
import { Fragment, useContext, useEffect, useMemo, useState, type FormEvent } from 'react';
import { AuthContext } from '@/features/auth/context/AuthContext';
import { endSurvey } from '@/constants/endSurvey';
import { fetchEndSurveyResponse, submitEndSurveyResponse } from '@/features/analytics/lib/endSurveyQueries';
import SurveyQuestionRenderer from '@/features/analytics/components/questions/SurveyQuestionRenderer';
import { createInitialAnswers, getAllQuestions, hasMissingRequiredAnswers, type SurveyAnswers } from '@/features/analytics/utils/surveyUtils';
import styles from '@/features/analytics/components/styles/VideoSurvey.module.css';
import { useTranslation } from 'react-i18next';
import { PageMeta } from '@/shared/components/Seo/PageMeta';

function EndSurveyPage() {
    const { t } = useTranslation();
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
                    setSubmitError(t('endSurvey.loadFailed'));
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
            setSubmitError(t('endSurvey.missingParticipant'));
            return;
        }

        if (hasMissingRequiredAnswers(surveyQuestions, answers)) {
            setSubmitError(t('endSurvey.missingAnswers'));
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
            setSubmitError(error instanceof Error ? error.message : t('endSurvey.submitFailed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={styles.surveyContainer}>
            <PageMeta title={t('seo.endSurvey.title')} description={t('seo.endSurvey.description')} />
            <h2>{t('endSurvey.title')}</h2>
            <p>{t('endSurvey.intro')}</p>
            {hasExistingResponse && <p>{t('endSurvey.editableHint')}</p>}
            {isLoadingExisting && <p>{t('endSurvey.loadingExisting')}</p>}

            <form onSubmit={handleSubmit} className={styles.surveyForm}>
                {endSurvey.sections.map((section) => (
                    <Fragment key={section.id}>
                        <h3>{t(section.title, { defaultValue: section.title })}</h3>
                        {section.description && <p>{t(section.description, { defaultValue: section.description })}</p>}
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
                {submitted && <p className={styles.submitSuccess}>{t('endSurvey.submitSuccess')}</p>}

                <button type="submit" className="primary" disabled={isSubmitting || isLoadingExisting}>
                    {isSubmitting ? t('common.saveInProgress') : hasExistingResponse ? t('endSurvey.updateButton') : t('endSurvey.submitButton')}
                </button>
            </form>
        </section>
    );
}

export default EndSurveyPage;