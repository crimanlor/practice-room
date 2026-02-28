'use client';

/**
 * @file components/SongAnalyzer.tsx
 * Herramientas de análisis musical con tres pestañas:
 *
 * - **BPM**: tap tempo — el usuario toca al ritmo y se calcula el BPM promedio
 * - **Metrónomo**: reproduce clics sintéticos (Web Audio API) a un BPM configurable
 * - **Conteo**: visualizador de 4 tiempos del compás, sincronizado con el metrónomo
 *
 * El metrónomo usa `AudioContext` (Web Audio API), no archivos de audio.
 * Se crea lazy para cumplir con las políticas del navegador (requiere gesto del usuario).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Pause, Play, Plus, RotateCcw } from 'lucide-react';

interface SongAnalyzerProps {
  currentTime: number;
  isPlaying: boolean;
  onTapBpm?: (bpm: number) => void;
}

const TAP_COOLDOWN_MS = 2000;
const TAP_WINDOW_MS = 5000;
const MIN_BPM = 60;
const MAX_BPM = 200;

function calculateBpm(tapTimes: number[]): number | null {
  if (tapTimes.length < 2) return null;
  const intervals = tapTimes.slice(1).map((t, i) => t - tapTimes[i]);
  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const bpm = Math.round(60_000 / avg);
  return bpm >= MIN_BPM && bpm <= MAX_BPM ? bpm : null;
}

export function SongAnalyzer({ currentTime, isPlaying, onTapBpm }: SongAnalyzerProps) {
  const [activeTab, setActiveTab] = useState<'bpm' | 'metronome' | 'count'>('bpm');

  // ── BPM tap ──────────────────────────────────────────────────────────────
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [calculatedBpm, setCalculatedBpm] = useState<number | null>(null);
  const lastTapRef = useRef(0);

  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current > TAP_COOLDOWN_MS) {
      setTapTimes([]);
      setCalculatedBpm(null);
    }
    lastTapRef.current = now;

    setTapTimes((prev) => {
      const next = [...prev, now].filter((t) => now - t < TAP_WINDOW_MS);
      const bpm = calculateBpm(next);
      if (bpm !== null) {
        setCalculatedBpm(bpm);
        onTapBpm?.(bpm);
      }
      return next;
    });
  }, [onTapBpm]);

  // ── Metronome ─────────────────────────────────────────────────────────────
  const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);
  const [metronomeBpm, setMetronomeBpm] = useState(120);
  const [beat, setBeat] = useState(1);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playClick = useCallback((isAccent: boolean) => {
    if (typeof window === 'undefined') return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (
        window.AudioContext ||
        // Safari legacy
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!
      )();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = isAccent ? 1000 : 800;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }, []);

  useEffect(() => {
    if (!isMetronomePlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setBeat(1);
      return;
    }

    const tick = () => {
      setBeat((prev) => {
        const next = prev >= 4 ? 1 : prev + 1;
        playClick(next === 1);
        return next;
      });
    };

    tick();
    intervalRef.current = setInterval(tick, 60_000 / metronomeBpm);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMetronomePlaying, metronomeBpm, playClick]);

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  function adjustBpm(delta: number) {
    setMetronomeBpm((prev) => Math.max(MIN_BPM, Math.min(MAX_BPM, prev + delta)));
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="bg-slate-800 rounded-lg p-4 shadow-xl">
      <h3 className="text-lg font-bold text-white mb-4">Análisis</h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['bpm', 'metronome', 'count'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab
                ? 'bg-primary-500 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600',
            ].join(' ')}
          >
            {tab === 'bpm' ? 'BPM' : tab === 'metronome' ? 'Metrónomo' : 'Conteo'}
          </button>
        ))}
      </div>

      {/* BPM Tab */}
      {activeTab === 'bpm' && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-1">
              {calculatedBpm ?? '--'}
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
              onClick={() => { setTapTimes([]); setCalculatedBpm(null); }}
              className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg transition-colors"
              aria-label="Reiniciar"
            >
              <RotateCcw size={20} />
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center">
            Toca "TAP" al ritmo de la música para detectar los BPM
          </p>
          {tapTimes.length > 0 && (
            <p className="text-center text-xs text-slate-500">
              {tapTimes.length} toques registrados
            </p>
          )}
        </div>
      )}

      {/* Metronome Tab */}
      {activeTab === 'metronome' && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-1">{metronomeBpm}</div>
            <div className="text-slate-400 text-sm">BPM</div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => adjustBpm(-5)}
              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
              aria-label="-5 BPM"
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
              onClick={() => setIsMetronomePlaying((v) => !v)}
              className={[
                'p-4 rounded-full transition-colors text-white',
                isMetronomePlaying
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-primary-500 hover:bg-primary-600',
              ].join(' ')}
              aria-label={isMetronomePlaying ? 'Pausar metrónomo' : 'Iniciar metrónomo'}
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
              aria-label="+5 BPM"
            >
              <Plus size={20} />
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center">
            Ajusta el tempo y usa el metrónomo para practicar
          </p>
        </div>
      )}

      {/* Count Tab */}
      {activeTab === 'count' && (
        <div className="space-y-4">
          <div className="flex justify-center gap-4 py-4">
            {[1, 2, 3, 4].map((b) => (
              <div
                key={b}
                className={[
                  'w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all',
                  b === beat ? 'bg-primary-500 text-white scale-110' : 'bg-slate-700 text-slate-400',
                ].join(' ')}
              >
                {b}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMetronomePlaying((v) => !v)}
              className={[
                'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors text-white',
                isMetronomePlaying
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-primary-500 hover:bg-primary-600',
              ].join(' ')}
            >
              {isMetronomePlaying ? 'Detener' : 'Iniciar conteo'}
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center">
            Practica contando los compases de 4 tiempos
          </p>
        </div>
      )}
    </div>
  );
}
