'use client';

/**
 * PlayerContext centraliza el estado compartido entre AudioPlayer, MarkerList
 * y SongAnalyzer, eliminando el prop drilling de seekFn y currentTime desde page.tsx.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

interface PlayerContextValue {
  currentTime: number;
  setCurrentTime: (time: number) => void;
  /** Registra la función seek expuesta por AudioPlayer */
  registerSeek: (fn: (time: number) => void) => void;
  /** Navega el reproductor a un tiempo concreto */
  seekTo: (time: number) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTime, setCurrentTime] = useState(0);
  const seekFnRef = useRef<((time: number) => void) | null>(null);

  const registerSeek = useCallback((fn: (time: number) => void) => {
    seekFnRef.current = fn;
  }, []);

  const seekTo = useCallback((time: number) => {
    setCurrentTime(time);
    seekFnRef.current?.(time);
  }, []);

  const value = useMemo<PlayerContextValue>(
    () => ({ currentTime, setCurrentTime, registerSeek, seekTo }),
    [currentTime, registerSeek, seekTo],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayerContext(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error('usePlayerContext debe usarse dentro de <PlayerProvider>');
  }
  return ctx;
}
