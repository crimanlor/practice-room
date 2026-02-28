'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music2, Upload, Headphones, BookmarkPlus, BarChart2 } from 'lucide-react';

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
                <p className="text-slate-400 text-sm">Analiza la estructura de tus canciones antes de mezclar</p>
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
                className="space-y-6"
              >
                {/* Bienvenida */}
                <div className="bg-slate-800 rounded-lg p-10 text-center">
                  <Music2 className="mx-auto text-primary-400 mb-4" size={56} />
                  <h2 className="text-2xl font-bold text-white mb-3">
                    Bienvenid@ a Practice Room
                  </h2>
                  <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
                    Practice Room es una herramienta para principiantes que quieren entender
                    la estructura de sus canciones antes de mezclar. Carga tus pistas, identifica
                    secciones clave como intros, drops o breaks, analiza BPM y tonalidad, y marca
                    los puntos de entrada y salida para después construir mezclas más precisas.
                  </p>
                </div>

                {/* Pasos de uso */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-white font-semibold mb-5 text-center">¿Cómo empezar?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        icon: <Upload size={20} className="text-primary-400" />,
                        step: '1',
                        title: 'Sube tu música',
                        desc: 'Importa archivos MP3, WAV u otros formatos desde tu dispositivo usando el panel izquierdo.',
                      },
                      {
                        icon: <Headphones size={20} className="text-primary-400" />,
                        step: '2',
                        title: 'Escucha y analiza',
                        desc: 'Reproduce la pista y observa el análisis de BPM, tonalidad y estructura de la canción.',
                      },
                      {
                        icon: <BookmarkPlus size={20} className="text-primary-400" />,
                        step: '3',
                        title: 'Marca los momentos clave',
                        desc: 'Añade marcadores en los puntos importantes: drops, breaks, entradas o cualquier referencia.',
                      },
                      {
                        icon: <BarChart2 size={20} className="text-primary-400" />,
                        step: '4',
                        title: 'Practica y mejora',
                        desc: 'Usa el panel de aprendizaje para repasar conceptos de mezcla y perfeccionar tu técnica.',
                      },
                    ].map(({ icon, step, title, desc }) => (
                      <div key={step} className="flex gap-4 p-4 bg-slate-700/50 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-slate-300 text-xs font-bold">
                          {step}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {icon}
                            <span className="text-white text-sm font-medium">{title}</span>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-700 mt-12 bg-slate-900/50">
        <div className="container mx-auto px-4 py-6 text-center text-slate-500 text-sm">
          <p className="mt-1">
            Desarrollado por{" "}
            <a
              href="https://github.com/crimanlor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Lorena Criado.
            </a>
          </p>
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
