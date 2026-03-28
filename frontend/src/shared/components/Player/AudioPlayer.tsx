
import Hls from 'hls.js';
import { useEffect, useRef } from 'react';

interface AudioPlayerProps {
    hls_url: string;
    volume: number;
    masterVideoRef: React.RefObject<HTMLVideoElement | null>;
    audioContext: AudioContext | null;
}

function AudioPlayer({ hls_url, volume, masterVideoRef, audioContext }: AudioPlayerProps) {

    const audioRef = useRef<HTMLAudioElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

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
        if (!audioContext || !audioRef.current || sourceNodeRef.current) return;

        const source = audioContext.createMediaElementSource(audioRef.current);
        const gainNode = audioContext.createGain();

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        sourceNodeRef.current = source;
        gainNodeRef.current = gainNode;

        return () => {
            source.disconnect();
            gainNode.disconnect();
        };
    }, [audioContext]);

    useEffect(() => { // gegen Knackser
        if (gainNodeRef.current && audioContext) {
            gainNodeRef.current.gain.setTargetAtTime(
                volume,
                audioContext.currentTime,
                0.02
            );
            return;
        }
    }, [volume, audioContext]);

    useEffect(() => {
        const master = masterVideoRef.current;
        const slave = audioRef.current;
        if (!master || !slave) return;

        const sync = () => {
            if (Math.abs(slave.currentTime - master.currentTime) > 0.1) {
                slave.currentTime = master.currentTime;
            }
        };

        const handlePlay = () => slave.play();
        const handlePause = () => slave.pause();
        const handleSeeking = () => { slave.currentTime = master.currentTime; };

        master.addEventListener('play', handlePlay);
        master.addEventListener('pause', handlePause);
        master.addEventListener('seeking', handleSeeking);
        master.addEventListener('timeupdate', sync);

        return () => {
            master.removeEventListener('play', handlePlay);
            master.removeEventListener('pause', handlePause);
            master.removeEventListener('seeking', handleSeeking);
            master.removeEventListener('timeupdate', sync);
        };
    }, [audioContext, masterVideoRef]);

    return (
        <audio
            ref={audioRef}
            muted={false}
            playsInline
            style={{ display: 'none' }}
        />
    );
}

export default AudioPlayer;