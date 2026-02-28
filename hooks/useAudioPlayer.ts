'use client';

/**
 * @file hooks/useAudioPlayer.ts
 * Hook que encapsula la integración con WaveSurfer.js.
 *
 * Arquitectura de un único efecto:
 * - WaveSurfer se crea y destruye dentro del mismo efecto que carga el audio.
 * - Cada vez que `audioUrl` cambia, el efecto anterior se limpia (destroy) y
 *   el nuevo crea una instancia fresca. Esto elimina toda coordinación entre
 *   efectos y es resistente a React StrictMode (mount→unmount→remount).
 * - Las race conditions de cambio rápido de track se manejan con `cancelled`
 *   (flag local del efecto) en lugar de un ref global.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import type { PlayerState } from '@/types';
import { getAudioFile } from '@/services/audioService';

interface UseAudioPlayerOptions {
  /** ID del archivo en IndexedDB, o URL directa (blob:, http:, https:) */
  audioUrl?: string;
  /** Callback invocado cuando WaveSurfer termina de decodificar el audio y está listo */
  onReady?: (duration: number) => void;
}

/** Tiempo mínimo (ms) entre actualizaciones de currentTime para limitar re-renders. */
const TIME_UPDATE_THROTTLE_MS = 100;

const DIRECT_URL_PREFIXES = ['blob:', 'http:', 'https:'];

/** Devuelve true si el error es una interrupción intencional de fetch/WaveSurfer (no un error real). */
function isAbortError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  // DOMException lanzado por fetch() cuando se llama AbortController.abort()
  if (err.name === 'AbortError') return true;
  // Mensaje alternativo que WaveSurfer propaga en algunos navegadores
  if (err.message.toLowerCase().includes('aborted')) return true;
  return false;
}

function isDirectUrl(url: string): boolean {
  return DIRECT_URL_PREFIXES.some((prefix) => url.startsWith(prefix));
}

export function useAudioPlayer({ audioUrl, onReady }: UseAudioPlayerOptions = {}) {
  /** Ref al <div> donde WaveSurfer monta el canvas de la forma de onda */
  const waveformRef = useRef<HTMLDivElement | null>(null);
  /** Instancia activa de WaveSurfer. Sólo se usa desde los controles (play/pause/seek/vol). */
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  /** Ref estable al callback onReady para evitar recrear el efecto cuando cambia */
  const onReadyRef = useRef(onReady);
  /** Timestamp de la última actualización de currentTime (throttle) */
  const lastTimeUpdateRef = useRef(0);

  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
  });
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mantener la ref actualizada sin causar re-renders ni recrear el efecto
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  // Efecto único: crear WaveSurfer, cargar audio, destruir al limpiar.
  // Se re-ejecuta cuando cambia audioUrl (incluyendo cambio de track).
  // Es resistente a StrictMode porque todo el estado vive en variables locales
  // del efecto — no en refs compartidos entre montajes.
  useEffect(() => {
    if (!audioUrl) {
      setIsReady(true);
      return;
    }

    // Capturar en una const local para que TypeScript sepa que es string dentro de init()
    const url = audioUrl;

    // Flag local: true cuando React ejecuta el cleanup de este efecto.
    // Cualquier operación async que compruebe `cancelled` antes de continuar
    // se cancela limpiamente sin tocar el estado del nuevo montaje.
    let cancelled = false;
    let ws: WaveSurfer | null = null;
    let blobUrlToRevoke: string | null = null;

    async function init() {
      // Esperar a que el contenedor DOM esté disponible
      // (puede no estarlo en el primer render con React StrictMode)
      const container = waveformRef.current;
      if (!container) return;

      setIsReady(false);
      setError(null);
      setPlayerState((prev) => ({ ...prev, isPlaying: false, currentTime: 0, duration: 0 }));

      ws = WaveSurfer.create({
        container,
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

      // Publicar la instancia para que los controles puedan usarla
      wavesurferRef.current = ws;

      ws.on('ready', () => {
        if (cancelled) return;
        const duration = ws!.getDuration();
        setPlayerState((prev) => ({ ...prev, duration }));
        setIsReady(true);
        setError(null);
        onReadyRef.current?.(duration);
      });

      ws.on('play', () => {
        if (cancelled) return;
        setPlayerState((prev) => ({ ...prev, isPlaying: true }));
      });

      ws.on('pause', () => {
        if (cancelled) return;
        setPlayerState((prev) => ({ ...prev, isPlaying: false }));
      });

      ws.on('timeupdate', (currentTime: number) => {
        if (cancelled) return;
        const now = Date.now();
        if (now - lastTimeUpdateRef.current > TIME_UPDATE_THROTTLE_MS) {
          lastTimeUpdateRef.current = now;
          setPlayerState((prev) => ({ ...prev, currentTime }));
        }
      });

      ws.on('finish', () => {
        if (cancelled) return;
        setPlayerState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }));
      });

      ws.on('error', (err: Error) => {
        if (isAbortError(err)) return;
        if (cancelled) return;
        console.error('[useAudioPlayer] WaveSurfer error:', err);
        setError('Error al cargar el audio');
        setIsReady(false);
      });

      // Resolver la URL: si es un ID de IndexedDB, obtener blob URL primero
      try {
        let resolvedUrl: string;

        if (isDirectUrl(url)) {
          resolvedUrl = url;
        } else {
          const blobUrl = await getAudioFile(url);
          if (cancelled) return; // el efecto se limpió mientras esperábamos IndexedDB
          if (!blobUrl) {
            setError('Archivo no encontrado');
            return;
          }
          blobUrlToRevoke = blobUrl;
          resolvedUrl = blobUrl;
        }

        if (cancelled) return;
        await ws.load(resolvedUrl);
      } catch (err) {
        if (isAbortError(err)) return;
        if (cancelled) return;
        console.error('[useAudioPlayer] Error cargando audio:', err);
        setError('Error al cargar audio');
      }
    }

    init();

    return () => {
      cancelled = true;

      // Revocar blob URL para liberar memoria
      if (blobUrlToRevoke) {
        URL.revokeObjectURL(blobUrlToRevoke);
        blobUrlToRevoke = null;
      }

      // Destruir WaveSurfer sincrónicamente — la próxima ejecución del efecto
      // creará una instancia nueva sobre el mismo contenedor DOM.
      if (ws) {
        try {
          if (ws.isPlaying()) ws.pause();
          ws.destroy();
        } catch {
          // ignorar errores en destroy (el canvas puede haber sido eliminado ya)
        }
        ws = null;
        wavesurferRef.current = null;
      }
    };
  }, [audioUrl]); // re-ejecutar sólo cuando cambia el track

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
