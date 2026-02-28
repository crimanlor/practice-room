'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import type { PlayerState } from '@/types';
import { getAudioFile } from '@/services/audioService';

interface UseAudioPlayerOptions {
  audioUrl?: string;
  onReady?: (duration: number) => void;
}

/** Tiempo mínimo (ms) entre actualizaciones de currentTime para limitar re-renders. */
const TIME_UPDATE_THROTTLE_MS = 100;

const DIRECT_URL_PREFIXES = ['blob:', 'http:', 'https:', 'data:'];

function isDirectUrl(url: string): boolean {
  return DIRECT_URL_PREFIXES.some((prefix) => url.startsWith(prefix));
}

export function useAudioPlayer({ audioUrl, onReady }: UseAudioPlayerOptions = {}) {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const onReadyRef = useRef(onReady);
  const currentBlobUrlRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const lastTimeUpdateRef = useRef(0);

  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
  });
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mantener la ref actualizada sin causar re-renders
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const loadAudio = useCallback(async (url: string) => {
    const ws = wavesurferRef.current;
    if (!ws) return;

    // Revocar blob URL anterior para liberar memoria
    if (currentBlobUrlRef.current) {
      URL.revokeObjectURL(currentBlobUrlRef.current);
      currentBlobUrlRef.current = null;
    }

    if (ws.isPlaying()) ws.pause();

    isLoadingRef.current = true;
    setIsReady(false);
    setError(null);

    try {
      if (isDirectUrl(url)) {
        await ws.load(url);
      } else {
        const blobUrl = await getAudioFile(url);
        if (blobUrl) {
          currentBlobUrlRef.current = blobUrl;
          await ws.load(blobUrl);
        } else {
          isLoadingRef.current = false;
          setError('Archivo no encontrado');
        }
      }
    } catch (err) {
      console.error('[useAudioPlayer] Error loading audio:', err);
      isLoadingRef.current = false;
      setError('Error al cargar audio');
    }
  }, []);

  // Inicializar WaveSurfer una sola vez y cargar audio cuando el contenedor esté listo
  useEffect(() => {
    function tryInit() {
      if (isInitializedRef.current) return;
      if (!waveformRef.current) {
        requestAnimationFrame(tryInit);
        return;
      }

      isInitializedRef.current = true;

      const ws = WaveSurfer.create({
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

      wavesurferRef.current = ws;

      ws.on('ready', () => {
        if (!isLoadingRef.current) return;
        isLoadingRef.current = false;
        const duration = ws.getDuration();
        setPlayerState((prev) => ({ ...prev, duration }));
        setIsReady(true);
        setError(null);
        onReadyRef.current?.(duration);
      });

      ws.on('play', () =>
        setPlayerState((prev) => ({ ...prev, isPlaying: true })),
      );
      ws.on('pause', () =>
        setPlayerState((prev) => ({ ...prev, isPlaying: false })),
      );

      ws.on('timeupdate', (currentTime: number) => {
        const now = Date.now();
        if (now - lastTimeUpdateRef.current > TIME_UPDATE_THROTTLE_MS) {
          lastTimeUpdateRef.current = now;
          setPlayerState((prev) => ({ ...prev, currentTime }));
        }
      });

      ws.on('finish', () =>
        setPlayerState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 })),
      );

      ws.on('error', (err: Error) => {
        console.error('[useAudioPlayer] WaveSurfer error:', err);
        isLoadingRef.current = false;
        setError('Error al cargar el audio');
        setIsReady(false);
      });

      if (audioUrl) {
        isLoadingRef.current = true;
        loadAudio(audioUrl);
      } else {
        setIsReady(true);
      }

      return () => {
        setTimeout(() => {
          try {
            if (ws.isPlaying()) ws.pause();
            ws.destroy();
          } catch {
            // ignorar errores en cleanup
          }
          wavesurferRef.current = null;
          isInitializedRef.current = false;
        }, 0);
      };
    }

    tryInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl, loadAudio]);

  const togglePlayPause = useCallback(() => {
    wavesurferRef.current?.playPause();
  }, []);

  const seekTo = useCallback((time: number) => {
    const ws = wavesurferRef.current;
    if (!ws) return;
    const duration = ws.getDuration();
    if (duration > 0) ws.seekTo(time / duration);
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    wavesurferRef.current?.setVolume(clamped);
    setPlayerState((prev) => ({ ...prev, volume: clamped }));
  }, []);

  const stop = useCallback(() => {
    wavesurferRef.current?.stop();
    setPlayerState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }));
  }, []);

  return { waveformRef, playerState, isReady, error, togglePlayPause, seekTo, setVolume, stop };
}
