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
