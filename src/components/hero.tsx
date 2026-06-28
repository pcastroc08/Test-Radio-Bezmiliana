import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { HERO_IMAGE, LOGO_URL } from "@/utils/images";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-32">
      {/* Background image */}
      <div className="absolute inset-0 -z-20">
        <img
          src={HERO_IMAGE}
          alt=""
          className="h-full w-full object-cover opacity-50"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        <div className="absolute inset-0 bg-grid opacity-40" />
      </div>

      {/* Glow blobs */}
      <div className="pointer-events-none absolute -left-32 top-20 -z-10 h-96 w-96 rounded-full bg-primary/30 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-[140px]" />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Emisora escolar
          </div>

          <h1 className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            La voz del{" "}
            <span className="text-gradient-brand">IES Bezmiliana</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Radio Bezmiliana es la emisora escolar del IES Bezmiliana, donde compartimos noticias, entrevistas, música y proyectos educativos.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/programas"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.03]"
            >
              <Sparkles className="h-4 w-4" /> Explorar programas
            </Link>
          </div>
        </div>

        {/* Visual: floating logo */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none animate-scale-in" style={{ animationDelay: "0.15s" }}>
          <div className="relative aspect-square">
            {/* rotating ring */}
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin-slow" />
            <div className="absolute inset-6 rounded-full border border-primary/10" />
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
            {/* glass card */}
            <div className="absolute inset-8 grid place-items-center rounded-[3rem] glass-strong border border-white/10 p-10 shadow-card">
              <img src={LOGO_URL} alt="Radio Bezmiliana" className="h-full w-full object-contain drop-shadow-2xl" />
            </div>
            {/* equalizer chip */}
            <div className="glass-strong absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 px-5 py-3 shadow-card">
              <div className="flex h-4 items-end gap-1">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className="block w-[3px] origin-bottom rounded-sm bg-primary animate-equalizer"
                    style={{ animationDelay: `${i * 0.12}s`, height: "100%" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
