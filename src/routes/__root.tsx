import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  ScrollRestoration,
  ScriptOnce,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ThemeProvider } from "../components/theme-provider";
import { AudioPlayerProvider } from "../components/audio-player";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { SplashScreen } from "../components/splash-screen";
import { BackToTop } from "../components/back-to-top";
const logoAsset = { url: "/favicon.png" };

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl" />
        <h1 className="relative font-display text-[7rem] font-black leading-none text-gradient-brand sm:text-[10rem]">404</h1>
      </div>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Esta frecuencia no existe
      </h2>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Parece que la página que buscas se ha quedado fuera del aire. Vuelve al inicio para seguir escuchando Radio Bezmiliana.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-105"
      >
        Volver al inicio
      </Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Algo ha fallado
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Hubo un problema al cargar la página. Puedes reintentar o volver al inicio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:scale-105"
          >
            Reintentar
          </button>
          <a href="/" className="rounded-full border border-white/10 bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-white/5">
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#07111F" },
      { title: "test" },
      {
        name: "description",
        content:
          "Emisora escolar del IES Bezmiliana. Programas, episodios, noticias y proyectos hechos por y para los alumnos.",
      },
      { property: "og:site_name", content: "Radio Bezmiliana" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: logoAsset.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: logoAsset.url },
      { property: "og:title", content: "test" },
      { name: "twitter:title", content: "test" },
      { name: "description", content: "Radio Bezmiliana Stream is a modern, professional school radio website." },
      { property: "og:description", content: "Radio Bezmiliana Stream is a modern, professional school radio website." },
      { name: "twitter:description", content: "Radio Bezmiliana Stream is a modern, professional school radio website." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4fc46877-e206-416d-ba47-6997aa9f483b/id-preview-df771c2d--fa33cfd3-63d6-421e-8785-085b8429207c.lovable.app-1782648765719.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4fc46877-e206-416d-ba47-6997aa9f483b/id-preview-df771c2d--fa33cfd3-63d6-421e-8785-085b8429207c.lovable.app-1782648765719.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: logoAsset.url },
      { rel: "apple-touch-icon", href: logoAsset.url },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RadioStation",
          name: "Radio Bezmiliana",
          description: "Emisora escolar del IES Bezmiliana.",
          logo: logoAsset.url,
          sameAs: [
            "https://instagram.com/radiobezmiliana",
            "https://youtube.com/@radiobezmiliana",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ScriptOnce>
          {`try{var t=localStorage.getItem('rb-theme');var d=t==='light'?false:true;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}`}
        </ScriptOnce>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AudioPlayerProvider>
          <SplashScreen />
          <Navbar />
          <main className="min-h-screen">
            {/* Required: nested routes render here. */}
            <Outlet />
          </main>
          <Footer />
          <BackToTop />
        </AudioPlayerProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
