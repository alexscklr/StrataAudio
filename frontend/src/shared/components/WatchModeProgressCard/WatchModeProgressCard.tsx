import { VideoWatchMode, type VideoWatchMode as WatchMode } from '@/shared/types/media';
import ProgressBar from '@/shared/components/ProgressBar/ProgressBar';
import styles from './WatchModeProgressCard.module.css';
import { useTranslation } from 'react-i18next';

interface WatchModeProgressCardProps {
    completedCount: number;
    totalModes: number;
    currentMode: WatchMode;
    nextRequiredMode?: WatchMode;
    surveyUnlocked: boolean;
}

function WatchModeProgressCard({
    completedCount,
    totalModes,
    currentMode,
    nextRequiredMode,
    surveyUnlocked,
}: WatchModeProgressCardProps) {
    const { t } = useTranslation();
    const getModeLabel = (mode: WatchMode) => (mode === VideoWatchMode.Mixer ? t('watchMode.mixerMode') : t('watchMode.standardMode'));
    const progressPercent = totalModes === 0 ? 0 : Math.round((completedCount / totalModes) * 100);

    return (
        <section className={styles.watchStatusCard} aria-live="polite">
            <div className={styles.statusTopRow}>
                <p className={styles.statusTitle}>{t('watchMode.unlockTitle')}</p>
                <span className={styles.statusCounter}>{completedCount}/{totalModes}</span>
            </div>

            <p className={styles.statusText}>
                {t('watchMode.unlockHint')}
            </p>

            <div className={styles.modeRow}>
                <span className={styles.modeLabel}>{t('watchMode.currentMode')}</span>
                <span className={styles.modeBadge}>{getModeLabel(currentMode)}</span>
            </div>

            <ProgressBar
                percentage={progressPercent}
                ariaLabel={t('watchMode.unlockTitle')}
                ariaValueText={`${completedCount}/${totalModes}`}
                variant="gradient"
            />

            <p className={styles.nextStepText}>
                {!surveyUnlocked && nextRequiredMode
                    ? t('watchMode.nextMode', { mode: getModeLabel(nextRequiredMode) })
                    : t('watchMode.allDone')}
            </p>
        </section>
    );
}

export default WatchModeProgressCard;