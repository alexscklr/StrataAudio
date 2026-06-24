import { formatDuration } from "../utils/formatDuration";


interface VideoTimeDisplayProps {
    currentTime: number;
    duration: number;
}

function VideoTimeDisplay ({ currentTime, duration }: VideoTimeDisplayProps) {
    return (
        <span style={{ fontSize: 'var(--player-time-font-size, 1rem)', lineHeight: 1.1 , margin: 'clamp(0.5rem, 1vw, 1rem)'}}>
            {formatDuration(currentTime)} / {formatDuration(duration)}
        </span>
    );
}

export default VideoTimeDisplay;
