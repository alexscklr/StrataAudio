import { supabase } from "@/api/supabaseClient";

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Meldet einen User mit E-Mail und Passwort an
 */
export async function signInWithPassword({ email, password }: LoginCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

/**
 * Meldet den aktuellen User ab
 */
export async function signOut() {
  // Ensure refresh token is revoked across all sessions and local storage cleared
  const { error } = await supabase.auth.signOut({ scope: 'global' });
  if (error) throw error;
}

/**
 * Holt die aktuelle Session
 */
async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data;
}