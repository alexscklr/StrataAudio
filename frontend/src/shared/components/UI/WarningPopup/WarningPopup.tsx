import styles from "./WarningPopup.module.css";

interface WarningPopupProps {
    title: string;
    message: string;
    details?: string;
    closeBtnText?: string;
    onClose: () => void;
}

function WarningPopup({ title, message, details, closeBtnText = "Close", onClose }: WarningPopupProps) {
    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <h2>{title}</h2>
                <p>{message}</p>
                {details && <pre className={styles.details}>{details}</pre>}
                <button onClick={onClose}>{closeBtnText}</button>
            </div>
        </div>
    );
}

export default WarningPopup;