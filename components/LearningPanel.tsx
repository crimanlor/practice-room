'use client';

/**
 * @file components/LearningPanel.tsx
 * Panel educativo con contenido sobre mezcla de música.
 *
 * Exports:
 * - `LearningPanel`: el panel completo (lateral o pantalla completa)
 * - `LearningButton`: botón del header que abre el panel
 *
 * Componentes internos:
 * - `SectionItem`: acordeón para cada sección (prop `wideLayout` cambia el layout)
 * - `LearningItemCard`: tarjeta con subtitle, descripción y lista de tips
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronRight, Maximize2, Minimize2, X } from 'lucide-react';

import type { LearningSection, LearningItem } from '@/types';
import { LEARNING_CONTENT } from '@/lib/learningContent';

// ─── LearningItemCard ─────────────────────────────────────────────────────────

function LearningItemCard({ item }: { item: LearningItem }) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4">
      <h4 className="font-semibold text-primary-400 text-sm mb-2">{item.subtitle}</h4>
      <p className="text-slate-300 text-sm leading-relaxed mb-3">{item.description}</p>
      {item.tips && item.tips.length > 0 && (
        <ul className="space-y-1.5">
          {item.tips.map((tip, i) => (
            <li key={i} className="text-slate-400 text-xs flex items-start gap-2">
              <span className="text-primary-500 mt-0.5" aria-hidden>•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── SectionItem ──────────────────────────────────────────────────────────────

interface SectionItemProps {
  section: LearningSection;
  /** Cuando true, usa layout de dos columnas */
  wideLayout?: boolean;
}

function SectionItem({ section, wideLayout = false }: SectionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={
        wideLayout
          ? 'border-b border-slate-700/50'
          : 'border-b border-slate-700 last:border-0'
      }
    >
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={[
          'w-full flex items-center justify-between text-left transition-colors',
          wideLayout
            ? 'p-6 hover:bg-slate-800/30'
            : 'p-4 hover:bg-slate-700/50',
        ].join(' ')}
      >
        <span className="flex items-center gap-3">
          <span className={wideLayout ? 'text-2xl' : 'text-xl'}>{section.icon}</span>
          <span
            className={
              wideLayout ? 'text-xl font-bold text-white' : 'font-medium text-white'
            }
          >
            {section.title}
          </span>
        </span>
        {isOpen ? (
          <ChevronDown size={wideLayout ? 24 : 18} className="text-slate-400" />
        ) : (
          <ChevronRight size={wideLayout ? 24 : 18} className="text-slate-400" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={wideLayout ? 'px-6 pb-6 pt-2' : 'px-4 pb-4 pt-2'}>
              <div className="space-y-3">
                {section.content.map((item, i) => (
                  <LearningItemCard key={i} item={item} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── LearningPanel ────────────────────────────────────────────────────────────

interface LearningPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isExpanded?: boolean;
  onExpand?: () => void;
}

export function LearningPanel({
  isOpen,
  onClose,
  isExpanded = false,
  onExpand,
}: LearningPanelProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={isExpanded ? { opacity: 0 } : { x: '100%' }}
      animate={isExpanded ? { opacity: 1 } : { x: 0 }}
      exit={isExpanded ? { opacity: 0 } : { x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={
        isExpanded
          ? 'fixed inset-0 bg-slate-900 z-50 flex flex-col'
          : 'fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col'
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
        <div className="flex items-center gap-3">
          <BookOpen className="text-primary-400" size={24} />
          <div>
            <h2 className="text-lg font-bold text-white">Aprende a Mezclar</h2>
            <p className="text-xs text-slate-400">Guía para DJs principiantes</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onExpand && (
            <button
              onClick={onExpand}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              aria-label={isExpanded ? 'Vista reducida' : 'Expandir a pantalla completa'}
            >
              {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Cerrar panel"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 overflow-y-auto ${isExpanded ? 'p-6' : ''}`}>
        {isExpanded && (
          <div className="max-w-5xl mx-auto mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Guía Completa de DJ</h1>
            <p className="text-slate-400">
              Todo lo que necesitas saber para aprender a mezclar música electrónica
            </p>
          </div>
        )}
        <div className={isExpanded ? 'max-w-5xl mx-auto' : ''}>
          {LEARNING_CONTENT.map((section) => (
            <SectionItem key={section.id} section={section} wideLayout={isExpanded} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/30">
        <p className="text-xs text-slate-500 text-center">
          Consejo: Usa los marcadores para marcar las secciones de cada canción y practicar transiciones.
        </p>
      </div>
    </motion.div>
  );
}

// ─── LearningButton ───────────────────────────────────────────────────────────

interface LearningButtonProps {
  onClick: () => void;
}

export function LearningButton({ onClick }: LearningButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-primary-500/10 hover:bg-primary-500/20
                 border border-primary-500/30 text-primary-400 px-4 py-2 rounded-lg
                 text-sm font-medium transition-colors"
    >
      <BookOpen size={18} />
      Aprende a mezclar
    </button>
  );
}
