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
    title: "Demografische Umfrage",
    eyebrow: "Vor dem Start",
    intro: "Vielen Dank für Deine Teilnahme. Bevor du startest, gib bitte noch einige Informationen zu Deiner Person und Erfahrung an. Die Antworten bleiben anonym und werden nur für die Auswertung der Studie verwendet.",
    submitHint: "Nach dem Absenden gelangst du direkt zum Videokatalog.",
    sections: [
        {
            id: "demographics-entry",
            title: "",
            questions: [
                {
                    id: "streamingUsage",
                    type: QuestionType.OptionSelect,
                    question: "Wie oft nutzen Sie Streaming-Dienste (YouTube, Netflix, Twitch etc.)?",
                    options: [
                        "Täglich",
                        "Mehrmals pro Woche",
                        "Etwa einmal pro Woche",
                        "Mehrmals pro Monat",
                        "Seltener / Fast nie",
                    ],
                },
                {
                    id: "audioOutputType",
                    type: QuestionType.OptionSelect,
                    question: "Welche Art von Audio-Ausgabe nutzt du?",
                    options: [
                        "Eingebaute Lautsprecher",
                        "Kopfhörer",
                        "Externe Boxen",
                    ],
                },
                {
                    id: "audioDisturbance",
                    type: QuestionType.LinearRating,
                    question: "Wie oft empfindest du das Lautstärkeverhältnis zwischen Hintergrundmusik / Effekten und Sprache in Videos als störend?",
                    minValue: 1,
                    minDescription: "Nie",
                    maxValue: 7,
                    maxDescription: "Immer/Sehr häufig",
                },
                {
                    id: "audioSettingsSatisfaction",
                    type: QuestionType.LinearRating,
                    question: "Wie bewertest du die aktuellen Audio-Einstellmöglichkeiten (meist nur einen gesamten Lautstärkeregler, an/aus) bei Videos im Web?",
                    minValue: 1,
                    minDescription: "Sehr unzufrieden",
                    maxValue: 7,
                    maxDescription: "Sehr zufrieden",
                },
                {
                    id: "gender",
                    type: QuestionType.OptionSelect,
                    question: "Welches Geschlecht hast du?",
                    options: ["Weiblich", "Männlich", "Divers"],
                    optional: true,
                    noAnswerOption: true,
                },
                {
                    id: "ageRange",
                    type: QuestionType.OptionSelect,
                    question: "In welchem Alter befindest du dich?",
                    options: [
                        "Unter 18",
                        "18-24",
                        "25-34",
                        "35-44",
                        "45-54",
                        "55-64",
                        "65 oder älter",
                    ],
                    noAnswerOption: false,
                },
            ],
        },
    ],
    valueMaps: {
        streamingUsage: {
            "Täglich": "daily",
            "Mehrmals pro Woche": "multiple_per_week",
            "Etwa einmal pro Woche": "weekly",
            "Mehrmals pro Monat": "multiple_per_month",
            "Seltener / Fast nie": "rarely",
        },
        audioOutputType: {
            "Eingebaute Lautsprecher": "built_in_speakers",
            "Kopfhörer": "headphones",
            "Externe Boxen": "external_speakers",
        },
        gender: {
            Weiblich: "female",
            Männlich: "male",
            Divers: "diverse",
            "": "no_answer",
        },
        ageRange: {
            "Unter 18": "under_18",
            "18-24": "18_24",
            "25-34": "25_34",
            "35-44": "35_44",
            "45-54": "45_54",
            "55-64": "55_64",
            "65 oder älter": "65_plus",
        },
    },
};