import SurveyQuestion from '@/shared/components/SurveyQuestion/SurveyQuestion';
import styles from '../styles/OptionSelect.module.css';
import React from 'react';

interface OptionSelectQuestionProps {
    question?: string;
    description?: string;
    optional?: boolean;
    options: string[];
    value: string;
    onChange: (value: string) => void;
    noAnswerOption?: boolean;
}

function OptionSelectQuestion({ question, description, optional, options, value, onChange, noAnswerOption = true }: OptionSelectQuestionProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <SurveyQuestion question={question} description={description} optional={optional}>
            <div className={styles.optionsWrapper}>
            {noAnswerOption && (
                <>
                    <input type="radio" id={`${question}-none`} name={question} value="" checked={value === ""} onChange={handleChange} className={styles.radioInput} />
                    <label htmlFor={`${question}-none`} className={`${styles.optionLabel} ${value === "" ? styles.selected : ''}`.trim()}>Keine Angabe</label>
                </>
            )}
            {options.map((option, index) => (
                <React.Fragment key={index}>
                    <input type="radio" id={`${question}-${index}`} name={question} value={option} checked={value === option} onChange={handleChange} className={styles.radioInput} />
                    <label htmlFor={`${question}-${index}`} className={`${styles.optionLabel} ${value === option ? styles.selected : ''}`.trim()}>{option}</label>
                </React.Fragment>
            ))}
            </div>
            {!optional && value === '' && !noAnswerOption && (
                <p className={styles.hint}>Bitte beantworte diese Frage</p>
            )}
        </SurveyQuestion>
    );
}

export default OptionSelectQuestion;