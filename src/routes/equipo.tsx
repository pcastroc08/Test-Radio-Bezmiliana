import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-shell";
import { TeamCard } from "@/components/team-card";
import { SectionReveal } from "@/components/section-reveal";
import { Mic, Megaphone, Headphones, BookOpen, Share2 } from "lucide-react";
import equipo from "@/data/equipo.json";

export const Route = createFileRoute("/equipo")({
  head: () => ({
    meta: [
      { title: "Equipo — Radio Bezmiliana" },
      { name: "description", content: "Profesores, alumnos y equipo técnico que hace posible Radio Bezmiliana cada semana." },
      { property: "og:title", content: "Equipo — Radio Bezmiliana" },
      { property: "og:description", content: "Las personas detrás de la emisora escolar del IES Bezmiliana." },
      { property: "og:url", content: "/equipo" },
    ],
    links: [{ rel: "canonical", href: "/equipo" }],
  }),
  component: EquipoPage,
});

const ICONS: Record<string, React.ReactNode> = {
  direccion: <Megaphone className="h-3.5 w-3.5" />,
  locucion: <Mic className="h-3.5 w-3.5" />,
  guiones: <BookOpen className="h-3.5 w-3.5" />,
  tecnico: <Headphones className="h-3.5 w-3.5" />,
  rrss: <Share2 className="h-3.5 w-3.5" />,
};

function EquipoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Equipo"
        title={<>Las voces detrás del <span className="text-gradient-brand">micro</span></>}
        description="Dirección, locutores, redactores, técnicos y redes: el equipo que hace posible Radio Bezmiliana."
      />

      <div className="mx-auto max-w-7xl space-y-20 px-6 pb-24">
        {equipo.grupos.map((grupo) => (
          <SectionReveal key={grupo.key}>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                {ICONS[grupo.key]} {grupo.subtitulo}
              </div>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">{grupo.titulo}</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {grupo.miembros.map((m) => (
                <TeamCard key={m.nombre} nombre={m.nombre} rol={m.rol} bio={m.bio} />
              ))}
            </div>
          </SectionReveal>
        ))}
      </div>
    </>
  );
}
