import type { Audio } from '@/shared/types/media';
import StemPlayer from './StemPlayer';
import { getPublicUrl } from '@/shared/utils/storage';

interface AudioEngineProps {
    videoId: string;
    audios: Audio[] | undefined;
    masterVideoRef: React.RefObject<HTMLVideoElement | null>;
    calculateEffectiveVolume: (id: string) => number;
    calculateEffectivePan: (id: string) => number;
    masterPan: number;
}

function AudioEngine({ videoId, audios, masterVideoRef, calculateEffectiveVolume, calculateEffectivePan, masterPan }: AudioEngineProps) {
    if (!audios) return null;

    return (
        <>
            {audios.map(audio => (
                <StemPlayer
                    key={audio.id}
                    audioId={audio.id}
                    hls_url={getPublicUrl(`${videoId}/${audio.hls_url}`, "videos")}
                    volume={calculateEffectiveVolume(audio.id)}
                    pan={calculateEffectivePan(audio.id)}
                    masterPan={masterPan}
                    masterVideoRef={masterVideoRef}
                />
            ))}
        </>
    );
}

export default AudioEngine;
