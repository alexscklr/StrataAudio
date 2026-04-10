
import { Fragment, useContext, useEffect, useMemo, useState, type FormEvent } from 'react';
import { AuthContext } from '@/features/auth/context/AuthContext';
import { endSurvey } from '@/constants/endSurvey';
import { fetchEndSurveyResponse, submitEndSurveyResponse } from '@/features/analytics/lib/endSurveyQueries';
import SurveyQuestionRenderer from '@/features/analytics/components/questions/SurveyQuestionRenderer';
import { createInitialAnswers, getAllQuestions, hasMissingRequiredAnswers, type SurveyAnswers } from '@/features/analytics/utils/surveyUtils';
import styles from '@/features/analytics/components/styles/VideoSurvey.module.css';

const MISSING_PARTICIPANT_ERROR = 'Participant-ID fehlt. Bitte Einverstaendnis erneut bestaetigen.';
const MISSING_ANSWERS_ERROR = 'Bitte beantworte alle Pflichtfragen, bevor du absendest.';
const LOAD_FAILED_ERROR = 'Bestehende Endumfrage konnte nicht geladen werden.';
const SUBMIT_FAILED_ERROR = 'Endumfrage konnte nicht gespeichert werden.';

function EndSurveyPage() {
    const { participantId } = useContext(AuthContext);

    const [answers, setAnswers] = useState<SurveyAnswers>(() => createInitialAnswers(endSurvey));
    const [isLoadingExisting, setIsLoadingExisting] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [hasExistingResponse, setHasExistingResponse] = useState(false);

    const surveyQuestions = useMemo(() => getAllQuestions(endSurvey), []);

    const updateAnswer = (questionId: string, value: string | number) => {
        setAnswers((currentAnswers) => ({
            ...currentAnswers,
            [questionId]: value,
        }));
    };

    useEffect(() => {
        let isMounted = true;

        const loadExisting = async () => {
            setSubmitError(null);

            if (!participantId) {
                setIsLoadingExisting(false);
                return;
            }

            try {
                const existingAnswers = await fetchEndSurveyResponse(participantId);

                if (!isMounted || !existingAnswers) {
                    return;
                }

                setAnswers((currentAnswers) => ({
                    ...currentAnswers,
                    ...existingAnswers,
                }));
                setHasExistingResponse(true);
            } catch {
                if (isMounted) {
                    setSubmitError(LOAD_FAILED_ERROR);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingExisting(false);
                }
            }
        };

        void loadExisting();

        return () => {
            isMounted = false;
        };
    }, [participantId]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitError(null);

        if (!participantId) {
            setSubmitError(MISSING_PARTICIPANT_ERROR);
            return;
        }

        if (hasMissingRequiredAnswers(surveyQuestions, answers)) {
            setSubmitError(MISSING_ANSWERS_ERROR);
            return;
        }

        setIsSubmitting(true);

        try {
            await submitEndSurveyResponse({
                participantId,
                survey: endSurvey,
                answers,
            });

            setSubmitted(true);
            setHasExistingResponse(true);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : SUBMIT_FAILED_ERROR);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={styles.surveyContainer}>
            <h2>Abschliessende Umfrage</h2>
            <p>
                Vielen Dank, dass du bis hierhin teilgenommen hast. Diese abschliessenden Fragen helfen,
                das gesamte Nutzungserlebnis zu bewerten.
            </p>
            {hasExistingResponse && <p>Du kannst deine Endumfrage jederzeit anpassen und erneut speichern.</p>}
            {isLoadingExisting && <p>Lade bestehende Endumfrage...</p>}

            <form onSubmit={handleSubmit} className={styles.surveyForm}>
                {endSurvey.sections.map((section) => (
                    <Fragment key={section.id}>
                        <h3>{section.title}</h3>
                        {section.description && <p>{section.description}</p>}
                        {section.questions.map((question) => (
                            <SurveyQuestionRenderer
                                key={question.id}
                                question={question}
                                answers={answers}
                                onAnswer={updateAnswer}
                            />
                        ))}
                        <div className={styles.spacer} />
                        <hr className={styles.questionDivider} />
                        <div className={styles.spacer} />
                    </Fragment>
                ))}

                {submitError && <p className={styles.submitError}>{submitError}</p>}
                {submitted && <p className={styles.submitSuccess}>Vielen Dank! Deine Endumfrage wurde gespeichert.</p>}

                <button type="submit" className="primary" disabled={isSubmitting || isLoadingExisting}>
                    {isSubmitting ? 'Speichere...' : hasExistingResponse ? 'Endumfrage aktualisieren' : 'Endumfrage absenden'}
                </button>
            </form>
        </section>
    );
}

export default EndSurveyPage;