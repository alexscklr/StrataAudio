import { QuestionType, type Survey } from "@/shared/types/survey";

type DemographicsValueMaps = {
    streamingUsage: Record<string, string>;
    audioOutputType: Record<string, string>;
    gender: Record<string, string>;
    ageRange: Record<string, string>;
};

export const demographicsSurvey: Survey & {
    eyebrow: string;
    intro: string;
    submitHint: string;
    valueMaps: DemographicsValueMaps;
} = {
    id: "demographics-survey",
    title: "surveys.demographics.title",
    eyebrow: "surveys.demographics.eyebrow",
    intro: "surveys.demographics.intro",
    submitHint: "surveys.demographics.submitHint",
    sections: [
        {
            id: "demographics-entry",
            title: "",
            questions: [
                {
                    id: "streamingUsage",
                    type: QuestionType.OptionSelect,
                    question: "surveys.demographics.questions.streamingUsage.question",
                    options: [
                        "daily",
                        "multiple_per_week",
                        "weekly",
                        "multiple_per_month",
                        "rarely",
                    ],
                },
                {
                    id: "audioOutputType",
                    type: QuestionType.OptionSelect,
                    question: "surveys.demographics.questions.audioOutputType.question",
                    options: [
                        "built_in_speakers",
                        "headphones",
                        "external_speakers",
                    ],
                },
                {
                    id: "audioDisturbance",
                    type: QuestionType.LinearRating,
                    question: "surveys.demographics.questions.audioDisturbance.question",
                    minValue: 1,
                    minDescription: "surveys.demographics.questions.audioDisturbance.minDescription",
                    maxValue: 7,
                    maxDescription: "surveys.demographics.questions.audioDisturbance.maxDescription",
                },
                {
                    id: "audioSettingsSatisfaction",
                    type: QuestionType.LinearRating,
                    question: "surveys.demographics.questions.audioSettingsSatisfaction.question",
                    minValue: 1,
                    minDescription: "surveys.demographics.questions.audioSettingsSatisfaction.minDescription",
                    maxValue: 7,
                    maxDescription: "surveys.demographics.questions.audioSettingsSatisfaction.maxDescription",
                },
                {
                    id: "gender",
                    type: QuestionType.OptionSelect,
                    question: "surveys.demographics.questions.gender.question",
                    options: ["female", "male", "diverse"],
                    optional: true,
                    noAnswerOption: true,
                },
                {
                    id: "ageRange",
                    type: QuestionType.OptionSelect,
                    question: "surveys.demographics.questions.ageRange.question",
                    options: [
                        "under_18",
                        "age_18_24",
                        "age_25_34",
                        "age_35_44",
                        "age_45_54",
                        "age_55_64",
                        "age_65_plus",
                    ],
                    noAnswerOption: false,
                },
            ],
        },
    ],
    valueMaps: {
        streamingUsage: {
            daily: "daily",
            multiple_per_week: "multiple_per_week",
            weekly: "weekly",
            multiple_per_month: "multiple_per_month",
            rarely: "rarely",
        },
        audioOutputType: {
            built_in_speakers: "built_in_speakers",
            headphones: "headphones",
            external_speakers: "external_speakers",
        },
        gender: {
            female: "female",
            male: "male",
            diverse: "diverse",
            "": "no_answer",
        },
        ageRange: {
            under_18: "under_18",
            age_18_24: "18_24",
            age_25_34: "25_34",
            age_35_44: "35_44",
            age_45_54: "45_54",
            age_55_64: "55_64",
            age_65_plus: "65_plus",
        },
    },
};