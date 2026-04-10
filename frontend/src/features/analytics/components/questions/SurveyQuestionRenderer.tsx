import { QuestionType, type Question } from '@/shared/types/survey';
import type { SurveyAnswers } from '../../utils/surveyUtils';
import LinearRating from './LinearRating';
import OptionSelect from './OptionSelect';
import TextAnswerQuestion from './TextAnswer';
import { useTranslation } from 'react-i18next';

interface SurveyQuestionRendererProps {
    question: Question;
    answers: SurveyAnswers;
    onAnswer: (questionId: string, value: string | number) => void;
}

function SurveyQuestionRenderer({ question, answers, onAnswer }: SurveyQuestionRendererProps) {
    const { t } = useTranslation();
    const localizedQuestion = question.question ? t(question.question, { defaultValue: question.question }) : undefined;
    const localizedMinDescription = question.minDescription ? t(question.minDescription, { defaultValue: question.minDescription }) : '';
    const localizedMaxDescription = question.maxDescription ? t(question.maxDescription, { defaultValue: question.maxDescription }) : '';

    switch (question.type) {
        case QuestionType.LinearRating:
            return (
                <LinearRating
                    questionId={question.id}
                    question={localizedQuestion}
                    optional={question.optional}
                    minValue={question.minValue ?? 1}
                    minDescription={localizedMinDescription}
                    maxValue={question.maxValue ?? 7}
                    maxDescription={localizedMaxDescription}
                    onChange={(value) => onAnswer(question.id, value)}
                    value={answers[question.id] !== undefined ? Number(answers[question.id]) : undefined}
                />
            );
        case QuestionType.OptionSelect:
            return (
                <OptionSelect
                    questionId={question.id}
                    question={localizedQuestion}
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
                    question={localizedQuestion}
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
