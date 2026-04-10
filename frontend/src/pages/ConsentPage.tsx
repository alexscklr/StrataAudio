import { useNavigate } from "react-router-dom";
import styles from "./styles/ConsentPage.module.css";
import mainPageStyles from "./styles/MainPageStyle.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/features/auth/context/AuthContext";
import { useTranslation } from 'react-i18next';


function ConsentPage() {
    const { t, i18n } = useTranslation();
    const [consentGiven, setConsentGiven] = useState(false);
    const [isSubmittingConsent, setIsSubmittingConsent] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const { initializeParticipant, participantId } = useContext(AuthContext);

    const isEn = i18n.resolvedLanguage?.startsWith('en');

    const content = isEn
        ? {
            title: 'Consent Declaration',
            topic: 'Topic: User-centered audio mixing of individual audio tracks for web videos',
            lead: 'Study lead: Alexander Sickler, Hamm-Lippstadt University of Applied Sciences (HSHL)',
            duration: 'Depending on your preference, this test takes about 10 to 30 minutes. Afterwards, you can continue watching and rating additional videos to support the research.',
            sections: {
                purposeTitle: 'Purpose of data collection',
                purposeText: 'The data collected through this survey/application is used solely for scientific analysis as part of my bachelor thesis. The goal is to evaluate requirements for an interactive browser-based audio mixer.',
                dataTypeTitle: 'Types of collected data',
                dataTypeLead: 'The following data is collected:',
                storageTitle: 'Storage and security (Supabase)',
                storageText: 'Data is stored in encrypted form in a database provided by Supabase, Inc.',
                voluntaryTitle: 'Voluntary participation and withdrawal',
                voluntaryText: 'Participation is voluntary. You may withdraw your consent at any time by closing the application.',
                sharingTitle: 'Data sharing',
                sharingText: 'Raw data is not shared with third parties. Results are published in aggregated form (statistics/charts) within the bachelor thesis.',
                consentTitle: 'Consent',
                consentText: 'By clicking [I agree], I confirm that I:',
            },
            bullets: {
                dataTypes: [
                    'Demographic data: age, gender, and information about your experience with audio technology.',
                    'Usage and interaction data: your video ratings and automated logs of your interaction with the audio mixer (e.g., timestamp and intensity of slider ratings, final audio configuration).',
                    'Technical data: browser type and device type, but no directly identifiable data such as name or email address (anonymous collection).',
                    'Anonymization: to avoid multiple participations, a technical user hash is generated. No IP addresses or directly identifiable data are stored.',
                ],
                storage: [
                    'Server location: data is stored in the EU region (Frankfurt, Germany) to meet GDPR requirements.',
                    'Security: Supabase uses modern security standards (AES-256 encryption) to protect data from unauthorized access.',
                ],
                consent: [
                    'I am at least 18 years old.',
                    'I have read and understood the information above.',
                    'I agree to the anonymized storage of my data on Supabase servers.',
                    'I agree that data collection starts immediately after consent.',
                ],
            },
            checkbox: 'I agree',
        }
        : {
            title: 'Einverstaendniserklaerung',
            topic: 'Thema: Nutzerzentriertes Audio-Mixing individueller Audio-Tracks fuer Videos im Web',
            lead: 'Studienleitung: Alexander Sickler, Hochschule Hamm-Lippstadt (HSHL)',
            duration: 'Der Test dauert je nach Wunsch etwa 10 bis 30 Minuten. Du hast anschliessend die Moeglichkeit, auch weitere Videos zu schauen und zu bewerten, um die Forschung zu unterstuetzen.',
            sections: {
                purposeTitle: 'Zweck der Datenerhebung',
                purposeText: 'Die im Rahmen dieser Umfrage/Anwendung erhobenen Daten dienen ausschliesslich der wissenschaftlichen Untersuchung im Rahmen meiner Bachelorarbeit. Ziel ist es, die Anforderungen an einen interaktiven Audio-Mixer im Browser zu evaluieren.',
                dataTypeTitle: 'Art der erhobenen Daten',
                dataTypeLead: 'Es werden folgende Daten erhoben:',
                storageTitle: 'Speicherung und Sicherheit (Supabase)',
                storageText: 'Die Speicherung der Daten erfolgt verschluesselt in einer Datenbank des Dienstleisters Supabase, Inc.',
                voluntaryTitle: 'Freiwilligkeit und Widerruf',
                voluntaryText: 'Die Teilnahme an dieser Umfrage/Anwendung ist freiwillig. Du kannst deine Einwilligung jederzeit widerrufen, indem du die Anwendung schliesst.',
                sharingTitle: 'Datenweitergabe',
                sharingText: 'Eine Weitergabe der Rohdaten an Dritte erfolgt nicht. Die Ergebnisse der Arbeit werden in aggregierter Form (Statistiken/Grafiken) in der Bachelorarbeit veroeffentlicht.',
                consentTitle: 'Einverstaendnis',
                consentText: 'Durch das Klicken auf [Ich stimme zu] bestaetige ich, dass ich:',
            },
            bullets: {
                dataTypes: [
                    'Demografische Daten: Alter, Geschlecht sowie Angaben zu deiner Erfahrung im Umgang mit Audiotechnik.',
                    'Nutzungs- und Interaktionsdaten: Deine Bewertungen der Videos sowie automatisierte Protokolle deiner Interaktion mit dem Audio-Mixer (z. B. Zeitpunkt und Intensitaet von Regler-Bewertungen, finale Audio-Konfiguration).',
                    'Technische Daten: Browsertyp und Geraetetyp, jedoch keine direkt identifizierbaren Daten wie Name oder E-Mail-Adresse (anonyme Erhebung).',
                    'Anonymisierung: Zur Vermeidung von Mehrfachteilnahmen wird ein technischer User-Hash generiert. Es werden keine IP-Adressen oder direkt identifizierbaren Daten gespeichert.',
                ],
                storage: [
                    'Serverstandort: Die Daten werden in der Region EU (Frankfurt, Deutschland) gespeichert, um den Anforderungen der DSGVO zu entsprechen.',
                    'Sicherheit: Supabase nutzt moderne Sicherheitsstandards (AES-256 Verschluesselung), um die Daten vor unbefugtem Zugriff zu schuetzen.',
                ],
                consent: [
                    'Das 18. Lebensjahr vollendet habe.',
                    'Die oben genannten Informationen gelesen und verstanden habe.',
                    'Mit der anonymisierten Speicherung meiner Daten auf den Servern von Supabase einverstanden bin.',
                    'Mit der Datenerhebung unmittelbar nach der Zustimmung einverstanden bin.',
                ],
            },
            checkbox: 'Ich stimme zu',
        };

    const navigate = useNavigate();

    const handleConsent = async () => {
        setSubmitError(null);
        setIsSubmittingConsent(true);

        try {
            await initializeParticipant();
            localStorage.setItem('user-consent', 'true');
            navigate('/demografie');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('consent.submitError');
            setSubmitError(errorMessage);
        } finally {
            setIsSubmittingConsent(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('user-consent') === 'true' && participantId) {
            navigate('/demografie');
        }
    }, [navigate, participantId]);

    return (
        <div className={`${styles.mainWrapper} ${mainPageStyles.sectionCounter} ${mainPageStyles.pageCard} ${mainPageStyles.leftAlignedParagraphs}`}>
            <header className={mainPageStyles.pageSection}>
                <h1 style={{ textAlign: "center" }}>{content.title}</h1>
                <h2>{content.topic}</h2>
                <p className={styles.subheader}>
                    {content.lead}<br />
                    Kontakt: <a href="mailto:alexander.sickler@stud.hshl.de">alexander.sickler@stud.hshl.de</a>
                </p>
                <p className={styles.subheader}>
                    {content.duration}
                </p>
            </header>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{content.sections.purposeTitle}</h2>
                <p>{content.sections.purposeText}</p>
            </section>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{content.sections.dataTypeTitle}</h2>
                <p>{content.sections.dataTypeLead}</p>
                <ul>
                    {content.bullets.dataTypes.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{content.sections.storageTitle}</h2>
                <p>{content.sections.storageText}</p>
                <ul>
                    {content.bullets.storage.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{content.sections.voluntaryTitle}</h2>
                <p>{content.sections.voluntaryText}</p>
            </section>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{content.sections.sharingTitle}</h2>
                <p>{content.sections.sharingText}</p>
            </section>
            <hr style={{ width: "stretch" }} />
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2 className={`${styles.consentHeader} ${mainPageStyles.noNumber}`}>{content.sections.consentTitle}</h2>
                <p>{content.sections.consentText}</p>
                <ul>
                    {content.bullets.consent.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>

            <div className={styles.consentInput}>
                <input type="checkbox" id="consentCheckbox" checked={consentGiven} onChange={(e) => setConsentGiven(e.target.checked)} />
                <label htmlFor="consentCheckbox">{content.checkbox}</label>
            </div>

            {submitError && <p>{submitError}</p>}

            {consentGiven ?
                <button type="button" onClick={handleConsent} className="primary" disabled={isSubmittingConsent}>
                    {isSubmittingConsent ? t('consent.wait') : t('consent.continue')}
                </button>
                : <button type="button" className="primary" disabled>{t('consent.mustConsent')}</button>}

        </div>
    );
}

export default ConsentPage;