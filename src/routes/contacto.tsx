import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Youtube, Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/page-shell";
import { ContactForm } from "@/components/contact-form";
import { SectionReveal } from "@/components/section-reveal";
import { SOCIAL_LINKS } from "@/utils/contact";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Radio Bezmiliana" },
      { name: "description", content: "Escribe a Radio Bezmiliana: propuestas de programas, colaboraciones y dudas del taller de radio." },
      { property: "og:title", content: "Contacto — Radio Bezmiliana" },
      { property: "og:description", content: "Ponte en contacto con la emisora escolar del IES Bezmiliana." },
      { property: "og:url", content: "/contacto" },
    ],
    links: [{ rel: "canonical", href: "/contacto" }],
  }),
  component: ContactoPage,
});

function ContactoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contacto"
        title={<>Hablemos sobre tu <span className="text-gradient-brand">próximo programa</span></>}
        description="Sugerencias, propuestas de invitados o ideas para nuevos episodios: el equipo de redacción te leerá con atención."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-24 lg:grid-cols-[1.3fr_1fr]">
        <SectionReveal>
          <ContactForm />
        </SectionReveal>
        <SectionReveal delay={120}>
          <aside className="glass space-y-6 rounded-3xl border border-white/5 p-6 sm:p-8">
            <div>
              <h3 className="font-display text-xl font-bold tracking-tight">Síguenos en redes</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Recibe avisos de nuevos episodios y entrevistas en directo.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex flex-1 items-center gap-3 rounded-2xl border border-white/10 p-4 transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-white">
                    <Instagram className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Instagram</div>
                    <div className="font-semibold">@radiobezmiliana</div>
                  </div>
                </a>
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex flex-1 items-center gap-3 rounded-2xl border border-white/10 p-4 transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-white">
                    <Youtube className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">YouTube</div>
                    <div className="font-semibold">@radiobezmiliana</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="space-y-4 border-t border-white/5 pt-6 text-sm">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Email</div>
                  <div className="font-medium">radiobezmiliana@gmail.com</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Centro</div>
                  <div className="font-medium">IES Bezmiliana</div>
                  <div className="text-muted-foreground">Rincón de la Victoria, Málaga</div>
                </div>
              </div>
            </div>
          </aside>
        </SectionReveal>
      </section>
    </>
  );
}
