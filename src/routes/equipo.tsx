import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-shell";
import { TeamCard } from "@/components/team-card";
import { SectionReveal } from "@/components/section-reveal";
import { Mic, Megaphone, Headphones, BookOpen, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

const GRUPOS: Record<string, { titulo: string; subtitulo: string; icon: React.ReactNode }> = {
  direccion: { titulo: "Dirección",            subtitulo: "Coordinación y dirección de la radio",  icon: <Megaphone className="h-3.5 w-3.5" /> },
  locutores: { titulo: "Locución",             subtitulo: "Las voces de Radio Bezmiliana",          icon: <Mic className="h-3.5 w-3.5" /> },
  redaccion: { titulo: "Redacción de guiones", subtitulo: "Quienes dan forma a cada programa",      icon: <BookOpen className="h-3.5 w-3.5" /> },
  tecnicos:  { titulo: "Técnico de sonido",    subtitulo: "Producción y postproducción",             icon: <Headphones className="h-3.5 w-3.5" /> },
  redes:     { titulo: "Redes sociales",       subtitulo: "Comunicación y difusión",                icon: <Share2 className="h-3.5 w-3.5" /> },
};
const ORDEN = ["direccion", "locutores", "redaccion", "tecnicos", "redes"];

function EquipoPage() {
  const [equipo, setEquipo] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipo();

    const channel = supabase
      .channel("equipo-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "equipo" }, () => {
        fetchEquipo();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchEquipo() {
    const { data } = await supabase.from("equipo").select("*").order("orden", { ascending: true });
    setEquipo(data ?? []);
    setLoading(false);
  }

  const grupos = ORDEN
    .map((key) => ({ key, ...GRUPOS[key], miembros: equipo.filter((m) => m.categoria === key) }))
    .filter((g) => g.miembros.length > 0);

  return (
    <>
      <PageHeader
        eyebrow="Equipo"
        title={<>Las voces detrás del <span className="text-gradient-brand">micro</span></>}
        description="Dirección, locutores, redactores, técnicos y redes: el equipo que hace posible Radio Bezmiliana."
      />
      <div className="mx-auto max-w-7xl space-y-20 px-6 pb-24">
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Cargando equipo...</div>
        ) : grupos.length === 0 ? (
          <div className="glass rounded-3xl border border-white/5 p-12 text-center text-muted-foreground">
            El equipo todavía no se ha publicado.
          </div>
        ) : (
          grupos.map((grupo) => (
            <SectionReveal key={grupo.key}>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  {grupo.icon} {grupo.subtitulo}
                </div>
                <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">{grupo.titulo}</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {grupo.miembros.map((m) => (
                  <TeamCard key={m.id} nombre={m.nombre} rol={m.rol ?? ""} bio={m.descripcion} fotoUrl={m.foto_url} />
                ))}
              </div>
            </SectionReveal>
          ))
        )}
      </div>
    </>
  );
}
