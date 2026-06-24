import { useCallback, useEffect, useRef, useState } from 'react';
import type { Audio, VideoControlPermissions } from '../types/media';
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
import type { AudioConfigurationSnapshot } from '../types/mixer';
import type { VideoWatchMode } from '../types/media';
import {
    passthroughPublicUrlResolver,
    type ResolvePublicUrl,
} from '../utils/publicUrlResolver';

export interface VideoPlayerProps {
    videoId: string;
    videoUrl: string;
    title: string;
    audios: Audio[] | undefined;
    autoplay?: boolean;
    canControlVideo?: VideoControlPermissions;
    onVideoEnd?: () => void;
    onMidpointReached?: (snapshot: AudioConfigurationSnapshot) => void;
    onAudioConfigurationReady?: (snapshot: AudioConfigurationSnapshot) => void;
    watchMode: VideoWatchMode;
    resolvePublicUrl?: ResolvePublicUrl;
}

function VideoPlayer({ videoId, videoUrl, title, autoplay = false, audios, canControlVideo, onVideoEnd, onMidpointReached, onAudioConfigurationReady, watchMode, resolvePublicUrl = passthroughPublicUrlResolver }: VideoPlayerProps) {
    const FULLSCREEN_CONTROLS_TIMEOUT_MS = 2200;

    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [isPlayerHovered, setIsPlayerHovered] = useState(false);
    const [isTouchOpen, setIsTouchOpen] = useState(false);
    const [isFullscreenControlsVisible, setIsFullscreenControlsVisible] = useState(false);
    const touchCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fullscreenControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasReachedMidpointRef = useRef(false);

    const handleTouchStart = () => {
        if (touchCloseTimerRef.current) clearTimeout(touchCloseTimerRef.current);
        setIsTouchOpen(true);
        touchCloseTimerRef.current = setTimeout(() => setIsTouchOpen(false), 3500);
    };

    useEffect(() => {
        return () => {
            if (touchCloseTimerRef.current) clearTimeout(touchCloseTimerRef.current);
            if (fullscreenControlsTimerRef.current) clearTimeout(fullscreenControlsTimerRef.current);
        };
    }, []);

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

    const showFullscreenControls = useCallback(() => {
        if (!isFullscreen) return;

        setIsFullscreenControlsVisible(true);
        if (fullscreenControlsTimerRef.current) clearTimeout(fullscreenControlsTimerRef.current);

        if (!isPlaying) return;

        fullscreenControlsTimerRef.current = setTimeout(() => {
            setIsFullscreenControlsVisible(false);
        }, FULLSCREEN_CONTROLS_TIMEOUT_MS);
    }, [isFullscreen, isPlaying]);

    const {
        mixerState,
        resetMixerState,
        handleVolumeChange,
        handleVolumeCommit,
        handleMasterVolumeChange,
        handleMasterVolumeCommit,
        handlePanChange,
        handlePanCommit,
        handleMasterPanChange,
        handleMasterPanCommit,
        handleMuteToggle,
        calculateEffectiveVolume,
        calculateEffectivePan,
        getAudioConfigurationSnapshot,
    } = useMixer(audios);

    const handleVideoEnded = () => {
        onAudioConfigurationReady?.(getAudioConfigurationSnapshot());
        onVideoEnd?.();
    };

    useEffect(() => {
        hasReachedMidpointRef.current = false;
    }, [videoId, videoUrl]);

    useEffect(() => {
        if (!onMidpointReached) return;
        if (hasReachedMidpointRef.current) return;
        if (!Number.isFinite(duration) || duration <= 0) return;

        if (currentTime >= duration / 2) {
            hasReachedMidpointRef.current = true;
            onMidpointReached(getAudioConfigurationSnapshot());
        }
    }, [currentTime, duration, getAudioConfigurationSnapshot, onMidpointReached]);

    useEffect(() => {
        if (isPlaying && isInitialOpen) {
            setIsInitialOpen(false);
        }
    }, [isPlaying, isInitialOpen, setIsInitialOpen]);

    useEffect(() => {
        resetMixerState();
    }, [resetMixerState, watchMode]);

    useEffect(() => {
        if (!isFullscreen) {
            if (fullscreenControlsTimerRef.current) clearTimeout(fullscreenControlsTimerRef.current);
            setIsFullscreenControlsVisible(false);
            return;
        }

        showFullscreenControls();
    }, [isFullscreen, isPlaying, showFullscreenControls]);

    const containerClassName = [
        styles.videoContainer,
        isFullscreen ? styles.fullscreen : '',
        isFullscreen && isFullscreenControlsVisible ? styles.controlsVisible : '',
        isInitialOpen ? styles.initialOpen : '',
        isTouchOpen ? styles.touchOpen : '',
    ].filter(Boolean).join(' ');

    const isAudioControlsExpanded = (isFullscreen ? isFullscreenControlsVisible : isPlayerHovered) || isInitialOpen || isTouchOpen;

    return (
        <div
            ref={playerContainerRef}
            className={containerClassName}
            onMouseEnter={() => setIsPlayerHovered(true)}
            onMouseLeave={() => setIsPlayerHovered(false)}
            onMouseMove={showFullscreenControls}
            onTouchStart={handleTouchStart}
        >
            <div
                className={`${styles.playerPlaceholder} ${isVideoReady ? styles.playerPlaceholderHidden : ''}`}
                aria-hidden="true"
            />
            <video ref={videoRef} muted playsInline className={styles.video} onEnded={handleVideoEnded} onCanPlay={() => setIsVideoReady(true)}>
                Your browser does not support the video tag.
            </video>
            <AudioEngine
                videoId={videoId}
                audios={audios}
                masterVideoRef={videoRef}
                calculateEffectiveVolume={calculateEffectiveVolume}
                calculateEffectivePan={calculateEffectivePan}
                masterPan={mixerState.masterPan}
                resolvePublicUrl={resolvePublicUrl}
            />

            
            <div className={styles.overlay} >
                <div className={styles.invisiblePlayArea} onClick={() => { handleTogglePlay(); }} />
                <TimeSlider currentTime={currentTime} duration={duration} onSeek={handleSeek} videoRef={videoRef} />
                <div className={styles.uiTop}>
                    <p className={styles.videoTitle}>{title}</p>
                </div>
                <div className={styles.uiBottom}>
                    <div className={styles.uiBottomLeft}>
                        <div className={styles.transportControls}>
                            {canControlVideo?.rewind && <RewindButton rewindMode="backward" onClick={() => handleRewind(-5)} />}
                            {canControlVideo?.pause && <PlayPauseButton isPlaying={isPlaying} onClick={handleTogglePlay} />}
                            {canControlVideo?.rewind && <RewindButton rewindMode="forward" onClick={() => handleRewind(5)} />}
                        </div>
                        <VideoTimeDisplay currentTime={currentTime} duration={duration} />
                    </div>
                    <div className={styles.uiBottomRight}>
                        <ScreenModeButton onClick={handleToggleFullscreen} isFullscreen={isFullscreen} />
                    </div>
                </div>
            </div>

            <AudioControls
                audios={audios}
                mixerState={mixerState}
                isFullscreen={isFullscreen}
                onVolumeChange={handleVolumeChange}
                onVolumeCommit={handleVolumeCommit}
                onMasterVolumeChange={handleMasterVolumeChange}
                onMasterVolumeCommit={handleMasterVolumeCommit}
                onPanChange={handlePanChange}
                onPanCommit={handlePanCommit}
                onMasterPanChange={handleMasterPanChange}
                onMasterPanCommit={handleMasterPanCommit}
                onMuteToggle={handleMuteToggle}
                watchMode={watchMode}
                isExpanded={isAudioControlsExpanded}
                resolvePublicUrl={resolvePublicUrl}
            />
        </div>
    );
}

export default VideoPlayer;