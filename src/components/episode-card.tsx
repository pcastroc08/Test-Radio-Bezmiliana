import { Clock, Play } from "lucide-react";
import { useAudioPlayer } from "./audio-player";
import { formatDate } from "@/utils/format";
import type { Episodio, Programa } from "@/data/types";
import { PROGRAMA_IMAGES } from "@/utils/images";

export function EpisodeCard({ episodio, programa }: { episodio: Episodio; programa: Programa }) {
  const { play, current, isPlaying } = useAudioPlayer();
  const playing = current?.episodio.id === episodio.id && isPlaying;

  return (
    <article className="group glass flex flex-col gap-4 rounded-3xl border border-white/5 p-4 transition hover:border-primary/30 hover-lift sm:flex-row sm:items-center sm:gap-5 sm:p-5">
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-28">
        <img
          src={PROGRAMA_IMAGES[programa.imagen]}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/30" />
        <button
          onClick={() => play({ episodio, programaNombre: programa.nombre })}
          aria-label={playing ? "Reproduciendo" : `Escuchar ${episodio.titulo}`}
          className="absolute inset-0 grid place-items-center text-white opacity-0 transition group-hover:opacity-100"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-primary shadow-glow">
            <Play className="ml-0.5 h-5 w-5" />
          </span>
        </button>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>{formatDate(episodio.fecha)}</span>
          <span className="text-primary/60">•</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {episodio.duracion}</span>
        </div>
        <h3 className="mt-1.5 font-display text-lg font-semibold tracking-tight">{episodio.titulo}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{episodio.descripcion}</p>
      </div>
      <button
        onClick={() => play({ episodio, programaNombre: programa.nombre })}
        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:scale-105"
      >
        <Play className="h-3.5 w-3.5" />
        {playing ? "Sonando" : "Escuchar"}
      </button>
    </article>
  );
}
