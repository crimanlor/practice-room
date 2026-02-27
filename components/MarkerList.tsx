'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Edit2 } from 'lucide-react';
import { MarkerType, MARKER_LABELS, MARKER_HELP, Marker, MARKER_COLORS } from '@/lib/types';
import { formatTime } from '@/lib/utils';

interface AddMarkerFormProps {
  currentTime: number;
  onAdd: (type: MarkerType, time: number, note?: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

export const AddMarkerForm = ({ currentTime, onAdd, isVisible, onClose }: AddMarkerFormProps) => {
  const [markerType, setMarkerType] = useState<MarkerType>('intro');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(markerType, currentTime, note || undefined);
    setNote('');
    onClose();
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-slate-700 rounded-lg p-4 mb-4"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tipo de marcador - Tiempo: {formatTime(currentTime)}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(MARKER_LABELS) as MarkerType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMarkerType(type)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${markerType === type 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
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
          <label htmlFor="marker-note" className="block text-sm font-medium text-slate-300 mb-1">
            Nota (opcional)
          </label>
          <textarea
            id="marker-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Añade una nota sobre este momento..."
            rows={2}
            className="w-full px-3 py-2 bg-slate-600 text-white rounded-lg 
                       placeholder-slate-400 focus:outline-none focus:ring-2 
                       focus:ring-primary-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white 
                       px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Añadir Marcador
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
    </motion.div>
  );
};

interface EditMarkerFormProps {
  marker: Marker;
  onSave: (marker: Marker) => void;
  onClose: () => void;
}

const EditMarkerForm = ({ marker, onSave, onClose }: EditMarkerFormProps) => {
  const [markerType, setMarkerType] = useState<MarkerType>(marker.type);
  const [note, setNote] = useState(marker.note || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...marker,
      type: markerType,
      note: note || undefined,
      color: MARKER_COLORS[markerType],
    });
    onClose();
  };

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
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tiempo: {formatTime(marker.time)}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(MARKER_LABELS) as MarkerType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMarkerType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${markerType === type 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                    }`}
                >
                  {MARKER_LABELS[type]}
                </button>
              ))}
            </div>
            <motion.div
              key={markerType}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-3 bg-slate-700/50 rounded-lg border-l-4"
              style={{ borderColor: MARKER_COLORS[markerType] }}
            >
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-white">{MARKER_LABELS[markerType]}:</span>{' '}
                {MARKER_HELP[markerType]}
              </p>
            </motion.div>
          </div>

          <div>
            <label htmlFor="edit-marker-note" className="block text-sm font-medium text-slate-300 mb-1">
              Nota (opcional)
            </label>
            <textarea
              id="edit-marker-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Añade una nota sobre este momento..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-600 text-white rounded-lg 
                         placeholder-slate-400 focus:outline-none focus:ring-2 
                         focus:ring-primary-500"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white 
                         px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Guardar Cambios
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
      </div>
    </motion.div>
  );
};

interface MarkerListProps {
  markers: Marker[];
  onDelete: (id: string) => void;
  onEdit: (marker: Marker) => void;
  onSeek: (time: number) => void;
  currentTime: number;
  onAddMarker: (type: MarkerType, time: number, note?: string) => void;
}

export const MarkerList = ({ 
  markers, 
  onDelete, 
  onEdit, 
  onSeek,
  currentTime,
  onAddMarker,
}: MarkerListProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMarker, setEditingMarker] = useState<Marker | null>(null);

  const handleEdit = (marker: Marker) => {
    setEditingMarker(marker);
  };

  const handleSaveEdit = (updatedMarker: Marker) => {
    onEdit(updatedMarker);
    setEditingMarker(null);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Marcadores</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 
                     text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          Añadir
        </motion.button>
      </div>

      <AnimatePresence>
        <AddMarkerForm
          currentTime={currentTime}
          onAdd={onAddMarker}
          isVisible={showAddForm}
          onClose={() => setShowAddForm(false)}
        />
      </AnimatePresence>

      <AnimatePresence>
        {editingMarker && (
          <EditMarkerForm
            marker={editingMarker}
            onSave={handleSaveEdit}
            onClose={() => setEditingMarker(null)}
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
            <motion.div
              key={marker.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div 
                  className="w-1 h-full rounded-full flex-shrink-0"
                  style={{ backgroundColor: marker.color }}
                />
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
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(marker)}
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
          ))
        )}
      </div>
    </div>
  );
};
