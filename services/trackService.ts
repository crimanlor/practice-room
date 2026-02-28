import type { Track, Marker } from '@/types';

const STORAGE_KEY = 'practice-room-tracks';

function readFromStorage(): Track[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Track[]) : [];
  } catch {
    return [];
  }
}

function writeToStorage(tracks: Track[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
  } catch (error) {
    console.error('[trackService] Error al escribir en localStorage:', error);
  }
}

export const trackService = {
  getAll(): Track[] {
    return readFromStorage();
  },

  getById(id: string): Track | null {
    return readFromStorage().find((t) => t.id === id) ?? null;
  },

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

  delete(id: string): void {
    const tracks = readFromStorage().filter((t) => t.id !== id);
    writeToStorage(tracks);
  },

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
