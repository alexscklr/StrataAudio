import { QuestionType, type Survey } from "@/shared/types/survey";

export const endSurvey: Survey = {
    id: "endSurvey",
    title: "surveys.end.title",
    sections: [
        {
            id: "section-1",
            title: "surveys.end.sections.section1.title",
            description: "surveys.end.sections.section1.description",
            questions: [
                {
                    id: "sus-1",
                    type: QuestionType.LinearRating,
                    question: "surveys.end.questions.sus1.question",
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "surveys.end.questions.sus1.minDescription",
                    maxDescription: "surveys.end.questions.sus1.maxDescription"
                },
                {
                    id: "sus-2",
                    type: QuestionType.LinearRating,
                    question: "surveys.end.questions.sus2.question",
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "surveys.end.questions.sus2.minDescription",
                    maxDescription: "surveys.end.questions.sus2.maxDescription"
                },
                {
                    id: "sus-3",
                    type: QuestionType.LinearRating,
                    question: "surveys.end.questions.sus3.question",
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "surveys.end.questions.sus3.minDescription",
                    maxDescription: "surveys.end.questions.sus3.maxDescription"
                },
                {
                    id: "sus-4",
                    type: QuestionType.LinearRating,
                    question: "surveys.end.questions.sus4.question",
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "surveys.end.questions.sus4.minDescription",
                    maxDescription: "surveys.end.questions.sus4.maxDescription"
                }
            ]
        },
        {
            id: "section-2",
            title: "surveys.end.sections.section2.title",
            description: "surveys.end.sections.section2.description",
            questions: [
                {
                    id: "ueq-1",
                    type: QuestionType.LinearRating,
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "surveys.end.questions.ueq1.minDescription",
                    maxDescription: "surveys.end.questions.ueq1.maxDescription"
                },
                {
                    id: "ueq-2",
                    type: QuestionType.LinearRating,
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "surveys.end.questions.ueq2.minDescription",
                    maxDescription: "surveys.end.questions.ueq2.maxDescription"
                },
                {
                    id: "ueq-3",
                    type: QuestionType.LinearRating,
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "surveys.end.questions.ueq3.minDescription",
                    maxDescription: "surveys.end.questions.ueq3.maxDescription"
                },
                {
                    id: "ueq-4",
                    type: QuestionType.LinearRating,
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "surveys.end.questions.ueq4.minDescription",
                    maxDescription: "surveys.end.questions.ueq4.maxDescription"
                },
                {
                    id: "ueq-5",
                    type: QuestionType.LinearRating,
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "surveys.end.questions.ueq5.minDescription",
                    maxDescription: "surveys.end.questions.ueq5.maxDescription"
                }
            ]
        },
        {
            id: "section-3",
            title: "surveys.end.sections.section3.title",
            questions: [
                {
                    id: "nps-1",
                    type: QuestionType.LinearRating,
                    minValue: 1,
                    maxValue: 10,
                    minDescription: "surveys.end.questions.nps1.minDescription",
                    maxDescription: "surveys.end.questions.nps1.maxDescription"
                }
            ]
        },
        {
            id: "section-4",
            title: "surveys.end.sections.section4.title",
            questions: [
                {
                    id: "feedback-1",
                    type: QuestionType.TextAnswer,
                    question: "surveys.end.questions.feedback1.question",
                    optional: true
                }
            ]
        }
    ]
};
