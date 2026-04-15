import { useNavigate } from "react-router-dom";
import styles from "./styles/ConsentPage.module.css";
import mainPageStyles from "./styles/MainPageStyle.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/features/auth/context/AuthContext";
import { useTranslation } from 'react-i18next';
import { PageMeta } from "@/shared/components/Seo/PageMeta";


function ConsentPage() {
    const { t } = useTranslation();
    const [consentGiven, setConsentGiven] = useState(false);
    const [isSubmittingConsent, setIsSubmittingConsent] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const { initializeParticipant, participantId } = useContext(AuthContext);
    const dataTypeBullets = t('consentPage.bullets.dataTypes', { returnObjects: true }) as string[];
    const storageBullets = t('consentPage.bullets.storage', { returnObjects: true }) as string[];
    const consentBullets = t('consentPage.bullets.consent', { returnObjects: true }) as string[];

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
            <PageMeta title={t('seo.consent.title')} description={t('seo.consent.description')} />
            <header className={mainPageStyles.pageSection}>
                <h1 style={{ textAlign: "center" }}>{t('consentPage.title')}</h1>
                <p className={styles.subheader}>
                    {t('consentPage.surveyCircleNotice.prefix')}
                    <strong>SurveyCircle</strong>
                    {t('consentPage.surveyCircleNotice.suffix')}
                </p>
                <h2>{t('consentPage.topic')}</h2>
                <p className={styles.subheader}>
                    {t('consentPage.lead')}<br />
                    {t('consentPage.contactLabel')}: <a href="mailto:alexander.sickler@stud.hshl.de">alexander.sickler@stud.hshl.de</a>
                </p>
                <p className={styles.subheader}>
                    {t('consentPage.duration')}
                </p>
            </header>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{t('consentPage.sections.purposeTitle')}</h2>
                <p>{t('consentPage.sections.purposeText')}</p>
            </section>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{t('consentPage.sections.dataTypeTitle')}</h2>
                <p>{t('consentPage.sections.dataTypeLead')}</p>
                <ul>
                    {dataTypeBullets.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{t('consentPage.sections.storageTitle')}</h2>
                <p>{t('consentPage.sections.storageText')}</p>
                <ul>
                    {storageBullets.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{t('consentPage.sections.voluntaryTitle')}</h2>
                <p>{t('consentPage.sections.voluntaryText')}</p>
            </section>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{t('consentPage.sections.sharingTitle')}</h2>
                <p>{t('consentPage.sections.sharingText')}</p>
            </section>
            <hr style={{ width: "stretch" }} />
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2 className={`${styles.consentHeader} ${mainPageStyles.noNumber}`}>{t('consentPage.sections.consentTitle')}</h2>
                <p>{t('consentPage.sections.consentText')}</p>
                <ul>
                    {consentBullets.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>

            <div className={styles.consentInput}>
                <input type="checkbox" id="consentCheckbox" checked={consentGiven} onChange={(e) => setConsentGiven(e.target.checked)} />
                <label htmlFor="consentCheckbox">{t('consentPage.checkbox')}</label>
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