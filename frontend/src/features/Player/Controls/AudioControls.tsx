import { useEffect, useRef, useState } from "react";
import type { Audio } from "@/shared/types/media";
import styles from "./styles/AudioControls.module.css";
import StemControl from "./StemControl";
import type { MixerState } from "@/shared/types/mixer";


interface AudioControlsProps {
    onVolumeChange: (id: string, val: number) => void;
    mixerState: MixerState;
    audios: Audio[] | undefined;
    isFullscreen: boolean;
    onMuteToggle: (id: string) => void;
}

function AudioControls({ onVolumeChange, mixerState, audios, isFullscreen, onMuteToggle }: AudioControlsProps) {


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
                {audios?.map(audio => (
                    <StemControl key={audio.id} audio={audio} isAudioControlsOpen={isAudioControlsOpen} trackState={mixerState.trackstates[audio.id] ?? { volume: 1, isMuted: false }} onVolumeChange={onVolumeChange} onToggleMute={() => onMuteToggle(audio.id)} />
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