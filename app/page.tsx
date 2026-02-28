'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music2 } from 'lucide-react';

import { useTracks } from '@/hooks/useTracks';
import { useTrackMarkers } from '@/hooks/useTrackMarkers';
import { PlayerProvider, usePlayerContext } from '@/context/PlayerContext';

import { FileUpload } from '@/components/FileUpload';
import { TrackList } from '@/components/TrackList';
import { AudioPlayer } from '@/components/AudioPlayer';
import { MarkerList } from '@/components/MarkerList';
import { SongAnalyzer } from '@/components/SongAnalyzer';
import { LearningPanel, LearningButton } from '@/components/LearningPanel';

import type { Marker, MarkerType, Track } from '@/types';

// ─── Sub-componente interno (ya tiene acceso al context) ──────────────────────

function MainContent() {
  const { tracks, currentTrack, addTrack, updateTrack, deleteTrack, selectTrack } =
    useTracks();

  const { currentTime, setCurrentTime, registerSeek, seekTo } = usePlayerContext();

  const { markers, addMarker, updateMarker, deleteMarker } = useTrackMarkers({
    currentTrack,
    updateTrack,
  });

  const [showLearningPanel, setShowLearningPanel] = useState(false);
  const [learningExpanded, setLearningExpanded] = useState(false);

  function handleTrackSelect(id: string) {
    selectTrack(id);
  }

  function handleEditMarker(marker: Marker) {
    updateMarker(marker.id, { type: marker.type, note: marker.note });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music2 className="text-primary-400" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-white">Practice Room</h1>
                <p className="text-slate-400 text-sm">Aprende a pinchar música</p>
              </div>
            </div>
            <LearningButton onClick={() => setShowLearningPanel(true)} />
          </div>
        </div>
      </header>

      <LearningPanel
        isOpen={showLearningPanel}
        onClose={() => setShowLearningPanel(false)}
        isExpanded={learningExpanded}
        onExpand={() => setLearningExpanded((v) => !v)}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
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

          {/* Main area */}
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
                    onSeek={registerSeek}
                  />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <SongAnalyzer
                      currentTime={currentTime}
                      isPlaying={currentTrack !== null}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <MarkerList
                      markers={markers}
                      onDelete={deleteMarker}
                      onEdit={handleEditMarker}
                      onSeek={seekTo}
                      currentTime={currentTime}
                      onAddMarker={addMarker}
                    />
                  </motion.div>
                </div>
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

      <footer className="border-t border-slate-700 mt-12 bg-slate-900/50">
        <div className="container mx-auto px-4 py-6 text-center text-slate-500 text-sm">
          <p>Practice Room - Una herramienta educativa para aprender a pinchar música</p>
        </div>
      </footer>
    </div>
  );
}

// ─── Page (envuelve en el provider) ──────────────────────────────────────────

export default function Home() {
  return (
    <PlayerProvider>
      <MainContent />
    </PlayerProvider>
  );
}
