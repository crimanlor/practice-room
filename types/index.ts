/**
 * @file types/index.ts
 * Tipos TypeScript del dominio de la aplicación.
 *
 * REGLA: todos los tipos del dominio viven aquí.
 * Ningún componente ni hook debe definir sus propias interfaces de dominio.
 */

// ─── Marker ──────────────────────────────────────────────────────────────────

/**
 * Tipo de sección musical que puede tener un marcador.
 * Representa las partes típicas de una canción electrónica.
 */
export type MarkerType = 'intro' | 'buildup' | 'drop' | 'outro' | 'custom';

/**
 * Un marcador colocado por el usuario en un punto del audio.
 * Los marcadores se ordenan siempre por `time` ascendente.
 */
export interface Marker {
  /** Identificador único generado con `generateId()` */
  id: string;
  type: MarkerType;
  /** Posición en el track, en segundos */
  time: number;
  /** Nota opcional escrita por el usuario */
  note?: string;
  /** Color hexadecimal calculado desde `MARKER_COLORS[type]` */
  color: string;
}

// ─── Track ────────────────────────────────────────────────────────────────────

/**
 * Representa un archivo de audio cargado por el usuario.
 * Los metadatos se persisten en localStorage; el binario en IndexedDB.
 */
export interface Track {
  /** Identificador único. También es la clave del archivo en IndexedDB. */
  id: string;
  /** Nombre del archivo sin extensión */
  name: string;
  /** ID del archivo en IndexedDB (o URL directa para compatibilidad con versiones antiguas) */
  file_url: string;
  /** Duración total en segundos */
  duration: number;
  /** Marcadores del usuario, ordenados por tiempo ascendente */
  markers: Marker[];
  /** Timestamp Unix (ms) de creación */
  createdAt: number;
  /** Timestamp Unix (ms) de última modificación */
  updatedAt: number;
}

// ─── Player ───────────────────────────────────────────────────────────────────

/**
 * Estado del reproductor de audio en un momento dado.
 * Gestionado por `useAudioPlayer` y compartido vía `PlayerContext`.
 */
export interface PlayerState {
  isPlaying: boolean;
  /** Posición actual de reproducción, en segundos */
  currentTime: number;
  /** Duración total del audio cargado, en segundos */
  duration: number;
  /** Volumen de 0.0 (silencio) a 1.0 (máximo) */
  volume: number;
}

// ─── Learning ─────────────────────────────────────────────────────────────────

/**
 * Un bloque de contenido educativo: título, descripción y lista de consejos.
 * Pertenece a una `LearningSection`.
 */
export interface LearningItem {
  subtitle: string;
  description: string;
  tips?: string[];
}

/**
 * Una sección del panel de aprendizaje (ej: "BPM y Tempo").
 * Contiene uno o más `LearningItem`.
 * Los datos concretos están en `lib/learningContent.ts`.
 */
export interface LearningSection {
  id: string;
  title: string;
  /** Emoji que identifica visualmente la sección */
  icon: string;
  content: LearningItem[];
}
