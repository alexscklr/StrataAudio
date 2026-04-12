import { useEffect, useRef, useState } from 'react';
import type { Audio, VideoControlPermissions } from '@/shared/types/media';
import styles from './VideoPlayer.module.css';
import { PlayPauseButton } from '../Controls/PlayPauseButton';
import VideoTimeDisplay from '../Controls/VideoTimeDisplay';
import ScreenModeButton from '../Controls/ScreenModeButton';
import RewindButton from '../Controls/RewindButton';
import TimeSlider from '../Controls/TimeSlider';
import AudioEngine from './AudioEngine';
import AudioControls from '../Controls/AudioControls';
import { useVideoControls } from '../hooks/useVideoControls';
import useMixer from '../hooks/useMixer';
import type { AudioConfigurationSnapshot } from '@/shared/types/mixer';
import type { VideoWatchMode } from '@/shared/types/media';

interface VideoPlayerProps {
    videoId: string;
    videoUrl: string;
    title: string;
    audios: Audio[] | undefined;
    autoplay?: boolean;
    canControlVideo?: VideoControlPermissions;
    onVideoEnd?: () => void;
    onAudioConfigurationReady?: (snapshot: AudioConfigurationSnapshot) => void;
    watchMode: VideoWatchMode;
}

function VideoPlayer({ videoId, videoUrl, title, autoplay = false, audios, canControlVideo, onVideoEnd, onAudioConfigurationReady, watchMode }: VideoPlayerProps) {

    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const [isVideoReady, setIsVideoReady] = useState(false);

    const {
        isPlaying,
        handleTogglePlay,
        handleRewind,
        handleSeek,
        handleToggleFullscreen,
        currentTime,
        duration,
        isFullscreen,
        isInitialOpen,
        setIsInitialOpen,
    } = useVideoControls({
        videoId,
        videoRef,
        playerContainerRef,
        videoUrl,
        autoplay,
        canControlVideo,
    });

    const {
        mixerState,
        handleVolumeChange,
        handleVolumeCommit,
        handleMasterVolumeChange,
        handleMasterVolumeCommit,
        handleMuteToggle,
        calculateEffectiveVolume,
        getAudioConfigurationSnapshot,
    } = useMixer(audios);

    const handleVideoEnded = () => {
        onAudioConfigurationReady?.(getAudioConfigurationSnapshot());
        onVideoEnd?.();
    };

    useEffect(() => {
        if (isPlaying && isInitialOpen) {
            setIsInitialOpen(false);
        }
    }, [isPlaying, isInitialOpen, setIsInitialOpen]);

    const containerClassName = [
        styles.videoContainer,
        isFullscreen ? styles.fullscreen : '',
        isInitialOpen ? styles.initialOpen : '',
    ].filter(Boolean).join(' ');

    return (
        <div ref={playerContainerRef} className={containerClassName}>
            <div
                className={`${styles.playerPlaceholder} ${isVideoReady ? styles.playerPlaceholderHidden : ''}`}
                aria-hidden="true"
            />
            <video ref={videoRef} muted playsInline className={styles.video} onEnded={handleVideoEnded} onCanPlay={() => setIsVideoReady(true)}>
                Your browser does not support the video tag.
            </video>
            <AudioEngine videoId={videoId} audios={audios} masterVideoRef={videoRef} calculateEffectiveVolume={calculateEffectiveVolume} />

            
            <div className={styles.overlay} >
                <div className={styles.invisiblePlayArea} onClick={() => { handleTogglePlay(); }} />
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
                        <AudioControls
                            audios={audios}
                            mixerState={mixerState}
                            isFullscreen={isFullscreen}
                            onVolumeChange={handleVolumeChange}
                            onVolumeCommit={handleVolumeCommit}
                            onMasterVolumeChange={handleMasterVolumeChange}
                            onMasterVolumeCommit={handleMasterVolumeCommit}
                            onMuteToggle={handleMuteToggle}
                            watchMode={watchMode}
                        />
                        <ScreenModeButton onClick={handleToggleFullscreen} isFullscreen={isFullscreen} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayer;