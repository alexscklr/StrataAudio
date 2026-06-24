import { TbRewindBackward5, TbRewindForward5 } from "react-icons/tb";

interface RewindButtonProps {
    rewindMode: "backward" | "forward";
    onClick: () => void;
}

function RewindButton({ rewindMode, onClick }: RewindButtonProps) {
    return (
        <button onClick={onClick} className="normal" style={{ fontSize: 'var(--player-control-font-size, 1.5rem)', padding: 'var(--player-control-padding, 1rem)', border: 'none', transform: 'scale(var(--player-secondary-control-scale, 1.6))', lineHeight: 1 }}>
            {rewindMode === "forward" ? <TbRewindForward5 /> : <TbRewindBackward5 />}
        </button>
    );
}

export default RewindButton;