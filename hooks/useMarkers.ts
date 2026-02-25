'use client';

import { useState, useCallback } from 'react';
import { Marker, MarkerType, MARKER_COLORS } from '@/lib/types';
import { generateId } from '@/lib/utils';

/**
 * Hook para gestionar marcadores
 * Proporciona funciones para añadir, editar y eliminar marcadores
 */
export const useMarkers = (initialMarkers: Marker[] = []) => {
  const [markers, setMarkers] = useState<Marker[]>(initialMarkers);

  /**
   * Añade un nuevo marcador
   */
  const addMarker = useCallback((type: MarkerType, time: number, note?: string) => {
    const newMarker: Marker = {
      id: generateId(),
      type,
      time,
      note,
      color: MARKER_COLORS[type],
    };

    setMarkers(prev => [...prev, newMarker].sort((a, b) => a.time - b.time));
    return newMarker;
  }, []);

  /**
   * Actualiza un marcador existente
   */
  const updateMarker = useCallback((id: string, updates: Partial<Marker>) => {
    setMarkers(prev => 
      prev.map(marker => 
        marker.id === id 
          ? { ...marker, ...updates }
          : marker
      ).sort((a, b) => a.time - b.time)
    );
  }, []);

  /**
   * Elimina un marcador
   */
  const deleteMarker = useCallback((id: string) => {
    setMarkers(prev => prev.filter(marker => marker.id !== id));
  }, []);

  /**
   * Limpia todos los marcadores
   */
  const clearMarkers = useCallback(() => {
    setMarkers([]);
  }, []);

  /**
   * Obtiene marcadores por tipo
   */
  const getMarkersByType = useCallback((type: MarkerType) => {
    return markers.filter(marker => marker.type === type);
  }, [markers]);

  /**
   * Obtiene el marcador más cercano a un tiempo dado
   */
  const getNearestMarker = useCallback((time: number, threshold: number = 2) => {
    let nearest: Marker | null = null;
    let minDiff = threshold;

    markers.forEach(marker => {
      const diff = Math.abs(marker.time - time);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = marker;
      }
    });

    return nearest;
  }, [markers]);

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
};
