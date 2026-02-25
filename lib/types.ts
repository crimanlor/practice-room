/**
 * Tipos de marcadores disponibles para marcar momentos importantes
 * en una pista de audio
 */
export type MarkerType = 'intro' | 'buildup' | 'drop' | 'outro' | 'custom';

/**
 * Marcador individual que representa un punto específico en el tiempo
 * dentro de una pista de audio
 */
export interface Marker {
  id: string;
  type: MarkerType;
  time: number; // Tiempo en segundos
  note?: string;
  color: string;
}

/**
 * Pista de audio con toda su información y marcadores asociados
 */
export interface Track {
  id: string;
  name: string;
  file_url: string; // ID del archivo en IndexedDB (o URL directa para compatibilidad)
  duration: number; // Duración en segundos
  markers: Marker[];
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
}

/**
 * Estado del reproductor de audio
 */
export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

/**
 * Colores predefinidos para cada tipo de marcador
 */
export const MARKER_COLORS: Record<MarkerType, string> = {
  intro: '#10b981', // Verde
  buildup: '#f59e0b', // Naranja
  drop: '#ef4444', // Rojo
  outro: '#8b5cf6', // Púrpura
  custom: '#3b82f6', // Azul
};

/**
 * Etiquetas legibles para tipos de marcadores
 */
export const MARKER_LABELS: Record<MarkerType, string> = {
  intro: 'Intro',
  buildup: 'Build Up',
  drop: 'Drop',
  outro: 'Outro',
  custom: 'Personalizado',
};
