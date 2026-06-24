import { useEffect, useMemo, useState } from "react";
import styles from "./styles/TimeSlider.module.css";

interface TimeSliderProps {
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
    videoRef?: React.RefObject<HTMLVideoElement | null>;
}

function TimeSlider({ currentTime, duration, onSeek, videoRef }: TimeSliderProps) {

    const [bufferedTimeSpans, setBufferedTimeSpans] = useState<TimeRanges | null>(null);
    const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;

    const playedPercentage = safeDuration > 0
        ? Math.min(100, Math.max(0, (currentTime / safeDuration) * 100))
        : 0;

    const bufferedSegments = useMemo(() => {
        if (!bufferedTimeSpans || safeDuration <= 0) {
            return [] as Array<{ left: number; width: number }>;
        }

        const segments: Array<{ left: number; width: number }> = [];

        for (let i = 0; i < bufferedTimeSpans.length; i += 1) {
            const start = bufferedTimeSpans.start(i);
            const end = bufferedTimeSpans.end(i);
            const left = Math.min(100, Math.max(0, (start / safeDuration) * 100));
            const right = Math.min(100, Math.max(0, (end / safeDuration) * 100));
            const width = Math.max(0, right - left);

            if (width > 0) {
                segments.push({ left, width });
            }
        }

        return segments;
    }, [bufferedTimeSpans, safeDuration]);

    useEffect(() => {
        if (!videoRef || !videoRef.current) return;

        const video = videoRef.current;

        const updateBufferedRanges = () => {
            if (video.buffered.length > 0) {
                setBufferedTimeSpans(video.buffered);
            }
        };

        updateBufferedRanges();

        video.addEventListener('progress', updateBufferedRanges);
        video.addEventListener('loadedmetadata', updateBufferedRanges);
        video.addEventListener('seeked', updateBufferedRanges);

        return () => {
            video.removeEventListener('progress', updateBufferedRanges);
            video.removeEventListener('loadedmetadata', updateBufferedRanges);
            video.removeEventListener('seeked', updateBufferedRanges);
        };
    }, [videoRef]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSeek(parseFloat(e.target.value));
    };

    return (
        <div className={styles.timeSliderContainer}>
            <div className={styles.timeSlider}>
                <div className={styles.trackBackground} />

                <div className={styles.bufferedLayer}>
                    {bufferedSegments.map((segment, index) => (
                        <span
                            // Buffered ranges can be fragmented; each segment is rendered explicitly.
                            key={`${segment.left}-${segment.width}-${index}`}
                            className={styles.bufferedSegment}
                            style={{ left: `${segment.left}%`, width: `${segment.width}%` }}
                        />
                    ))}
                </div>

                <div className={styles.playedLayer} style={{ width: `${playedPercentage}%` }} />

                <input
                    className={styles.rangeInput}
                    type="range"
                    min={0}
                    max={safeDuration}
                    value={Math.min(currentTime, safeDuration)}
                    onChange={handleChange}
                    step={0.01}
                />
            </div>
        </div>
    );
}

export default TimeSlider;