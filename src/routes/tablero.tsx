import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import {
  Lock, LogOut, Plus, Trash2, Pencil, X, Check,
  Eye, EyeOff, GripVertical,
} from "lucide-react";

export const Route = createFileRoute("/tablero")({
  head: () => ({ meta: [{ title: "Tablero — Radio Bezmiliana" }] }),
  component: TableroPage,
});

// ─── login ────────────────────────────────────────────────────────────────────

function LoginForm({ onLogin }: { onLogin: (s: Session) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError("Credenciales incorrectas."); return; }
    if (data.session) onLogin(data.session);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="glass-strong w-full max-w-sm rounded-3xl border border-white/10 p-8">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/20 text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl font-bold">Acceso al tablero</h2>
          <p className="text-center text-sm text-muted-foreground">Solo para miembros de Radio Bezmiliana</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@email.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contraseña</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30" />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && <p className="rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.02] disabled:opacity-60">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── types ────────────────────────────────────────────────────────────────────

type Columna = { id: string; titulo: string; orden: number };
type Tarjeta = { id: string; columna_id: string; titulo: string; descripcion: string | null; color: string; orden: number };

const COLORES: { key: string; label: string; bg: string; border: string }[] = [
  { key: "default", label: "Sin color",  bg: "bg-white/5",      border: "border-white/10" },
  { key: "red",     label: "Rojo",       bg: "bg-red-500/15",   border: "border-red-500/30" },
  { key: "yellow",  label: "Amarillo",   bg: "bg-yellow-500/15",border: "border-yellow-500/30" },
  { key: "green",   label: "Verde",      bg: "bg-green-500/15", border: "border-green-500/30" },
  { key: "blue",    label: "Azul",       bg: "bg-blue-500/15",  border: "border-blue-500/30" },
  { key: "purple",  label: "Morado",     bg: "bg-purple-500/15",border: "border-purple-500/30" },
];

function colorClasses(color: string) {
  return COLORES.find(c => c.key === color) ?? COLORES[0];
}

// ─── TarjetaCard ──────────────────────────────────────────────────────────────

function TarjetaCard({ tarjeta, onEdit, onDelete }: { tarjeta: Tarjeta; onEdit: () => void; onDelete: () => void }) {
  const { bg, border } = colorClasses(tarjeta.color);
  return (
    <div className={`group rounded-2xl border ${border} ${bg} px-4 py-3 transition hover:shadow-md`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug">{tarjeta.titulo}</p>
        <div className="flex shrink-0 gap-0.5 opacity-0 transition group-hover:opacity-100">
          <button onClick={onEdit} className="grid h-6 w-6 place-items-center rounded-lg text-muted-foreground hover:bg-white/10 hover:text-foreground">
            <Pencil className="h-3 w-3" />
          </button>
          <button onClick={onDelete} className="grid h-6 w-6 place-items-center rounded-lg text-muted-foreground hover:bg-red-500/20 hover:text-red-400">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
      {tarjeta.descripcion && (
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{tarjeta.descripcion}</p>
      )}
    </div>
  );
}

// ─── TarjetaForm ─────────────────────────────────────────────────────────────

function TarjetaForm({ inicial, onSave, onClose }: {
  inicial?: Partial<Tarjeta>;
  onSave: (data: { titulo: string; descripcion: string; color: string }) => void;
  onClose: () => void;
}) {
  const [titulo, setTitulo] = useState(inicial?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? "");
  const [color, setColor] = useState(inicial?.color ?? "default");

  return (
    <div className="space-y-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título de la tarjeta"
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary/50" autoFocus />
      <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción (opcional)" rows={2}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none" />
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color</p>
        <div className="flex flex-wrap gap-2">
          {COLORES.map(c => (
            <button key={c.key} onClick={() => setColor(c.key)} title={c.label}
              className={`h-6 w-6 rounded-full border-2 transition ${c.bg} ${color === c.key ? "border-primary scale-110" : "border-white/20"}`} />
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:bg-white/5">Cancelar</button>
        <button onClick={() => { if (titulo.trim()) onSave({ titulo: titulo.trim(), descripcion: descripcion.trim(), color }); }}
          disabled={!titulo.trim()}
          className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">
          <Check className="h-3 w-3" /> Guardar
        </button>
      </div>
    </div>
  );
}

// ─── Columna ──────────────────────────────────────────────────────────────────

function ColumnaBoard({ columna, tarjetas, onDeleteColumna, onRefresh }: {
  columna: Columna;
  tarjetas: Tarjeta[];
  onDeleteColumna: (id: string) => void;
  onRefresh: () => void;
}) {
  const [editandoTitulo, setEditandoTitulo] = useState(false);
  const [titulo, setTitulo] = useState(columna.titulo);
  const [addingCard, setAddingCard] = useState(false);
  const [editingCard, setEditingCard] = useState<Tarjeta | null>(null);

  async function saveTitulo() {
    if (!titulo.trim()) { setTitulo(columna.titulo); setEditandoTitulo(false); return; }
    await supabase.from("tablero_columnas").update({ titulo: titulo.trim() }).eq("id", columna.id);
    setEditandoTitulo(false);
    onRefresh();
  }

  async function addTarjeta(data: { titulo: string; descripcion: string; color: string }) {
    await supabase.from("tablero_tarjetas").insert({ columna_id: columna.id, titulo: data.titulo, descripcion: data.descripcion || null, color: data.color, orden: tarjetas.length });
    setAddingCard(false);
    onRefresh();
  }

  async function saveTarjeta(id: string, data: { titulo: string; descripcion: string; color: string }) {
    await supabase.from("tablero_tarjetas").update({ titulo: data.titulo, descripcion: data.descripcion || null, color: data.color }).eq("id", id);
    setEditingCard(null);
    onRefresh();
  }

  async function deleteTarjeta(id: string) {
    if (!confirm("¿Eliminar esta tarjeta?")) return;
    await supabase.from("tablero_tarjetas").delete().eq("id", id);
    onRefresh();
  }

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      {/* Cabecera columna */}
      <div className="flex items-center justify-between gap-2">
        {editandoTitulo ? (
          <input value={titulo} onChange={e => setTitulo(e.target.value)} onBlur={saveTitulo}
            onKeyDown={e => { if (e.key === "Enter") saveTitulo(); if (e.key === "Escape") { setTitulo(columna.titulo); setEditandoTitulo(false); } }}
            className="flex-1 rounded-lg border border-primary/40 bg-white/10 px-2 py-1 text-sm font-semibold outline-none" autoFocus />
        ) : (
          <button onClick={() => setEditandoTitulo(true)} className="flex-1 text-left text-sm font-bold tracking-tight hover:text-primary transition truncate">
            {columna.titulo}
          </button>
        )}
        <div className="flex shrink-0 gap-1">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-xs font-semibold text-muted-foreground">{tarjetas.length}</span>
          <button onClick={() => { if (confirm(`¿Eliminar la columna "${columna.titulo}" y todas sus tarjetas?`)) onDeleteColumna(columna.id); }}
            className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-red-500/20 hover:text-red-400 transition">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Tarjetas */}
      <div className="flex flex-col gap-2">
        {tarjetas.map(t => (
          editingCard?.id === t.id ? (
            <TarjetaForm key={t.id} inicial={t} onSave={data => saveTarjeta(t.id, data)} onClose={() => setEditingCard(null)} />
          ) : (
            <TarjetaCard key={t.id} tarjeta={t} onEdit={() => setEditingCard(t)} onDelete={() => deleteTarjeta(t.id)} />
          )
        ))}
        {addingCard && <TarjetaForm onSave={addTarjeta} onClose={() => setAddingCard(false)} />}
      </div>

      {/* Añadir tarjeta */}
      {!addingCard && !editingCard && (
        <button onClick={() => setAddingCard(true)}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground">
          <Plus className="h-3.5 w-3.5" /> Añadir tarjeta
        </button>
      )}
    </div>
  );
}

// ─── Tablero ──────────────────────────────────────────────────────────────────

function Tablero() {
  const [columnas, setColumnas] = useState<Columna[]>([]);
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [nuevaColumna, setNuevaColumna] = useState("");
  const [addingCol, setAddingCol] = useState(false);

  useEffect(() => {
    fetchAll();
    const channel = supabase.channel("tablero-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "tablero_columnas" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "tablero_tarjetas" }, fetchAll)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchAll() {
    const [{ data: cols }, { data: cards }] = await Promise.all([
      supabase.from("tablero_columnas").select("*").order("orden"),
      supabase.from("tablero_tarjetas").select("*").order("orden"),
    ]);
    setColumnas(cols ?? []);
    setTarjetas(cards ?? []);
    setLoading(false);
  }

  async function addColumna() {
    if (!nuevaColumna.trim()) return;
    await supabase.from("tablero_columnas").insert({ titulo: nuevaColumna.trim(), orden: columnas.length });
    setNuevaColumna("");
    setAddingCol(false);
    fetchAll();
  }

  async function deleteColumna(id: string) {
    await supabase.from("tablero_columnas").delete().eq("id", id);
    fetchAll();
  }

  if (loading) return <div className="py-20 text-center text-muted-foreground">Cargando tablero...</div>;

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Tablero horizontal con scroll */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columnas.map(col => (
          <ColumnaBoard
            key={col.id}
            columna={col}
            tarjetas={tarjetas.filter(t => t.columna_id === col.id)}
            onDeleteColumna={deleteColumna}
            onRefresh={fetchAll}
          />
        ))}

        {/* Añadir columna */}
        <div className="w-72 shrink-0">
          {addingCol ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
              <input value={nuevaColumna} onChange={e => setNuevaColumna(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addColumna(); if (e.key === "Escape") { setAddingCol(false); setNuevaColumna(""); } }}
                placeholder="Nombre de la columna"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary/50" autoFocus />
              <div className="flex justify-end gap-2">
                <button onClick={() => { setAddingCol(false); setNuevaColumna(""); }} className="rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:bg-white/5">Cancelar</button>
                <button onClick={addColumna} disabled={!nuevaColumna.trim()}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">
                  <Check className="h-3 w-3" /> Crear
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingCol(true)}
              className="flex w-full items-center gap-2 rounded-3xl border border-dashed border-white/20 px-4 py-4 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground">
              <Plus className="h-4 w-4" /> Nueva columna
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

function TableroPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setChecking(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (checking) return null;
  if (!session) return <LoginForm onLogin={setSession} />;

  return (
    <div className="min-h-screen pt-24 pb-10">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Tablero</p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">Radio Bezmiliana</h1>
          </div>
          <button onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-1.5 text-sm font-medium text-muted-foreground transition hover:border-primary/30 hover:text-foreground">
            <LogOut className="h-3.5 w-3.5" /> Salir
          </button>
        </div>
        <Tablero />
      </div>
    </div>
  );
}
