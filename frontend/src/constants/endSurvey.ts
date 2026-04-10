import { QuestionType, type Survey } from "@/shared/types/survey";

export const endSurvey: Survey = {
    id: "endSurvey",
    title: "Abschließende Umfrage",
    sections: [
        {
            id: "section-1",
            title: "Fragen zur Benutzbarkeit",
            description: "Bitte bewerten Sie die folgenden Aussagen zur Benutzbarkeit des Mischpults.",
            questions: [
                {
                    id: "sus-1",
                    type: QuestionType.LinearRating,
                    question: "Ich fand das Mischpult-System einfach zu bedienen.",
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "Stimme überhaupt nicht zu",
                    maxDescription: "Stimme voll und ganz zu"
                },
                {
                    id: "sus-2",
                    type: QuestionType.LinearRating,
                    question: "Ich glaube, dass man die Bedienung des Mischpults sehr schnell lernt.",
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "Stimme überhaupt nicht zu",
                    maxDescription: "Stimme voll und ganz zu"
                },
                {
                    id: "sus-3",
                    type: QuestionType.LinearRating,
                    question: "Ich fühlte mich bei der Benutzung des Mischpults sehr sicher.",
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "Stimme überhaupt nicht zu",
                    maxDescription: "Stimme voll und ganz zu"
                },
                {
                    id: "sus-4",
                    type: QuestionType.LinearRating,
                    question: "Ich fand die verschiedenen Funktionen (Volume, Mute) im Player gut integriert.",
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "Stimme überhaupt nicht zu",
                    maxDescription: "Stimme voll und ganz zu"
                }
            ]
        },
        {
            id: "section-2",
            title: "Fragen zur Benutzererfahrung",
            description: "Wie bewerten Sie Ihr Erlebnis beim Mischen des Tons?",
            questions: [
                {
                    id: "ueq-1",
                    type: QuestionType.LinearRating,
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "Unerfreulich",
                    maxDescription: "Erfreulich"
                },
                {
                    id: "ueq-2",
                    type: QuestionType.LinearRating,
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "Überladen",
                    maxDescription: "Übersichtlich"
                },
                {
                    id: "ueq-3",
                    type: QuestionType.LinearRating,
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "Ineffizient",
                    maxDescription: "Effizient"
                },
                {
                    id: "ueq-4",
                    type: QuestionType.LinearRating,
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "Phantasielos",
                    maxDescription: "Kreativ"
                },
                {
                    id: "ueq-5",
                    type: QuestionType.LinearRating,
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "Herkömmlich",
                    maxDescription: "Neuartig"
                }
            ]
        },
        {
            id: "section-3",
            title: "Weiterempfehlung",
            questions: [
                {
                    id: "nps-1",
                    type: QuestionType.LinearRating,
                    minValue: 1,
                    maxValue: 10,
                    minDescription: "Sehr unwahrscheinlich",
                    maxDescription: "Sehr wahrscheinlich"
                }
            ]
        },
        {
            id: "section-4",
            title: "Offenes Feedback",
            questions: [
                {
                    id: "feedback-1",
                    type: QuestionType.TextAnswer,
                    question: "Haben Sie weitere Anmerkungen oder Verbesserungsvorschläge zum Mischpult oder dem Video?",
                    optional: true
                }
            ]
        }
    ]
};
