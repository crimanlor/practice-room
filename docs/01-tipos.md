# Tipos TypeScript (`types/index.ts`)

Los tipos son la "forma" que tienen los datos en la aplicación. TypeScript los usa para avisarte si intentas usar un dato de la manera incorrecta.

> **Regla del proyecto:** todos los tipos del dominio viven en `types/index.ts`. Ningún componente ni hook define sus propias interfaces de dominio.

---

## MarkerType

```ts
export type MarkerType = 'intro' | 'buildup' | 'drop' | 'outro' | 'custom';
```

Un **union type**: solo puede tener uno de esos cinco valores exactos. Si escribes `'chorus'` donde se espera un `MarkerType`, TypeScript te dará un error.

Estos valores representan las secciones típicas de una canción electrónica:

| Valor | Significado |
|---|---|
| `'intro'` | Parte inicial sin voz. Ideal para empezar a mezclar |
| `'buildup'` | Subida de energía antes del drop |
| `'drop'` | Momento más energético, el "clímax" |
| `'outro'` | Final de la canción |
| `'custom'` | Cualquier momento personalizado |

---

## Marker

```ts
export interface Marker {
  id: string;
  type: MarkerType;
  time: number;      // en segundos
  note?: string;     // el ? significa que es opcional
  color: string;     // color hexadecimal, ej: '#ef4444'
}
```

Representa un marcador que el usuario coloca en un punto del audio.

- `id`: identificador único generado por `generateId()` de `lib/utils.ts`
- `type`: qué tipo de sección es (usa `MarkerType`)
- `time`: en qué segundo del track está el marcador
- `note`: nota opcional escrita por el usuario
- `color`: se calcula automáticamente desde `MARKER_COLORS[type]` en `lib/constants.ts`

**¿Por qué `color` está en el marcador si ya existe `MARKER_COLORS`?**
Para que si en el futuro añadimos marcadores de color personalizado, el color ya está guardado directamente en el dato sin necesidad de recalcularlo.

---

## Track

```ts
export interface Track {
  id: string;
  name: string;
  file_url: string;    // ID del archivo en IndexedDB
  duration: number;    // en segundos
  markers: Marker[];
  createdAt: number;   // timestamp Unix en ms
  updatedAt: number;   // timestamp Unix en ms
}
```

Representa un archivo de audio cargado por el usuario.

- `id`: identificador único. Es también la clave con la que se guarda el archivo en IndexedDB.
- `name`: nombre del archivo sin extensión (ej: `"My Track - Artist"`)
- `file_url`: normalmente es el mismo valor que `id`. En versiones antiguas podía ser una `blob:` URL (ya no se usa, hay limpieza automática).
- `markers`: array de marcadores. Se guarda junto al track en localStorage.
- `createdAt` / `updatedAt`: fechas en milisegundos desde época Unix. Útiles para ordenar o mostrar "último modificado".

---

## PlayerState

```ts
export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;   // segundos transcurridos
  duration: number;      // duración total en segundos
  volume: number;        // 0.0 a 1.0
}
```

Estado interno del reproductor de audio. Lo gestiona `useAudioPlayer.ts` y se actualiza en tiempo real mientras suena el audio.

- `volume`: va de `0` (silencio) a `1` (máximo). En la UI se muestra como 0–100%.

---

## LearningItem

```ts
export interface LearningItem {
  subtitle: string;
  description: string;
  tips?: string[];
}
```

Un bloque de contenido educativo dentro de una sección. Por ejemplo: "¿Qué es el BPM?" con su descripción y lista de consejos.

---

## LearningSection

```ts
export interface LearningSection {
  id: string;
  title: string;
  icon: string;          // emoji, ej: '⏱️'
  content: LearningItem[];
}
```

Una sección completa del panel de aprendizaje. Por ejemplo: "BPM y Tempo" con varios `LearningItem` dentro.

Los datos concretos están en `lib/learningContent.ts`.

---

## Tipos de compatibilidad (`lib/types.ts`)

```ts
// lib/types.ts — NO editar este archivo
export type { MarkerType, Marker, Track, PlayerState } from '@/types';
export { MARKER_COLORS, MARKER_LABELS, MARKER_HELP } from '@/lib/constants';
```

Este archivo existe solo para que imports antiguos que usaban `@/lib/types` sigan funcionando. Los tipos reales están en `@/types` y las constantes en `@/lib/constants`.
