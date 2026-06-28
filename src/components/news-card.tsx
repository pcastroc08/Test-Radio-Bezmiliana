import { ArrowUpRight } from "lucide-react";
import type { Noticia } from "@/data/types";
import { NOTICIA_IMAGES } from "@/utils/images";
import { formatDate } from "@/utils/format";

export function NewsCard({ noticia }: { noticia: Noticia }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-surface/30 transition-all duration-500 hover-lift">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={NOTICIA_IMAGES[noticia.imagen]}
          alt={noticia.titulo}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-glow">
          {noticia.categoria}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <time className="text-xs uppercase tracking-wider text-muted-foreground">{formatDate(noticia.fecha)}</time>
        <h3 className="font-display text-xl font-bold tracking-tight">{noticia.titulo}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">{noticia.resumen}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
          Leer noticia <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </article>
  );
}
