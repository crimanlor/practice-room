'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import type { Track } from '@/types';
import { formatTime } from '@/lib/utils';

interface AudioPlayerProps {
  track: Track;
  onReady?: (duration: number) => void;
  /** Callback llamado en cada actualización de tiempo */
  onTimeUpdate?: (time: number) => void;
  /** Callback que expone la función seek al padre */
  onSeek?: (seekFn: (time: number) => void) => void;
}

/**
 * Reproductor de audio principal.
 * Integra WaveSurfer para visualización de forma de onda y controles básicos.
 */
export function AudioPlayer({ track, onReady, onTimeUpdate, onSeek }: AudioPlayerProps) {
  const { waveformRef, playerState, isReady, error, togglePlayPause, setVolume, seekTo } =
    useAudioPlayer({ audioUrl: track.file_url, onReady });

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Exponer función seek al padre (usada por PlayerContext)
  useEffect(() => {
    onSeek?.(seekTo);
  }, [onSeek, seekTo]);

  // Notificar cambios de tiempo al padre (usados por PlayerContext)
  useEffect(() => {
    onTimeUpdate?.(playerState.currentTime);
  }, [playerState.currentTime, onTimeUpdate]);

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
      {/* Información del track */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-1">{track.name}</h2>
        <p className="text-slate-400 text-sm">
          {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
        </p>
      </div>

      {/* Forma de onda */}
      <div className="mb-6 bg-slate-900 rounded-lg p-4">
        <div ref={waveformRef} className="w-full" />
        {!isReady && !error && (
          <div className="flex items-center justify-center h-[100px]">
            <p className="text-slate-400">Cargando audio...</p>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-[100px] text-center">
            <div>
              <p className="font-semibold text-red-400 mb-1">⚠️ {error}</p>
              <p className="text-sm text-slate-400">
                Elimina este track y sube el archivo nuevamente
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlayPause}
          disabled={!isReady}
          aria-label={playerState.isPlaying ? 'Pausar' : 'Reproducir'}
          className="bg-primary-500 hover:bg-primary-600 disabled:bg-slate-600
                     text-white rounded-full p-4 transition-colors"
        >
          {playerState.isPlaying ? (
            <Pause size={24} fill="currentColor" />
          ) : (
            <Play size={24} fill="currentColor" className="ml-1" />
          )}
        </motion.button>

        {/* Volumen */}
        <div
          className="relative"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button
            aria-label="Control de volumen"
            className="text-slate-400 hover:text-white transition-colors"
            onClick={() => setVolume(playerState.volume > 0 ? 0 : 1)}
          >
            {playerState.volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          {showVolumeSlider && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                         bg-slate-700 rounded-lg p-2 shadow-lg"
            >
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(playerState.volume * 100)}
                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                aria-label="Volumen"
                className="w-24 h-1 accent-primary-500 cursor-pointer"
              />
            </motion.div>
          )}
        </div>

        <div className="ml-auto text-slate-400 text-sm">
          {track.markers.length} marcador{track.markers.length !== 1 ? 'es' : ''}
        </div>
      </div>
    </div>
  );
}
