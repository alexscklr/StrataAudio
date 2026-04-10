import styles from "./WarningPopup.module.css";
import { useTranslation } from 'react-i18next';

interface WarningPopupProps {
    title: string;
    message: string;
    details?: string;
    closeBtnText?: string;
    onClose: () => void;
}

function WarningPopup({ title, message, details, closeBtnText, onClose }: WarningPopupProps) {
    const { t } = useTranslation();

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <h2>{title}</h2>
                <p>{message}</p>
                {details && <pre className={styles.details}>{details}</pre>}
                <button onClick={onClose}>{closeBtnText ?? t('common.close')}</button>
            </div>
        </div>
    );
}

export default WarningPopup;