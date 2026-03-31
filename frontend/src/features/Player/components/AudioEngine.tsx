import type { Audio } from '@/shared/types/media';
import StemPlayer from './StemPlayer';
import { getPublicUrl } from '@/shared/utils/storage';

interface AudioEngineProps {
    videoId: string;
    audios: Audio[] | undefined;
    masterVideoRef: React.RefObject<HTMLVideoElement | null>;
    calculateEffectiveVolume: (id: string) => number;
}

function AudioEngine({ videoId, audios, masterVideoRef, calculateEffectiveVolume }: AudioEngineProps) {
    if (!audios) return null;

    return (
        <>
            {audios.map(audio => (
                <StemPlayer
                    key={audio.id}
                    hls_url={getPublicUrl(`${videoId}/${audio.hls_url}`, "videos")}
                    volume={calculateEffectiveVolume(audio.id)}
                    masterVideoRef={masterVideoRef}
                />
            ))}
        </>
    );
}

export default AudioEngine;
