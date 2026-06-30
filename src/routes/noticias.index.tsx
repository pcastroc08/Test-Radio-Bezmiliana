import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-shell";
import { NewsCard } from "@/components/news-card";
import { SectionReveal } from "@/components/section-reveal";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/noticias/")({
  head: () => ({
    meta: [
      { title: "Noticias — Radio Bezmiliana" },
      { name: "description", content: "Actualidad de la radio escolar del IES Bezmiliana: eventos, entrevistas y novedades del centro." },
      { property: "og:title", content: "Noticias — Radio Bezmiliana" },
      { property: "og:description", content: "Toda la actualidad de la emisora escolar." },
      { property: "og:url", content: "/noticias" },
    ],
    links: [{ rel: "canonical", href: "/noticias" }],
  }),
  component: NoticiasPage,
});

function NoticiasPage() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("noticias").select("*").order("created_at", { ascending: false })
      .then(({ data }) => {
        setNoticias(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Noticias"
        title={<>La actualidad de la <span className="text-gradient-brand">radio</span></>}
        description="Estrenos, eventos, premios y todo lo que pasa dentro y fuera del estudio."
      />
      <section className="mx-auto max-w-7xl px-6 pb-24">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Cargando noticias...</div>
        ) : noticias.length === 0 ? (
          <div className="glass rounded-3xl border border-white/5 p-12 text-center text-muted-foreground">
            No hay noticias publicadas todavía.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {noticias.map((n, i) => (
              <SectionReveal key={n.id} delay={i * 70}>
                <NewsCard noticia={n} />
              </SectionReveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
