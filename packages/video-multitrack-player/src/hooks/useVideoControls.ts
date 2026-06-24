
import { useEffect, useState } from 'react';
import Hls from 'hls.js';
import type { VideoControlPermissions } from '../types/media';

interface VideoControlsProps {
    videoId: string;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    playerContainerRef: React.RefObject<HTMLDivElement | null>;
    videoUrl: string;
    autoplay?: boolean;
    canControlVideo?: VideoControlPermissions;
}

export function useVideoControls({
    videoRef,
    playerContainerRef,
    videoUrl,
    autoplay = false,
    canControlVideo,
}: VideoControlsProps) {
    const [isPlaying, setIsPlaying] = useState(autoplay);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isInitialOpen, setIsInitialOpen] = useState(true);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hls: Hls | null = null;

        if (Hls.isSupported()) {
            hls = new Hls({
                maxBufferLength: 10,
                maxMaxBufferLength: 20,
                backBufferLength: 5,
                enableWorker: true
            });
            hls.loadSource(videoUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (autoplay) {
                    video.play().catch(e => console.log("Play failed", e));
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoUrl;
        }

        const handleTimeUpdate = () => setCurrentTime(video.currentTime);
        const handleDurationChange = () => setDuration(video.duration);

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('durationchange', handleDurationChange);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('durationchange', handleDurationChange);
            hls?.destroy();
        };
    }, [videoUrl, autoplay, videoRef]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.play().catch(e => console.log("Play failed", e));
        } else {
            if (canControlVideo?.pause === false) return;
            video.pause();
        }
    }, [isPlaying, videoRef, canControlVideo]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleEnded = () => setIsPlaying(false);
        video.addEventListener('ended', handleEnded);
        return () => video.removeEventListener('ended', handleEnded);
    }, [videoRef]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        handleFullscreenChange();
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    useEffect(() => {
        if (canControlVideo?.fullscreen !== false) return;
        if (!document.fullscreenElement) return;

        document.exitFullscreen().catch((e) => console.log("Exit fullscreen failed", e));
    }, [canControlVideo]);

    const handleTogglePlay = () => {
        if (canControlVideo?.pause === false && isPlaying === true) return;
        setIsPlaying(prev => !prev);
    };

    const handleRewind = (seconds: number) => {
        const video = videoRef.current;
        if (!video) return;
        if (canControlVideo?.rewind === false) return;
        video.currentTime = Math.max(0, video.currentTime + seconds);
    };

    const handleSeek = (time: number) => {
        const video = videoRef.current;
        if (!video) return;
        if (canControlVideo?.seek === false) return;
        video.currentTime = time;
    };

    const handleToggleFullscreen = () => {
        if (canControlVideo?.fullscreen === false) return;

        const containerElement = playerContainerRef.current;
        if (!containerElement) return;

        if (!document.fullscreenElement) {
            containerElement.requestFullscreen().catch((e) => console.log("Fullscreen failed", e));
            return;
        }

        document.exitFullscreen().catch((e) => console.log("Exit fullscreen failed", e));
    };

    return {
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
    };
};