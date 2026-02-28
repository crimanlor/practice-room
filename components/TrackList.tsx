'use client';

/**
 * @file components/TrackList.tsx
 * Lista de tracks cargados. Permite seleccionar el activo y eliminar tracks.
 *
 * La eliminación requiere confirmación en un modal propio (sin confirm() nativo).
 * El botón de eliminar es invisible por defecto y aparece al hacer hover (group-hover).
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Music, Trash2 } from 'lucide-react';

import type { Track } from '@/types';
import { formatTime } from '@/lib/utils';

interface TrackListProps {
  tracks: Track[];
  currentTrack: Track | null;
  onSelectTrack: (id: string) => void;
  onDeleteTrack: (id: string) => void;
}

/** Lista de tracks cargados. Permite seleccionar y eliminar cada track. */
export function TrackList({ tracks, currentTrack, onSelectTrack, onDeleteTrack }: TrackListProps) {
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

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

  function handleDeleteClick(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    setPendingDelete(id);
  }

  function confirmDelete() {
    if (pendingDelete) {
      onDeleteTrack(pendingDelete);
      setPendingDelete(null);
    }
  }

  return (
    <>
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
                className={[
                  'group relative p-4 rounded-lg cursor-pointer transition-all border-2',
                  isActive
                    ? 'bg-primary-500/20 border-primary-500'
                    : 'bg-slate-700 hover:bg-slate-600 border-transparent',
                ].join(' ')}
                onClick={() => onSelectTrack(track.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Music
                        size={18}
                        className={isActive ? 'text-primary-400' : 'text-slate-400'}
                      />
                      <h4 className="font-semibold text-white truncate">{track.name}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatTime(track.duration)}
                      </span>
                      <span>
                        {track.markers.length} marcador
                        {track.markers.length !== 1 ? 'es' : ''}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDeleteClick(e, track.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400
                               hover:text-red-400 transition-all"
                    aria-label={`Eliminar ${track.name}`}
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

      {/* Diálogo de confirmación de borrado (sin confirm() nativo) */}
      <AnimatePresence>
        {pendingDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setPendingDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-800 rounded-lg p-6 w-full max-w-sm shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-white mb-2">Eliminar track</h3>
              <p className="text-slate-400 mb-6 text-sm">
                ¿Eliminar "
                {tracks.find((t) => t.id === pendingDelete)?.name}"? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2
                             rounded-lg font-medium transition-colors"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setPendingDelete(null)}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-4 py-2
                             rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
