# Servicios (`services/`)

Los servicios son funciones que acceden a datos **fuera de React**: localStorage e IndexedDB. No saben nada de componentes, hooks ni estado. Eso los hace fáciles de testear y reutilizar.

---

## trackService (`services/trackService.ts`)

Gestiona los **metadatos** de los tracks en `localStorage`.

### ¿Por qué localStorage?

Los metadatos (nombre, duración, marcadores) son texto pequeño. localStorage es simple, síncrono y más que suficiente para este caso.

### Clave de almacenamiento

```ts
const STORAGE_KEY = 'practice-room-tracks';
```

Todo se guarda en una única entrada de localStorage como un array JSON.

### Métodos

#### `trackService.getAll() → Track[]`

Devuelve todos los tracks guardados. Si localStorage está vacío o hay un error de parseo, devuelve `[]`.

```ts
const tracks = trackService.getAll();
// → [{ id: '...', name: 'Mi canción', ... }, ...]
```

#### `trackService.getById(id) → Track | null`

Busca un track por su `id`. Devuelve `null` si no existe.

```ts
const track = trackService.getById('1700000000000-abc123');
```

#### `trackService.save(track) → void`

Crea o actualiza un track. Si ya existe un track con ese `id`, lo reemplaza y actualiza `updatedAt`. Si no existe, lo añade al array.

```ts
trackService.save({
  id: '1700000000000-abc123',
  name: 'Mi canción',
  file_url: '1700000000000-abc123',
  duration: 245,
  markers: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
```

#### `trackService.delete(id) → void`

Elimina un track del array y guarda el resultado. **No elimina el archivo de audio** — eso lo hace `deleteAudioFile` de `audioService.ts`.

#### `trackService.updateMarkers(trackId, markers) → void`

Atajo para actualizar solo los marcadores de un track sin tener que hacer `getById` + `save` manualmente.

#### `trackService.removeStaleBlobs() → number`

Limpieza al arrancar la app. En versiones antiguas, `file_url` era una `blob:` URL, que es temporal y solo válida mientras la pestaña está abierta. Al recargar la página, esas URLs ya no funcionan. Esta función elimina esos tracks y devuelve cuántos eliminó.

```ts
const removed = trackService.removeStaleBlobs();
// → 2 (se eliminaron 2 tracks con URLs inválidas)
```

---

## audioService (`services/audioService.ts`)

Gestiona los **archivos de audio binarios** en IndexedDB.

### ¿Por qué IndexedDB?

Los archivos de audio pueden pesar decenas de MB. localStorage solo puede guardar strings y tiene un límite de ~5MB. IndexedDB está diseñada para datos grandes y binarios (`Blob`, `ArrayBuffer`).

### Configuración de la base de datos

```ts
const DB_NAME    = 'practice-room-audio';
const STORE_NAME = 'audio-files';
const DB_VERSION = 1;
```

IndexedDB funciona con una "base de datos" que contiene "almacenes" (object stores). Aquí hay un único almacén llamado `audio-files`.

### Función interna: `openDB()`

Abre (o crea) la conexión a IndexedDB. Es una `Promise` porque IndexedDB es asíncrona.

- Si estamos en el servidor (Next.js puede ejecutar código en Node.js), rechaza inmediatamente porque IndexedDB no existe fuera del navegador.
- Si la versión de la BD ha cambiado (`onupgradeneeded`), crea el object store.

### Funciones exportadas

#### `saveAudioFile(id, file) → Promise<void>`

Guarda un `Blob` de audio con el `id` del track como clave.

```ts
await saveAudioFile('1700000000000-abc123', audioBlob);
```

Se llama en `FileUpload.tsx` justo después de que el usuario selecciona un archivo.

#### `getAudioFile(id) → Promise<string | null>`

Recupera el archivo de audio y devuelve una **blob URL** (`blob://...`). Esta URL es temporal: solo es válida mientras la pestaña está abierta y mientras no se llame a `URL.revokeObjectURL()`.

Devuelve `null` si el archivo no existe.

```ts
const blobUrl = await getAudioFile('1700000000000-abc123');
// → 'blob:http://localhost:3000/a1b2c3...'
// → null (si no existe)
```

#### `deleteAudioFile(id) → Promise<void>`

Elimina el archivo de audio. Se llama cuando el usuario elimina un track en `useTracks.ts`.

#### `audioFileExists(id) → Promise<boolean>`

Comprueba si existe un archivo. Útil para validar antes de intentar cargar.

---

## Relación entre los dos servicios

```
Usuario sube archivo
        │
        ▼
FileUpload.tsx
  ├── audioService.saveAudioFile(id, blob)   ← guarda el binario
  └── trackService.save(track)               ← guarda los metadatos
                                               (vía useTracks → addTrack)
```

Cuando el usuario elimina un track:

```
TrackList → onDeleteTrack(id)
        │
        ▼
useTracks.deleteTrack(id)
  ├── trackService.delete(id)                ← borra metadatos
  └── audioService.deleteAudioFile(id)       ← borra el binario
```
