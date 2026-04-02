import { QuestionType, type Survey } from '@/shared/types/survey';

export type SurveyAnswers = Record<string, string | number>;

export const createInitialAnswers = (survey: Survey): SurveyAnswers => {
    return survey.sections.reduce<SurveyAnswers>((accumulator, section) => {
        section.questions.forEach((question) => {
            if (question.type === QuestionType.LinearRating) {
                accumulator[question.id] = question.minValue ?? 1;
                return;
            }

            accumulator[question.id] = '';
        });

        return accumulator;
    }, {});
};

export const getAllQuestions = (survey: Survey) =>
    survey.sections.flatMap((section) => section.questions);
