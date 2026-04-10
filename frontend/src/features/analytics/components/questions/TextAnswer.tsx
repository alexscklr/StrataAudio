import SurveyQuestion from '@/shared/components/SurveyQuestion/SurveyQuestion';
import styles from '../styles/TextAnswer.module.css';
import { useTranslation } from 'react-i18next';

interface TextAnswerQuestionProps {
    question?: string;
    description?: string;
    optional?: boolean;
    value: string;
    onChange: (value: string) => void;
}

function TextAnswerQuestion({ question, description, optional, value, onChange }: TextAnswerQuestionProps) {
    const { t } = useTranslation();

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event.target.value);
    };

    return (
        <SurveyQuestion question={question} description={description} optional={optional}>
            <textarea value={value} onChange={handleChange} className={styles.textInput} rows={4} />
            {!optional && value.trim() === '' && (
                <p className={styles.hint}>{t('common.pleaseAnswerQuestion')}</p>
            )}
        </SurveyQuestion>
    );
}

export default TextAnswerQuestion;