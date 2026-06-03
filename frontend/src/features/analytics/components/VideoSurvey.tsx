import { useContext, useMemo, useState, type FormEvent } from 'react';
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
import SurveySectionList from './questions/SurveySectionList';
import type { VideoWatchMode } from '@/shared/types/media';
import { useTranslation } from 'react-i18next';

interface VideoSurveyProps {
    videoId: string;
    videoTitle: string;
    firstWatchMode: VideoWatchMode;
    audioConfigurationSnapshot: AudioConfigurationSnapshot | null;
    unlocked: boolean;
}

function VideoSurvey({ videoId, videoTitle, firstWatchMode, audioConfigurationSnapshot, unlocked }: VideoSurveyProps) {
    const { t } = useTranslation();
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
            setSubmitError(t('videoSurvey.missingParticipant'));
            return;
        }

        if (hasMissingRequiredAnswers(surveyQuestions, answers)) {
            setSubmitError(t('videoSurvey.missingAnswers'));
            return;
        }

        if (!audioConfigurationSnapshot) {
            setSubmitError(t('videoSurvey.missingAudioConfiguration'));
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
            setSubmitError(error instanceof Error ? error.message : t('videoSurvey.submitFailed'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={styles.surveyContainer}>
            <h2>{t('videoSurvey.title', { title: videoTitle })}</h2>
            <p>{t('videoSurvey.intro')}</p>
            {!unlocked && <p className={styles.lockedMessage}>{t('videoSurvey.lockedMessage')}</p>}
            {unlocked && (
                <form onSubmit={handleSurveySubmit} className={styles.surveyForm}>
                    <SurveySectionList
                        sections={videoSurvey.sections}
                        answers={answers}
                        onAnswer={updateAnswer}
                        showDividers
                        spacerClassName={styles.spacer}
                        dividerClassName={styles.questionDivider}
                    />

                    {submitError && <p className={styles.submitError}>{submitError}</p>}
                    {submitted && <p className={styles.submitSuccess}>{t('videoSurvey.submitSuccess')}</p>}

                    <button type="submit" className="primary" disabled={isSubmitting || submitted}>
                        {isSubmitting ? t('common.saveInProgress') : submitted ? t('videoSurvey.savedButton') : t('videoSurvey.submitButton')}
                    </button>
                </form>
            )}
        </section>
    );
}

export default VideoSurvey;
