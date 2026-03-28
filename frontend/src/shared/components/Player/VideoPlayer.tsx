import { useEffect } from 'react';
import Hls from 'hls.js';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
    videoUrl: string;
    videoRef: React.RefObject<HTMLVideoElement | null>;
}

function VideoPlayer({ videoUrl, videoRef }: VideoPlayerProps) {

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hls: Hls | null = null;

        if (Hls.isSupported()) {
            hls = new Hls({
                maxBufferLength: 10, // 10 statt 30 Sekunden, um RAM zu sparen
                maxMaxBufferLength: 20,
                backBufferLength: 5,
                enableWorker: true
            });
            hls.loadSource(videoUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(e => console.log("Play failed", e));
            });
        }
        else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoUrl;
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(e => console.log("Play failed", e));
            });
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [videoUrl, videoRef]);

    return (
        <video ref={videoRef} controls muted playsInline className={styles.video}>
            Your browser does not support the video tag.
        </video>
    );
}

export default VideoPlayer;