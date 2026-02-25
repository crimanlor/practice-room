'use client';

import { useState } from 'react';
import { useTracks } from '@/hooks/useTracks';
import { useMarkers } from '@/hooks/useMarkers';
import { FileUpload } from '@/components/FileUpload';
import { TrackList } from '@/components/TrackList';
import { AudioPlayer } from '@/components/AudioPlayer';
import { MarkerList } from '@/components/MarkerList';
import { Track, MarkerType } from '@/lib/types';
import { motion } from 'framer-motion';
import { Music2 } from 'lucide-react';

export default function Home() {
  const { 
    tracks, 
    currentTrack, 
    addTrack, 
    updateTrack,
    deleteTrack, 
    selectTrack,
  } = useTracks();

  const {
    markers,
    addMarker,
    deleteMarker,
    updateMarker,
    setMarkers,
  } = useMarkers(currentTrack?.markers || []);

  const [currentTime, setCurrentTime] = useState(0);

  // Actualizar marcadores cuando cambia el track
  const handleTrackSelect = (id: string) => {
    selectTrack(id);
    const track = tracks.find(t => t.id === id);
    if (track) {
      setMarkers(track.markers);
    }
  };

  // Añadir marcador y actualizar track
  const handleAddMarker = (type: MarkerType, time: number, note?: string) => {
    const newMarker = addMarker(type, time, note);
    if (currentTrack && newMarker) {
      const updatedTrack: Track = {
        ...currentTrack,
        markers: [...markers, newMarker],
      };
      updateTrack(updatedTrack);
    }
  };

  // Eliminar marcador y actualizar track
  const handleDeleteMarker = (id: string) => {
    deleteMarker(id);
    if (currentTrack) {
      const updatedTrack: Track = {
        ...currentTrack,
        markers: markers.filter(m => m.id !== id),
      };
      updateTrack(updatedTrack);
    }
  };

  const handleSeekTo = (time: number) => {
    setCurrentTime(time);
    // La funcionalidad de seek se maneja en el AudioPlayer
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Music2 className="text-primary-400" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-white">Practice Room</h1>
              <p className="text-slate-400 text-sm">Aprende a pinchar música</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar: Track List & Upload */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <FileUpload onTrackAdd={addTrack} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TrackList
                tracks={tracks}
                currentTrack={currentTrack}
                onSelectTrack={handleTrackSelect}
                onDeleteTrack={deleteTrack}
              />
            </motion.div>
          </div>

          {/* Main Area: Player & Markers */}
          <div className="lg:col-span-2 space-y-6">
            {currentTrack ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <AudioPlayer
                    track={currentTrack}
                    onTimeUpdate={setCurrentTime}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <MarkerList
                    markers={markers}
                    onDelete={handleDeleteMarker}
                    onEdit={updateMarker}
                    onSeek={handleSeekTo}
                    currentTime={currentTime}
                    onAddMarker={handleAddMarker}
                  />
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800 rounded-lg p-12 text-center"
              >
                <Music2 className="mx-auto text-slate-600 mb-4" size={64} />
                <h2 className="text-2xl font-bold text-white mb-2">
                  Bienvenido a Practice Room
                </h2>
                <p className="text-slate-400 max-w-md mx-auto">
                  Sube un archivo de audio o selecciona un track de tu biblioteca 
                  para comenzar a practicar y marcar momentos importantes.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-12 bg-slate-900/50">
        <div className="container mx-auto px-4 py-6 text-center text-slate-500 text-sm">
          <p>
            Practice Room - Una herramienta educativa para aprender a pinchar música
          </p>
        </div>
      </footer>
    </div>
  );
}
