'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Plus, Minus, RotateCcw, Volume2, VolumeX, Mic } from 'lucide-react';

interface SongAnalyzerProps {
  currentTime: number;
  isPlaying: boolean;
  onTapBpm?: (bpm: number) => void;
}

const TAP_COOLDOWN = 2000;
const TAP_WINDOW = 5000;

export const SongAnalyzer = ({ currentTime, isPlaying, onTapBpm }: SongAnalyzerProps) => {
  const [activeTab, setActiveTab] = useState<'bpm' | 'metronome' | 'count'>('bpm');
  
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [calculatedBpm, setCalculatedBpm] = useState<number | null>(null);
  const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);
  const [metronomeBpm, setMetronomeBpm] = useState(120);
  const [countBeats, setCountBeats] = useState(1);
  const [isCounting, setIsCounting] = useState(false);
  const [countIn, setCountIn] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapTimeRef = useRef<number>(0);

  const playClick = useCallback((isAccent: boolean = false) => {
    if (typeof window === 'undefined') return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = isAccent ? 1000 : 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }, []);

  const handleTap = useCallback(() => {
    const now = Date.now();
    
    if (now - lastTapTimeRef.current > TAP_COOLDOWN) {
      setTapTimes([]);
      setCalculatedBpm(null);
    }
    lastTapTimeRef.current = now;
    
    const newTapTimes = [...tapTimes, now].filter(t => now - t < TAP_WINDOW);
    setTapTimes(newTapTimes);
    
    if (newTapTimes.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < newTapTimes.length; i++) {
        intervals.push(newTapTimes[i] - newTapTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60000 / avgInterval);
      
      if (bpm >= 60 && bpm <= 200) {
        setCalculatedBpm(bpm);
        if (onTapBpm) onTapBpm(bpm);
      }
    }
  }, [tapTimes, onTapBpm]);

  const handleReset = () => {
    setTapTimes([]);
    setCalculatedBpm(null);
  };

  useEffect(() => {
    if (isMetronomePlaying) {
      const interval = 60000 / metronomeBpm;
      
      const tick = () => {
        setCountBeats(prev => {
          const next = prev >= 4 ? 1 : prev + 1;
          playClick(next === 1);
          return next;
        });
      };
      
      tick();
      metronomeIntervalRef.current = setInterval(tick, interval);
    } else {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
        metronomeIntervalRef.current = null;
      }
      setCountBeats(1);
    }
    
    return () => {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
      }
    };
  }, [isMetronomePlaying, metronomeBpm, playClick]);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const adjustBpm = (delta: number) => {
    setMetronomeBpm(prev => Math.max(60, Math.min(200, prev + delta)));
  };

  const getCountDisplay = () => {
    if (countIn) {
      return (
        <div className="flex gap-4 justify-center">
          {[1, 2, 3, 4].map(beat => (
            <div
              key={beat}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                beat === countBeats 
                  ? 'bg-primary-500 text-white scale-110' 
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {beat}
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="text-center">
        <div className={`text-6xl font-bold mb-2 ${countBeats === 1 ? 'text-primary-400' : 'text-white'}`}>
          {countBeats}
        </div>
        <div className="text-slate-400 text-sm">de 4</div>
      </div>
    );
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Análisis</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('bpm')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'bpm' 
              ? 'bg-primary-500 text-white' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          BPM
        </button>
        <button
          onClick={() => setActiveTab('metronome')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'metronome' 
              ? 'bg-primary-500 text-white' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Metrónomo
        </button>
        <button
          onClick={() => setActiveTab('count')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'count' 
              ? 'bg-primary-500 text-white' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Conteo
        </button>
      </div>

      {activeTab === 'bpm' && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {calculatedBpm || '--'}
            </div>
            <div className="text-slate-400 text-sm">BPM detectado</div>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTap}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              TAP
            </motion.button>
            <button
              onClick={handleReset}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg transition-colors"
              title="Reiniciar"
            >
              <RotateCcw size={20} />
            </button>
          </div>
          
          <p className="text-xs text-slate-400 text-center">
            Toca "TAP" al ritmo de la música para contar los BPM
          </p>

          {tapTimes.length > 0 && (
            <div className="text-center text-xs text-slate-500">
              {tapTimes.length} toques registrados
            </div>
          )}
        </div>
      )}

      {activeTab === 'metronome' && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {metronomeBpm}
            </div>
            <div className="text-slate-400 text-sm">BPM</div>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => adjustBpm(-5)}
              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
            >
              <Minus size={20} />
            </button>
            <button
              onClick={() => adjustBpm(-1)}
              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
            >
              -1
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMetronomePlaying(!isMetronomePlaying)}
              className={`p-4 rounded-full transition-colors ${
                isMetronomePlaying 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-primary-500 hover:bg-primary-600'
              } text-white`}
            >
              {isMetronomePlaying ? <Pause size={24} /> : <Play size={24} />}
            </motion.button>
            <button
              onClick={() => adjustBpm(1)}
              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
            >
              +1
            </button>
            <button
              onClick={() => adjustBpm(5)}
              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <p className="text-xs text-slate-400 text-center">
            Ajusta el tempo y usa el metrónomo para practicar
          </p>
        </div>
      )}

      {activeTab === 'count' && (
        <div className="space-y-4">
          <div className="flex justify-center items-center py-4">
            {getCountDisplay()}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setCountIn(!countIn)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                countIn 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Count In (4 beats)
            </button>
            <button
              onClick={() => setIsCounting(!isCounting)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                isCounting 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
              }`}
            >
              {isCounting ? 'Detener' : 'Iniciar'}
            </button>
          </div>

          {isCounting && (
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4].map(beat => (
                <div
                  key={beat}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    beat === (countBeats % 4 || 4) 
                      ? 'bg-primary-500 text-white scale-110' 
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {beat}
                </div>
              ))}
            </div>
          )}
          
          <p className="text-xs text-slate-400 text-center">
            Practica contando los compases de 4 tiempos
          </p>
        </div>
      )}
    </div>
  );
};
