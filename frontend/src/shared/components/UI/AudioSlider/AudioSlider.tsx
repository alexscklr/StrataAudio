import styles from './AudioSlider.module.css';

interface AudioSliderProps {
    audioId: string;
    volume: number;
    onVolumeChange: (id: string, val: number) => void;
    onVolumeCommit?: (id: string, val: number) => void;
}

function AudioSlider({ audioId, volume, onVolumeChange, onVolumeCommit }: AudioSliderProps) {
    const handleCommit = (value: number) => {
        onVolumeCommit?.(audioId, value);
    };

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
                onMouseUp={(e) => handleCommit(parseFloat(e.currentTarget.value))}
                onTouchEnd={(e) => handleCommit(parseFloat(e.currentTarget.value))}
                onKeyUp={(e) => {
                    if (e.key.startsWith('Arrow') || e.key === 'Home' || e.key === 'End' || e.key === 'PageUp' || e.key === 'PageDown') {
                        handleCommit(parseFloat(e.currentTarget.value));
                    }
                }}
            />
        </div>
    );
}

export default AudioSlider;