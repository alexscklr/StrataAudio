

interface VideoTimeDisplayProps {
    currentTime: number;
    duration: number;
}

function VideoTimeDisplay ({ currentTime, duration }: VideoTimeDisplayProps) {
    return (
        <span style={{ fontSize: 'var(--player-time-font-size, 0.9rem)', lineHeight: 1.1 }}>
            {currentTime.toFixed(2)} / {duration.toFixed(2)}
        </span>
    );
}

export default VideoTimeDisplay;
