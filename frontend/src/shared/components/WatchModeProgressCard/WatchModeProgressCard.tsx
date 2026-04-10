import { VideoWatchMode, type VideoWatchMode as WatchMode } from '@/shared/types/media';
import ProgressBar from '@/shared/components/ProgressBar/ProgressBar';
import styles from './WatchModeProgressCard.module.css';

interface WatchModeProgressCardProps {
    completedCount: number;
    totalModes: number;
    currentMode: WatchMode;
    nextRequiredMode?: WatchMode;
    surveyUnlocked: boolean;
}

const getModeLabel = (mode: WatchMode) => (mode === VideoWatchMode.Mixer ? 'Mixer-Modus' : 'Standard-Modus');

function WatchModeProgressCard({
    completedCount,
    totalModes,
    currentMode,
    nextRequiredMode,
    surveyUnlocked,
}: WatchModeProgressCardProps) {
    const progressPercent = totalModes === 0 ? 0 : Math.round((completedCount / totalModes) * 100);

    return (
        <section className={styles.watchStatusCard} aria-live="polite">
            <div className={styles.statusTopRow}>
                <p className={styles.statusTitle}>Freischaltung der Umfrage</p>
                <span className={styles.statusCounter}>{completedCount}/{totalModes}</span>
            </div>

            <p className={styles.statusText}>
                Schau das Video in beiden Modi, um die Umfrage freizuschalten.
            </p>

            <div className={styles.modeRow}>
                <span className={styles.modeLabel}>Aktueller Modus</span>
                <span className={styles.modeBadge}>{getModeLabel(currentMode)}</span>
            </div>

            <ProgressBar
                percentage={progressPercent}
                variant="gradient"
            />

            <p className={styles.nextStepText}>
                {!surveyUnlocked && nextRequiredMode
                    ? `Als Nächstes: ${getModeLabel(nextRequiredMode)}.`
                    : 'Alle Modi abgeschlossen. Du kannst jetzt die Umfrage ausfüllen.'}
            </p>
        </section>
    );
}

export default WatchModeProgressCard;