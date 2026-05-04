import type { Audio } from "@/shared/types/media";
import styles from "./styles/AudioControls.module.css";
import AudioSlider from "../../../shared/components/UI/AudioSlider/AudioSlider";
import { getPublicUrl } from "@/shared/utils/storage";
import type { AudioTrackState } from "@/shared/types/mixer";
import { LuSlash } from "react-icons/lu";
import { useTranslation } from 'react-i18next';

interface StemControlProps {
    audio: Audio;
    isAudioControlsOpen: boolean;
    trackState: AudioTrackState;
    onVolumeChange: (id: string, val: number) => void;
    onVolumeCommit: (id: string, val: number) => void;
    onToggleMute: (id: string) => void;
}

function StemControl({ audio, isAudioControlsOpen, trackState, onVolumeChange, onVolumeCommit, onToggleMute }: StemControlProps) {
    const { t } = useTranslation();

    return (
        <div key={audio.id} className={styles.audioControlWrapper}>
            {isAudioControlsOpen && (
                <AudioSlider audioId={audio.id} volume={trackState.volume} onVolumeChange={onVolumeChange} onVolumeCommit={onVolumeCommit} />
            )}
            <button
                type="button"
                className={'normal ' +styles.audioIconButton}
                aria-label={t('player.trackVolume', { title: audio.title })}
                title={audio.title}
                onClick={() => { onToggleMute(audio.id); }}
            >
                <img className={styles.icon} src={getPublicUrl(`icons/${audio.icon_url}`, "system")} alt={audio.title} width={32} height={32} />
                <LuSlash className={styles.muteIcon} style={{ display: trackState.isMuted ? 'block' : 'none' }} color="red" />
            </button>
            {isAudioControlsOpen && <span className={styles.audioTrackLabel}>{audio.title}</span>}
        </div>
    )
}

export default StemControl;