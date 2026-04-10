import { supabase } from '@/api/supabaseClient';
import type { Survey } from '@/shared/types/survey';
import type { SurveyAnswers } from '../utils/surveyUtils';

interface EndSurveyPayload {
    survey_id?: string;
    answers?: unknown;
}

interface SubmitEndSurveyResponseInput {
    participantId: string;
    survey: Survey;
    answers: SurveyAnswers;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

export const fetchEndSurveyResponse = async (participantId: string): Promise<SurveyAnswers | null> => {
    const { data, error } = await supabase
        .from('end_survey_responses')
        .select('responses')
        .eq('participant_id', participantId)
        .maybeSingle<{ responses: EndSurveyPayload }>();

    if (error) {
        throw error;
    }

    const payload = data?.responses;

    if (!payload || payload.survey_id !== 'endSurvey' || !isRecord(payload.answers)) {
        return null;
    }

    return payload.answers as SurveyAnswers;
};

export const submitEndSurveyResponse = async ({
    participantId,
    survey,
    answers,
}: SubmitEndSurveyResponseInput): Promise<void> => {
    const { error } = await supabase
        .from('end_survey_responses')
        .upsert({
            participant_id: participantId,
            responses: {
                survey_id: survey.id,
                answers,
            },
        }, {
            onConflict: 'participant_id',
        });

    if (error) {
        throw error;
    }
};
