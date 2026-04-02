import { useContext, useMemo, useState, type FormEvent } from 'react';
import { QuestionType } from '@/shared/types/survey';
import { type VideoWatchMode } from '@/shared/types/media';
import LinearRating from './questions/LinearRating';
import OptionSelect from './questions/OptionSelect';
import styles from './styles/VideoSurvey.module.css';
import { videoSurvey } from '@/constants/videoSurvey';
import TextAnswerQuestion from './questions/TextAnswer';
import { AuthContext } from '@/features/auth/context/AuthContext';
import React from 'react';
import { submitSurveyResponse } from '../lib/surveyQueries';
import { saveAudioConfiguration } from '../lib/audioConfigurationQueries';
import { createInitialAnswers, getAllQuestions, type SurveyAnswers } from '../lib/surveyUtils';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { AudioConfigurationSnapshot } from '@/shared/types/mixer';

interface VideoSurveyProps {
    videoId: string;
    videoTitle: string;
    watchMode: VideoWatchMode;
    audioConfigurationSnapshot: AudioConfigurationSnapshot | null;
    unlocked: boolean;
}

function VideoSurvey({ videoId, videoTitle, watchMode, audioConfigurationSnapshot, unlocked }: VideoSurveyProps) {
    const { participantId } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [answers, setAnswers] = useState<SurveyAnswers>(() => createInitialAnswers(videoSurvey));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const surveyQuestions = useMemo(() => getAllQuestions(videoSurvey), []);

    const navigate = useNavigate();

    const updateAnswer = (questionId: string, value: string | number) => {
        setAnswers((currentAnswers) => ({
            ...currentAnswers,
            [questionId]: value,
        }));
    };

    const handleSurveySubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitError(null);

        if (!participantId) {
            setSubmitError('Participant-ID fehlt. Bitte Einverständnis erneut bestätigen.');
            return;
        }

        const hasMissingAnswers = surveyQuestions.some((question) => {
            if (question.optional) return false;

            const value = answers[question.id];

            if (question.type === QuestionType.LinearRating) {
                return typeof value !== 'number';
            }

            return typeof value !== 'string' || value.trim().length === 0;
        });

        if (hasMissingAnswers) {
            setSubmitError('Bitte beantworte alle Fragen, bevor du absendest.');
            return;
        }

        if (!audioConfigurationSnapshot) {
            setSubmitError('Audio-Konfiguration fehlt. Bitte schaue das Video vollständig an, bevor du absendest.');
            return;
        }

        setIsSubmitting(true);

        try {
            const configurationId = await saveAudioConfiguration({
                participantId,
                videoId,
                snapshot: audioConfigurationSnapshot,
            });

            await submitSurveyResponse({
                participantId,
                configId: configurationId,
                videoId,
                watchMode,
                survey: videoSurvey,
                answers,
            });

            await queryClient.invalidateQueries({
                queryKey: ['video-catalog', participantId],
            });

            setSubmitted(true);
            navigate(-1);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Umfrage konnte nicht gespeichert werden.';
            setSubmitError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={styles.surveyContainer}>
            <h2>Umfrage zum Video „{videoTitle}“</h2>
            <p>Vielen Dank, dass du an der Videoumfrage teilnimmst! Deine Meinung ist uns sehr wichtig und hilft uns, genauere Einblicke zu gewinnen. Bitte beantworte die folgenden Fragen so ehrlich wie möglich. Es gibt keine richtigen oder falschen Antworten, ich möchte einfach nur Deine ehrliche Meinung hören.</p>
            {!unlocked && <p className={styles.lockedMessage}>Die Umfrage wird freigeschaltet, sobald Sie das Video angeschaut haben.</p>}
            {unlocked && (
                <form onSubmit={handleSurveySubmit} className={styles.surveyForm}>
                    {
                        videoSurvey.sections.map(section => (
                            <React.Fragment key={section.id}>
                                <h3>{section.title}</h3>
                                {section.description && <p>{section.description}</p>}
                                {section.questions.map(question => {
                                    switch (question.type) {
                                        case QuestionType.LinearRating:
                                            return (
                                                <LinearRating
                                                    key={question.id}
                                                    question={question.question}
                                                    optional={question.optional}
                                                    minValue={question.minValue ?? 1}
                                                    minDescription={question.minDescription ?? ''}
                                                    maxValue={question.maxValue ?? 7}
                                                    maxDescription={question.maxDescription ?? ''}
                                                    onChange={(value) => updateAnswer(question.id, value)}
                                                    value={Number(answers[question.id] ?? question.minValue ?? 1)}
                                                />
                                            );
                                        case QuestionType.OptionSelect:
                                            return (
                                                <OptionSelect
                                                    key={question.id}
                                                    question={question.question}
                                                    optional={question.optional}
                                                    options={question.options ?? []}
                                                    onChange={(value) => updateAnswer(question.id, value)}
                                                    value={String(answers[question.id] ?? '')}
                                                    noAnswerOption={false}
                                                />
                                            );
                                        case QuestionType.TextAnswer:
                                            return (
                                                <TextAnswerQuestion
                                                    key={question.id}
                                                    question={question.question}
                                                    optional={question.optional}
                                                    onChange={(value) => updateAnswer(question.id, value)}
                                                    value={String(answers[question.id] ?? '')}
                                                />
                                            );
                                        default:
                                            return null;
                                    }
                                })}
                                <div className={styles.spacer} />
                                <hr className={styles.questionDivider} />
                                <div className={styles.spacer} />
                            </React.Fragment>
                        ))
                    }

                    {submitError && <p className={styles.submitError}>{submitError}</p>}
                    {submitted && <p className={styles.submitSuccess}>Vielen Dank! Deine Antworten wurden gespeichert.</p>}

                    <button type="submit" className='primary' disabled={isSubmitting || submitted}>
                        {isSubmitting ? 'Speichere...' : submitted ? 'Gespeichert' : 'Umfrage absenden'}
                    </button>
                </form>
            )}
        </section>
    );
}

export default VideoSurvey;