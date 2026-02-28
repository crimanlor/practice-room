# Componentes (`components/`)

Los componentes son las piezas visuales de la interfaz. Cada uno tiene una responsabilidad concreta. Todos son **Client Components** (`'use client'`) porque necesitan interactividad del usuario o APIs del navegador.

---

## FileUpload (`components/FileUpload.tsx`)

**Propósito:** zona de carga de archivos. Permite seleccionar un archivo de audio haciendo clic o arrastrando y soltando (drag & drop).

### Props

```ts
interface FileUploadProps {
  onTrackAdd: (track: Track) => void;
}
```

- `onTrackAdd`: se llama cuando el archivo se ha procesado correctamente y el track está listo para añadirse a la lista.

### Flujo interno al subir un archivo

```
Usuario selecciona/suelta un archivo
        │
        ▼
handleFile(file)
  1. Valida que sea audio (isAudioFile)
  2. Genera un ID único (generateId)
  3. Guarda el binario en IndexedDB (saveAudioFile)
  4. Crea un <Audio> temporal para leer la duración
  5. Construye el objeto Track
  6. Llama a onTrackAdd(track)
  7. Revoca la blob URL temporal
```

### Estado interno

| Estado | Tipo | Para qué |
|---|---|---|
| `isDragging` | `boolean` | Cambia el estilo visual mientras el usuario arrastra un archivo encima |
| `isProcessing` | `boolean` | Muestra spinner y desactiva la zona mientras procesa |
| `uploadError` | `string \| null` | Muestra un mensaje de error inline (sin `alert()`) |

### `isAudioFile(file)`

Función pura que valida si el archivo es audio. Comprueba tanto `file.type` (el MIME type que reporta el navegador) como una lista de tipos conocidos, porque algunos navegadores no reportan correctamente el MIME type de `.m4a`.

---

## TrackList (`components/TrackList.tsx`)

**Propósito:** lista de todos los tracks cargados. Permite seleccionar el track activo y eliminar tracks.

### Props

```ts
interface TrackListProps {
  tracks: Track[];
  currentTrack: Track | null;
  onSelectTrack: (id: string) => void;
  onDeleteTrack: (id: string) => void;
}
```

### Comportamiento

- Si no hay tracks, muestra un mensaje vacío
- El track activo tiene un borde y fondo distintos (`border-primary-500`)
- El botón de eliminar es invisible por defecto y aparece al hacer hover (`group-hover:opacity-100`)
- Al hacer clic en eliminar, se guarda `pendingDelete` pero **no se elimina todavía**
- Se muestra un modal de confirmación propio (sin `confirm()` nativo)
- El modal se puede cerrar haciendo clic fuera de él

### Modal de confirmación

El estado `pendingDelete` guarda el ID del track que se quiere eliminar. Cuando no es `null`, se muestra el modal. Al confirmar, llama a `onDeleteTrack(pendingDelete)`.

---

## AudioPlayer (`components/AudioPlayer.tsx`)

**Propósito:** reproductor principal. Muestra la forma de onda, controles de play/pause y volumen.

### Props

```ts
interface AudioPlayerProps {
  track: Track;
  onReady?: (duration: number) => void;
  onTimeUpdate?: (time: number) => void;
  onSeek?: (seekFn: (time: number) => void) => void;
}
```

- `onTimeUpdate`: cada vez que cambia el tiempo, llama a `setCurrentTime` del contexto
- `onSeek`: pasa la función `seekTo` de WaveSurfer al contexto (vía `registerSeek`)

### Uso de `useAudioPlayer`

```ts
const { waveformRef, playerState, isReady, error, togglePlayPause, setVolume, seekTo } =
  useAudioPlayer({ audioUrl: track.file_url, onReady });
```

El `div` referenciado por `waveformRef` es donde WaveSurfer dibuja la onda. Es un `<div>` vacío que WaveSurfer gestiona internamente con un `<canvas>`.

### Estados visibles

| Situación | Qué muestra |
|---|---|
| Cargando audio | "Cargando audio..." centrado en el área de la onda |
| Error | Mensaje de error con icono ⚠️ y consejo de acción |
| Listo | La forma de onda + controles activos |

### Control de volumen

El slider de volumen solo es visible al hacer hover sobre el icono de volumen. Está posicionado `absolute` encima del icono con `bottom-full`. Un clic en el icono mute/unmute alterna entre 0 y 1.

---

## MarkerList (`components/MarkerList.tsx`)

**Propósito:** lista de marcadores del track activo. Permite añadir y editar marcadores.

### Props

```ts
interface MarkerListProps {
  markers: Marker[];
  currentTime: number;
  onDelete: (id: string) => void;
  onEdit: (marker: Marker) => void;
  onSeek: (time: number) => void;
  onAddMarker: (type: MarkerType, time: number, note?: string) => void;
}
```

### Componente interno: `MarkerForm`

Es un formulario único que funciona en dos modos distintos controlados por la prop `asModal`:

| Modo | `asModal` | Cuándo se usa |
|---|---|---|
| Inline (añadir) | `false` | Al hacer clic en "Añadir" — aparece encima de la lista |
| Modal (editar) | `true` | Al hacer clic en editar un marcador — modal centrado |

El formulario muestra:
1. Botones de selección de tipo (intro, buildup, drop, outro, custom)
2. Una caja explicativa animada con el texto de `MARKER_HELP[tipo]` y el color del marcador
3. Textarea opcional para la nota
4. Botones de confirmar y cancelar

### Estado interno de `MarkerList`

| Estado | Tipo | Para qué |
|---|---|---|
| `showAddForm` | `boolean` | Alterna la visibilidad del formulario de añadir |
| `editingMarker` | `Marker \| null` | Cuando no es null, muestra el modal de edición con ese marcador |

### `AnimatePresence`

Framer Motion necesita `AnimatePresence` para poder animar la salida de un componente. Sin él, el formulario desaparecería instantáneamente sin animación.

---

## MarkerItem (`components/MarkerItem.tsx`)

**Propósito:** fila individual de un marcador dentro de `MarkerList`.

### Props

```ts
interface MarkerItemProps {
  marker: Marker;
  onDelete: (id: string) => void;
  onEdit: (marker: Marker) => void;
  onSeek: (time: number) => void;
}
```

### Qué muestra

- Una barra de color vertical a la izquierda (el color del tipo de marcador)
- El nombre del tipo (`MARKER_LABELS[marker.type]`)
- El tiempo como botón clickeable que llama a `onSeek` → mueve el reproductor a ese punto
- La descripción educativa del tipo (`MARKER_HELP[marker.type]`)
- La nota del usuario (si existe)
- Botones de editar y eliminar

---

## SongAnalyzer (`components/SongAnalyzer.tsx`)

**Propósito:** herramientas de análisis musical. Tiene tres pestañas.

### Props

```ts
interface SongAnalyzerProps {
  currentTime: number;
  isPlaying: boolean;
  onTapBpm?: (bpm: number) => void;
}
```

### Pestaña BPM (tap tempo)

El usuario toca el botón "TAP" al ritmo de la música. El componente:
1. Guarda los timestamps de cada toque en `tapTimes`
2. Filtra los toques de más de 5 segundos (`TAP_WINDOW_MS`) — solo se considera la "ventana" reciente
3. Si han pasado más de 2 segundos desde el último toque (`TAP_COOLDOWN_MS`), empieza de cero
4. Calcula el BPM promediando los intervalos entre toques (`calculateBpm`)

#### `calculateBpm(tapTimes)` — función pura

```ts
function calculateBpm(tapTimes: number[]): number | null {
  if (tapTimes.length < 2) return null;
  const intervals = tapTimes.slice(1).map((t, i) => t - tapTimes[i]);
  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const bpm = Math.round(60_000 / avg);
  return bpm >= MIN_BPM && bpm <= MAX_BPM ? bpm : null;
}
```

Es una función pura (sin efectos secundarios) que se puede testear de forma independiente. Si el resultado está fuera del rango 60–200 BPM, devuelve `null` (valor inválido o error del usuario).

### Pestaña Metrónomo

Reproduce clics a un BPM configurable usando la **Web Audio API** (`AudioContext`). No usa ningún archivo de audio: genera los tonos sintéticamente con un `OscillatorNode`.

- Los toques en el tiempo 1 suenan a 1000 Hz (acento)
- Los tiempos 2, 3, 4 suenan a 800 Hz

El `AudioContext` se crea lazy (solo cuando el usuario activa el metrónomo) para cumplir con las políticas del navegador que requieren un gesto del usuario antes de reproducir audio.

### Pestaña Conteo

Comparte el mismo estado del metrónomo (`isMetronomePlaying`, `metronomeBpm`, `beat`). Muestra visualmente los 4 tiempos del compás, resaltando el beat actual con una animación.

---

## LearningPanel (`components/LearningPanel.tsx`)

**Propósito:** panel lateral con contenido educativo sobre mezcla de música. Se puede expandir a pantalla completa.

### Exports de este archivo

```ts
export function LearningPanel(...)  // el panel completo
export function LearningButton(...) // el botón del header que lo abre
```

### Props de `LearningPanel`

```ts
interface LearningPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded?: boolean;
  onExpand?: () => void;
}
```

### Modos de visualización

| Modo | `isExpanded` | Descripción |
|---|---|---|
| Panel lateral | `false` | Ocupa el lado derecho de la pantalla (`max-w-md`) |
| Pantalla completa | `true` | Ocupa toda la pantalla (`fixed inset-0`) |

La animación de entrada/salida cambia según el modo:
- Panel lateral: desliza desde la derecha (`x: '100%'` → `x: 0`)
- Pantalla completa: fade (`opacity: 0` → `opacity: 1`)

### Componente interno: `SectionItem`

Cada sección del panel (ej: "BPM y Tempo") es un acordeón que se abre/cierra con `isOpen`. La prop `wideLayout` cambia:
- El tamaño del icono y el título
- El espaciado del padding
- La disposición de los items: columna única (normal) o dos columnas (expandido)

### Componente interno: `LearningItemCard`

Tarjeta de un ítem educativo. Muestra título, descripción y lista de consejos.

---

## Librería de utilidades (`lib/`)

### `lib/utils.ts`

Dos funciones puras sin dependencias:

#### `generateId() → string`

Genera un ID único combinando timestamp + sufijo aleatorio:
```
"1700000000000-abc123def"
```
No usa UUID para evitar importar una librería extra. La probabilidad de colisión es despreciable para el uso de esta app.

#### `formatTime(seconds) → string`

Convierte segundos a formato `MM:SS`:
```ts
formatTime(125)  // → "2:05"
formatTime(3600) // → "60:00"
```

### `lib/constants.ts`

Tres objetos `Record<MarkerType, string>` que mapean cada tipo de marcador a su color, etiqueta y descripción educativa. Se usan en `MarkerItem`, `MarkerForm` y `MarkerList`.

### `lib/learningContent.ts`

Array de `LearningSection[]` con todo el contenido del panel educativo. Es datos estáticos puros — no hay lógica aquí.
