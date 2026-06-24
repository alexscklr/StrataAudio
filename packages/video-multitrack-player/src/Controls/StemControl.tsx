import type { Audio } from "../types/media";
import styles from "./styles/AudioControls.module.css";
import VolumeSlider from "../components/UI/VolumeSlider/VolumeSlider";
import PanSlider from "../components/UI/PanSlider/PanSlider";
import type { AudioTrackState } from "../types/mixer";
import { LuSlash } from "react-icons/lu";
import { useTranslation } from 'react-i18next';
import type { ResolvePublicUrl } from "../utils/publicUrlResolver";

interface StemControlProps {
    audio: Audio;
    isAudioControlsOpen: boolean;
    trackState: AudioTrackState;
    onVolumeChange: (id: string, val: number) => void;
    onVolumeCommit: (id: string, val: number) => void;
    onPanChange: (id: string, val: number) => void;
    onPanCommit: (id: string, val: number) => void;
    onToggleMute: (id: string) => void;
    resolvePublicUrl: ResolvePublicUrl;
}

function StemControl({ audio, isAudioControlsOpen, trackState, onVolumeChange, onVolumeCommit, onPanChange, onPanCommit, onToggleMute, resolvePublicUrl }: StemControlProps) {
    const { t } = useTranslation();

    return (
        <div key={audio.id} className={styles.audioControlWrapper}>
            {isAudioControlsOpen && (
                <div className={styles.controlStack}>
                    <VolumeSlider audioId={audio.id} volume={trackState.volume} onVolumeChange={onVolumeChange} onVolumeCommit={onVolumeCommit} />
                    <PanSlider audioId={audio.id} pan={trackState.pan} onPanChange={onPanChange} onPanCommit={onPanCommit} />
                </div>
            )}
            <button
                type="button"
                className={'normal ' +styles.audioIconButton}
                aria-label={t('player.trackVolume', { title: audio.title })}
                title={audio.title}
                onClick={() => { onToggleMute(audio.id); }}
            >
                <img className={styles.icon} src={resolvePublicUrl(`icons/${audio.icon_url}`, "system")} alt={audio.title} width={32} height={32} />
                <LuSlash className={styles.muteIcon} style={{ display: trackState.isMuted ? 'block' : 'none' }} color="red" />
            </button>
            {isAudioControlsOpen && <span className={styles.audioTrackLabel}>{audio.title}</span>}
        </div>
    )
}

export default StemControl;