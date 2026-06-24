import type { Audio } from '../types/media';
import StemPlayer from './StemPlayer';
import type { ResolvePublicUrl } from '../utils/publicUrlResolver';

interface AudioEngineProps {
    videoId: string;
    audios: Audio[] | undefined;
    masterVideoRef: React.RefObject<HTMLVideoElement | null>;
    calculateEffectiveVolume: (id: string) => number;
    calculateEffectivePan: (id: string) => number;
    masterPan: number;
    resolvePublicUrl: ResolvePublicUrl;
}

function AudioEngine({ videoId, audios, masterVideoRef, calculateEffectiveVolume, calculateEffectivePan, masterPan, resolvePublicUrl }: AudioEngineProps) {
    if (!audios) return null;

    return (
        <>
            {audios.map(audio => (
                <StemPlayer
                    key={audio.id}
                    audioId={audio.id}
                    hls_url={resolvePublicUrl(`${videoId}/${audio.hls_url}`, "videos")}
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
