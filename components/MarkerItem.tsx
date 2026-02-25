'use client';

import { motion } from 'framer-motion';
import { X, Edit2 } from 'lucide-react';
import { Marker, MARKER_LABELS } from '@/lib/types';
import { formatTime } from '@/lib/utils';

interface MarkerItemProps {
  marker: Marker;
  onDelete: (id: string) => void;
  onEdit: (marker: Marker) => void;
  onSeek: (time: number) => void;
}

/**
 * Componente individual de marcador
 * Muestra información del marcador y permite editar/eliminar
 */
export const MarkerItem = ({ marker, onDelete, onEdit, onSeek }: MarkerItemProps) => {
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
          className="w-1 h-full rounded-full flex-shrink-0"
          style={{ backgroundColor: marker.color }}
        />

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white">
              {MARKER_LABELS[marker.type]}
            </span>
            <button
              onClick={() => onSeek(marker.time)}
              className="text-primary-400 hover:text-primary-300 text-sm font-mono"
            >
              {formatTime(marker.time)}
            </button>
          </div>
          
          {marker.note && (
            <p className="text-slate-300 text-sm mt-1">{marker.note}</p>
          )}
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(marker)}
            className="p-1.5 text-slate-400 hover:text-primary-400 transition-colors"
            title="Editar marcador"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(marker.id)}
            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
            title="Eliminar marcador"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
