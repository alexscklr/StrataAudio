import mainPageStyles from "./styles/MainPageStyle.module.css";
import { useTranslation } from 'react-i18next';
import { PageMeta } from '@/shared/components/Seo/PageMeta';

function PrivacyPolicyPage() {
    const { i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage?.startsWith('en');

    return (
        <div className={`${mainPageStyles.pageCard} ${mainPageStyles.leftAlignedParagraphs} ${mainPageStyles.sectionCounter}`}>
            <PageMeta title={isEn ? 'Privacy Policy' : 'Datenschutzerklaerung'} description={isEn ? 'Privacy information about data processing within the StrataAudio research study.' : 'Datenschutzhinweise zur Verarbeitung personenbezogener Daten innerhalb der StrataAudio-Forschungsstudie.'} />
            <header className={mainPageStyles.pageSection}>
                <h1>{isEn ? 'Privacy Policy' : 'Datenschutzerklaerung'}</h1>
                <p>
                    {isEn
                        ? 'This privacy policy informs you about the type, scope, and purpose of processing personal data within this scientific web application.'
                        : 'Diese Datenschutzerklaerung informiert Sie ueber die Art, den Umfang und Zweck der Verarbeitung personenbezogener Daten im Rahmen dieser wissenschaftlichen Webanwendung.'}
                </p>
                <p>
                    {isEn ? 'Version: 2026-04-10' : 'Stand: 10.04.2026'}
                </p>
            </header>

            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{isEn ? 'Controller' : 'Verantwortlicher'}</h2>
                <p>
                    Alexander Sickler<br />
                    Nepomukstraße 76<br />
                    59556 Lippstadt<br />
                    E-Mail: alexander.sickler@stud.hshl.de
                </p>
            </section>

            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{isEn ? 'Purpose and legal basis of processing' : 'Zweck und Rechtsgrundlage der Verarbeitung'}</h2>
                <p>
                    {isEn
                        ? 'Data processing is carried out solely for scientific purposes within a bachelor thesis at Hamm-Lippstadt University of Applied Sciences (HSHL). Collected data is used to evaluate requirements for interactive web audio mixers.'
                        : 'Die Datenverarbeitung erfolgt ausschliesslich zu wissenschaftlichen Zwecken im Rahmen einer Bachelorarbeit an der Hochschule Hamm-Lippstadt (HSHL). Die erhobenen Daten dienen der Evaluation von Anforderungen an interaktive Audio-Mixer im Web.'}
                </p>
                <ul>
                    <li>{isEn ? 'Execution of the scientific study and operation of the application.' : 'Durchfuehrung der wissenschaftlichen Studie und Bereitstellung der Anwendung.'}</li>
                    <li>{isEn ? 'Analysis of interaction and survey results regarding audio perception.' : 'Auswertung von Interaktions- und Umfrageergebnissen zur Audio-Wahrnehmung.'}</li>
                    <li>{isEn ? 'Ensuring technical operation and preventing multiple participations.' : 'Sicherstellung des technischen Betriebs und Vermeidung von Mehrfachteilnahmen.'}</li>
                </ul>
                <p>
                    <strong>{isEn ? 'Legal basis:' : 'Rechtsgrundlage:'}</strong> {isEn ? 'Processing is based on your voluntary consent according to Art. 6(1)(a) GDPR.' : 'Die Verarbeitung erfolgt auf Basis Ihrer freiwilligen Einwilligung gemaess Art. 6 Abs. 1 lit. a DSGVO.'}
                </p>
            </section>

            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{isEn ? 'Types of collected data' : 'Art der erhobenen Daten'}</h2>
                <p>
                    {isEn ? 'Data collection starts immediately after your explicit consent. The following data is processed:' : 'Die Erhebung der Daten beginnt unmittelbar nach Ihrer ausdruecklichen Zustimmung. Folgende Daten werden verarbeitet:'}
                </p>
                <ul>
                    <li><strong>{isEn ? 'Demographic data:' : 'Demografische Angaben:'}</strong> {isEn ? 'Age, gender, and audio-related experience.' : 'Alter, Geschlecht und Erfahrung im Audio-Bereich.'}</li>
                    <li><strong>{isEn ? 'Usage and interaction data:' : 'Nutzungs- und Interaktionsdaten:'}</strong> {isEn ? 'Logging slider movements (timestamps, values), selected audio settings, and responses to video surveys.' : 'Protokollierung von Reglerbewegungen (Zeitstempel, Werte), gewaehlte Audio-Einstellungen und Antworten zu den Video-Umfragen.'}</li>
                    <li><strong>{isEn ? 'Technical metadata:' : 'Technische Metadaten:'}</strong> {isEn ? 'Browser type and device type (e.g., smartphone/PC).' : 'Browsertyp und Geraetetyp (z. B. Smartphone/PC).'}</li>
                    <li><strong>{isEn ? 'Anonymization:' : 'Anonymisierung:'}</strong> {isEn ? 'No IP addresses or directly identifiable data (names, emails) are stored permanently. A technical user hash is used to avoid multiple participations.' : 'Es werden keine IP-Adressen oder direkt identifizierbaren Daten (Namen, E-Mails) dauerhaft gespeichert. Zur Vermeidung von Mehrfachteilnahmen wird ein technischer User-Hash verwendet.'}</li>
                </ul>
            </section>

            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{isEn ? 'Retention and deletion' : 'Speicherdauer und Loeschung'}</h2>
                <p>
                    <strong>{isEn ? 'Hosting and infrastructure:' : 'Hosting und Infrastruktur:'}</strong> {isEn ? 'This application uses services by' : 'Diese Anwendung nutzt die Dienste von'}
                    <strong> Supabase, Inc.</strong> {isEn ? 'to store collected research data. Data processing is performed on servers in the Frankfurt region (Germany). More information about Supabase privacy can be found at:' : 'zur Speicherung der erhobenen Forschungsdaten. Die Datenverarbeitung erfolgt auf Servern in der Region Frankfurt (Deutschland). Weitere Informationen zum Datenschutz bei Supabase finden Sie unter:'}
                    <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
                        https://supabase.com/privacy
                    </a>.
                </p>
                <p>
                    <strong>{isEn ? 'Planned retention period:' : 'Geplante Speicherdauer:'}</strong> {isEn ? 'Data is stored until final completion of the bachelor thesis examination process and then deleted.' : 'Die Daten werden bis zum endgueltigen Abschluss des Pruefungsverfahrens der Bachelorarbeit gespeichert und anschliessend geloescht.'}
                </p>
                <p>
                    <strong>{isEn ? 'Withdrawal note:' : 'Hinweis zum Widerruf:'}</strong> {isEn ? 'Because collection is anonymized, data cannot be technically assigned to a specific person after survey submission. Subsequent identification or deletion of individual records is therefore not possible. Partial data from aborted sessions is also analyzed scientifically to investigate dropout reasons.' : 'Da die Erhebung anonymisiert erfolgt, koennen Daten nach dem Absenden der Umfrage technisch nicht mehr einer spezifischen Person zugeordnet werden. Eine nachtraegliche Identifizierung oder Loeschung einzelner Datensaetze ist daher nicht moeglich. Teil-Datensaetze von abgebrochenen Sitzungen werden zur Untersuchung von Abbruchgruenden ebenfalls wissenschaftlich ausgewertet.'}
                </p>
            </section>

            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{isEn ? 'Your rights' : 'Ihre Rechte'}</h2>
                <p>
                    {isEn ? 'Under GDPR, you are entitled to the following rights in particular:' : 'Ihnen stehen nach der DSGVO insbesondere folgende Rechte zu:'}
                </p>
                <ul>
                    <li>{isEn ? 'Access to processed data (Art. 15 GDPR).' : 'Auskunft ueber die verarbeiteten Daten (Art. 15 DSGVO).'}</li>
                    <li>{isEn ? 'Rectification of inaccurate data (Art. 16 GDPR).' : 'Berichtigung unrichtiger Daten (Art. 16 DSGVO).'}</li>
                    <li>{isEn ? 'Deletion of your data (Art. 17 GDPR - where technically possible through identifiability).' : 'Loeschung Ihrer Daten (Art. 17 DSGVO - sofern technisch durch Identifizierbarkeit moeglich).'}</li>
                    <li>{isEn ? 'Withdrawal of granted consent with effect for the future (Art. 7(3) GDPR).' : 'Widerruf einer erteilten Einwilligung mit Wirkung fuer die Zukunft (Art. 7 Abs. 3 DSGVO).'}</li>
                </ul>
                <p>
                    {isEn ? 'You also have the right to lodge a complaint with a data protection supervisory authority.' : 'Zudem haben Sie das Recht, sich bei einer Datenschutzaufsichtsbehoerde (z. B. dem Landesbeauftragten fuer Datenschutz und Informationsfreiheit Nordrhein-Westfalen) zu beschweren.'}
                </p>
            </section>
        </div>
    );
}

export default PrivacyPolicyPage;