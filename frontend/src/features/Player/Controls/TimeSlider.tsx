import { useEffect, useState } from "react";
import styles from "./styles/TimeSlider.module.css";

interface TimeSliderProps {
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
    videoRef?: React.RefObject<HTMLVideoElement | null>;
}

function TimeSlider({ currentTime, duration, onSeek, videoRef }: TimeSliderProps) {

    const [bufferedTimeSpans, setBufferedTimeSpans] = useState<TimeRanges | null>(null);

    useEffect(() => {
        if (!videoRef || !videoRef.current) return;

        const video = videoRef.current;

        const handleProgress = () => {
            if (video.buffered.length > 0) {
                setBufferedTimeSpans(video.buffered);
            }
        };

        video.addEventListener('progress', handleProgress);
        return () => {
            video.removeEventListener('progress', handleProgress);
        };
    }, [videoRef]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSeek(parseFloat(e.target.value));
    };

    return (
        <div className={styles.timeSliderContainer}>
            <div className={styles.timeSlider}>
                <input
                    type="range"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={handleChange}
                    step={0.01}
                />
            </div>
        </div>
    );
}

export default TimeSlider;