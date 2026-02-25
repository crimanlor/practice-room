'use client';

import { useState, useEffect } from 'react';
import { Track } from '@/lib/types';
import { storageUtils } from '@/lib/utils';
import { deleteAudioFile } from '@/lib/audioStorage';

/**
 * Hook para manejar tracks
 * Proporciona estado y funciones para gestionar la colección de tracks
 */
export const useTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar tracks al montar el componente
  useEffect(() => {
    // Limpiar tracks antiguos con URLs de blob inválidas
    const removedCount = storageUtils.cleanInvalidTracks();
    if (removedCount > 0) {
      console.log(`✨ Se limpiaron ${removedCount} tracks antiguos automáticamente`);
    }
    
    const loadedTracks = storageUtils.getTracks();
    setTracks(loadedTracks);
    setIsLoading(false);
  }, []);

  /**
   * Añade un nuevo track
   */
  const addTrack = (track: Track) => {
    storageUtils.saveTrack(track);
    setTracks(prev => [...prev, track]);
  };

  /**
   * Actualiza un track existente
   */
  const updateTrack = (track: Track) => {
    storageUtils.saveTrack(track);
    setTracks(prev => prev.map(t => t.id === track.id ? track : t));
    
    if (currentTrack?.id === track.id) {
      setCurrentTrack(track);
    }
  };

  /**
   * Elimina un track
   */
  const deleteTrack = (id: string) => {
    // Obtener el track antes de eliminarlo para limpiar el archivo
    const track = tracks.find(t => t.id === id);
    
    storageUtils.deleteTrack(id);
    setTracks(prev => prev.filter(t => t.id !== id));
    
    // Eliminar el archivo de audio de IndexedDB
    if (track) {
      deleteAudioFile(track.file_url).catch(err => 
        console.error('Error al eliminar archivo de audio:', err)
      );
    }
    
    if (currentTrack?.id === id) {
      setCurrentTrack(null);
    }
  };

  /**
   * Selecciona un track como actual
   */
  const selectTrack = (id: string) => {
    const track = tracks.find(t => t.id === id);
    setCurrentTrack(track || null);
  };

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
};
