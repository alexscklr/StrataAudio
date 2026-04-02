import styles from '../styles/LinearRating.module.css';
import SurveyQuestion from '@/shared/components/SurveyQuestion/SurveyQuestion';

interface LinearRatingQuestionProps {
    question?: string;
    description?: string;
    optional?: boolean;
    minValue: number;
    maxValue: number;
    minDescription: string;
    maxDescription: string;
    value: number;
    onChange: (value: number) => void;
}

function LinearRatingQuestion({ question, description, optional, minValue, maxValue, minDescription, maxDescription, value, onChange }: LinearRatingQuestionProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(event.target.value));
    };

    return (
        <SurveyQuestion question={question} description={description} optional={optional}>
            <div className={styles.sliderContainer}>
                <input type="range" min={minValue} max={maxValue} value={value} onChange={handleChange} className={styles.slider} step={1} />
                <div className={styles.labelWrapper}>
                    <span className={styles.minLabel}>{minDescription}</span>
                    <span className={styles.maxLabel}>{maxDescription}</span>
                </div>
            </div>
        </SurveyQuestion>
    );
}

export default LinearRatingQuestion;