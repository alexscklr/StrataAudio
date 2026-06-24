import { MdFullscreen, MdFullscreenExit } from "react-icons/md";

interface ScreenModeButtonProps {
    onClick: () => void;
    isFullscreen: boolean;
}

function ScreenModeButton({ onClick, isFullscreen }: ScreenModeButtonProps) {
    return (
        <button onClick={onClick} className="normal" style={{ fontSize: 'var(--player-utility-font-size, 2rem)', padding: 'var(--player-utility-padding, 0.625rem)', border: 'none', lineHeight: 1 }}>
            {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
        </button>
    );
}

export default ScreenModeButton;