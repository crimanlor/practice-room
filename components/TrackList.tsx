'use client';

import { motion } from 'framer-motion';
import { Music, Trash2, Clock } from 'lucide-react';
import { Track } from '@/lib/types';
import { formatTime } from '@/lib/utils';

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track | null;
  onSelectTrack: (id: string) => void;
  onDeleteTrack: (id: string) => void;
}

/**
 * Lista de tracks disponibles
 * Permite seleccionar y eliminar tracks
 */
export const TrackList = ({ 
  tracks, 
  currentTrack, 
  onSelectTrack, 
  onDeleteTrack 
}: TrackListProps) => {
  if (tracks.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-8 text-center">
        <Music className="mx-auto text-slate-600 mb-3" size={48} />
        <p className="text-slate-400">
          No hay tracks cargados. Sube tu primer archivo de audio para comenzar.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-4">
        Mis Tracks ({tracks.length})
      </h3>

      <div className="space-y-2">
        {tracks.map((track) => {
          const isActive = currentTrack?.id === track.id;

          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                group relative p-4 rounded-lg cursor-pointer transition-all
                ${isActive 
                  ? 'bg-primary-500/20 border-2 border-primary-500' 
                  : 'bg-slate-700 hover:bg-slate-600 border-2 border-transparent'
                }
              `}
              onClick={() => onSelectTrack(track.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Music 
                      size={18} 
                      className={isActive ? 'text-primary-400' : 'text-slate-400'} 
                    />
                    <h4 className="font-semibold text-white truncate">
                      {track.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatTime(track.duration)}
                    </span>
                    <span>
                      {track.markers.length} marcador{track.markers.length !== 1 ? 'es' : ''}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`¿Eliminar "${track.name}"?`)) {
                      onDeleteTrack(track.id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 
                             hover:text-red-400 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 
                             bg-primary-500 rounded-r"
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
