/**
 * @file lib/utils.ts
 * Funciones de utilidad puras sin efectos secundarios ni dependencias de React.
 * Se pueden importar desde cualquier capa (servicios, hooks, componentes).
 */

/** Genera un ID único combinando timestamp y sufijo aleatorio en base 36. */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Convierte segundos a formato `MM:SS`.
 * @example formatTime(125) → "2:05"
 * @example formatTime(3600) → "60:00"
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
