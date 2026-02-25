import { Track, Marker } from './types';

/**
 * Hook para manejar el almacenamiento local de tracks
 * Proporciona funciones para CRUD de tracks en localStorage
 */

const STORAGE_KEY = 'practice-room-tracks';

export const storageUtils = {
  /**
   * Obtiene todos los tracks del localStorage
   */
  getTracks: (): Track[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al leer tracks del localStorage:', error);
      return [];
    }
  },

  /**
   * Guarda un track nuevo en localStorage
   */
  saveTrack: (track: Track): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const tracks = storageUtils.getTracks();
      const existingIndex = tracks.findIndex(t => t.id === track.id);
      
      if (existingIndex >= 0) {
        // Actualizar track existente
        tracks[existingIndex] = {
          ...track,
          updatedAt: Date.now(),
        };
      } else {
        // Agregar nuevo track
        tracks.push(track);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
    } catch (error) {
      console.error('Error al guardar track:', error);
    }
  },

  /**
   * Obtiene un track específico por ID
   */
  getTrack: (id: string): Track | null => {
    const tracks = storageUtils.getTracks();
    return tracks.find(t => t.id === id) || null;
  },

  /**
   * Elimina un track por ID
   */
  deleteTrack: (id: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const tracks = storageUtils.getTracks();
      const filtered = tracks.filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error al eliminar track:', error);
    }
  },

  /**
   * Actualiza los marcadores de un track
   */
  updateTrackMarkers: (trackId: string, markers: Marker[]): void => {
    const track = storageUtils.getTrack(trackId);
    if (track) {
      track.markers = markers;
      track.updatedAt = Date.now();
      storageUtils.saveTrack(track);
    }
  },

  /**
   * Limpia todos los tracks (útil para desarrollo/testing)
   */
  clearAll: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Limpia tracks con URLs de blob antiguas/inválidas
   * Retorna el número de tracks eliminados
   */
  cleanInvalidTracks: (): number => {
    if (typeof window === 'undefined') return 0;
    
    try {
      const tracks = storageUtils.getTracks();
      const validTracks = tracks.filter(track => {
        // Mantener solo tracks que NO tienen URLs de blob antiguas
        return !track.file_url.startsWith('blob:');
      });
      
      const removedCount = tracks.length - validTracks.length;
      
      if (removedCount > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validTracks));
        console.log(`Se eliminaron ${removedCount} tracks con archivos inválidos`);
      }
      
      return removedCount;
    } catch (error) {
      console.error('Error al limpiar tracks inválidos:', error);
      return 0;
    }
  },
};

/**
 * Genera un ID único simple
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Formatea segundos a formato MM:SS
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
