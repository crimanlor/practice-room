'use client';

/**
 * @file components/MarkerList.tsx
 * Lista de marcadores del track activo con formularios para añadir y editar.
 *
 * Contiene el componente interno `MarkerForm`, que funciona en dos modos:
 * - inline (asModal=false): formulario expandible encima de la lista para añadir
 * - modal (asModal=true): modal centrado con overlay para editar
 *
 * Usa `AnimatePresence` de Framer Motion para animar la entrada/salida del formulario.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

import type { Marker, MarkerType } from '@/types';
import { MARKER_LABELS, MARKER_HELP, MARKER_COLORS } from '@/lib/constants';
import { formatTime } from '@/lib/utils';
import { MarkerItem } from '@/components/MarkerItem';

// ─── MarkerForm ───────────────────────────────────────────────────────────────

interface MarkerFormProps {
  /** Tiempo inicial (modo add) o tiempo del marcador (modo edit) */
  time: number;
  initialType?: MarkerType;
  initialNote?: string;
  submitLabel: string;
  onSubmit: (type: MarkerType, note?: string) => void;
  onClose: () => void;
  /** Si true, el formulario se muestra como modal */
  asModal?: boolean;
}

function MarkerForm({
  time,
  initialType = 'intro',
  initialNote = '',
  submitLabel,
  onSubmit,
  onClose,
  asModal = false,
}: MarkerFormProps) {
  const [markerType, setMarkerType] = useState<MarkerType>(initialType);
  const [note, setNote] = useState(initialNote);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(markerType, note || undefined);
    onClose();
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Tipo de marcador — Tiempo: {formatTime(time)}
        </label>

        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(MARKER_LABELS) as MarkerType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMarkerType(type)}
              className={[
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                markerType === type
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-600 text-slate-300 hover:bg-slate-500',
              ].join(' ')}
            >
              {MARKER_LABELS[type]}
            </button>
          ))}
        </div>

        <motion.div
          key={markerType}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 p-3 bg-slate-800/50 rounded-lg border-l-4"
          style={{ borderColor: MARKER_COLORS[markerType] }}
        >
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-white">{MARKER_LABELS[markerType]}:</span>{' '}
            {MARKER_HELP[markerType]}
          </p>
        </motion.div>
      </div>

      <div>
        <label
          htmlFor="marker-note-input"
          className="block text-sm font-medium text-slate-300 mb-1"
        >
          Nota (opcional)
        </label>
        <textarea
          id="marker-note-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Añade una nota sobre este momento..."
          rows={asModal ? 3 : 2}
          maxLength={500}
          className="w-full px-3 py-2 bg-slate-600 text-white rounded-lg
                     placeholder-slate-400 focus:outline-none focus:ring-2
                     focus:ring-primary-500 resize-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-primary-500 hover:bg-primary-600 text-white
                     px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white
                     rounded-lg font-medium transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );

  if (asModal) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-slate-800 rounded-lg p-6 w-full max-w-md shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold text-white mb-4">Editar Marcador</h3>
          {formContent}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-slate-700 rounded-lg p-4 mb-4"
    >
      {formContent}
    </motion.div>
  );
}

// ─── MarkerList ───────────────────────────────────────────────────────────────

interface MarkerListProps {
  markers: Marker[];
  currentTime: number;
  onDelete: (id: string) => void;
  onEdit: (marker: Marker) => void;
  onSeek: (time: number) => void;
  onAddMarker: (type: MarkerType, time: number, note?: string) => void;
}

export function MarkerList({
  markers,
  currentTime,
  onDelete,
  onEdit,
  onSeek,
  onAddMarker,
}: MarkerListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMarker, setEditingMarker] = useState<Marker | null>(null);

  function handleAddSubmit(type: MarkerType, note?: string) {
    onAddMarker(type, currentTime, note);
  }

  function handleEditSubmit(type: MarkerType, note?: string) {
    if (!editingMarker) return;
    onEdit({ ...editingMarker, type, note });
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Marcadores</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm((v) => !v)}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600
                     text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          Añadir
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <MarkerForm
            key="add-form"
            time={currentTime}
            submitLabel="Añadir Marcador"
            onSubmit={handleAddSubmit}
            onClose={() => setShowAddForm(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingMarker && (
          <MarkerForm
            key="edit-form"
            time={editingMarker.time}
            initialType={editingMarker.type}
            initialNote={editingMarker.note}
            submitLabel="Guardar Cambios"
            onSubmit={handleEditSubmit}
            onClose={() => setEditingMarker(null)}
            asModal
          />
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {markers.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            No hay marcadores aún. Añade uno para marcar momentos importantes.
          </p>
        ) : (
          markers.map((marker) => (
            <MarkerItem
              key={marker.id}
              marker={marker}
              onDelete={onDelete}
              onEdit={setEditingMarker}
              onSeek={onSeek}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Re-export del formulario por si se necesita en otro lugar
export { MarkerForm };
