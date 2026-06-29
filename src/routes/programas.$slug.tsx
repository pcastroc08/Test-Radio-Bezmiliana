import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Mic, Tag } from "lucide-react";
import { SearchInput } from "@/components/search-input";
import { SectionReveal } from "@/components/section-reveal";
import { supabase } from "@/lib/supabase";
import { useAudioPlayer } from "@/components/audio-player";
import { Play, Pause } from "lucide-react";

export const Route = createFileRoute("/programas/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("programas")
      .select("*")
      .eq("slug", params.slug)
      .single();
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData, params }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.titulo} — Radio Bezmiliana` },
          { name: "description", content: loaderData.descripcion },
          { property: "og:title", content: `${loaderData.titulo} — Radio Bezmiliana` },
          { property: "og:description", content: loaderData.descripcion },
          { property: "og:type", content: "article" },
          { property: "og:url", content: `/programas/${params.slug}` },
        ]
      : [],
    links: [{ rel: "canonical", href: `/programas/${params.slug}` }],
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
  const [episodios, setEpisodios] = useState<any[]>([]);
  const { play, toggle, current, isPlaying } = useAudioPlayer();

  useEffect(() => {
    supabase
      .from("episodios")
      .select("*")
      .eq("programa_id", programa.id)
      .order("fecha", { ascending: false })
      .then(({ data }) => setEpisodios(data ?? []));
  }, [programa.id]);

  const items = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return episodios;
    return episodios.filter(
      (e) =>
        e.titulo?.toLowerCase().includes(s) ||
        e.descripcion?.toLowerCase().includes(s),
    );
  }, [q, episodios]);

  const img = programa.imagen_url;

  return (
    <>
      {/* Hero programa */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24">
        <div className="absolute inset-0 -z-10">
          {img && <img src={img} alt="" className="h-full w-full object-cover opacity-30" />}
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
              {img ? (
                <img
                  src={img}
                  alt={programa.titulo}
                  className="relative aspect-square w-full rounded-[2rem] border border-white/10 object-cover shadow-card"
                  width={600}
                  height={600}
                />
              ) : (
                <div className="relative aspect-square w-full rounded-[2rem] border border-white/10 bg-white/5 flex items-center justify-center">
                  <Mic className="h-20 w-20 text-white/20" />
                </div>
              )}
            </div>

            <div className="animate-fade-up">
              {programa.categoria && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  <Tag className="h-3 w-3" /> {programa.categoria}
                </span>
              )}
              <h1 className="mt-4 font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                {programa.titulo}
              </h1>
              {programa.sinopsis && (
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {programa.sinopsis}
                </p>
              )}

              {/* Episodio único: reproductor directo */}
              {programa.episodio_unico && programa.audio_url && (
                <button
                  onClick={() => {
                    const track = {
                      episodio: {
                        id: programa.id,
                        titulo: programa.titulo,
                        fecha: "",
                        duracion: "",
                        descripcion: programa.descripcion ?? "",
                        audioUrl: programa.audio_url,
                        programaSlug: programa.slug,
                      },
                      programaNombre: programa.titulo,
                    };
                    if (current?.episodio.id === programa.id) {
                      toggle();
                    } else {
                      play(track);
                    }
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-105"
                >
                  {current?.episodio.id === programa.id && isPlaying
                    ? <><Pause className="h-4 w-4" /> Pausar</>
                    : <><Play className="ml-0.5 h-4 w-4" /> Escuchar programa</>
                  }
                </button>
              )}

              {programa.fecha_emision && (
                <div className="mt-8 glass rounded-2xl border border-white/5 p-4 inline-block">
                  <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" /> Frecuencia
                  </dt>
                  <dd className="mt-1.5 font-medium">{programa.fecha_emision}</dd>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Episodios — solo si no es episodio único */}
      {!programa.episodio_unico && (
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
              No hay episodios publicados todavía.
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map((ep, i) => (
                <SectionReveal key={ep.id} delay={i * 50}>
                  <EpisodioRow episodio={ep} programaNombre={programa.titulo} />
                </SectionReveal>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}

function EpisodioRow({ episodio, programaNombre }: { episodio: any; programaNombre: string }) {
  const { play, toggle, current, isPlaying } = useAudioPlayer();
  const isThis = current?.episodio.id === episodio.id;

  function handlePlay() {
    const track = {
      episodio: {
        id: episodio.id,
        titulo: episodio.titulo,
        fecha: episodio.fecha ?? "",
        duracion: episodio.duracion ?? "",
        descripcion: episodio.descripcion ?? "",
        audioUrl: episodio.audio_url ?? "",
        programaSlug: episodio.programa_id,
      },
      programaNombre,
    };
    if (isThis) toggle();
    else play(track);
  }

  return (
    <div className="glass rounded-2xl border border-white/5 p-5 flex items-center gap-4">
      {episodio.audio_url && (
        <button
          onClick={handlePlay}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-white shadow-glow transition hover:scale-105"
          aria-label={isThis && isPlaying ? "Pausar" : "Reproducir"}
        >
          {isThis && isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
        </button>
      )}
      <div className="min-w-0 flex-1">
        <div className="font-semibold truncate">{episodio.titulo}</div>
        {episodio.descripcion && (
          <div className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{episodio.descripcion}</div>
        )}
        <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
          {episodio.fecha && <span>{episodio.fecha}</span>}
          {episodio.duracion && <span>{episodio.duracion}</span>}
        </div>
      </div>
    </div>
  );
}
