'use client';

import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Track } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

interface AudioPlayerProps {
  track: Track;
  onReady?: (duration: number) => void;
  onTimeUpdate?: (time: number) => void;
}

/**
 * Componente principal del reproductor de audio
 * Integra WaveSurfer para visualización y controles de reproducción
 */
export const AudioPlayer = ({ track, onReady, onTimeUpdate }: AudioPlayerProps) => {
  const { 
    waveformRef, 
    playerState, 
    isReady,
    error,
    togglePlayPause, 
    setVolume,
  } = useAudioPlayer({ 
    audioUrl: track.file_url,
    onReady,
  });

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Notificar cambios de tiempo
  if (onTimeUpdate && playerState.currentTime) {
    onTimeUpdate(playerState.currentTime);
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
      {/* Información del track */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-1">{track.name}</h2>
        <p className="text-slate-400 text-sm">
          {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
        </p>
      </div>

      {/* Visualización de forma de onda */}
      <div className="mb-6 bg-slate-900 rounded-lg p-4">
        <div ref={waveformRef} className="w-full" />
        {!isReady && !error && (
          <div className="flex items-center justify-center h-[100px]">
            <div className="text-slate-400">Cargando audio...</div>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-[100px]">
            <div className="text-red-400 text-center">
              <p className="font-semibold mb-1">⚠️ {error}</p>
              <p className="text-sm text-slate-400">
                Sugerencia: Elimina este track y sube el archivo nuevamente
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlayPause}
          disabled={!isReady}
          className="bg-primary-500 hover:bg-primary-600 disabled:bg-slate-600 
                     text-white rounded-full p-4 transition-colors"
        >
          {playerState.isPlaying ? (
            <Pause size={24} fill="currentColor" />
          ) : (
            <Play size={24} fill="currentColor" className="ml-1" />
          )}
        </motion.button>

        {/* Volume Control */}
        <div 
          className="relative"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button 
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
                value={playerState.volume * 100}
                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                className="w-24 h-1 accent-primary-500 cursor-pointer"
                style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
              />
            </motion.div>
          )}
        </div>

        {/* Info adicional */}
        <div className="ml-auto text-slate-400 text-sm">
          {track.markers.length} marcador{track.markers.length !== 1 ? 'es' : ''}
        </div>
      </div>
    </div>
  );
};
