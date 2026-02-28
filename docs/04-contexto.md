# Contexto (`context/PlayerContext.tsx`)

## ¿Qué problema resuelve?

`AudioPlayer`, `MarkerList` y `SongAnalyzer` comparten dos valores:

- **`currentTime`**: el segundo actual del audio que está sonando
- **`seekTo`**: una función para saltar el reproductor a un tiempo concreto

Sin contexto, `page.tsx` tendría que recibir esos valores de `AudioPlayer` y pasarlos hacia abajo a `MarkerList` y `SongAnalyzer` como props. Eso se llama "prop drilling" y hace el código difícil de leer y mantener.

Con contexto, cualquier componente dentro de `<PlayerProvider>` puede leer `currentTime` y llamar a `seekTo` directamente.

---

## Cómo funciona

### `PlayerProvider`

Es el componente envolvente. Se coloca en `app/page.tsx` alrededor de toda la interfaz:

```tsx
<PlayerProvider>
  <MainContent />
</PlayerProvider>
```

Internamente guarda:
- `currentTime` en un `useState` (causa re-renders cuando cambia)
- `seekFnRef` en un `useRef` (no causa re-renders; es solo una referencia a la función)

### `registerSeek`

`AudioPlayer` llama a `registerSeek(seekTo)` para "registrar" su función de seek en el contexto. Esto permite que otros componentes (como `MarkerList`) puedan mover el reproductor sin tener acceso directo a la instancia de WaveSurfer.

```ts
// En AudioPlayer.tsx
useEffect(() => {
  onSeek?.(seekTo);  // "Hola contexto, aquí está mi función seek"
}, [onSeek, seekTo]);
```

```ts
// En PlayerContext.tsx
const registerSeek = useCallback((fn) => {
  seekFnRef.current = fn;  // La guardamos en una ref (sin re-render)
}, []);
```

### `seekTo` (el del contexto)

Hace dos cosas a la vez:
1. Actualiza `currentTime` en el estado → re-renderiza los componentes que lo usan
2. Llama a `seekFnRef.current(time)` → mueve WaveSurfer al nuevo punto

```ts
const seekTo = useCallback((time: number) => {
  setCurrentTime(time);          // 1. actualizar estado
  seekFnRef.current?.(time);     // 2. mover el reproductor
}, []);
```

### `usePlayerContext`

Hook que los componentes usan para acceder al contexto. Si se llama fuera de un `PlayerProvider`, lanza un error descriptivo en lugar de fallar silenciosamente.

```ts
// En cualquier componente hijo de PlayerProvider:
const { currentTime, seekTo } = usePlayerContext();
```

---

## Diagrama de relaciones

```
PlayerProvider (context/PlayerContext.tsx)
│
│  estado: currentTime
│  ref:    seekFnRef
│
├── AudioPlayer
│     │  lee:    audioUrl del track
│     │  expone: seekTo (vía onSeek → registerSeek)
│     └─ escribe currentTime (vía onTimeUpdate → setCurrentTime)
│
├── MarkerList
│     │  lee:    currentTime (para saber dónde colocar nuevo marcador)
│     └─ llama:  seekTo (cuando usuario hace clic en tiempo del marcador)
│
└── SongAnalyzer
      └─ lee:    currentTime (para display y tap BPM)
```

---

## ¿Por qué `useMemo` en el value?

```ts
const value = useMemo(
  () => ({ currentTime, setCurrentTime, registerSeek, seekTo }),
  [currentTime, registerSeek, seekTo],
);
```

Sin `useMemo`, cada vez que `PlayerProvider` re-renderiza crearía un objeto `value` nuevo, aunque su contenido sea idéntico. Eso causaría que todos los consumidores del contexto también re-renderizaran. Con `useMemo`, el objeto solo se recrea cuando realmente cambia alguno de sus valores.
