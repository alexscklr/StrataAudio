import { supabase } from '@/api/supabaseClient';
import type { Survey } from '@/shared/types/survey';
import type { SurveyAnswers } from '../utils/surveyUtils';

interface SubmitSurveyResponseInput {
    participantId: string;
    configId: string | null;
    videoId: string;
    survey: Survey;
    answers: SurveyAnswers;
}

export const submitSurveyResponse = async ({
    participantId,
    configId,
    videoId,
    survey,
    answers,
}: SubmitSurveyResponseInput): Promise<void> => {
    const { error } = await supabase
        .from('survey_responses')
        .insert({
            participant_id: participantId,
            config_id: configId,
            video_id: videoId,
            survey_type: 'single',
            responses: {
                survey_id: survey.id,
                answers,
            },
            feedback_text: null,
        });

    if (error) throw error;
};
