import { QuestionType, type Survey } from "@/shared/types/survey";

export const videoSurvey: Survey = {
    id: "video-survey",
    title: "surveys.video.title",
    sections: [
        {
            id: "section-1",
            title: "surveys.video.sections.section1",
            questions: [
                {
                    id: "sync-1",
                    type: QuestionType.LinearRating,
                    question: "surveys.video.questions.sync1.question",
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "surveys.video.questions.sync1.minDescription",
                    maxDescription: "surveys.video.questions.sync1.maxDescription"
                },
                {
                    id: "sync-2",
                    type: QuestionType.OptionSelect,
                    question: "surveys.video.questions.sync2.question",
                    options: ["Ja", "Nein"]
                }
            ]
        },
        {
            id: "section-2",
            title: "surveys.video.sections.section2",
            questions: [
                {
                    id: "experience-1",
                    type: QuestionType.LinearRating,
                    question: "surveys.video.questions.experience1.question",
                    minValue: 1,
                    maxValue: 7,
                    minDescription: "surveys.video.questions.experience1.minDescription",
                    maxDescription: "surveys.video.questions.experience1.maxDescription"
                },
                {
                    id: "experience-2",
                    type: QuestionType.OptionSelect,
                    question: "surveys.video.questions.experience2.question",
                    options: ["Standard", "Mixer"]
                }
            ]
        }
    ]
}