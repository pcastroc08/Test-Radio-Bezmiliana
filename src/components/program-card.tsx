import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mic } from "lucide-react";

export function ProgramCard({ programa }: { programa: any }) {
  const img = programa.imagen_url;
  return (
    <Link
      to="/programas/$slug"
      params={{ slug: programa.slug }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-surface/40 backdrop-blur-sm transition-all duration-500 hover-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        {img ? (
          <img
            src={img}
            alt={programa.titulo}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Mic className="h-16 w-16 text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        {programa.categoria && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {programa.categoria}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="font-display text-xl font-bold tracking-tight">{programa.titulo}</h3>
        {programa.descripcion && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{programa.descripcion}</p>
        )}
        <div className="mt-auto flex items-center justify-end pt-4">
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
            Ver programa <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
