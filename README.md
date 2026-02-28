# Practice Room

Aplicación web para DJs principiantes construida como proyecto de aprendizaje de buenas prácticas con **Next.js 15**, **React 18** y **TypeScript**.

Permite cargar tracks de audio, visualizar su forma de onda, marcar momentos clave y consultar contenido educativo sobre mezcla.

---

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| Next.js | 15 | Framework (App Router, headers HTTP, build) |
| React | 18 | UI, hooks, contexto |
| TypeScript | 5 | Tipado estático estricto (`strict: true`) |
| WaveSurfer.js | 7 | Renderizado de forma de onda via Web Audio API |
| Framer Motion | 11 | Animaciones declarativas |
| Tailwind CSS | 3 | Estilos utility-first |
| Lucide React | — | Iconos SVG |

---

## Inicio rápido

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # build de producción
npx tsc --noEmit  # verificar tipos sin compilar
```

---

## Estructura del proyecto

```
practice-room/
├── app/
│   ├── layout.tsx          # HTML base, metadatos globales
│   └── page.tsx            # Única ruta (/). Orquesta providers y componentes.
│
├── components/             # Componentes de UI (todos 'use client')
│   ├── AudioPlayer.tsx     # Reproductor: waveform + controles
│   ├── FileUpload.tsx      # Carga de archivos (drag & drop)
│   ├── MarkerList.tsx      # Lista de marcadores + formularios inline/modal
│   ├── MarkerItem.tsx      # Fila individual de marcador
│   ├── SongAnalyzer.tsx    # Tap BPM, metrónomo, conteo de compases
│   ├── TrackList.tsx       # Lista de tracks con modal de confirmación
│   └── LearningPanel.tsx   # Panel educativo expandible
│
├── context/
│   └── PlayerContext.tsx   # currentTime y seekTo compartidos entre componentes
│
├── hooks/
│   ├── useAudioPlayer.ts   # Integración con WaveSurfer (efecto único por track)
│   ├── useTracks.ts        # CRUD de tracks + track activo
│   ├── useMarkers.ts       # CRUD de marcadores en memoria
│   └── useTrackMarkers.ts  # Sincroniza marcadores en memoria ↔ localStorage
│
├── services/               # Acceso a datos sin dependencias de React
│   ├── audioService.ts     # IndexedDB: guardar/leer/borrar blobs de audio
│   └── trackService.ts     # localStorage: CRUD de metadatos de tracks
│
├── types/
│   └── index.ts            # Tipos del dominio: Track, Marker, MarkerType…
│
├── lib/
│   ├── constants.ts        # MARKER_COLORS, MARKER_LABELS, MARKER_HELP
│   ├── learningContent.ts  # Datos estáticos del panel educativo
│   └── utils.ts            # generateId, formatTime
│
└── docs/                   # Documentación técnica detallada
    ├── 00-arquitectura.md
    ├── 01-tipos.md
    ├── 02-servicios.md
    ├── 03-hooks.md
    ├── 04-contexto.md
    └── 05-componentes.md
```

---

## Persistencia

La aplicación es 100% client-side. No hay servidor ni autenticación. Los datos se guardan en el navegador del usuario:

- **localStorage** — metadatos de tracks (JSON serializado, clave `practice-room-tracks`)
- **IndexedDB** — binarios de audio (base de datos `practice-room-audio`, store `audio-files`)

`file_url` en el objeto `Track` no es una URL real: es el `id` del track, que actúa como clave en IndexedDB. `audioService.getAudioFile(id)` lo resuelve a una `blob:` URL en tiempo de ejecución.

---

## Buenas prácticas aplicadas

### Separación de capas

```
services/   →  acceso a datos puro (sin React, testeable de forma independiente)
hooks/      →  lógica con estado React (usa services internamente)
components/ →  solo presentación y eventos de usuario
```

Los servicios no importan nada de React. Los hooks no saben nada de cómo se renderizan los componentes. Los componentes no acceden directamente a localStorage ni IndexedDB.

### Efecto único por recurso en `useAudioPlayer`

WaveSurfer se crea y destruye dentro del mismo `useEffect` que carga el audio, con `deps: [audioUrl]`. Cada cambio de track ejecuta un cleanup completo (destroy) seguido de una inicialización fresca. Esto hace el hook resistente a React StrictMode (que desmonta y remonta en desarrollo) sin necesidad de refs globales de control.

```ts
useEffect(() => {
  let cancelled = false;
  let ws: WaveSurfer | null = null;

  async function init() { /* crear ws, registrar eventos, cargar audio */ }
  init();

  return () => {
    cancelled = true;   // cancela cualquier async en curso
    ws?.destroy();      // limpia el recurso sincrónicamente
  };
}, [audioUrl]);
```

### Race conditions con flag local

Las operaciones async (IndexedDB lookup → `ws.load`) pueden quedar obsoletas si el usuario cambia de track antes de que terminen. En lugar de un contador global (`loadIdRef`), se usa una variable `cancelled` local al efecto: si el cleanup de React se ejecuta antes de que la async termine, `cancelled = true` y la operación se cancela en silencio.

### Validación de datos en los límites de confianza

`trackService.ts` valida con `isValidTrack()` cada entrada del array parseado desde localStorage, descartando silenciosamente las entradas corruptas o con esquema incorrecto. Los datos que entran al sistema (archivos de usuario) se validan antes de procesarse: tipo MIME y tamaño máximo (200 MB) en `FileUpload`.

### Cabeceras HTTP de seguridad

Configuradas en `next.config.ts` para todas las rutas:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Content-Security-Policy: default-src 'self'; worker-src blob:; connect-src 'self' blob:; ...
```

`connect-src` incluye `blob:` porque WaveSurfer llama internamente a `fetch(blobUrl)` con un `AbortController`.

### Sin `alert()` ni `confirm()` nativos

Todos los mensajes de error y confirmaciones se muestran mediante componentes propios (mensajes inline, modales con Framer Motion). Los diálogos nativos del navegador son bloqueantes y tienen estilos fuera del control de la app.

### Throttle de eventos de alta frecuencia

`timeupdate` de WaveSurfer se emite muchas veces por segundo. Sin throttle, cada evento causaría un re-render de React. Se aplica un límite de 100ms entre actualizaciones de estado.

---

## Tipos del dominio

```ts
interface Track {
  id: string
  name: string
  file_url: string       // mismo valor que id; clave en IndexedDB
  duration: number       // segundos
  markers: Marker[]
  createdAt: number      // Date.now()
  updatedAt: number
}

interface Marker {
  id: string
  type: 'intro' | 'buildup' | 'drop' | 'outro' | 'custom'
  time: number           // segundos desde el inicio
  note?: string          // máx. 500 caracteres
  color: string          // hex, derivado del type
}
```

---

## Documentación técnica

Cada capa del proyecto tiene su propia documentación en `/docs`, orientada a explicar el razonamiento detrás de cada decisión:

- [`00-arquitectura.md`](docs/00-arquitectura.md) — visión general, flujo de datos, conceptos de React
- [`01-tipos.md`](docs/01-tipos.md) — tipos del dominio y por qué están definidos así
- [`02-servicios.md`](docs/02-servicios.md) — localStorage, IndexedDB, por qué no se mezclan
- [`03-hooks.md`](docs/03-hooks.md) — lógica de cada hook, incluyendo el diseño de `useAudioPlayer`
- [`04-contexto.md`](docs/04-contexto.md) — cuándo usar Context vs props vs estado local
- [`05-componentes.md`](docs/05-componentes.md) — responsabilidades y contratos de cada componente
