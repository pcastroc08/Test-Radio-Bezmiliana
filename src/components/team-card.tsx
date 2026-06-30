interface Props {
  nombre: string;
  rol: string;
  meta?: string;
  bio?: string;
  fotoUrl?: string;
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function TeamCard({ nombre, rol, meta, bio, fotoUrl }: Props) {
  return (
    <article className="glass group flex flex-col gap-4 rounded-3xl border border-white/5 p-6 transition hover-lift">
      <div className="flex items-center gap-4">
        {fotoUrl ? (
          <img
            src={fotoUrl}
            alt={nombre}
            className="h-14 w-14 shrink-0 rounded-2xl object-cover shadow-glow"
          />
        ) : (
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 font-display text-lg font-bold text-white shadow-glow">
            {initials(nombre)}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold tracking-tight">{nombre}</h3>
          {rol && <p className="truncate text-xs uppercase tracking-wider text-primary/90">{rol}</p>}
        </div>
      </div>
      {meta && <div className="text-xs text-muted-foreground">{meta}</div>}
      {bio && <p className="text-sm leading-relaxed text-muted-foreground">{bio}</p>}
    </article>
  );
}
