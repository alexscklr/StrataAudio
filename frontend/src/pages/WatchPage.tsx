import { useParams } from "react-router-dom";
import { useVideo } from "@/shared/hooks/useVideo";
import VideoPlayer from "@/shared/components/Player/VideoPlayer";
import { getPublicUrl } from "@/shared/utils/storage";
import { useAudio } from "@/shared/hooks/useAudio";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from "@/shared/components/Player/AudioPlayer";
import AudioSlider from "@/shared/components/UI/AudioSlider";

function WatchPage() {
    const { videoid } = useParams<{ videoid: string }>();
    const { data: video, isLoading: isVideoLoading, error: videoError } = useVideo(videoid!);
    const { data: audios, isLoading: isAudioLoading, error: audioError } = useAudio(videoid!);

    const videoRef = useRef<HTMLVideoElement>(null);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

    const [volumes, setVolumes] = useState<{ [audioId: string]: number }>({});

    useEffect(() => {
        const context = new AudioContext();
        setAudioContext(context);

        return () => {
            void context.close();
        };
    }, []);

    const handleVolumeChange = (id: string, val: number) => {
        setVolumes(prev => ({ ...prev, [id]: val }));
    };

    return (
        <>
            <h1>{video?.title}</h1>
            <p>Schau dieses Video, um die Umfrage ausfüllen zu können.</p>
            {isVideoLoading && <p>Loading video...</p>}
            {videoError && <p>Error loading video: {videoError.message}</p>}
            {video && (
                <>
                    <VideoPlayer videoUrl={getPublicUrl(`${videoid}/${video.hls_url}`, "videos")} videoRef={videoRef} />
                    {isAudioLoading && <p>Loading audio...</p>}
                    {audioError && <p>Error loading audio: {audioError.message}</p>}
                    {audios?.map(audio => (
                        <div key={audio.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <AudioPlayer hls_url={getPublicUrl(`${videoid}/${audio.hls_url}`, "videos")} volume={volumes[audio.id] ?? 1} masterVideoRef={videoRef} audioContext={audioContext} />
                            <AudioSlider audioId={audio.id} volume={volumes[audio.id] ?? 1} onVolumeChange={handleVolumeChange} />
                            <img src={getPublicUrl(`icons/${audio.icon_url}`, "system")} alt={audio.type} width={32} height={32} />
                            <p>Audio loaded: {audio.title}</p>
                        </div>
                    ))}
                </>
            )}
        </>
    );
}

export default WatchPage;