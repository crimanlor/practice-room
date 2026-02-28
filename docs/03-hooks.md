# Hooks personalizados (`hooks/`)

Un **hook** en React es una función que empieza por `use` y puede llamar a otros hooks (`useState`, `useEffect`, `useRef`…). Sirven para extraer lógica compleja fuera de los componentes y reutilizarla.

> **Regla:** los hooks solo pueden usarse dentro de componentes React o de otros hooks. No se pueden llamar en servicios ni en funciones normales.

---

## useAudioPlayer (`hooks/useAudioPlayer.ts`)

El hook más complejo del proyecto. Encapsula toda la integración con **WaveSurfer.js**, la librería que dibuja la forma de onda y gestiona la reproducción de audio.

### Qué recibe

```ts
interface UseAudioPlayerOptions {
  audioUrl?: string;    // ID del track en IndexedDB (o URL directa)
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

El hook usa **dos efectos separados** (esto es importante y no accidental):

#### Efecto 1: inicialización de WaveSurfer (se ejecuta solo al montar)

```ts
useEffect(() => {
  // Crea la instancia de WaveSurfer y la conecta al <div>
  // Registra todos los eventos: ready, play, pause, timeupdate, finish, error
  // Se ejecuta una sola vez (deps: [])
}, []);
```

Crear WaveSurfer es caro (configura un AudioContext, un canvas…). Si lo recreáramos cada vez que cambia el track, sería lento y causaría parpadeos.

#### Efecto 2: carga de audio (se ejecuta cuando cambia `audioUrl`)

```ts
useEffect(() => {
  // Llama a loadAudio(audioUrl) cuando cambia la URL
  // Si WaveSurfer todavía no está montado, espera en un setInterval de 50ms
}, [audioUrl, loadAudio]);
```

#### La función `loadAudio`

1. Incrementa `loadIdRef.current` (el "ID de carga")
2. Revoca la blob URL anterior para liberar memoria
3. Si la URL es directa (`blob:`, `http:`…), llama a `ws.load(url)` directamente
4. Si la URL es un ID de IndexedDB, primero llama a `getAudioFile(id)` para obtener la blob URL, luego llama a `ws.load(blobUrl)`

#### ¿Por qué existe `loadIdRef`?

Es una solución a una **race condition**: si el usuario cambia de track muy rápido, puede pasar que:

1. Se lanza `loadAudio("track-1")` → empieza a buscar en IndexedDB
2. Antes de que termine, se lanza `loadAudio("track-2")`
3. `loadAudio("track-1")` termina y llama a `ws.load(blob-de-track-1)` → **incorrecto**, ya deberíamos estar en track-2

Con `loadIdRef`:
- Cada llamada a `loadAudio` captura `const myLoadId = ++loadIdRef.current`
- Antes de usar el resultado de IndexedDB, comprueba: `if (myLoadId !== loadIdRef.current) return;`
- Si la comprobación falla, significa que ya hay una carga más reciente → simplemente no hace nada

#### ¿Por qué el `error` handler ignora "aborted"?

Cuando llamas a `ws.load()` mientras hay una carga en curso, WaveSurfer aborta internamente el fetch anterior y emite un error de tipo "signal is aborted without reason". No es un error real (es el comportamiento esperado), así que lo filtramos:

```ts
ws.on('error', (err: Error) => {
  if (err?.message?.toLowerCase().includes('aborted')) return;
  // ...
});
```

### Throttle de `timeupdate`

WaveSurfer emite el evento `timeupdate` muchas veces por segundo. Si cada evento causara un re-render de React, la UI sería lenta. Por eso hay un throttle de 100ms:

```ts
const TIME_UPDATE_THROTTLE_MS = 100;
// Solo actualiza el estado si han pasado al menos 100ms desde la última vez
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
