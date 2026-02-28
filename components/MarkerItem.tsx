'use client';

/**
 * @file components/MarkerItem.tsx
 * Fila individual de un marcador dentro de MarkerList.
 *
 * Muestra: barra de color | tipo + tiempo clickeable | descripción educativa | nota | acciones
 * El tiempo actúa como botón: al hacer clic llama a onSeek para mover el reproductor.
 */

import { motion } from 'framer-motion';
import { Edit2, X } from 'lucide-react';

import type { Marker } from '@/types';
import { MARKER_LABELS, MARKER_HELP } from '@/lib/constants';
import { formatTime } from '@/lib/utils';

interface MarkerItemProps {
  marker: Marker;
  onDelete: (id: string) => void;
  onEdit: (marker: Marker) => void;
  onSeek: (time: number) => void;
}

/** Fila individual de un marcador dentro de MarkerList. */
export function MarkerItem({ marker, onDelete, onEdit, onSeek }: MarkerItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Indicador de color */}
        <div
          className="w-1 self-stretch rounded-full flex-shrink-0"
          style={{ backgroundColor: marker.color }}
          aria-hidden
        />

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white">{MARKER_LABELS[marker.type]}</span>
            <button
              onClick={() => onSeek(marker.time)}
              className="text-primary-400 hover:text-primary-300 text-sm font-mono"
              aria-label={`Ir a ${formatTime(marker.time)}`}
            >
              {formatTime(marker.time)}
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {MARKER_HELP[marker.type]}
          </p>

          {marker.note && (
            <p className="text-slate-300 text-sm mt-2 italic">"{marker.note}"</p>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(marker)}
            className="p-1.5 text-slate-400 hover:text-primary-400 transition-colors"
            aria-label="Editar marcador"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(marker.id)}
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
            aria-label="Eliminar marcador"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
