import { demographicsSurvey } from "@/constants/demographicsSurvey";
import { createInitialAnswers, getAllQuestions, hasMissingRequiredAnswers, type SurveyAnswers } from "./surveyUtils";

export type DemographicsFormValues = SurveyAnswers;

export interface DemographicsPayload {
    participant_id: string;
    streaming_usage: string;
    audio_output_type: string;
    audio_balance_disturbance: number;
    audio_settings_satisfaction: number;
    gender: string;
    age_group: string;
}

const demographicsQuestions = getAllQuestions(demographicsSurvey);

export const createInitialDemographicsValues = (): DemographicsFormValues =>
    createInitialAnswers(demographicsSurvey);

export const hasMissingRequiredDemographicsAnswers = (answers: DemographicsFormValues): boolean =>
    hasMissingRequiredAnswers(demographicsQuestions, answers);

export const mapDemographicsToPayload = (
    participantId: string,
    values: DemographicsFormValues,
): DemographicsPayload => ({
    participant_id: participantId,
    streaming_usage: demographicsSurvey.valueMaps.streamingUsage[
        String(values.streamingUsage) as keyof typeof demographicsSurvey.valueMaps.streamingUsage
    ],
    audio_output_type: demographicsSurvey.valueMaps.audioOutputType[
        String(values.audioOutputType) as keyof typeof demographicsSurvey.valueMaps.audioOutputType
    ],
    audio_balance_disturbance: Number(values.audioDisturbance),
    audio_settings_satisfaction: Number(values.audioSettingsSatisfaction),
    gender: demographicsSurvey.valueMaps.gender[
        String(values.gender) as keyof typeof demographicsSurvey.valueMaps.gender
    ] ?? "no_answer",
    age_group: demographicsSurvey.valueMaps.ageRange[
        String(values.ageRange) as keyof typeof demographicsSurvey.valueMaps.ageRange
    ],
});