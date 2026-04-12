import styles from './ProgressBar.module.css';

interface ProgressBarProps {
    percentage: number;
    label?: string;
    counter?: string;
    ariaLabel?: string;
    ariaValueText?: string;
    className?: string;
    variant?: 'default' | 'gradient';
}

function ProgressBar({
    percentage,
    label,
    counter,
    ariaLabel,
    ariaValueText,
    className,
    variant = 'default',
}: ProgressBarProps) {
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
    const variantClass = variant === 'gradient' ? styles.variantGradient : styles.variantDefault;
    const accessibleName = ariaLabel ?? label;
    const accessibleValueText = ariaValueText ?? counter;

    return (
        <div className={`${styles.progressBarContainer} ${className || ''}`}>
            {(label || counter) && (
                <div className={styles.progressHeader}>
                    {label && <span className={styles.progressLabel}>{label}</span>}
                    {counter && <span className={styles.progressCounter}>{counter}</span>}
                </div>
            )}
            <div
                className={`${styles.progressTrack} ${variantClass}`}
                role="progressbar"
                aria-label={accessibleName}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={clampedPercentage}
                aria-valuetext={accessibleValueText}
            >
                <div
                    className={`${styles.progressFill} ${variantClass}`}
                    style={{ width: `${clampedPercentage}%` }}
                />
            </div>
        </div>
    );
}

export default ProgressBar;
