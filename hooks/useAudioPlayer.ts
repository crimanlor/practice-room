'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { PlayerState } from '@/lib/types';
import { getAudioFile } from '@/lib/audioStorage';

interface UseAudioPlayerProps {
  audioUrl?: string;
  onReady?: (duration: number) => void;
}

/**
 * Hook para manejar el reproductor de audio con WaveSurfer
 * Maneja la reproducción, pausa, seek y visualización de waveform
 */
export const useAudioPlayer = ({ audioUrl, onReady }: UseAudioPlayerProps = {}) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const onReadyRef = useRef(onReady);
  
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
  });

  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Actualizar ref cuando cambia onReady
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  /**
   * Inicializa WaveSurfer cuando el contenedor está disponible
   */
  useEffect(() => {
    if (!waveformRef.current) return;

    // Crear instancia de WaveSurfer
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#94a3b8',
      progressColor: '#0ea5e9',
      cursorColor: '#ef4444',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 100,
      normalize: true,
      backend: 'WebAudio',
    });

    wavesurferRef.current = wavesurfer;

    // Event listeners
    wavesurfer.on('ready', () => {
      const duration = wavesurfer.getDuration();
      setPlayerState(prev => ({ ...prev, duration }));
      setIsReady(true);
      setError(null); // Limpiar errores previos
      onReadyRef.current?.(duration);
    });

    wavesurfer.on('play', () => {
      setPlayerState(prev => ({ ...prev, isPlaying: true }));
    });

    wavesurfer.on('pause', () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    });

    wavesurfer.on('timeupdate', (currentTime: number) => {
      setPlayerState(prev => ({ ...prev, currentTime }));
    });

    wavesurfer.on('finish', () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    });

    // Cleanup
    return () => {
      // Detener reproducción primero
      try {
        if (wavesurfer.isPlaying()) {
          wavesurfer.pause();
        }
      } catch (error) {
        // Ignorar
      }

      // Destruir después de un pequeño delay para permitir que termine cualquier operación
      setTimeout(() => {
        try {
          wavesurfer.destroy();
        } catch (error) {
          // Ignorar errores de cleanup
        }
      }, 0);
    };
  }, []); // Sin dependencias - solo se crea una vez

  /**
   * Cargar audio cuando cambia la URL
   */
  useEffect(() => {
    if (!wavesurferRef.current || !audioUrl) return;

    const wavesurfer = wavesurferRef.current;
    
    // Función asíncrona para cargar el audio
    const loadAudio = async () => {
      // Detener y limpiar antes de cargar nuevo audio
      try {
        if (wavesurfer.isPlaying()) {
          wavesurfer.pause();
        }
        wavesurfer.empty(); // Limpiar el audio actual
      } catch (error) {
        // Ignorar errores
      }

      setIsReady(false);
      setError(null); // Limpiar errores previos
      
      try {
        // Determinar si es un ID de IndexedDB o una URL directa
        const isDirectUrl = audioUrl.startsWith('blob:') || 
                           audioUrl.startsWith('http:') || 
                           audioUrl.startsWith('https:') ||
                           audioUrl.startsWith('data:');
        
        if (isDirectUrl) {
          // Si es una URL directa (como blob: o http:), intentar cargar directamente
          try {
            await wavesurfer.load(audioUrl);
          } catch (error) {
            const errorMsg = 'Archivo no disponible. Por favor, elimina este track y vuelve a subirlo.';
            console.error(errorMsg);
            setError(errorMsg);
            setIsReady(false);
          }
        } else {
          // Si parece ser un ID, buscar en IndexedDB
          const blobUrl = await getAudioFile(audioUrl);
          
          if (blobUrl) {
            // Si se encuentra en IndexedDB, cargar desde ahí
            await wavesurfer.load(blobUrl);
          } else {
            const errorMsg = 'Archivo no encontrado. Puede que sea un track antiguo. Elimínalo y vuelve a subirlo.';
            console.error(errorMsg, 'ID:', audioUrl);
            setError(errorMsg);
            setIsReady(false);
          }
        }
      } catch (error) {
        const errorMsg = 'Error al cargar audio';
        console.error(errorMsg, error);
        setError(errorMsg);
        setIsReady(false);
      }
    };

    loadAudio();
  }, [audioUrl]);

  /**
   * Play/Pause
   */
  const togglePlayPause = useCallback(() => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.playPause();
  }, []);

  /**
   * Ir a un tiempo específico (en segundos)
   */
  const seekTo = useCallback((time: number) => {
    if (!wavesurferRef.current) return;
    const duration = wavesurferRef.current.getDuration();
    if (duration > 0) {
      wavesurferRef.current.seekTo(time / duration);
    }
  }, []);

  /**
   * Cambiar volumen (0 a 1)
   */
  const setVolume = useCallback((volume: number) => {
    if (!wavesurferRef.current) return;
    const clampedVolume = Math.max(0, Math.min(1, volume));
    wavesurferRef.current.setVolume(clampedVolume);
    setPlayerState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

  /**
   * Detener reproducción
   */
  const stop = useCallback(() => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.stop();
    setPlayerState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
  }, []);

  return {
    waveformRef,
    playerState,
    isReady,
    error,
    togglePlayPause,
    seekTo,
    setVolume,
    stop,
  };
};
