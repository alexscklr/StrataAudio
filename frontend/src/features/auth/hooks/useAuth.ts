import { useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { signOut } from "../lib/authQueries";

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        // Helper function to set user
        const updateAuthState = async (session: any) => {
            if (!isMounted) return;

            const currentUser = session?.user ?? null;
            setUser(currentUser);

            setLoading(false);
        };

        // 1. Get current session on mount
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

    return { user, loading, logout };
};