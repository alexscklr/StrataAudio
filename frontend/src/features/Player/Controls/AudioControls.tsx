import { useMemo } from "react";
import type { Audio, VideoWatchMode } from "@/shared/types/media";
import styles from "./styles/AudioControls.module.css";
import StemControl from "./StemControl";
import type { MixerState } from "@/shared/types/mixer";
import VolumeSlider from "../../../shared/components/UI/VolumeSlider/VolumeSlider";
import PanSlider from "../../../shared/components/UI/PanSlider/PanSlider";
import { LuVolume2 } from "react-icons/lu";
import { useTranslation } from 'react-i18next';


interface AudioControlsProps {
    onVolumeChange: (id: string, val: number) => void;
    onVolumeCommit: (id: string, val: number) => void;
    onMasterVolumeChange: (val: number) => void;
    onMasterVolumeCommit: (val: number) => void;
    onPanChange: (id: string, val: number) => void;
    onPanCommit: (id: string, val: number) => void;
    onMasterPanChange: (val: number) => void;
    onMasterPanCommit: (val: number) => void;
    mixerState: MixerState;
    audios: Audio[] | undefined;
    isFullscreen: boolean;
    onMuteToggle: (id: string) => void;
    watchMode: VideoWatchMode;
    isExpanded: boolean;
}

function AudioControls({ onVolumeChange, onVolumeCommit, onMasterVolumeChange, onMasterVolumeCommit, onPanChange, onPanCommit, onMasterPanChange, onMasterPanCommit, mixerState, audios, isFullscreen, onMuteToggle, watchMode, isExpanded }: AudioControlsProps) {
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
                        <div className={styles.controlStack}>
                            <VolumeSlider
                                audioId="master"
                                volume={mixerState.masterVolume}
                                onVolumeChange={(_, val) => onMasterVolumeChange(val)}
                                onVolumeCommit={(_, val) => onMasterVolumeCommit(val)}
                            />
                            <PanSlider
                                audioId="master"
                                pan={mixerState.masterPan}
                                onPanChange={(_, val) => onMasterPanChange(val)}
                                onPanCommit={(_, val) => onMasterPanCommit(val)}
                            />
                        </div>
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
                        trackState={mixerState.trackstates[audio.id] ?? { volume: 1, isMuted: false, pan: 0 }}
                        onVolumeChange={onVolumeChange}
                        onVolumeCommit={onVolumeCommit}
                        onPanChange={onPanChange}
                        onPanCommit={onPanCommit}
                        onToggleMute={() => onMuteToggle(audio.id)}
                    />
                ))}
            </div>

        </div >
    )
}

export default AudioControls;