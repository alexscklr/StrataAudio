import styles from './SurveyQuestion.module.css';
import { useTranslation } from 'react-i18next';

interface SurveyQuestionProps {
    question?: string;
    description?: string;
    optional?: boolean;
    children?: React.ReactNode;
}

function SurveyQuestion({ question, description, optional, children }: SurveyQuestionProps) {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            {question && (
                <h4 className={styles.question}>
                    {question}
                    {optional && <span className={styles.optionalBadge}>{t('common.optional')}</span>}
                </h4>
            )}
            {description && <p className={styles.description}>{description}</p>}
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
}

export default SurveyQuestion;