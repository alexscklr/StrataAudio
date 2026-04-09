import { QuestionType, type Question } from '@/shared/types/survey';
import type { SurveyAnswers } from '../../utils/surveyUtils';
import LinearRating from './LinearRating';
import OptionSelect from './OptionSelect';
import TextAnswerQuestion from './TextAnswer';

interface SurveyQuestionRendererProps {
    question: Question;
    answers: SurveyAnswers;
    onAnswer: (questionId: string, value: string | number) => void;
}

function SurveyQuestionRenderer({ question, answers, onAnswer }: SurveyQuestionRendererProps) {
    switch (question.type) {
        case QuestionType.LinearRating:
            return (
                <LinearRating
                    questionId={question.id}
                    question={question.question}
                    optional={question.optional}
                    minValue={question.minValue ?? 1}
                    minDescription={question.minDescription ?? ''}
                    maxValue={question.maxValue ?? 7}
                    maxDescription={question.maxDescription ?? ''}
                    onChange={(value) => onAnswer(question.id, value)}
                    value={answers[question.id] !== undefined ? Number(answers[question.id]) : undefined}
                />
            );
        case QuestionType.OptionSelect:
            return (
                <OptionSelect
                    questionId={question.id}
                    question={question.question}
                    optional={question.optional}
                    options={question.options ?? []}
                    onChange={(value) => onAnswer(question.id, value)}
                    value={String(answers[question.id] ?? '')}
                    noAnswerOption={question.noAnswerOption ?? false}
                />
            );
        case QuestionType.TextAnswer:
            return (
                <TextAnswerQuestion
                    question={question.question}
                    optional={question.optional}
                    onChange={(value) => onAnswer(question.id, value)}
                    value={String(answers[question.id] ?? '')}
                />
            );
        default:
            return null;
    }
}

export default SurveyQuestionRenderer;
