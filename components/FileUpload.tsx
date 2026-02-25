'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Music } from 'lucide-react';
import { Track } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { saveAudioFile } from '@/lib/audioStorage';

interface FileUploadProps {
  onTrackAdd: (track: Track) => void;
}

/**
 * Componente para subir archivos de audio
 * Permite drag & drop o selección de archivo
 */
export const FileUpload = ({ onTrackAdd }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert('Por favor selecciona un archivo de audio válido');
      return;
    }

    setIsProcessing(true);

    try {
      // Generar ID único para el track
      const trackId = generateId();
      
      // Guardar archivo en IndexedDB
      await saveAudioFile(trackId, file);
      
      // Crear URL temporal del blob para obtener duración
      const fileUrl = URL.createObjectURL(file);
      
      // Crear elemento de audio temporal para obtener duración
      const audio = new Audio(fileUrl);
      
      audio.addEventListener('loadedmetadata', () => {
        const track: Track = {
          id: trackId,
          name: file.name.replace(/\.[^/.]+$/, ''), // Quitar extensión
          file_url: trackId, // Guardar el ID en lugar de la URL de blob
          duration: audio.duration,
          markers: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        onTrackAdd(track);
        setIsProcessing(false);
        
        // Limpiar la URL temporal
        URL.revokeObjectURL(fileUrl);
      });

      audio.addEventListener('error', () => {
        alert('Error al cargar el archivo de audio');
        setIsProcessing(false);
        URL.revokeObjectURL(fileUrl);
      });
    } catch (error) {
      console.error('Error al procesar archivo:', error);
      alert('Error al procesar el archivo');
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors
          ${isDragging 
            ? 'border-primary-400 bg-primary-500/10' 
            : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
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
            <p className="text-slate-500 text-sm">
              o haz clic para seleccionar
            </p>
            <p className="text-slate-600 text-xs mt-2">
              Formatos soportados: MP3, WAV, OGG, M4A
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
