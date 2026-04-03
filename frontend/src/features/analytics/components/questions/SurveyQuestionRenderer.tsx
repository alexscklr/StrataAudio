import { QuestionType, type Question } from '@/shared/types/survey';
import type { SurveyAnswers } from '../../lib/surveyUtils';
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
                    question={question.question}
                    optional={question.optional}
                    minValue={question.minValue ?? 1}
                    minDescription={question.minDescription ?? ''}
                    maxValue={question.maxValue ?? 7}
                    maxDescription={question.maxDescription ?? ''}
                    onChange={(value) => onAnswer(question.id, value)}
                    value={Number(answers[question.id] ?? question.minValue ?? 1)}
                />
            );
        case QuestionType.OptionSelect:
            return (
                <OptionSelect
                    question={question.question}
                    optional={question.optional}
                    options={question.options ?? []}
                    onChange={(value) => onAnswer(question.id, value)}
                    value={String(answers[question.id] ?? '')}
                    noAnswerOption={false}
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
