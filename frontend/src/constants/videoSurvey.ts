import { QuestionType, type Survey } from "@/shared/types/survey";

export const videoSurvey: Survey = {
    id: "video-survey",
    title: "Umfrage zum Video",
    sections: [
        {
            id: "section-1",
            title: "Fragen zum Thema Synchronisation",
            questions: [
                {
                    id: "sync-1",
                    type: QuestionType.LinearRating,
                    question: "Wie synchron waren die Tonspuren mit dem Video?",
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "Sehr unsynchron",
                    maxDescription: "Perfekt synchron"
                },
                {
                    id: "sync-2",
                    type: QuestionType.OptionSelect,
                    question: "Gab es Störungen wie Tonaussetzer oder Ruckeln während des Tonmischens?",
                    options: ["Ja", "Nein"]
                }
            ]
        },
        {
            id: "section-2",
            title: "Fragen zum Thema Erlebnis",
            questions: [
                {
                    id: "experience-1",
                    type: QuestionType.LinearRating,
                    question: "Inwiefern hat die Möglichkeit, den Mix selbst zu bestimmen, Ihr Interesse am Video gesteigert?",
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "Gar nicht",
                    maxDescription: "Sehr stark"
                },
                {
                    id: "experience-2",
                    type: QuestionType.OptionSelect,
                    question: "Welchen Modus haben Sie beim Ansehen des Videos bevorzugt?",
                    options: ["Standard", "Mixer"]
                }
            ]
        }
    ]
}