import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-shell";
import { ProgramCard } from "@/components/program-card";
import { SearchInput } from "@/components/search-input";
import { SectionReveal } from "@/components/section-reveal";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/programas/")({
  head: () => ({
    meta: [
      { title: "Programas — Radio Bezmiliana" },
      { name: "description", content: "Descubre todos los programas de Radio Bezmiliana: magazine matinal, música y deportes." },
      { property: "og:title", content: "Programas — Radio Bezmiliana" },
      { property: "og:description", content: "La parrilla completa de la emisora escolar del IES Bezmiliana." },
      { property: "og:url", content: "/programas" },
    ],
    links: [{ rel: "canonical", href: "/programas" }],
  }),
  component: ProgramasPage,
});

function ProgramasPage() {
  const [q, setQ] = useState("");
  const [programas, setProgramas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("programas")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setProgramas(data ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return programas;
    return programas.filter(
      (p) =>
        p.titulo?.toLowerCase().includes(s) ||
        p.categoria?.toLowerCase().includes(s) ||
        p.descripcion?.toLowerCase().includes(s),
    );
  }, [q, programas]);

  return (
    <>
      <PageHeader
        eyebrow="Programas"
        title={<>La parrilla <span className="text-gradient-brand">Bezmiliana</span></>}
        description="Espacios para acompañarte: magazine matinal, música y deportes. Hechos por alumnos, supervisados por profesores."
      />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 max-w-md">
          <SearchInput value={q} onChange={setQ} placeholder="Buscar programa por nombre o categoría..." />
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted-foreground">Cargando programas...</div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-3xl border border-white/5 p-12 text-center text-muted-foreground">
            No hay programas que coincidan con tu búsqueda.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" id="ultimos">
            {filtered.map((p, i) => (
              <SectionReveal key={p.id} delay={i * 70}>
                <ProgramCard programa={p} />
              </SectionReveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
