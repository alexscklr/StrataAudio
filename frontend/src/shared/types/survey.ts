export const QuestionType = {
    LinearRating: 'linearRating',
    OptionSelect: 'optionSelect',
    TextAnswer: 'textAnswer'
} as const;

export type QuestionType = typeof QuestionType[keyof typeof QuestionType];

export interface Question {
    id: string;
    type: QuestionType;
    question?: string;
    description?: string;
    optional?: boolean;
    options?: string[]; // Nur für optionSelect
    noAnswerOption?: boolean;
    minValue?: number; // Nur für linearRating
    maxValue?: number; // Nur für linearRating
    minDescription?: string; // Nur für linearRating
    maxDescription?: string; // Nur für linearRating
}

export interface SurveySection {
    id: string;
    title: string;
    description?: string;
    questions: Question[];
}

export interface Survey {
    id: string;
    title: string;
    description?: string;
    sections: SurveySection[];
}