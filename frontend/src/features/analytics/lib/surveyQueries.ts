import { supabase } from '@/api/supabaseClient';
import type { Survey } from '@/shared/types/survey';
import type { SurveyAnswers } from '../utils/surveyUtils';
import type { VideoWatchMode } from '@/shared/types/media';

interface SubmitSurveyResponseInput {
    participantId: string;
    configId: string | null;
    videoId: string;
    firstWatchMode: VideoWatchMode;
    survey: Survey;
    answers: SurveyAnswers;
}

export const submitSurveyResponse = async ({
    participantId,
    configId,
    videoId,
    firstWatchMode,
    survey,
    answers,
}: SubmitSurveyResponseInput): Promise<void> => {
    const { error } = await supabase
        .from('survey_responses')
        .insert({
            participant_id: participantId,
            config_id: configId,
            video_id: videoId,
            first_watch_mode: firstWatchMode,
            responses: {
                survey_id: survey.id,
                answers,
            },
            feedback_text: null,
        });

    if (error) {
        const detailParts = [error.message, error.details, error.hint, error.code].filter(Boolean);
        throw new Error(detailParts.join(' | '));
    }
};
