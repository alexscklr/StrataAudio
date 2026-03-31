import { useRef } from 'react';
import type { Audio } from '@/shared/types/media';
import styles from './VideoPlayer.module.css';
import { PlayPauseButton } from '../Controls/PlayPauseButton';
import VideoTimeDisplay from '../Controls/VideoTimeDisplay';
import { toggleFullscreen } from '@/shared/utils/fullscreen';
import ScreenModeButton from '../Controls/ScreenModeButton';
import RewindButton from '../Controls/RewindButton';
import TimeSlider from '../Controls/TimeSlider';
import AudioEngine from './AudioEngine';
import AudioControls from '../Controls/AudioControls';
import { useVideoControls } from '../hooks/useVideoControls';
import useMixer from '../hooks/useMixer';

interface VideoPlayerProps {
    videoId: string;
    videoUrl: string;
    title: string;
    audios: Audio[] | undefined;
    autoplay?: boolean;
    
}

function VideoPlayer({ videoId, videoUrl, title, autoplay = false, audios }: VideoPlayerProps) {

    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);

    const {
        isPlaying,
        handleTogglePlay,
        handleRewind,
        handleSeek,
        currentTime,
        duration,
        isFullscreen,
        isInitialOpen,
        setIsInitialOpen,
    } = useVideoControls({ videoId, videoRef, videoUrl, autoplay });

    const {
        mixerState,
        handleVolumeChange,
        handleMuteToggle,
        calculateEffectiveVolume,
    } = useMixer(audios);

    const containerClassName = [
        styles.videoContainer,
        isFullscreen ? styles.fullscreen : '',
        isInitialOpen ? 'initialOpen' : '',
    ].filter(Boolean).join(' ');

    return (
        <div ref={playerContainerRef} className={containerClassName}>
            <video ref={videoRef} muted playsInline className={styles.video} >
                Your browser does not support the video tag.
            </video>
            <AudioEngine videoId={videoId} audios={audios} masterVideoRef={videoRef} calculateEffectiveVolume={calculateEffectiveVolume} />

            
            <div className={styles.overlay} >
                <div className={styles.invisiblePlayArea} onClick={() => { handleTogglePlay(); setIsInitialOpen(false); }} />
                <TimeSlider currentTime={currentTime} duration={duration} onSeek={handleSeek} videoRef={videoRef} />
                <div className={styles.uiTop}>
                    <p className={styles.videoTitle}>{title}</p>
                </div>
                <div className={styles.uiCenter}>
                    <RewindButton rewindMode="backward" onClick={() => handleRewind(-5)} />
                    <PlayPauseButton isPlaying={isPlaying} onClick={handleTogglePlay} scale={2} />
                    <RewindButton rewindMode="forward" onClick={() => handleRewind(5)} />
                </div>
                <div className={styles.uiBottom}>
                    <div className={styles.uiBottomLeft}>
                        <div className={styles.mobileHideBottomPlayButton}>
                            <PlayPauseButton isPlaying={isPlaying} onClick={handleTogglePlay} />
                        </div>
                        <VideoTimeDisplay currentTime={currentTime} duration={duration} />
                    </div>
                    <div className={styles.uiBottomRight}>
                        <AudioControls audios={audios} mixerState={mixerState} isFullscreen={isFullscreen} onVolumeChange={handleVolumeChange} onMuteToggle={handleMuteToggle} />
                        <ScreenModeButton onClick={() => toggleFullscreen(playerContainerRef.current)} isFullscreen={isFullscreen} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayer;