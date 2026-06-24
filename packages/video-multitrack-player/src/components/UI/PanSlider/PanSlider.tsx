import styles from './PanSlider.module.css';
import { useTranslation } from 'react-i18next';

interface PanSliderProps {
    audioId: string;
    pan: number;
    onPanChange: (id: string, val: number) => void;
    onPanCommit?: (id: string, val: number) => void;
    orientation?: 'horizontal' | 'vertical';
}

function PanSlider({ audioId, pan, onPanChange, onPanCommit, orientation = 'horizontal' }: PanSliderProps) {
    const { t } = useTranslation();
    const containerClassName = [
        styles.sliderContainer,
        orientation === 'horizontal' ? styles.sliderContainerHorizontal : styles.sliderContainerVertical,
    ].join(' ');

    const handleCommit = (value: number) => {
        onPanCommit?.(audioId, value);
    };

    return (
        <div className={containerClassName}>
            <label htmlFor={`pan-slider-${audioId}`} className={styles.srOnly}>{t('common.pan')}</label>
            <div className={styles.sliderFrame}>
                <span className={styles.railLabel}>L</span>
                <input
                    className={`${styles.slider} ${orientation === 'horizontal' ? styles.sliderHorizontal : styles.sliderVertical}`}
                    id={`pan-slider-${audioId}`}
                    type="range"
                    min={-1}
                    max={1}
                    step={0.01}
                    value={pan}
                    onChange={(e) => onPanChange(audioId, parseFloat(e.target.value))}
                    onMouseUp={(e) => handleCommit(parseFloat(e.currentTarget.value))}
                    onTouchEnd={(e) => handleCommit(parseFloat(e.currentTarget.value))}
                    onKeyUp={(e) => {
                        if (e.key.startsWith('Arrow') || e.key === 'Home' || e.key === 'End' || e.key === 'PageUp' || e.key === 'PageDown') {
                            handleCommit(parseFloat(e.currentTarget.value));
                        }
                    }}
                />
                <span className={styles.railLabel}>R</span>
            </div>
        </div>
    );
}

export default PanSlider;