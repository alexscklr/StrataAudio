import { useContext, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/DemographicsSurvey.module.css";
import { demographicsSurvey } from "@/constants/demographicsSurvey";
import { getClientEnvironmentInfo } from "@/features/auth/lib/participantTracking";
import { markDemographicsCompleted } from "../utils/demographics";
import { AuthContext } from "@/features/auth/context/AuthContext";
import {
    createInitialDemographicsValues,
    hasMissingRequiredDemographicsAnswers,
} from "../utils/demographicsSurvey";
import { saveDemographics } from "../lib/demographicsQueries";
import SurveySectionList from "./questions/SurveySectionList";
import { useTranslation } from 'react-i18next';


function DemographicsSurvey() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { participantId } = useContext(AuthContext);
    const environmentInfo = useMemo(() => getClientEnvironmentInfo(), []);
    const [formValues, setFormValues] = useState(createInitialDemographicsValues);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitError(null);

        if (!participantId) {
            setSubmitError(t('demographics.missingParticipant'));
            return;
        }

        if (hasMissingRequiredDemographicsAnswers(formValues)) {
            setSubmitError(t('demographics.missingAnswers'));
            return;
        }

        setIsSubmitting(true);

        try {
            await saveDemographics({
                participantId,
                values: formValues,
            });

            markDemographicsCompleted();
            navigate('/videos');
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : t('demographics.submitFailed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field: string, value: string | number) => {
        setFormValues((currentValues) => ({
            ...currentValues,
            [field]: value,
        }));
    };


    return (
        <section className={styles.surveyShell}>
            <header className={styles.hero}>
                <span className={styles.eyebrow}>{t(demographicsSurvey.eyebrow)}</span>
                <h2>{t(demographicsSurvey.title)}</h2>
                <p>{t(demographicsSurvey.intro)}</p>
            </header>

            <section className={styles.transparencyCard}>
                <h3 className={styles.transparencyTitle}>{t('demographics.transparencyTitle')}</h3>
                <p className={styles.transparencyText}>{t('demographics.transparencyText')}</p>
                <div className={styles.metaGrid}>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>{t('demographics.metaBrowser')}</span>
                        <span className={styles.metaValue}>{environmentInfo.browserName}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>{t('demographics.metaBrowserVersion')}</span>
                        <span className={styles.metaValue}>{environmentInfo.browserVersion}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>{t('demographics.metaOs')}</span>
                        <span className={styles.metaValue}>{environmentInfo.osName}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>{t('demographics.metaOsVersion')}</span>
                        <span className={styles.metaValue}>{environmentInfo.osVersion}</span>
                    </div>
                </div>
            </section>

            <form onSubmit={handleSubmit} className={styles.surveyForm}>
                <SurveySectionList
                    sections={demographicsSurvey.sections}
                    answers={formValues}
                    onAnswer={updateField}
                />

                {submitError && <p className={styles.submitError}>{submitError}</p>}

                <div className={styles.submitRow}>
                    <button type="submit" className="primary" disabled={isSubmitting}>{isSubmitting ? t('common.saveInProgress') : t('demographics.submitButton')}</button>
                </div>
            </form>
        </section>
    );
};

export default DemographicsSurvey;