import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-shell";
import { NewsCard } from "@/components/news-card";
import { SectionReveal } from "@/components/section-reveal";
import noticias from "@/data/noticias.json";
import type { Noticia } from "@/data/types";

export const Route = createFileRoute("/noticias")({
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
  const list = noticias as Noticia[];
  return (
    <>
      <PageHeader
        eyebrow="Noticias"
        title={<>La actualidad de la <span className="text-gradient-brand">radio</span></>}
        description="Estrenos, eventos, premios y todo lo que pasa dentro y fuera del estudio."
      />
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((n, i) => (
            <SectionReveal key={n.slug} delay={i * 70}>
              <NewsCard noticia={n} />
            </SectionReveal>
          ))}
        </div>
      </section>
    </>
  );
}
