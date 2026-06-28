import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Mic, Tag, Users } from "lucide-react";
import { EpisodeCard } from "@/components/episode-card";
import { SearchInput } from "@/components/search-input";
import { SectionReveal } from "@/components/section-reveal";
import programas from "@/data/programas.json";
import episodios from "@/data/episodios.json";
import type { Programa, Episodio } from "@/data/types";
import { PROGRAMA_IMAGES } from "@/utils/images";

export const Route = createFileRoute("/programas/$slug")({
  loader: ({ params }) => {
    const programa = (programas as Programa[]).find((p) => p.slug === params.slug);
    if (!programa) throw notFound();
    return programa;
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.nombre} — Radio Bezmiliana` },
          { name: "description", content: loaderData.descripcion },
          { property: "og:title", content: `${loaderData.nombre} — Radio Bezmiliana` },
          { property: "og:description", content: loaderData.descripcion },
          { property: "og:type", content: "article" },
          { property: "og:url", content: `/programas/${params.slug}` },
        ]
      : [],
    links: [{ rel: "canonical", href: `/programas/${params.slug}` }],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "PodcastSeries",
              name: loaderData.nombre,
              description: loaderData.sinopsis,
              inLanguage: "es",
            }),
          },
        ]
      : [],
  }),
  notFoundComponent: NotFound,
  component: ProgramaDetail,
});

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-40 text-center">
      <h1 className="font-display text-4xl font-bold">Programa no encontrado</h1>
      <Link to="/programas" className="mt-6 inline-flex items-center gap-2 text-primary">
        <ArrowLeft className="h-4 w-4" /> Volver a programas
      </Link>
    </div>
  );
}

function ProgramaDetail() {
  const programa = Route.useLoaderData();
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const list = (episodios as Episodio[])
      .filter((e) => e.programaSlug === programa.slug)
      .sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha));
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter(
      (e) => e.titulo.toLowerCase().includes(s) || e.descripcion.toLowerCase().includes(s),
    );
  }, [q, programa.slug]);

  const img = PROGRAMA_IMAGES[programa.imagen];

  return (
    <>
      {/* Hero programa */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div className="absolute inset-0 -z-10">
          <img src={img} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        </div>

        <div className="mx-auto max-w-7xl px-6">
          <Link
            to="/programas"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Todos los programas
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 rounded-[2rem] bg-primary/30 blur-3xl" />
              <img
                src={img}
                alt={programa.nombre}
                className="relative aspect-square w-full rounded-[2rem] border border-white/10 object-cover shadow-card"
                width={600}
                height={600}
              />
            </div>

            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                <Tag className="h-3 w-3" /> {programa.categoria}
              </span>
              <h1 className="mt-4 font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                {programa.nombre}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {programa.sinopsis}
              </p>
              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="glass rounded-2xl border border-white/5 p-4">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                    <Users className="h-3.5 w-3.5" /> Presentadores
                  </dt>
                  <dd className="mt-1.5 font-medium">{programa.presentadores.join(", ")}</dd>
                </div>
                <div className="glass rounded-2xl border border-white/5 p-4">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" /> Frecuencia
                  </dt>
                  <dd className="mt-1.5 font-medium">{programa.frecuencia}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Episodios */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <SectionReveal className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              <Mic className="h-3 w-3" /> Episodios
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">Todos los capítulos</h2>
          </div>
          <div className="w-full sm:max-w-xs">
            <SearchInput value={q} onChange={setQ} placeholder="Buscar episodio..." />
          </div>
        </SectionReveal>

        {items.length === 0 ? (
          <div className="glass rounded-3xl border border-white/5 p-10 text-center text-muted-foreground">
            No hay episodios que coincidan con tu búsqueda.
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((ep, i) => (
              <SectionReveal key={ep.id} delay={i * 50}>
                <EpisodeCard episodio={ep} programa={programa} />
              </SectionReveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
