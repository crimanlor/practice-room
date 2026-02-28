'use client';

/**
 * @file hooks/useTracks.ts
 * Hook que gestiona la lista de tracks y el track actualmente seleccionado.
 *
 * Responsabilidades:
 * - Cargar tracks desde localStorage al montar
 * - Limpiar tracks con blob: URLs inválidas de sesiones anteriores
 * - CRUD de tracks (delegando persistencia a `trackService`)
 * - Eliminar el archivo de audio al borrar un track (delegando a `audioService`)
 * - Mantener `currentTrack` sincronizado cuando se actualiza o elimina
 */

import { useCallback, useEffect, useState } from 'react';
import type { Track } from '@/types';
import { trackService } from '@/services/trackService';
import { deleteAudioFile } from '@/services/audioService';

export function useTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const removed = trackService.removeStaleBlobs();
    if (removed > 0) {
      console.info(`[useTracks] Se limpiaron ${removed} tracks con archivos inválidos`);
    }
    setTracks(trackService.getAll());
    setIsLoading(false);
  }, []);

  const addTrack = useCallback((track: Track) => {
    trackService.save(track);
    setTracks((prev) => [...prev, track]);
  }, []);

  const updateTrack = useCallback((track: Track) => {
    trackService.save(track);
    setTracks((prev) => prev.map((t) => (t.id === track.id ? track : t)));
    setCurrentTrack((prev) => (prev?.id === track.id ? track : prev));
  }, []);

  const deleteTrack = useCallback(
    (id: string) => {
      const track = tracks.find((t) => t.id === id);
      trackService.delete(id);
      setTracks((prev) => prev.filter((t) => t.id !== id));
      setCurrentTrack((prev) => (prev?.id === id ? null : prev));

      if (track) {
        deleteAudioFile(track.file_url).catch((err) =>
          console.error('[useTracks] Error al eliminar archivo de audio:', err),
        );
      }
    },
    [tracks],
  );

  const selectTrack = useCallback(
    (id: string) => {
      setCurrentTrack(tracks.find((t) => t.id === id) ?? null);
    },
    [tracks],
  );

  return {
    tracks,
    currentTrack,
    isLoading,
    addTrack,
    updateTrack,
    deleteTrack,
    selectTrack,
    setCurrentTrack,
  };
}
