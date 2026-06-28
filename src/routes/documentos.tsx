import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { PageHeader } from "@/components/page-shell";
import { SectionReveal } from "@/components/section-reveal";
import documentos from "@/data/documentos.json";

export const Route = createFileRoute("/documentos")({
  head: () => ({
    meta: [
      { title: "Documentos — Radio Bezmiliana" },
      { name: "description", content: "Reglamento, normas de participación y autorizaciones de Radio Bezmiliana." },
      { property: "og:title", content: "Documentos — Radio Bezmiliana" },
      { property: "og:description", content: "Documentación oficial de la emisora escolar." },
      { property: "og:url", content: "/documentos" },
    ],
    links: [{ rel: "canonical", href: "/documentos" }],
  }),
  component: DocumentosPage,
});

function DocumentosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Documentos"
        title={<>Toda la <span className="text-gradient-brand">documentación</span></>}
        description="Reglamento de funcionamiento, normas de participación y modelos de autorización del taller de radio."
      />
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {documentos.map((d, i) => (
            <SectionReveal key={d.titulo} delay={i * 80}>
              <a
                href={d.url}
                target="_blank"
                rel="noreferrer"
                className="group glass relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl border border-white/5 p-6 transition hover:border-primary/30 hover-lift"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">{d.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.descripcion}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-3 text-xs">
                  <span className="text-muted-foreground">{d.tamano}</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-primary transition-transform group-hover:translate-x-1">
                    Descargar <Download className="h-3.5 w-3.5" />
                  </span>
                </div>
              </a>
            </SectionReveal>
          ))}
        </div>
      </section>
    </>
  );
}
