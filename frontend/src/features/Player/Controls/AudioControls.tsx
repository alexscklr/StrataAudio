import { useEffect, useRef, useState } from "react";
import type { Audio, VideoWatchMode } from "@/shared/types/media";
import styles from "./styles/AudioControls.module.css";
import StemControl from "./StemControl";
import type { MixerState } from "@/shared/types/mixer";
import AudioSlider from "@/shared/components/UI/AudioSlider/AudioSlider";
import { LuVolume2 } from "react-icons/lu";


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
}

function AudioControls({ onVolumeChange, onVolumeCommit, onMasterVolumeChange, onMasterVolumeCommit, mixerState, audios, isFullscreen, onMuteToggle, watchMode }: AudioControlsProps) {


    const [isAudioControlsOpen, setIsAudioControlsOpen] = useState(false);

    const audioControlsBoxRef = useRef<HTMLDivElement>(null);

    const handleAudioBoxToggle = () => {
        setIsAudioControlsOpen(prev => !prev);
    };

    useEffect(() => {
        if (!isAudioControlsOpen) return;

        const handlePointerDownOutside = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node | null;
            if (!target) return;
            if (!audioControlsBoxRef.current?.contains(target)) {
                setIsAudioControlsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsAudioControlsOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDownOutside);
        document.addEventListener('touchstart', handlePointerDownOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handlePointerDownOutside);
            document.removeEventListener('touchstart', handlePointerDownOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isAudioControlsOpen]);

    return (
        <div
            ref={audioControlsBoxRef}
            className={`${styles.audioControlsBox} ${isFullscreen ? styles.audioControlsBoxFullscreen : ''} ${isAudioControlsOpen ? styles.audioControlsBoxExpanded : ''}`}
        >
            <div className={styles.audioControlsRow}>
                <div className={styles.audioControlWrapper}>
                    {isAudioControlsOpen && (
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
                        aria-label="Master volume"
                        title="Master volume"
                    >
                        <LuVolume2 className={styles.masterIcon} />
                    </button>
                </div>

                {watchMode !== 'standard' && <div className={styles.trackDivider} />}

                {watchMode !== 'standard' && audios?.map(audio => (
                    <StemControl
                        key={audio.id}
                        audio={audio}
                        isAudioControlsOpen={isAudioControlsOpen}
                        trackState={mixerState.trackstates[audio.id] ?? { volume: 1, isMuted: false }}
                        onVolumeChange={onVolumeChange}
                        onVolumeCommit={onVolumeCommit}
                        onToggleMute={() => onMuteToggle(audio.id)}
                    />
                ))}
            </div>
            <button
                className={`normal ${styles.audioControlsToggle} ${isAudioControlsOpen ? styles.audioControlsBoxExpanded : ''}`}
                role="button"
                tabIndex={0}
                aria-expanded={isAudioControlsOpen}
                aria-label="Open audio mixer"
                onClick={() => handleAudioBoxToggle()}>
            </button>
        </div >
    )
}

export default AudioControls;