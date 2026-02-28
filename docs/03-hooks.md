# Hooks personalizados (`hooks/`)

Un **hook** en React es una función que empieza por `use` y puede llamar a otros hooks (`useState`, `useEffect`, `useRef`…). Sirven para extraer lógica compleja fuera de los componentes y reutilizarla.

> **Regla:** los hooks solo pueden usarse dentro de componentes React o de otros hooks. No se pueden llamar en servicios ni en funciones normales.

---

## useAudioPlayer (`hooks/useAudioPlayer.ts`)

El hook más complejo del proyecto. Encapsula toda la integración con **WaveSurfer.js**, la librería que dibuja la forma de onda y gestiona la reproducción de audio.

### Qué recibe

```ts
interface UseAudioPlayerOptions {
  audioUrl?: string;    // ID del track en IndexedDB (o URL directa blob:/http:/https:)
  onReady?: (duration: number) => void;  // callback cuando el audio está listo
}
```

### Qué devuelve

```ts
{
  waveformRef,       // ref del <div> donde WaveSurfer dibuja la onda
  playerState,       // { isPlaying, currentTime, duration, volume }
  isReady,           // true cuando el audio está cargado y listo
  error,             // string con el error, o null si todo va bien
  togglePlayPause,   // función para play/pause
  seekTo,            // función para saltar a un tiempo concreto (segundos)
  setVolume,         // función para cambiar el volumen (0.0 - 1.0)
  stop,              // función para detener y volver al inicio
}
```

### Cómo funciona internamente

El hook usa **un único efecto** con `deps: [audioUrl]`. Cada vez que el track cambia, el efecto anterior se limpia (destroy de WaveSurfer) y el nuevo crea una instancia fresca.

```
audioUrl cambia
      │
      ▼
cleanup: cancelled=true, ws.destroy(), URL.revokeObjectURL()
      │
      ▼
nuevo efecto: WaveSurfer.create() → getAudioFile() → ws.load()
      │
      ▼
evento 'ready' → setIsReady(true)
```

#### ¿Por qué un solo efecto?

La arquitectura anterior usaba dos efectos separados (uno para init, otro para carga) coordinados mediante refs globales (`isInitializedRef`, `loadIdRef`). Eso era frágil porque React **StrictMode** desmonta y vuelve a montar los componentes en desarrollo para detectar efectos secundarios incorrectos. Con refs globales, el segundo montaje podía encontrar estado residual del primero y no inicializar WaveSurfer correctamente.

Con un único efecto:
- Todo el estado (`ws`, `cancelled`, `blobUrlToRevoke`) vive en **variables locales del efecto**, no en refs compartidas entre montajes.
- El cleanup siempre deja un estado limpio: el siguiente efecto nunca ve residuos del anterior.
- Es el patrón que React recomienda para recursos que tienen un ciclo de vida acoplado.

#### La función `init()` (interna al efecto)

1. Comprueba que el contenedor DOM (`waveformRef.current`) está disponible
2. Crea la instancia de WaveSurfer y la registra en `wavesurferRef` para que los controles puedan usarla
3. Registra los eventos: `ready`, `play`, `pause`, `timeupdate`, `finish`, `error` — todos protegidos con `if (cancelled) return`
4. Resuelve la URL:
   - Si es directa (`blob:`, `http:`, `https:`), la usa tal cual
   - Si es un ID de IndexedDB, llama a `getAudioFile(id)` para obtener la blob URL
5. Llama a `ws.load(resolvedUrl)`

#### ¿Cómo se gestionan las race conditions?

Si el usuario cambia de track mientras `getAudioFile` está en curso (operación async):

```
init() para track-1 → await getAudioFile("track-1") ...
  (usuario selecciona track-2)
  cleanup de track-1: cancelled = true
  nuevo init() para track-2 empieza
getAudioFile("track-1") resuelve → if (cancelled) return  ✓
```

El flag `cancelled` es local al efecto. No hay contadores globales ni comparaciones de IDs — simplemente: si el efecto fue limpiado antes de que terminara la operación async, se cancela en silencio.

#### ¿Por qué se ignoran los errores "aborted"?

WaveSurfer llama a `fetch(blobUrl, { signal })` internamente con un `AbortController`. Cuando se destruye la instancia (cleanup), llama a `abort()`, lo que hace que `fetch` rechace con un `DOMException` de tipo `AbortError`. Este error también puede propagarse al `catch` del `await ws.load()`.

No es un error real — es el comportamiento esperado del cleanup. Se filtra con:

```ts
function isAbortError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  if (err.name === 'AbortError') return true;           // DOMException estándar
  if (err.message.toLowerCase().includes('aborted')) return true; // fallback cross-browser
  return false;
}
```

La comprobación usa `err.name` (no solo el mensaje) porque el mensaje varía entre navegadores, pero `name === 'AbortError'` es parte del estándar DOM.

### Throttle de `timeupdate`

WaveSurfer emite el evento `timeupdate` muchas veces por segundo. Si cada evento causara un re-render de React, la UI sería lenta. Por eso hay un throttle de 100ms:

```ts
const TIME_UPDATE_THROTTLE_MS = 100;
// Solo actualiza el estado si han pasado al menos 100ms desde la última actualización
```

---

## useTracks (`hooks/useTracks.ts`)

Gestiona la lista de tracks y cuál está seleccionado actualmente.

### Qué devuelve

```ts
{
  tracks,         // Track[] — todos los tracks cargados
  currentTrack,   // Track | null — el track activo
  isLoading,      // boolean — true mientras carga desde localStorage
  addTrack,       // (track: Track) => void
  updateTrack,    // (track: Track) => void
  deleteTrack,    // (id: string) => void
  selectTrack,    // (id: string) => void
  setCurrentTrack // (track: Track | null) => void
}
```

### Al montar

Al iniciarse, hace dos cosas:
1. Llama a `trackService.removeStaleBlobs()` para limpiar tracks con URLs inválidas de sesiones antiguas
2. Carga todos los tracks de localStorage con `trackService.getAll()`

### `deleteTrack`

Además de eliminar el track de localStorage, también borra el archivo de audio de IndexedDB:

```ts
deleteAudioFile(track.file_url).catch(...)
```

Si el track activo es el que se elimina, `currentTrack` pasa a `null`.

---

## useMarkers (`hooks/useMarkers.ts`)

Gestiona el array de marcadores **solo en memoria** (no persiste nada). La persistencia la hace `useTrackMarkers`.

### Qué recibe

```ts
function useMarkers(initialMarkers: Marker[] = [])
```

### Qué devuelve

```ts
{
  markers,          // Marker[] — array siempre ordenado por tiempo
  addMarker,        // (type, time, note?) => Marker — crea y añade
  updateMarker,     // (id, updates) => void — actualiza campos parciales
  deleteMarker,     // (id) => void
  clearMarkers,     // () => void — vacía el array
  getMarkersByType, // (type) => Marker[] — filtra por tipo
  getNearestMarker, // (time, threshold?) => Marker | null
  setMarkers,       // setter directo para reemplazar el array completo
}
```

### Detalles importantes

**Los marcadores siempre se ordenan por tiempo** después de añadir o actualizar:
```ts
.sort((a, b) => a.time - b.time)
```

**`updateMarker` recalcula el color** si se cambia el tipo:
```ts
color: updates.type ? MARKER_COLORS[updates.type] : m.color
```

**`getNearestMarker`** encuentra el marcador más cercano a un tiempo dado, dentro de un umbral (por defecto 2 segundos). Útil para detectar si el reproductor está cerca de un marcador.

---

## useTrackMarkers (`hooks/useTrackMarkers.ts`)

Combina `useMarkers` (estado en memoria) con `useTracks` (persistencia) en una sola interfaz.

### Por qué existe

`useMarkers` gestiona los marcadores en la RAM de React. Pero también necesitamos guardarlos en localStorage cada vez que cambian. En lugar de hacerlo en cada componente, este hook lo centraliza.

### Qué recibe

```ts
interface UseTrackMarkersOptions {
  currentTrack: Track | null;
  updateTrack: (track: Track) => void;
}
```

### Qué devuelve

```ts
{ markers, addMarker, updateMarker, deleteMarker }
```

Las mismas funciones que `useMarkers`, pero cada una también llama a `updateTrack` para persistir el cambio.

### Sincronización al cambiar de track

```ts
useEffect(() => {
  setMarkers(currentTrack?.markers ?? []);
}, [currentTrack?.id]);
```

Cuando el usuario selecciona un track diferente, este efecto reemplaza los marcadores en memoria con los del nuevo track. La dependencia es `currentTrack?.id` (no el objeto completo), para que solo se dispare cuando cambia el track seleccionado, no cuando se actualiza su contenido.

### Flujo de datos completo

```
Usuario hace clic en "Añadir marcador"
          │
          ▼
MarkerList → onAddMarker(type, time, note)
          │
          ▼
useTrackMarkers.addMarker(type, time, note)
  ├── addMarkerLocal(type, time, note)   ← actualiza estado React
  └── persistUpdate([...markers, nuevo]) ← guarda en localStorage
            │
            ▼
       updateTrack({ ...currentTrack, markers: [...] })
            │
            ▼
       trackService.save(track)          ← escribe en localStorage
```
