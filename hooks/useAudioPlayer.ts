'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { PlayerState } from '@/lib/types';
import { getAudioFile } from '@/lib/audioStorage';

interface UseAudioPlayerProps {
  audioUrl?: string;
  onReady?: (duration: number) => void;
}

const THROTTLE_MS = 100;

export const useAudioPlayer = ({ audioUrl, onReady }: UseAudioPlayerProps = {}) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const onReadyRef = useRef(onReady);
  const currentBlobUrlRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);
  const isLoadingRef = useRef(false);
  
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
  });

  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const lastTimeUpdateRef = useRef<number>(0);

  // Actualizar ref cuando cambia onReady
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  // Función para cargar audio
  const loadAudio = useCallback(async (url: string) => {
    if (!wavesurferRef.current) return;
    
    const wavesurfer = wavesurferRef.current;

    // Limpiar blob URL anterior
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current);
      currentBlobUrlRef.current = null;
    }

    try {
      if (wavesurfer.isPlaying()) {
        wavesurfer.pause();
      }
    } catch (e) {}

    // Indicar que estamos cargando
    isLoadingRef.current = true;
    setIsReady(false);
    setError(null);

    try {
      const isDirectUrl = url.startsWith('blob:') || 
                         url.startsWith('http:') || 
                         url.startsWith('https:') ||
                         url.startsWith('data:');
      
      if (isDirectUrl) {
        await wavesurfer.load(url);
      } else {
        const blobUrl = await getAudioFile(url);
        
        if (blobUrl) {
          currentBlobUrlRef.current = blobUrl;
          await wavesurfer.load(blobUrl);
        } else {
          isLoadingRef.current = false;
          setError('Archivo no encontrado');
          setIsReady(false);
        }
      }
    } catch (err: any) {
      console.error('Error loading audio:', err);
      isLoadingRef.current = false;
      setError('Error al cargar audio');
      setIsReady(false);
    }
  }, []);

  // Efecto combinado: inicializar WaveSurfer Y cargar audio cuando esté listo
  useEffect(() => {
    // Función que intenta inicializar
    const tryInit = () => {
      if (isInitializedRef.current) return;
      if (!waveformRef.current) {
        // Reintentar en el siguiente frame
        requestAnimationFrame(tryInit);
        return;
      }

      isInitializedRef.current = true;

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

      // Evento cuando WaveSurfer termina de cargar audio
      wavesurfer.on('ready', () => {
        if (isLoadingRef.current) {
          isLoadingRef.current = false;
          const duration = wavesurfer.getDuration();
          setPlayerState(prev => ({ ...prev, duration }));
          setIsReady(true);
          setError(null);
          onReadyRef.current?.(duration);
        }
      });

      wavesurfer.on('play', () => {
        setPlayerState(prev => ({ ...prev, isPlaying: true }));
      });

      wavesurfer.on('pause', () => {
        setPlayerState(prev => ({ ...prev, isPlaying: false }));
      });

      wavesurfer.on('timeupdate', (currentTime: number) => {
        const now = Date.now();
        if (now - lastTimeUpdateRef.current > THROTTLE_MS) {
          lastTimeUpdateRef.current = now;
          setPlayerState(prev => ({ ...prev, currentTime }));
        }
      });

      wavesurfer.on('finish', () => {
        setPlayerState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
      });

      wavesurfer.on('error', (err: any) => {
        console.error('WaveSurfer error:', err);
        isLoadingRef.current = false;
        setError('Error al cargar el audio');
        setIsReady(false);
      });

      // Si hay una URL de audio, cargarla ahora
      if (audioUrl) {
        isLoadingRef.current = true;
        loadAudio(audioUrl);
      } else {
        // Sin audio, marcar como listo
        setIsReady(true);
      }

      // Cleanup
      return () => {
        try {
          if (wavesurfer.isPlaying()) {
            wavesurfer.pause();
          }
        } catch (e) {}
        
        setTimeout(() => {
          try {
            wavesurfer.destroy();
            wavesurferRef.current = null;
            isInitializedRef.current = false;
          } catch (e) {}
        }, 0);
      };
    };

    tryInit();
  }, [audioUrl, loadAudio]);

  const togglePlayPause = useCallback(() => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.playPause();
  }, []);

  const seekTo = useCallback((time: number) => {
    if (!wavesurferRef.current) return;
    const duration = wavesurferRef.current.getDuration();
    if (duration > 0) {
      wavesurferRef.current.seekTo(time / duration);
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (!wavesurferRef.current) return;
    const clampedVolume = Math.max(0, Math.min(1, volume));
    wavesurferRef.current.setVolume(clampedVolume);
    setPlayerState(prev => ({ ...prev, volume: clampedVolume }));
  }, []);

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
