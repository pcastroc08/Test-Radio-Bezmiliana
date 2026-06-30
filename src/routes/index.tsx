import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mic, Radio, Sparkles } from "lucide-react";
import { Hero } from "@/components/hero";
import { ProgramCard } from "@/components/program-card";
import { NewsCard } from "@/components/news-card";
import { SectionReveal } from "@/components/section-reveal";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Radio Bezmiliana — La voz del IES Bezmiliana" },
      { name: "description", content: "Emisora escolar del IES Bezmiliana. Noticias, entrevistas, música y proyectos educativos en formato podcast." },
      { property: "og:title", content: "Radio Bezmiliana" },
      { property: "og:description", content: "La voz del IES Bezmiliana, en formato podcast." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const [programas, setProgramas] = useState<any[]>([]);
  const [noticias, setNoticias] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("programas").select("*").order("created_at", { ascending: false }).limit(3)
      .then(({ data }) => setProgramas(data ?? []));
    supabase.from("noticias").select("*").order("created_at", { ascending: false }).limit(3)
      .then(({ data }) => setNoticias(data ?? []));
  }, []);

  return (
    <>
      <Hero />

      {/* Programas destacados */}
      {programas.length > 0 && (
        <section className="relative mx-auto max-w-7xl px-6 py-24">
          <SectionReveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                <Radio className="h-3 w-3" /> Nuestros programas
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Nuestros programas
              </h2>
            </div>
            <Link to="/programas" className="group inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary transition hover:gap-2.5">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </SectionReveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programas.map((p, i) => (
              <SectionReveal key={p.id} delay={i * 80}>
                <ProgramCard programa={p} />
              </SectionReveal>
            ))}
          </div>
        </section>
      )}

      {/* Últimas noticias */}
      {noticias.length > 0 && (
        <section className="relative mx-auto max-w-7xl px-6 py-24">
          <SectionReveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                <Mic className="h-3 w-3" /> Últimas noticias
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Últimas noticias
              </h2>
            </div>
            <Link to="/noticias" className="group inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary transition hover:gap-2.5">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </SectionReveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {noticias.map((n, i) => (
              <SectionReveal key={n.id} delay={i * 80}>
                <NewsCard noticia={n} />
              </SectionReveal>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <SectionReveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-primary/30 via-surface to-surface p-10 sm:p-16">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  <Sparkles className="h-3 w-3" /> ¿Quieres participar?
                </div>
                <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  Hay un micro esperándote en el estudio
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                  Si eres alumno del IES Bezmiliana y tienes una idea para un programa,
                  una entrevista o un podcast, escríbenos. Te enseñamos a presentar,
                  grabar y editar tu propio espacio.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to="/contacto" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-105">
                    <Mic className="h-4 w-4" /> Quiero presentar un programa
                  </Link>
                  <Link to="/equipo" className="glass inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40">
                    Conocer al equipo
                  </Link>
                </div>
              </div>
              <ul className="grid gap-3 text-sm">
                {[
                  "Formación técnica gratuita en grabación y edición",
                  "Tu programa publicado en redes y en la web",
                  "Equipo profesional: micros, mesa y software pro",
                ].map((t) => (
                  <li key={t} className="glass flex items-start gap-3 rounded-2xl border border-white/5 p-4">
                    <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionReveal>
      </section>
    </>
  );
}
