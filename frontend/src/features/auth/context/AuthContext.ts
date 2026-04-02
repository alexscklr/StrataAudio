import { createContext } from "react";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  participantId: string | null;
  loading: boolean;
  initializeParticipant: () => Promise<string>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  participantId: null,
  loading: true,
  initializeParticipant: async () => '',
  logout: async () => {},
});