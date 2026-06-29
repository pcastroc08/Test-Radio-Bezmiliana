import { Newspaper } from "lucide-react";
import { formatDate } from "@/utils/format";

export function NewsCard({ noticia }: { noticia: any }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-surface/30 transition-all duration-500 hover-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
        {noticia.imagen_url ? (
          <img
            src={noticia.imagen_url}
            alt={noticia.titulo}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Newspaper className="h-16 w-16 text-white/10" />
          </div>
        )}
        {noticia.categoria && (
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-glow">
            {noticia.categoria}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        {noticia.fecha && (
          <time className="text-xs uppercase tracking-wider text-muted-foreground">
            {formatDate(noticia.fecha)}
          </time>
        )}
        <h3 className="font-display text-xl font-bold tracking-tight">{noticia.titulo}</h3>
        {noticia.texto && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">{noticia.texto}</p>
        )}
      </div>
    </article>
  );
}
