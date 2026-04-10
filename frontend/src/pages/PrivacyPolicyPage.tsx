import mainPageStyles from "./styles/MainPageStyle.module.css";

function PrivacyPolicyPage() {
    return (
        <div className={`${mainPageStyles.pageCard} ${mainPageStyles.leftAlignedParagraphs} ${mainPageStyles.sectionCounter}`}>
            <header className={mainPageStyles.pageSection}>
                <h1>Datenschutzerklärung</h1>
                <p>
                    Diese Datenschutzerklärung informiert Sie über die Art, den Umfang und Zweck der Verarbeitung
                    personenbezogener Daten im Rahmen dieser wissenschaftlichen Webanwendung.
                </p>
                <p>
                    Stand: 10.04.2026
                </p>
            </header>

            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>Verantwortlicher</h2>
                <p>
                    Alexander Sickler<br />
                    Nepomukstraße 76<br />
                    59556 Lippstadt<br />
                    E-Mail: alexander.sickler@stud.hshl.de
                </p>
            </section>

            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>Zweck und Rechtsgrundlage der Verarbeitung</h2>
                <p>
                    Die Datenverarbeitung erfolgt ausschließlich zu wissenschaftlichen Zwecken im Rahmen einer Bachelorarbeit an der Hochschule Hamm-Lippstadt (HSHL). Die erhobenen Daten dienen der Evaluation von Anforderungen an interaktive Audio-Mixer im Web.
                </p>
                <ul>
                    <li>Durchführung der wissenschaftlichen Studie und Bereitstellung der Anwendung.</li>
                    <li>Auswertung von Interaktions- und Umfrageergebnissen zur Audio-Wahrnehmung.</li>
                    <li>Sicherstellung des technischen Betriebs und Vermeidung von Mehrfachteilnahmen.</li>
                </ul>
                <p>
                    <strong>Rechtsgrundlage:</strong> Die Verarbeitung erfolgt auf Basis Ihrer freiwilligen Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO.
                </p>
            </section>

            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>Art der erhobenen Daten</h2>
                <p>
                    Die Erhebung der Daten beginnt unmittelbar nach Ihrer ausdrücklichen Zustimmung. Folgende Daten werden verarbeitet:
                </p>
                <ul>
                    <li><strong>Demografische Angaben:</strong> Alter, Geschlecht und Erfahrung im Audio-Bereich.</li>
                    <li><strong>Nutzungs- und Interaktionsdaten:</strong> Protokollierung von Reglerbewegungen (Zeitstempel, Werte), gewählte Audio-Einstellungen und Antworten zu den Video-Umfragen.</li>
                    <li><strong>Technische Metadaten:</strong> Browsertyp und Gerätetyp (z. B. Smartphone/PC).</li>
                    <li><strong>Anonymisierung:</strong> Es werden keine IP-Adressen oder direkt identifizierbaren Daten (Namen, E-Mails) dauerhaft gespeichert. Zur Vermeidung von Mehrfachteilnahmen wird ein technischer User-Hash verwendet.</li>
                </ul>
            </section>

            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>Speicherdauer und Löschung</h2>
                <p>
                    <strong>Hosting und Infrastruktur:</strong> Diese Anwendung nutzt die Dienste von
                    <strong> Supabase, Inc.</strong> zur Speicherung der erhobenen Forschungsdaten.
                    Die Datenverarbeitung erfolgt auf Servern in der Region Frankfurt (Deutschland).
                    Weitere Informationen zum Datenschutz bei Supabase finden Sie unter:
                    <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
                        https://supabase.com/privacy
                    </a>.
                </p>
                <p>
                    <strong>Geplante Speicherdauer:</strong> Die Daten werden bis zum endgültigen Abschluss des Prüfungsverfahrens der Bachelorarbeit gespeichert und anschließend gelöscht.
                </p>
                <p>
                    <strong>Hinweis zum Widerruf:</strong> Da die Erhebung anonymisiert erfolgt, können Daten nach dem Absenden der Umfrage technisch nicht mehr einer spezifischen Person zugeordnet werden. Eine nachträgliche Identifizierung oder Löschung einzelner Datensätze ist daher nicht möglich. Teil-Datensätze von abgebrochenen Sitzungen werden zur Untersuchung von Abbruchgründen ebenfalls wissenschaftlich ausgewertet.
                </p>
            </section>

            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>Ihre Rechte</h2>
                <p>
                    Ihnen stehen nach der DSGVO insbesondere folgende Rechte zu:
                </p>
                <ul>
                    <li>Auskunft über die verarbeiteten Daten (Art. 15 DSGVO).</li>
                    <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO).</li>
                    <li>Löschung Ihrer Daten (Art. 17 DSGVO - sofern technisch durch Identifizierbarkeit möglich).</li>
                    <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO).</li>
                </ul>
                <p>
                    Zudem haben Sie das Recht, sich bei einer Datenschutzaufsichtsbehörde (z. B. dem Landesbeauftragten für Datenschutz und Informationsfreiheit Nordrhein-Westfalen) zu beschweren.
                </p>
            </section>
        </div>
    );
}

export default PrivacyPolicyPage;