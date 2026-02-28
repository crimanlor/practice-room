/**
 * Re-exports de compatibilidad.
 * Los tipos viven en @/types y las constantes en @/lib/constants.
 * Este archivo se mantiene para no romper importaciones existentes.
 */
export type { MarkerType, Marker, Track, PlayerState } from '@/types';
export { MARKER_COLORS, MARKER_LABELS, MARKER_HELP } from '@/lib/constants';
