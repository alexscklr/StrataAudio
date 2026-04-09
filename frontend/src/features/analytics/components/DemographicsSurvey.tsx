import { Fragment, useContext, useMemo, useState, type FormEvent } from "react";
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
import SurveyQuestionRenderer from "./questions/SurveyQuestionRenderer";

const MISSING_PARTICIPANT_ERROR = 'Participant-ID fehlt. Bitte Einverstaendnis erneut bestaetigen.';
const MISSING_ANSWERS_ERROR = 'Bitte beantworte die Pflichtfragen, bevor du fortfaehrst.';
const SUBMIT_FAILED_ERROR = 'Die Angaben konnten nicht gespeichert werden.';


function DemographicsSurvey() {
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
            setSubmitError(MISSING_PARTICIPANT_ERROR);
            return;
        }

        if (hasMissingRequiredDemographicsAnswers(formValues)) {
            setSubmitError(MISSING_ANSWERS_ERROR);
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
            setSubmitError(error instanceof Error ? error.message : SUBMIT_FAILED_ERROR);
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
                <span className={styles.eyebrow}>{demographicsSurvey.eyebrow}</span>
                <h2>{demographicsSurvey.title}</h2>
                <p>{demographicsSurvey.intro}</p>
            </header>

            <section className={styles.transparencyCard}>
                <h3 className={styles.transparencyTitle}>Transparenz zu automatisch erfassten technischen Daten</h3>
                <p className={styles.transparencyText}>Beim Anlegen der Teilnahme wurden technische Basisdaten automatisch erfasst. Diese Angaben sind hier nur zur Einsicht ausgegraut dargestellt und können von dir nicht bearbeitet werden.</p>
                <div className={styles.metaGrid}>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Browser</span>
                        <span className={styles.metaValue}>{environmentInfo.browserName}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Browser-Version</span>
                        <span className={styles.metaValue}>{environmentInfo.browserVersion}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Betriebssystem</span>
                        <span className={styles.metaValue}>{environmentInfo.osName}</span>
                    </div>
                    <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>OS-Version</span>
                        <span className={styles.metaValue}>{environmentInfo.osVersion}</span>
                    </div>
                </div>
            </section>

            <form onSubmit={handleSubmit} className={styles.surveyForm}>
                {demographicsSurvey.sections.map((section) => (
                    <Fragment key={section.id}>
                        {section.title && <h3>{section.title}</h3>}
                        {section.description && <p>{section.description}</p>}
                        {section.questions.map((question) => (
                            <SurveyQuestionRenderer
                                key={question.id}
                                question={question}
                                answers={formValues}
                                onAnswer={updateField}
                            />
                        ))}
                    </Fragment>
                ))}

                {submitError && <p className={styles.submitError}>{submitError}</p>}

                <div className={styles.submitRow}>
                    <p className={styles.submitHint}>{demographicsSurvey.submitHint}</p>
                    <button type="submit" className="primary" disabled={isSubmitting}>{isSubmitting ? 'Speichere...' : 'Weiter zum Katalog'}</button>
                </div>
            </form>
        </section>
    );
};

export default DemographicsSurvey;