import type { Audio } from "@/shared/types/media";
import styles from "./styles/AudioControls.module.css";
import AudioSlider from "../../../shared/components/UI/AudioSlider/AudioSlider";
import { getPublicUrl } from "@/shared/utils/storage";
import type { AudioTrackState } from "@/shared/types/mixer";
import { LuSlash } from "react-icons/lu";

interface StemControlProps {
    audio: Audio;
    isAudioControlsOpen: boolean;
    trackState: AudioTrackState;
    onVolumeChange: (id: string, val: number) => void;
    onToggleMute: (id: string) => void;
}

function StemControl({ audio, isAudioControlsOpen, trackState, onVolumeChange, onToggleMute }: StemControlProps) {

    return (
        <div key={audio.id} className={styles.audioControlWrapper}>
            {isAudioControlsOpen && (
                <AudioSlider audioId={audio.id} volume={trackState.volume} onVolumeChange={onVolumeChange} />
            )}
            <button
                type="button"
                className={'normal ' +styles.audioIconButton}
                aria-label={`${audio.title} volume`}
                title={audio.title}
                onClick={() => { onToggleMute(audio.id); }}
            >
                <img className={styles.icon} src={getPublicUrl(`icons/${audio.icon_url}`, "system")} alt={audio.title + ' ' + audio.type} width={32} height={32} />
                <LuSlash className={styles.muteIcon} style={{ display: trackState.isMuted ? 'block' : 'none' }} color="red" />
            </button>
        </div>
    )
}

export default StemControl;