'use client';

import { useCallback, useState } from 'react';
import type { Marker, MarkerType } from '@/types';
import { MARKER_COLORS } from '@/lib/constants';
import { generateId } from '@/lib/utils';

export function useMarkers(initialMarkers: Marker[] = []) {
  const [markers, setMarkers] = useState<Marker[]>(initialMarkers);

  const addMarker = useCallback(
    (type: MarkerType, time: number, note?: string): Marker => {
      const newMarker: Marker = {
        id: generateId(),
        type,
        time,
        note,
        color: MARKER_COLORS[type],
      };
      setMarkers((prev) =>
        [...prev, newMarker].sort((a, b) => a.time - b.time),
      );
      return newMarker;
    },
    [],
  );

  const updateMarker = useCallback(
    (id: string, updates: Partial<Omit<Marker, 'id'>>) => {
      setMarkers((prev) =>
        prev
          .map((m) =>
            m.id === id
              ? {
                  ...m,
                  ...updates,
                  // recalcular color si cambia el tipo
                  color: updates.type ? MARKER_COLORS[updates.type] : m.color,
                }
              : m,
          )
          .sort((a, b) => a.time - b.time),
      );
    },
    [],
  );

  const deleteMarker = useCallback((id: string) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const clearMarkers = useCallback(() => setMarkers([]), []);

  const getMarkersByType = useCallback(
    (type: MarkerType) => markers.filter((m) => m.type === type),
    [markers],
  );

  const getNearestMarker = useCallback(
    (time: number, threshold = 2): Marker | null => {
      let nearest: Marker | null = null;
      let minDiff = threshold;
      for (const m of markers) {
        const diff = Math.abs(m.time - time);
        if (diff < minDiff) {
          minDiff = diff;
          nearest = m;
        }
      }
      return nearest;
    },
    [markers],
  );

  return {
    markers,
    addMarker,
    updateMarker,
    deleteMarker,
    clearMarkers,
    getMarkersByType,
    getNearestMarker,
    setMarkers,
  };
}
