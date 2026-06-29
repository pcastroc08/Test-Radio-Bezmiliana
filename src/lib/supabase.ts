import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kcrzhemxbsjdinkldpwk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjcnpoZW14YnNqZGlua2xkcHdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NDcxNDQsImV4cCI6MjA5ODIyMzE0NH0.7aF2iVHAShPN7lpZKkGvTMvzYEWOAIVgxtgly1FQBRg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type UserRole = "direccion" | "locutor" | "redaccion" | "tecnico" | "rrss";

export interface AppUser {
  id: string;
  email: string;
  nombre: string;
  rol: UserRole;
}

// ── Storage helper ───────────────────────────────────────────────────────────
const BUCKET = "media";
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export async function uploadMedia(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, TEN_YEARS);
  if (error || !data) throw error ?? new Error("No se pudo generar URL");
  return data.signedUrl;
}
