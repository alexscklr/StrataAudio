import Hls from 'hls.js';
import { useEffect, useRef } from 'react';

interface StemPlayerProps {
    hls_url: string;
    volume: number;
    masterVideoRef: React.RefObject<HTMLVideoElement | null>;
}

function StemPlayer({ hls_url, volume, masterVideoRef }: StemPlayerProps) {

    const audioRef = useRef<HTMLAudioElement>(null);
    const hlsRef = useRef<Hls | null>(null);

    useEffect(() => {
        const audioEl = audioRef.current;
        if (!audioEl) return;

        hlsRef.current = new Hls({
            enableWorker: true,
            maxBufferLength: 10,
        });

        hlsRef.current.loadSource(hls_url);
        hlsRef.current.attachMedia(audioEl);

        return () => {
            hlsRef.current?.destroy();
        };
    }, [hls_url]);

    useEffect(() => {
        const audioEl = audioRef.current;
        if (!audioEl) return;

        audioEl.volume = Math.min(1, Math.max(0, volume));
    }, [volume]);

    useEffect(() => {
        const master = masterVideoRef.current;
        const slave = audioRef.current;
        if (!master || !slave) return;

        const tryPlay = () => {
            if (master.paused || slave.readyState < 2) return;

            if (Math.abs(slave.currentTime - master.currentTime) > 0.1) {
                slave.currentTime = master.currentTime;
            }

            void slave.play().catch(() => { });
        };

        const sync = () => {
            if (Math.abs(slave.currentTime - master.currentTime) > 0.1) {
                slave.currentTime = master.currentTime;
            }
        };

        const handlePlay = () => {
            tryPlay();
        };
        const handlePause = () => slave.pause();
        const handleSeeking = () => { slave.currentTime = master.currentTime; };
        const handleReady = () => {
            tryPlay();
        };

        master.addEventListener('play', handlePlay);
        master.addEventListener('pause', handlePause);
        master.addEventListener('seeking', handleSeeking);
        master.addEventListener('timeupdate', sync);
        slave.addEventListener('canplay', handleReady);
        slave.addEventListener('loadedmetadata', handleReady);

        tryPlay();

        return () => {
            master.removeEventListener('play', handlePlay);
            master.removeEventListener('pause', handlePause);
            master.removeEventListener('seeking', handleSeeking);
            master.removeEventListener('timeupdate', sync);
            slave.removeEventListener('canplay', handleReady);
            slave.removeEventListener('loadedmetadata', handleReady);
        };
    }, [masterVideoRef]);

    return (
        <audio
            ref={audioRef}
            muted={false}
            playsInline
            style={{ display: 'none' }}
        />
    );
}

export default StemPlayer;