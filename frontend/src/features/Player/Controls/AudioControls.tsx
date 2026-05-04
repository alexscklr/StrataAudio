import { useMemo } from "react";
import type { Audio, VideoWatchMode } from "@/shared/types/media";
import styles from "./styles/AudioControls.module.css";
import StemControl from "./StemControl";
import type { MixerState } from "@/shared/types/mixer";
import AudioSlider from "../../../shared/components/UI/AudioSlider/AudioSlider";
import { LuVolume2 } from "react-icons/lu";
import { useTranslation } from 'react-i18next';


interface AudioControlsProps {
    onVolumeChange: (id: string, val: number) => void;
    onVolumeCommit: (id: string, val: number) => void;
    onMasterVolumeChange: (val: number) => void;
    onMasterVolumeCommit: (val: number) => void;
    mixerState: MixerState;
    audios: Audio[] | undefined;
    isFullscreen: boolean;
    onMuteToggle: (id: string) => void;
    watchMode: VideoWatchMode;
    isExpanded: boolean;
}

function AudioControls({ onVolumeChange, onVolumeCommit, onMasterVolumeChange, onMasterVolumeCommit, mixerState, audios, isFullscreen, onMuteToggle, watchMode, isExpanded }: AudioControlsProps) {
    const { t } = useTranslation();

    const shouldRenderTracks = watchMode !== 'standard';
    const panelClassName = useMemo(() => {
        return [
            styles.audioControlsBox,
            isFullscreen ? styles.audioControlsBoxFullscreen : '',
            isExpanded ? styles.audioControlsBoxExpanded : '',
        ].filter(Boolean).join(' ');
    }, [isExpanded, isFullscreen]);

    return (
        <div
            className={panelClassName}
        >
            <div className={styles.audioControlsRow}>
                <div className={styles.audioControlWrapper}>
                    {isExpanded && (
                        <AudioSlider
                            audioId="master"
                            volume={mixerState.masterVolume}
                            onVolumeChange={(_, val) => onMasterVolumeChange(val)}
                            onVolumeCommit={(_, val) => onMasterVolumeCommit(val)}
                        />
                    )}
                    <button
                        type="button"
                        className={'normal ' + styles.audioIconButton}
                        aria-label={t('player.masterVolume')}
                        title={t('player.masterVolume')}
                    >
                        <LuVolume2 className={styles.masterIcon} />
                    </button>
                    {isExpanded && <span className={styles.audioTrackLabel}>{t('player.masterVolume')}</span>}
                </div>

                {shouldRenderTracks && <div className={styles.trackDivider} />}

                {shouldRenderTracks && audios?.map(audio => (
                    <StemControl
                        key={audio.id}
                        audio={audio}
                        isAudioControlsOpen={isExpanded}
                        trackState={mixerState.trackstates[audio.id] ?? { volume: 1, isMuted: false }}
                        onVolumeChange={onVolumeChange}
                        onVolumeCommit={onVolumeCommit}
                        onToggleMute={() => onMuteToggle(audio.id)}
                    />
                ))}
            </div>

        </div >
    )
}

export default AudioControls;