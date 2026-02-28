/**
 * @file lib/constants.ts
 * Constantes de presentación para los tipos de marcadores.
 *
 * Separadas de `types/index.ts` porque son valores de runtime (objetos JS),
 * no tipos TypeScript. Los tipos no existen en el bundle final; las constantes sí.
 */

import type { MarkerType } from '@/types';

/** Colores predefinidos para cada tipo de marcador */
export const MARKER_COLORS: Record<MarkerType, string> = {
  intro: '#10b981',    // verde
  buildup: '#f59e0b',  // naranja
  drop: '#ef4444',     // rojo
  outro: '#8b5cf6',    // púrpura
  custom: '#3b82f6',   // azul
};

/** Etiquetas legibles para tipos de marcadores */
export const MARKER_LABELS: Record<MarkerType, string> = {
  intro: 'Intro',
  buildup: 'Build Up',
  drop: 'Drop',
  outro: 'Outro',
  custom: 'Personalizado',
};

/**
 * Descripciones educativas para cada tipo de marcador.
 * Ayudan a DJs principiantes a entender la estructura de la música.
 */
export const MARKER_HELP: Record<MarkerType, string> = {
  intro:
    'Parte inicial de la canción. Suele tener 8-16 compases sin voz. Ideal para empezar a mezclar.',
  buildup:
    'Momento donde la tensión aumenta progresivamente. Subidas de energía, efectos de filtro, drum rolls. Prepara la transición.',
  drop:
    'El momento más energético. Suele tener voz, bass fuerte y melodías principales. El "clímax" de la canción.',
  outro:
    'Final de la canción. Generalmente 8-16 compases. Útil para mixes largos o transiciones suaves.',
  custom:
    'Cualquier momento especial que quieras recordar: cambio de sección, sample, efecto, etc.',
};
