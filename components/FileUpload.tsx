'use client';

/**
 * @file components/FileUpload.tsx
 * Zona de carga de archivos de audio. Soporta clic y drag & drop.
 *
 * Flujo al subir un archivo:
 * 1. Valida que sea audio
 * 2. Guarda el binario en IndexedDB (audioService.saveAudioFile)
 * 3. Lee la duración real con un <Audio> temporal
 * 4. Construye el objeto Track y llama a onTrackAdd
 *
 * Errores: se muestran inline (sin alert() nativo).
 */

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Music, AlertCircle } from 'lucide-react';

import type { Track } from '@/types';
import { generateId } from '@/lib/utils';
import { saveAudioFile } from '@/services/audioService';

interface FileUploadProps {
  onTrackAdd: (track: Track) => void;
}

const ACCEPTED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a'];

/** Tamaño máximo permitido por archivo (200 MB) */
const MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024;

function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/') || ACCEPTED_TYPES.includes(file.type);
}

/** Devuelve true si el error es un QuotaExceededError de IndexedDB/Storage */
function isQuotaError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  return (
    err.name === 'QuotaExceededError' ||
    err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    err.message.toLowerCase().includes('quota')
  );
}

/**
 * Zona de carga de archivos de audio.
 * Soporta click para seleccionar y drag & drop.
 */
export function FileUpload({ onTrackAdd }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!isAudioFile(file)) {
      setUploadError('Por favor selecciona un archivo de audio válido (MP3, WAV, OGG, M4A)');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(
        `El archivo es demasiado grande. El tamaño máximo permitido es 200 MB (el archivo pesa ${(file.size / 1024 / 1024).toFixed(1)} MB).`,
      );
      return;
    }

    setIsProcessing(true);
    setUploadError(null);

    try {
      const trackId = generateId();
      await saveAudioFile(trackId, file);

      const fileUrl = URL.createObjectURL(file);
      const audio = new Audio(fileUrl);

      await new Promise<void>((resolve, reject) => {
        audio.addEventListener('loadedmetadata', () => {
          const track: Track = {
            id: trackId,
            name: file.name.replace(/\.[^/.]+$/, ''),
            file_url: trackId,
            duration: audio.duration,
            markers: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          onTrackAdd(track);
          URL.revokeObjectURL(fileUrl);
          resolve();
        });
        audio.addEventListener('error', () => {
          URL.revokeObjectURL(fileUrl);
          reject(new Error('No se pudo leer el archivo de audio'));
        });
      });
    } catch (err) {
      console.error('[FileUpload] Error al procesar archivo:', err);
      if (isQuotaError(err)) {
        setUploadError(
          'No hay espacio suficiente en el almacenamiento del navegador. ' +
          'Elimina algunos tracks para liberar espacio e inténtalo de nuevo.',
        );
      } else {
        setUploadError(
          err instanceof Error ? err.message : 'Error al procesar el archivo',
        );
      }
    } finally {
      setIsProcessing(false);
      // Limpiar el input para permitir re-subir el mismo archivo
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="w-full space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <motion.div
        whileHover={isProcessing ? {} : { scale: 1.01 }}
        whileTap={isProcessing ? {} : { scale: 0.99 }}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        aria-label="Subir archivo de audio"
        className={[
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragging
            ? 'border-primary-400 bg-primary-500/10'
            : 'border-slate-600 hover:border-slate-500 bg-slate-800/50',
          isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
      >
        {isProcessing ? (
          <div className="space-y-2">
            <Music className="mx-auto text-primary-400 animate-pulse" size={48} />
            <p className="text-slate-300">Procesando archivo...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto text-slate-400" size={48} />
            <p className="text-slate-300 text-lg font-medium">
              Arrastra un archivo de audio aquí
            </p>
            <p className="text-slate-500 text-sm">o haz clic para seleccionar</p>
            <p className="text-slate-600 text-xs mt-2">
              Formatos soportados: MP3, WAV, OGG, M4A · Máx. 200 MB
            </p>
          </div>
        )}
      </motion.div>

      {uploadError && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 
                        rounded-lg px-3 py-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
