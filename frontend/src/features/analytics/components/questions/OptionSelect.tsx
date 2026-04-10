import SurveyQuestion from '@/shared/components/SurveyQuestion/SurveyQuestion';
import styles from '../styles/OptionSelect.module.css';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface OptionSelectQuestionProps {
    questionId: string;
    question?: string;
    description?: string;
    optional?: boolean;
    options: string[];
    value: string;
    onChange: (value: string) => void;
    noAnswerOption?: boolean;
}

function OptionSelectQuestion({ questionId, question, description, optional, options, value, onChange, noAnswerOption = true }: OptionSelectQuestionProps) {
    const { t } = useTranslation();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <SurveyQuestion question={question} description={description} optional={optional}>
            <div className={styles.optionsWrapper}>
            {noAnswerOption && (
                <>
                    <input type="radio" id={`${questionId}-none`} name={questionId} value="" checked={value === ""} onChange={handleChange} className={styles.radioInput} />
                    <label htmlFor={`${questionId}-none`} className={`${styles.optionLabel} ${value === "" ? styles.selected : ''}`.trim()}>{t('common.noAnswer')}</label>
                </>
            )}
            {options.map((option, index) => (
                <React.Fragment key={index}>
                    <input type="radio" id={`${questionId}-${index}`} name={questionId} value={option} checked={value === option} onChange={handleChange} className={styles.radioInput} />
                    <label htmlFor={`${questionId}-${index}`} className={`${styles.optionLabel} ${value === option ? styles.selected : ''}`.trim()}>{t(`surveys.demographics.questions.${questionId}.options.${option}`, { defaultValue: t(`surveys.video.questions.${questionId.replace('-', '')}.options.${option}`, { defaultValue: option }) })}</label>
                </React.Fragment>
            ))}
            </div>
            {!optional && value === '' && !noAnswerOption && (
                <p className={styles.hint}>{t('common.pleaseAnswerQuestion')}</p>
            )}
        </SurveyQuestion>
    );
}

export default OptionSelectQuestion;