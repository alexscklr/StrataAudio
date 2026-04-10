import { Fragment, useContext, useMemo, useState, type FormEvent } from 'react';
import styles from './styles/VideoSurvey.module.css';
import { videoSurvey } from '@/constants/videoSurvey';
import { AuthContext } from '@/features/auth/context/AuthContext';
import { submitSurveyResponse } from '../lib/surveyQueries';
import { saveAudioConfiguration } from '../lib/audioConfigurationQueries';
import { createInitialAnswers, getAllQuestions, hasMissingRequiredAnswers, type SurveyAnswers } from '../utils/surveyUtils';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import type { AudioConfigurationSnapshot } from '@/shared/types/mixer';
import { clearWatchModeState } from '@/shared/lib/watchModeSequence';
import SurveyQuestionRenderer from './questions/SurveyQuestionRenderer';
import type { VideoWatchMode } from '@/shared/types/media';

const MISSING_PARTICIPANT_ERROR = 'Participant-ID fehlt. Bitte Einverstaendnis erneut bestaetigen.';
const MISSING_ANSWERS_ERROR = 'Bitte beantworte alle Fragen, bevor du absendest.';
const MISSING_AUDIO_CONFIG_ERROR = 'Audio-Konfiguration fehlt. Bitte schaue das Video vollstaendig an, bevor du absendest.';
const SUBMIT_FAILED_ERROR = 'Umfrage konnte nicht gespeichert werden.';

interface VideoSurveyProps {
    videoId: string;
    videoTitle: string;
    firstWatchMode: VideoWatchMode;
    audioConfigurationSnapshot: AudioConfigurationSnapshot | null;
    unlocked: boolean;
}

function VideoSurvey({ videoId, videoTitle, firstWatchMode, audioConfigurationSnapshot, unlocked }: VideoSurveyProps) {
    const { participantId } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [answers, setAnswers] = useState<SurveyAnswers>(() => createInitialAnswers(videoSurvey));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const surveyQuestions = useMemo(() => getAllQuestions(videoSurvey), []);

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
            setSubmitError(MISSING_PARTICIPANT_ERROR);
            return;
        }

        if (hasMissingRequiredAnswers(surveyQuestions, answers)) {
            setSubmitError(MISSING_ANSWERS_ERROR);
            return;
        }

        if (!audioConfigurationSnapshot) {
            setSubmitError(MISSING_AUDIO_CONFIG_ERROR);
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
                firstWatchMode,
                survey: videoSurvey,
                answers,
            });

            clearWatchModeState(videoId);

            await queryClient.invalidateQueries({
                queryKey: ['video-catalog', participantId],
            });

            setSubmitted(true);
            navigate(-1);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : SUBMIT_FAILED_ERROR);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={styles.surveyContainer}>
            <h2>Umfrage zum Video "{videoTitle}"</h2>
            <p>Vielen Dank, dass du an der Videoumfrage teilnimmst! Deine Meinung ist mir sehr wichtig und hilft mir, genauere Einblicke zu gewinnen. Bitte beantworte die folgenden Fragen so ehrlich wie möglich. Es gibt keine richtigen oder falschen Antworten, ich möchte einfach nur Deine ehrliche Meinung hören.</p>
            {!unlocked && <p className={styles.lockedMessage}>Die Umfrage wird freigeschaltet, sobald Sie das Video angeschaut haben.</p>}
            {unlocked && (
                <form onSubmit={handleSurveySubmit} className={styles.surveyForm}>
                    {videoSurvey.sections.map((section) => (
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
                    {submitted && <p className={styles.submitSuccess}>Vielen Dank! Deine Antworten wurden gespeichert.</p>}

                    <button type="submit" className="primary" disabled={isSubmitting || submitted}>
                        {isSubmitting ? 'Speichere...' : submitted ? 'Gespeichert' : 'Umfrage absenden'}
                    </button>
                </form>
            )}
        </section>
    );
}

export default VideoSurvey;
