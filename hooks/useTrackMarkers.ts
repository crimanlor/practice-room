'use client';

/**
 * @file hooks/useTrackMarkers.ts
 * Hook que sincroniza los marcadores en memoria con la persistencia del track.
 *
 * Combina:
 * - `useMarkers`: gestión de marcadores en estado React (rápida, en memoria)
 * - `useTracks.updateTrack`: persistencia en localStorage (vía trackService)
 *
 * Al cambiar de track (`currentTrack.id`), reemplaza los marcadores en memoria
 * con los del nuevo track automáticamente.
 *
 * Uso en `page.tsx`:
 * ```ts
 * const { markers, addMarker, updateMarker, deleteMarker } = useTrackMarkers({
 *   currentTrack,
 *   updateTrack,
 * });
 * ```
 */

import { useEffect } from 'react';
import type { Marker, MarkerType, Track } from '@/types';
import { useMarkers } from '@/hooks/useMarkers';

interface UseTrackMarkersOptions {
  currentTrack: Track | null;
  updateTrack: (track: Track) => void;
}

export function useTrackMarkers({ currentTrack, updateTrack }: UseTrackMarkersOptions) {
  const {
    markers,
    addMarker: addMarkerLocal,
    updateMarker: updateMarkerLocal,
    deleteMarker: deleteMarkerLocal,
    setMarkers,
  } = useMarkers(currentTrack?.markers ?? []);

  // Sincronizar marcadores al cambiar de track
  useEffect(() => {
    setMarkers(currentTrack?.markers ?? []);
  }, [currentTrack?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function persistUpdate(updatedMarkers: Marker[]) {
    if (!currentTrack) return;
    updateTrack({ ...currentTrack, markers: updatedMarkers });
  }

  function addMarker(type: MarkerType, time: number, note?: string) {
    const newMarker = addMarkerLocal(type, time, note);
    persistUpdate([...markers, newMarker].sort((a, b) => a.time - b.time));
  }

  function updateMarker(id: string, updates: Partial<Omit<Marker, 'id'>>) {
    updateMarkerLocal(id, updates);
    const updatedMarkers = markers.map((m) =>
      m.id === id ? { ...m, ...updates } : m,
    );
    persistUpdate(updatedMarkers);
  }

  function deleteMarker(id: string) {
    deleteMarkerLocal(id);
    persistUpdate(markers.filter((m) => m.id !== id));
  }

  return { markers, addMarker, updateMarker, deleteMarker };
}
