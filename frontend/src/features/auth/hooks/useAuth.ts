import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";
import { signOut } from "../lib/authQueries";
import { ensureParticipantExists, getStoredParticipantId } from '../lib/participantTracking';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [participantId, setParticipantId] = useState<string | null>(() => getStoredParticipantId());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        // Helper function to set user
        const updateAuthState = (session: Session | null) => {
            if (!isMounted) return;

            const currentUser = session?.user ?? null;
            setUser(currentUser);

            setLoading(false);
        };

        supabase.auth.getSession().then(({ data: { session } }) => {
            updateAuthState(session);
        });

        // 2. Listen to changes (Login, Logout, Token Refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event !== 'INITIAL_SESSION') {
                updateAuthState(session);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const logout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            // Clear local auth state immediately so the UI updates even if the event listener lags
            setUser(null);
        }
    };

    const initializeParticipant = async () => {
        const createdParticipantId = await ensureParticipantExists();
        setParticipantId(createdParticipantId);
        return createdParticipantId;
    };

    return { user, participantId, loading, initializeParticipant, logout };
};