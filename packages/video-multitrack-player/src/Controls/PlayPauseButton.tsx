import { FaPlay, FaPause } from "react-icons/fa";

interface PlayPauseButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  scale?: number;
}

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({ isPlaying, onClick, scale = 1}) => {
  return (
    <button onClick={onClick} className="normal" style={{ fontSize: 'var(--player-control-font-size, 1.5rem)', padding: 'var(--player-control-padding, 1rem)', border: 'none', transform: `scale(${scale})`, lineHeight: 1 }}>
      {isPlaying ? <FaPause /> : <FaPlay />}
    </button>
  );
};