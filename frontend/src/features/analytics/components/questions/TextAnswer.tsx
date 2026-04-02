import SurveyQuestion from '@/shared/components/SurveyQuestion/SurveyQuestion';
import styles from '../styles/TextAnswer.module.css';

interface TextAnswerQuestionProps {
    question?: string;
    description?: string;
    optional?: boolean;
    value: string;
    onChange: (value: string) => void;
}

function TextAnswerQuestion({ question, description, optional, value, onChange }: TextAnswerQuestionProps) {
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event.target.value);
    };

    return (
        <SurveyQuestion question={question} description={description} optional={optional}>
            <textarea value={value} onChange={handleChange} className={styles.textInput} rows={4} />
        </SurveyQuestion>
    );
}

export default TextAnswerQuestion;