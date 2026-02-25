# Practice Room - Guía de Desarrollo

## 📋 Índice

- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Componentes Principales](#componentes-principales)
- [Hooks Personalizados](#hooks-personalizados)
- [Gestión de Estado](#gestión-de-estado)
- [Flujo de Datos](#flujo-de-datos)
- [Cómo Extender la App](#cómo-extender-la-app)

## Arquitectura del Proyecto

La aplicación sigue una arquitectura simple y modular con estos principios:

1. **Separación de responsabilidades**: Cada componente tiene una función específica
2. **Hooks personalizados**: Lógica de negocio encapsulada en hooks reutilizables
3. **Estado local**: Uso de localStorage para persistencia sin backend
4. **Componentes presentacionales**: Componentes simples que reciben props

### Stack Tecnológico

```
Next.js 15 (App Router)
├── React 18
├── TypeScript
├── Tailwind CSS
├── Framer Motion (animaciones)
└── Wavesurfer.js (audio)
```

## Estructura de Carpetas

```
practice-room/
├── app/                    # App Router de Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── AudioPlayer.tsx    # Reproductor de audio
│   ├── FileUpload.tsx     # Subida de archivos
│   ├── MarkerList.tsx     # Lista de marcadores
│   ├── MarkerItem.tsx     # Item individual de marcador
│   └── TrackList.tsx      # Lista de tracks
├── hooks/                 # Hooks personalizados
│   ├── useAudioPlayer.ts  # Manejo del audio player
│   ├── useTracks.ts       # Manejo de tracks
│   └── useMarkers.ts      # Manejo de marcadores
├── lib/                   # Utilidades y tipos
│   ├── types.ts          # Definiciones de tipos
│   └── utils.ts          # Funciones auxiliares
└── public/               # Archivos estáticos
```

## Componentes Principales

### AudioPlayer

Reproduce audio y muestra la forma de onda usando Wavesurfer.js.

**Props:**
- `track`: Track actual a reproducir
- `onReady`: Callback cuando el audio está listo
- `onTimeUpdate`: Callback con el tiempo actual de reproducción

**Características:**
- Visualización de waveform
- Controles de play/pause
- Control de volumen
- Visualización de tiempo

### FileUpload

Permite subir archivos de audio mediante drag & drop o selección.

**Props:**
- `onTrackAdd`: Callback cuando se añade un nuevo track

**Características:**
- Drag & drop
- Validación de tipo de archivo
- Extracción de metadata del audio

### MarkerList

Muestra y gestiona los marcadores de un track.

**Props:**
- `markers`: Array de marcadores
- `onDelete`: Callback para eliminar marcador
- `onEdit`: Callback para editar marcador
- `onSeek`: Callback para ir a un tiempo específico
- `currentTime`: Tiempo actual de reproducción
- `onAddMarker`: Callback para añadir nuevo marcador

**Características:**
- Lista de marcadores ordenados por tiempo
- Formulario para añadir marcadores
- Navegación a marcadores específicos

### TrackList

Muestra la biblioteca de tracks del usuario.

**Props:**
- `tracks`: Array de tracks
- `currentTrack`: Track actualmente seleccionado
- `onSelectTrack`: Callback para seleccionar un track
- `onDeleteTrack`: Callback para eliminar un track

## Hooks Personalizados

### useAudioPlayer

Maneja la reproducción de audio y la integración con Wavesurfer.js.

**Retorna:**
```typescript
{
  waveformRef: RefObject<HTMLDivElement>  // Ref para el contenedor del waveform
  playerState: PlayerState                // Estado del reproductor
  isReady: boolean                        // Si el audio está listo
  togglePlayPause: () => void             // Play/Pause
  seekTo: (time: number) => void          // Ir a un tiempo específico
  setVolume: (volume: number) => void     // Cambiar volumen
  stop: () => void                        // Detener reproducción
}
```

**Uso:**
```typescript
const { waveformRef, playerState, togglePlayPause } = useAudioPlayer({
  audioUrl: track.file_url,
  onReady: (duration) => console.log('Duración:', duration),
});
```

### useTracks

Gestiona la colección de tracks y el track actual.

**Retorna:**
```typescript
{
  tracks: Track[]                         // Array de todos los tracks
  currentTrack: Track | null              // Track seleccionado
  isLoading: boolean                      // Estado de carga
  addTrack: (track: Track) => void        // Añadir nuevo track
  updateTrack: (track: Track) => void     // Actualizar track
  deleteTrack: (id: string) => void       // Eliminar track
  selectTrack: (id: string) => void       // Seleccionar track
  setCurrentTrack: (track: Track) => void // Establecer track actual
}
```

**Uso:**
```typescript
const { tracks, currentTrack, addTrack, selectTrack } = useTracks();
```

### useMarkers

Gestiona los marcadores de un track.

**Retorna:**
```typescript
{
  markers: Marker[]                       // Array de marcadores
  addMarker: (type, time, note?) => Marker // Añadir marcador
  updateMarker: (id, updates) => void     // Actualizar marcador
  deleteMarker: (id: string) => void      // Eliminar marcador
  clearMarkers: () => void                // Limpiar todos
  getMarkersByType: (type) => Marker[]    // Filtrar por tipo
  getNearestMarker: (time) => Marker      // Obtener marcador más cercano
  setMarkers: (markers: Marker[]) => void // Establecer marcadores
}
```

## Gestión de Estado

### localStorage

Los datos se persisten en localStorage automáticamente:

- **Clave**: `practice-room-tracks`
- **Formato**: JSON array de objetos Track
- **Sincronización**: Automática en cada operación CRUD

### Flujo de Datos

```
Usuario interactúa con componente
         ↓
Hook actualiza estado local (React)
         ↓
Hook guarda en localStorage
         ↓
Componente se re-renderiza con nuevos datos
```

## Cómo Extender la App

### Añadir un Nuevo Tipo de Marcador

1. Actualizar `lib/types.ts`:
```typescript
export type MarkerType = 'intro' | 'buildup' | 'drop' | 'outro' | 'custom' | 'breakdown';

export const MARKER_COLORS: Record<MarkerType, string> = {
  // ...existing colors
  breakdown: '#f97316', // Nuevo color
};

export const MARKER_LABELS: Record<MarkerType, string> = {
  // ...existing labels
  breakdown: 'Breakdown',
};
```

### Migrar a Backend

Para preparar el código para usar un backend:

1. Crear servicio API en `lib/api.ts`:
```typescript
export const api = {
  getTracks: async () => {
    const response = await fetch('/api/tracks');
    return response.json();
  },
  saveTrack: async (track: Track) => {
    const response = await fetch('/api/tracks', {
      method: 'POST',
      body: JSON.stringify(track),
    });
    return response.json();
  },
  // ...más métodos
};
```

2. Actualizar hooks para usar el servicio API en lugar de localStorage

3. Añadir rutas API en `app/api/tracks/route.ts`

### Añadir Análisis BPM

1. Instalar librería de detección de BPM:
```bash
npm install music-tempo
```

2. Extender el tipo Track:
```typescript
export interface Track {
  // ...campos existentes
  bpm?: number;
}
```

3. Calcular BPM al subir archivo en `components/FileUpload.tsx`

### Añadir Exportación de Práctica

1. Crear función de exportación en `lib/utils.ts`:
```typescript
export const exportPracticeSession = (track: Track) => {
  const data = JSON.stringify(track, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${track.name}-practice.json`;
  a.click();
};
```

2. Añadir botón de exportación en la UI

## Buenas Prácticas

1. **Tipos Estrictos**: Usa TypeScript para todo
2. **Componentización**: Mantén componentes pequeños y enfocados
3. **Hooks Personalizados**: Encapsula lógica compleja en hooks
4. **Comentarios**: Documenta funciones complejas
5. **Manejo de Errores**: Siempre maneja casos de error
6. **Accesibilidad**: Usa etiquetas semánticas y ARIA cuando sea necesario
7. **Performance**: Usa `useCallback` y `useMemo` para optimizar

## Testing (Futuro)

Para añadir tests:

```bash
npm install -D @testing-library/react @testing-library/jest-dom jest
```

Ejemplo de test:
```typescript
import { render, screen } from '@testing-library/react';
import { MarkerList } from '@/components/MarkerList';

test('muestra mensaje cuando no hay marcadores', () => {
  render(<MarkerList markers={[]} {...props} />);
  expect(screen.getByText(/no hay marcadores/i)).toBeInTheDocument();
});
```
