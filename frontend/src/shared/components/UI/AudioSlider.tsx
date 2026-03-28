

function AudioSlider({ audioId, volume, onVolumeChange }: { audioId: string; volume: number; onVolumeChange: (id: string, val: number) => void }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label htmlFor={`slider-${audioId}`}>Volume:</label>
            <input
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