# Arquitectura del proyecto

## ¿Qué es Practice Room?

Practice Room es una aplicación web para DJs principiantes. Permite:

- Subir archivos de audio (MP3, WAV, OGG, M4A)
- Reproducirlos con visualización de forma de onda (waveform)
- Añadir marcadores en momentos clave del track (intro, buildup, drop, outro…)
- Consultar un panel de aprendizaje con teoría de mezcla

---

## Stack tecnológico

| Tecnología | Para qué se usa |
|---|---|
| **Next.js 15** | Framework de React. Gestiona rutas, servidor y build |
| **React 18** | Librería de UI. Componentes, hooks, contexto |
| **TypeScript** | Tipado estático. Detecta errores antes de ejecutar |
| **WaveSurfer.js** | Renderiza la forma de onda del audio en un `<canvas>` |
| **Framer Motion** | Animaciones suaves (fade, slide, scale) |
| **Lucide React** | Iconos SVG |
| **Tailwind CSS** | Estilos utilitarios |

---

## Estructura de carpetas

```
practice-room/
│
├── app/                    ← Rutas de Next.js (App Router)
│   ├── layout.tsx          ← HTML base, fuentes, metadatos globales
│   └── page.tsx            ← Página principal (/). Orquesta todo.
│
├── components/             ← Componentes de UI reutilizables
│   ├── AudioPlayer.tsx     ← Reproductor con waveform y controles
│   ├── FileUpload.tsx      ← Zona de carga de archivos (drag & drop)
│   ├── LearningPanel.tsx   ← Panel lateral con contenido educativo
│   ├── MarkerItem.tsx      ← Fila individual de un marcador
│   ├── MarkerList.tsx      ← Lista de marcadores + formularios
│   ├── SongAnalyzer.tsx    ← Tap BPM, metrónomo, conteo de compases
│   └── TrackList.tsx       ← Lista de tracks cargados
│
├── context/
│   └── PlayerContext.tsx   ← Contexto compartido: tiempo actual + seek
│
├── hooks/                  ← Lógica reutilizable extraída de componentes
│   ├── useAudioPlayer.ts   ← WaveSurfer: inicialización, carga, controles
│   ├── useMarkers.ts       ← CRUD de marcadores en memoria
│   ├── useTrackMarkers.ts  ← Sincroniza marcadores ↔ persistencia del track
│   └── useTracks.ts        ← CRUD de tracks + selección del activo
│
├── services/               ← Acceso a datos externos (fuera de React)
│   ├── audioService.ts     ← Lee/escribe archivos de audio en IndexedDB
│   └── trackService.ts     ← Lee/escribe metadatos de tracks en localStorage
│
├── types/
│   └── index.ts            ← Todos los tipos TypeScript del dominio
│
├── lib/                    ← Utilidades y datos estáticos
│   ├── constants.ts        ← Colores, etiquetas y ayudas de marcadores
│   ├── learningContent.ts  ← Contenido educativo (textos del panel)
│   ├── types.ts            ← Re-exports de compatibilidad (no editar)
│   └── utils.ts            ← generateId, formatTime
│
└── docs/                   ← Esta documentación
```

---

## Flujo de datos principal

```
┌─────────────────────────────────────────────────────────────┐
│                        app/page.tsx                         │
│                                                             │
│  useTracks ──────────────────────────────► TrackList        │
│     │                                                       │
│     ▼                                                       │
│  useTrackMarkers ────────────────────────► MarkerList       │
│                                                             │
│  PlayerProvider (contexto)                                  │
│     │                                                       │
│     ├──► AudioPlayer ──► useAudioPlayer ──► WaveSurfer.js   │
│     │         │                                             │
│     │    currentTime / seekTo                               │
│     │                                                       │
│     └──► MarkerList (lee currentTime, llama seekTo)         │
│     └──► SongAnalyzer (lee currentTime)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Persistencia de datos

La aplicación **no tiene servidor**. Todo se guarda en el navegador del usuario:

### localStorage — metadatos de tracks

Guarda un array JSON con la información de cada track:

```json
[
  {
    "id": "1700000000000-abc123",
    "name": "Mi canción",
    "file_url": "1700000000000-abc123",
    "duration": 245.3,
    "markers": [...],
    "createdAt": 1700000000000,
    "updatedAt": 1700000000000
  }
]
```

`file_url` es el mismo `id` del track, que se usa como clave en IndexedDB.

### IndexedDB — archivos de audio binarios

Base de datos del navegador para archivos grandes. Guarda el `Blob` del archivo de audio con el `id` del track como clave.

> **Por qué IndexedDB y no localStorage?**
> localStorage solo puede guardar texto (strings). Un archivo de audio puede pesar varios MB en binario. IndexedDB está diseñada para datos grandes y binarios.

---

## Conceptos clave de React que usa el proyecto

### Server Components vs Client Components

Next.js 15 tiene dos tipos de componentes:

- **Server Components** (por defecto): se renderizan en el servidor. No pueden usar `useState`, `useEffect`, eventos del navegador ni APIs del browser (localStorage, IndexedDB, AudioContext…).
- **Client Components** (con `'use client'` al principio): se ejecutan en el navegador. Pueden usar todo lo anterior.

En este proyecto, casi todos los componentes son Client Components porque necesitan interacción del usuario y APIs del browser.

### Prop drilling vs Context

Sin contexto, para pasar datos de un componente padre a un nieto hay que pasarlos por todos los componentes intermedios (esto se llama "prop drilling"). Es tedioso y hace el código difícil de mantener.

Con **Context** (ver `PlayerContext.tsx`), cualquier componente dentro del `PlayerProvider` puede acceder directamente a `currentTime` y `seekTo` sin que el componente intermedio tenga que saber de ellos.

### useRef vs useState

- `useState` → cuando el valor cambia y el componente **debe re-renderizarse** para mostrar el cambio.
- `useRef` → cuando necesitas guardar un valor entre renders pero **no quieres** que el componente se re-renderice cuando cambia. Ideal para instancias de librerías externas (WaveSurfer), timers, o flags internos.

---

## Decisiones de diseño

| Decisión | Por qué |
|---|---|
| Separar `services/` de `hooks/` | Los servicios no conocen React. Los hooks sí. Esto hace los servicios testeables de forma independiente. |
| `loadIdRef` en `useAudioPlayer` | Evita que una carga de audio antigua sobreescriba una nueva cuando el usuario cambia de track rápidamente (race condition). |
| `PlayerContext` para `seekTo` y `currentTime` | `AudioPlayer`, `MarkerList` y `SongAnalyzer` necesitan estos valores. Pasarlos por props requeriría prop drilling a través de `page.tsx`. |
| `useTrackMarkers` como hook separado | Combina `useMarkers` (estado en memoria) con `useTracks` (persistencia). `page.tsx` no necesita saber cómo funciona internamente. |
| No usar `alert()`/`confirm()` nativos | Son bloqueantes y tienen estilo del OS, no de la app. Se reemplazaron por modales propios con animaciones. |
