import React from 'react';
import styles from '../styles/LinearRating.module.css';
import SurveyQuestion from '@/shared/components/SurveyQuestion/SurveyQuestion';

interface LinearRatingQuestionProps {
    questionId: string;
    question?: string;
    description?: string;
    optional?: boolean;
    minValue: number;
    maxValue: number;
    minDescription: string;
    maxDescription: string;
    value: number | undefined;
    onChange: (value: number) => void;
}

function LinearRatingQuestion({ questionId, question, description, optional, minValue, maxValue, minDescription, maxDescription, value, onChange }: LinearRatingQuestionProps) {
    const steps = Array.from({ length: maxValue - minValue + 1 }, (_, i) => minValue + i);

    return (
        <SurveyQuestion question={question} description={description} optional={optional}>
            <div className={styles.ratingContainer}>
                <div className={styles.blocks}>
                    {steps.map((step) => (
                        <React.Fragment key={step}>
                            <input
                                type="radio"
                                id={`${questionId}-${step}`}
                                name={questionId}
                                value={step}
                                checked={value === step}
                                onChange={() => onChange(step)}
                                className={styles.radioInput}
                            />
                            <label
                                htmlFor={`${questionId}-${step}`}
                                className={`${styles.block} ${value === step ? styles.selected : ''}`}
                            >
                                {step}
                            </label>
                        </React.Fragment>
                    ))}
                </div>
                <div className={styles.labelWrapper}>
                    <span>{minDescription}</span>
                    <span>{maxDescription}</span>
                </div>
            </div>
            {!optional && value === undefined && (
                <p className={styles.hint}>Bitte beantworte diese Frage</p>
            )}
        </SurveyQuestion>
    );
}

export default LinearRatingQuestion;