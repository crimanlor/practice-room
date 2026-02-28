/**
 * @file services/trackService.ts
 * Capa de acceso a datos para metadatos de tracks en localStorage.
 *
 * Responsabilidades:
 * - CRUD de objetos `Track` (sin los binarios de audio)
 * - Limpieza de tracks con `blob:` URLs inválidas de sesiones anteriores
 *
 * NO gestiona los archivos de audio binarios — eso es `audioService.ts`.
 * NO conoce React: es código puro que puede testearse sin un navegador.
 */

import type { Track, Marker } from '@/types';

/** Clave bajo la que se guarda el array de tracks en localStorage */
const STORAGE_KEY = 'practice-room-tracks';

/** Lee y parsea el array de tracks desde localStorage. Devuelve [] ante cualquier error. */
function readFromStorage(): Track[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Track[]) : [];
  } catch {
    return [];
  }
}

/** Serializa y guarda el array de tracks en localStorage. */
function writeToStorage(tracks: Track[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
  } catch (error) {
    console.error('[trackService] Error al escribir en localStorage:', error);
  }
}

export const trackService = {
  /** Devuelve todos los tracks guardados, o [] si no hay ninguno. */
  getAll(): Track[] {
    return readFromStorage();
  },

  /** Busca un track por ID. Devuelve `null` si no existe. */
  getById(id: string): Track | null {
    return readFromStorage().find((t) => t.id === id) ?? null;
  },

  /**
   * Crea o actualiza un track.
   * Si ya existe un track con ese `id`, lo reemplaza y actualiza `updatedAt`.
   * Si no existe, lo añade al final del array.
   */
  save(track: Track): void {
    const tracks = readFromStorage();
    const idx = tracks.findIndex((t) => t.id === track.id);
    if (idx >= 0) {
      tracks[idx] = { ...track, updatedAt: Date.now() };
    } else {
      tracks.push(track);
    }
    writeToStorage(tracks);
  },

  /**
   * Elimina un track por ID.
   * No elimina el archivo de audio — llama a `audioService.deleteAudioFile` por separado.
   */
  delete(id: string): void {
    const tracks = readFromStorage().filter((t) => t.id !== id);
    writeToStorage(tracks);
  },

  /** Atajo para actualizar solo los marcadores de un track sin tener que hacer getById+save. */
  updateMarkers(trackId: string, markers: Marker[]): void {
    const track = trackService.getById(trackId);
    if (track) {
      trackService.save({ ...track, markers, updatedAt: Date.now() });
    }
  },

  /** Elimina tracks que todavía tengan blob: URLs (inválidas entre sesiones). */
  removeStaleBlobs(): number {
    if (typeof window === 'undefined') return 0;
    const all = readFromStorage();
    const valid = all.filter((t) => !t.file_url.startsWith('blob:'));
    const removed = all.length - valid.length;
    if (removed > 0) writeToStorage(valid);
    return removed;
  },
};
