
import { useEffect, useState } from 'react';
import Hls from 'hls.js';

interface VideoControlsProps {
    videoId: string;
    videoRef: React.RefObject<HTMLVideoElement | null>;
    videoUrl: string;
    autoplay?: boolean;
}

export function useVideoControls({ videoRef, videoUrl, autoplay = false }: VideoControlsProps) {
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
            video.pause();
        }
    }, [isPlaying, videoRef]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleEnded = () => setIsPlaying(false);
        video.addEventListener('ended', handleEnded);
        return () => video.removeEventListener('ended', handleEnded);
    }, [videoRef]);

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const handleTogglePlay = () => setIsPlaying(prev => !prev);

    const handleRewind = (seconds: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = Math.max(0, video.currentTime + seconds);
    };

    const handleSeek = (time: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = time;
    };

    return {
        isPlaying,
        handleTogglePlay,
        handleRewind,
        handleSeek,
        currentTime,
        duration,
        isFullscreen,
        isInitialOpen,
        setIsInitialOpen,
    };
};