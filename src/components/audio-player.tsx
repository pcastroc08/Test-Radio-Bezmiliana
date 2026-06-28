import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import type { Episodio } from "@/data/types";

interface PlayingTrack {
  episodio: Episodio;
  programaNombre: string;
}

interface AudioCtx {
  current: PlayingTrack | null;
  isPlaying: boolean;
  play: (track: PlayingTrack) => void;
  toggle: () => void;
  close: () => void;
}

const Ctx = createContext<AudioCtx>({
  current: null,
  isPlaying: false,
  play: () => {},
  toggle: () => {},
  close: () => {},
});

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<PlayingTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  const play = useCallback((track: PlayingTrack) => {
    setCurrent(track);
    setIsPlaying(true);
    requestAnimationFrame(() => {
      if (audioRef.current) {
        audioRef.current.src = track.episodio.audioUrl;
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    });
  }, []);

  const toggle = useCallback(() => {
    if (!audioRef.current || !current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [current]);

  const close = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setIsPlaying(false);
    setCurrent(null);
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setProgress(a.currentTime);
    const onDur = () => setDuration(a.duration || 0);
    const onEnd = () => setIsPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onDur);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onDur);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <Ctx.Provider value={{ current, isPlaying, play, toggle, close }}>
      {children}
      <audio ref={audioRef} preload="metadata" muted={muted} />
      {current && (
        <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-6 sm:pb-5 animate-fade-up">
          <div className="glass-strong mx-auto flex max-w-5xl items-center gap-3 rounded-2xl border border-white/10 p-3 shadow-card sm:gap-4 sm:p-4">
            <button
              onClick={toggle}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-white shadow-glow transition-transform hover:scale-105"
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-xs font-medium uppercase tracking-wider text-primary">
                  {current.programaNombre}
                </span>
                {isPlaying && (
                  <div className="flex h-3 items-end gap-[2px]">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="block w-[3px] origin-bottom rounded-sm bg-primary animate-equalizer"
                        style={{ animationDelay: `${i * 0.15}s`, height: "100%" }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="truncate text-sm font-semibold text-foreground">{current.episodio.titulo}</div>
              <div className="mt-2 flex items-center gap-2 text-[10px] tabular-nums text-muted-foreground">
                <span>{fmt(progress)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  value={progress}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (audioRef.current) audioRef.current.currentTime = v;
                    setProgress(v);
                  }}
                  className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-primary"
                  aria-label="Posición"
                />
                <span>{fmt(duration)}</span>
              </div>
            </div>
            <button
              onClick={() => setMuted((m) => !m)}
              className="hidden h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:text-foreground sm:grid"
              aria-label={muted ? "Activar sonido" : "Silenciar"}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              onClick={close}
              className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:text-foreground"
              aria-label="Cerrar reproductor"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useAudioPlayer() {
  return useContext(Ctx);
}
