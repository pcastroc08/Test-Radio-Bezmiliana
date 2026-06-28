import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-shell";
import { MasonryGallery } from "@/components/masonry-gallery";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galería — Radio Bezmiliana" },
      { name: "description", content: "Una mirada visual al estudio, los micrófonos y las grabaciones de Radio Bezmiliana." },
      { property: "og:title", content: "Galería — Radio Bezmiliana" },
      { property: "og:description", content: "Imágenes de nuestro estudio, equipo y grabaciones." },
      { property: "og:url", content: "/galeria" },
    ],
    links: [{ rel: "canonical", href: "/galeria" }],
  }),
  component: GaleriaPage,
});

function GaleriaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Galería"
        title={<>El estudio en <span className="text-gradient-brand">imágenes</span></>}
        description="Una selección visual de momentos, equipo y rincones del estudio de Radio Bezmiliana."
      />
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <MasonryGallery />
      </section>
    </>
  );
}
