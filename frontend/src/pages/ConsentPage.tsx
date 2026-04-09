import { useNavigate } from "react-router-dom";
import styles from "./styles/ConsentPage.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/features/auth/context/AuthContext";


function ConsentPage() {
    const [consentGiven, setConsentGiven] = useState(false);
    const [isSubmittingConsent, setIsSubmittingConsent] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const { initializeParticipant } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleConsent = async () => {
        setSubmitError(null);
        setIsSubmittingConsent(true);

        try {
            await initializeParticipant();
            localStorage.setItem('user-consent', 'true');
            navigate('/demografie');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Teilnehmer konnte nicht angelegt werden.';
            setSubmitError(errorMessage);
        } finally {
            setIsSubmittingConsent(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('user-consent') === 'true') {
            navigate('/demografie');
        }
    }, [navigate]);

    return (
        <div className={styles.mainWrapper}>

            <header className={styles.projectInfo}>
                <h1 style={{ textAlign: "center" }}>Einverständniserklärung</h1>
                <h2>Thema: Nutzerzentriertes Audio-Mixing individueller Audio-Tracks für Videos im Web</h2>
                <p className={styles.subheader}>Studienleitung: Alexander Sickler, Hochschule Hamm-Lippstadt (HSHL)</p>
            </header>
            <section className={styles.projectInfo}>
                <h2>Zweck der Datenerhebung</h2>
                <p>Die im Rahmen dieser Umfrage/Anwendung erhobenen Daten dienen ausschließlich der wissenschaftlichen Untersuchung im Rahmen meiner Bachelorarbeit. Ziel ist es, die Anforderungen an einen interaktiven Audio-Mixer im Browser zu evaluieren.</p>
            </section>
            <section className={styles.projectInfo}>
                <h2>Art der erhobenen Daten</h2>
                <p>
                    Es werden folgende Daten erhoben:
                </p>
                <ul>
                    <li>Nutzungsdaten: Deine Antworten auf die Fragen zur Audio-Wahrnehmung und Gerätenutzung.</li>
                    <li>Technische Daten: Browsertyp, jedoch keine direkt identifizierbaren Daten wie Name oder E-Mail-Adresse (Anonyme Erhebung).</li>
                    <li>IP-Adressen: Diese werden zur Vermeidung von Mehrfachteilnahmen technisch verarbeitet, aber nicht dauerhaft mit deinen Antworten verknüpft gespeichert.</li>
                </ul>
            </section>
            <section className={styles.projectInfo}>
                <h2>Speicherung und Sicherheit (Supabase)</h2>
                <p>
                    Die Speicherung der Daten erfolgt verschlüsselt in einer Datenbank des Dienstleisters Supabase, Inc.

                </p>
                <ul>
                    <li>Serverstandort: Die Daten werden in der Region EU (Frankfurt, Deutschland) gespeichert, um an den Anforderungen der DSGVO zu entsprechen.</li>
                    <li>Sicherheit: Supabase nutzt moderne Sicherheitsstandards (AES-256 Verschlüsselung), um die Daten vor unbefugtem Zugriff zu schützen.</li>
                </ul>
            </section>
            <section className={styles.projectInfo}>
                <h2>Freiwilligkeit und Widerruf</h2>
                <p>Die Teilnahme an dieser Umfrage/Anwendung ist freiwillig. Du kannst deine Einwilligung jederzeit widerrufen, indem du die Anwendung schließt oder deine Daten löschst.</p>
            </section>
            <section className={styles.projectInfo}>
                <h2>Datenweitergabe</h2>
                <p>Eine Weitergabe der Rohdaten an Dritte erfolgt nicht. Die Ergebnisse der Arbeit werden in aggregierter Form (Statistiken/Grafiken) in der Bachelorarbeit veröffentlicht.</p>
            </section>
            <hr style={{ width: "stretch" }} />
            <section className={styles.projectInfo}>
                <h2 className={`${styles.consentHeader} ${styles.noNumber}`}>Einverständnis</h2>
                <p>Durch das Klicken auf [Ich stimme zu] bestätige ich, dass ich:</p>
                <ul>
                    <li>Das 18. Lebensjahr vollendet habe.</li>
                    <li>Die oben genannten Informationen gelesen und verstanden habe.</li>
                    <li>Mit der anonymisierten Speicherung meiner Daten auf den Servern von Supabase einverstanden bin.</li>
                </ul>
            </section>

            <div className={styles.consentInput}>
                <input type="checkbox" id="consentCheckbox" checked={consentGiven} onChange={(e) => setConsentGiven(e.target.checked)} />
                <label htmlFor="consentCheckbox">Ich stimme zu</label>
            </div>

            {submitError && <p>{submitError}</p>}

            {consentGiven ?
                <button type="button" onClick={handleConsent} className="primary" disabled={isSubmittingConsent}>
                    {isSubmittingConsent ? 'Bitte warten...' : 'Einverstanden und Fortfahren'}
                </button>
                : <button type="button" className="primary" disabled>Bitte zustimmen</button>}

        </div>
    );
}

export default ConsentPage;