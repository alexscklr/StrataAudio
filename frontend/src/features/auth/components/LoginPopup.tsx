import React, { useState, useContext } from "react";
import styles from "./LoginPopup.module.css";
import { AuthContext } from "@/features/auth/context/AuthContext";
import { signInWithPassword } from "../lib/authQueries";



const CloseButton: React.FC<{ onClick: () => void, popoverTarget: string }> = ({ onClick, popoverTarget }) => (
    <button popoverTarget={popoverTarget} popoverTargetAction="hide" className={styles.closeBtn} onClick={onClick}>X</button>
);

interface LoginPopupProps {
    popoverTarget: string;
}

export const LoginPopup: React.FC<LoginPopupProps> = ({ popoverTarget }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { user } = useContext(AuthContext);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await signInWithPassword({ email, password });
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Login fehlgeschlagen");
            } else {
                setError(String(err) || "Login fehlgeschlagen");
            }
        }
        setLoading(false);
    };

    return (
        <div popover="auto" id={popoverTarget}>
            <div className={styles.loginPopupBackdrop}>
                <div
                    className={styles.loginPopup}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="login-title"
                >
                    <CloseButton onClick={() => { }} popoverTarget={popoverTarget} />
                    <h2 id="login-title">Login</h2>
                    {!user ? (
                        <form className={styles.loginPopupForm} onSubmit={handleLogin}>
                            <label className={styles.loginPopupLabel} htmlFor="email">E-Mail</label>
                            <input
                                className={styles.loginPopupInput}
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="username"
                            />
                            <label className={styles.loginPopupLabel} htmlFor="password">Passwort</label>
                            <input
                                className={styles.loginPopupInput}
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                            {error && <p className={styles.error}>{error}</p>}
                            <button className={styles.loginPopupButton} type="submit" disabled={loading}>
                                {loading ? "Anmelden..." : "Anmelden"}
                            </button>
                        </form>
                    ) : (
                        <p>Du bist bereits angemeldet als {user.email}</p>
                    )}
                </div>
            </div>
        </div>
    );
};