import styles from './AudioSlider.module.css';

function AudioSlider({ audioId, volume, onVolumeChange }: { audioId: string; volume: number; onVolumeChange: (id: string, val: number) => void }) {
    return (
        <div className={styles.sliderContainer}>
            <label htmlFor={`slider-${audioId}`} className={styles.srOnly}>Volume</label>
            <input
                className={styles.slider}
                id={`slider-${audioId}`}
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => onVolumeChange(audioId, parseFloat(e.target.value))}
            />
        </div>
    );
}

export default AudioSlider;