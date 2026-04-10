import { formatDuration } from "@/shared/utils/timeFormating";


interface VideoTimeDisplayProps {
    currentTime: number;
    duration: number;
}

function VideoTimeDisplay ({ currentTime, duration }: VideoTimeDisplayProps) {
    return (
        <span style={{ fontSize: 'var(--player-time-font-size, 0.9rem)', lineHeight: 1.1 }}>
            {formatDuration(currentTime)} / {formatDuration(duration)}
        </span>
    );
}

export default VideoTimeDisplay;
