import {type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { useAuth } from "../hooks/useAuth";



export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, participantId, loading, initializeParticipant, logout } = useAuth();

  return (
    <AuthContext.Provider value={{ user, participantId, loading, initializeParticipant, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
