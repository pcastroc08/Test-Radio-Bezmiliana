import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Newspaper } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/utils/format";

export const Route = createFileRoute("/noticias/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("noticias")
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
          { name: "description", content: loaderData.sinopsis ?? loaderData.titulo },
          { property: "og:title", content: `${loaderData.titulo} — Radio Bezmiliana` },
          { property: "og:description", content: loaderData.sinopsis ?? "" },
          { property: "og:type", content: "article" },
          { property: "og:url", content: `/noticias/${params.slug}` },
        ]
      : [],
    links: [{ rel: "canonical", href: `/noticias/${params.slug}` }],
  }),
  notFoundComponent: NotFound,
  component: NoticiaDetail,
});

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-40 text-center">
      <h1 className="font-display text-4xl font-bold">Noticia no encontrada</h1>
      <Link to="/noticias" className="mt-6 inline-flex items-center gap-2 text-primary">
        <ArrowLeft className="h-4 w-4" /> Volver a noticias
      </Link>
    </div>
  );
}

function NoticiaDetail() {
  const noticia = Route.useLoaderData();

  return (
    <article className="pt-28 pb-24 sm:pt-36">
      <div className="mx-auto max-w-3xl px-6">
        <Link to="/noticias" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Todas las noticias
        </Link>

        {noticia.fecha && (
          <time className="mt-6 block text-xs uppercase tracking-wider text-muted-foreground">
            {formatDate(noticia.fecha)}
          </time>
        )}
        <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          {noticia.titulo}
        </h1>
        {noticia.sinopsis && (
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{noticia.sinopsis}</p>
        )}

        <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          {noticia.imagen_url ? (
            <img src={noticia.imagen_url} alt={noticia.titulo} className="aspect-[16/9] w-full object-cover" />
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center">
              <Newspaper className="h-16 w-16 text-white/10" />
            </div>
          )}
        </div>

        {noticia.texto && (
          <div className="prose prose-invert mt-10 max-w-none whitespace-pre-line text-base leading-relaxed text-foreground/90">
            {noticia.texto}
          </div>
        )}
      </div>
    </article>
  );
}
