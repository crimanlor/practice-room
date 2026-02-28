// ─── Marker ──────────────────────────────────────────────────────────────────

export type MarkerType = 'intro' | 'buildup' | 'drop' | 'outro' | 'custom';

export interface Marker {
  id: string;
  type: MarkerType;
  /** Tiempo en segundos */
  time: number;
  note?: string;
  color: string;
}

// ─── Track ────────────────────────────────────────────────────────────────────

export interface Track {
  id: string;
  name: string;
  /** ID del archivo en IndexedDB (o URL directa para compatibilidad) */
  file_url: string;
  /** Duración en segundos */
  duration: number;
  markers: Marker[];
  createdAt: number;
  updatedAt: number;
}

// ─── Player ───────────────────────────────────────────────────────────────────

export interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

// ─── Learning ─────────────────────────────────────────────────────────────────

export interface LearningItem {
  subtitle: string;
  description: string;
  tips?: string[];
}

export interface LearningSection {
  id: string;
  title: string;
  icon: string;
  content: LearningItem[];
}
