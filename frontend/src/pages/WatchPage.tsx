import { useParams, useNavigate } from "react-router-dom";
import { useVideo } from "@/shared/hooks/useVideo";
import VideoPlayer from "@/features/Player/components/VideoPlayer";
import { getPublicUrl } from "@/shared/utils/storage";
import { useAudio } from "@/shared/hooks/useAudio";
import WarningPopup from "@/shared/components/UI/WarningPopup/WarningPopup";

function WatchPage() {
    const { videoid } = useParams<{ videoid: string }>();

    const { data: video, isLoading: isVideoLoading, error: videoError } = useVideo(videoid!);
    const { data: audios, isLoading: isAudioLoading, error: audioError } = useAudio(videoid!);

    const navigate = useNavigate();

    return (
        <>
            <h1>{video?.title}</h1>
            <p>Schau dieses Video, um die Umfrage ausfüllen zu können.</p>
            {isVideoLoading && <p>Loading video...</p>}
            {videoError && <WarningPopup title="Error" message={`Error loading video: ${videoError?.message}`} onClose={() => { navigate(-1) }} />}
            {video && (
                <>
                    <VideoPlayer videoId={videoid!} videoUrl={getPublicUrl(`${videoid}/${video.hls_url}`, "videos")} title={video.title} audios={audios} />
                    {isAudioLoading && <p>Loading audio...</p>}
                    {audioError && <WarningPopup title="Error" message={`Error loading audio: ${audioError.message}`} onClose={() => { navigate(-1) }} />}
                    
                </>
            )}
        </>
    );
}

export default WatchPage;