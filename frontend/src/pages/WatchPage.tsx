import { useParams, useNavigate } from "react-router-dom";
import { useVideo } from "@/shared/hooks/useVideo";
import VideoPlayer from "@/features/Player/components/VideoPlayer";
import { getPublicUrl } from "@/shared/utils/storage";
import { useAudio } from "@/shared/hooks/useAudio";
import WarningPopup from "@/shared/components/UI/WarningPopup/WarningPopup";
import VideoSurvey from "@/features/analytics/components/VideoSurvey";
import { useState } from "react";
import type { AudioConfigurationSnapshot } from "@/shared/types/mixer";
import { VideoWatchMode, type VideoWatchMode as WatchMode } from "@/shared/types/media";
import { getCompletedWatchModes, getOrCreateWatchModeSequence, markWatchModeCompleted } from "@/shared/lib/watchModeSequence";
import WatchModeProgressCard from "@/shared/components/WatchModeProgressCard/WatchModeProgressCard";

function WatchPage() {
    const { videoid } = useParams<{ videoid: string }>();
    const hasTrackingConsent = localStorage.getItem('user-consent') === 'true';

    const resolvedVideoId = videoid ?? '';
    const modeSequence = resolvedVideoId ? getOrCreateWatchModeSequence(resolvedVideoId) : [VideoWatchMode.Mixer, VideoWatchMode.Standard];
    const initialCompletedModes = resolvedVideoId ? getCompletedWatchModes(resolvedVideoId) : [];

    const initialCurrentMode = modeSequence.find((mode) => !initialCompletedModes.includes(mode)) ?? modeSequence[modeSequence.length - 1];

    const { data: video, isLoading: isVideoLoading, error: videoError } = useVideo(videoid!);
    const { data: audios, isLoading: isAudioLoading, error: audioError } = useAudio(videoid!);

    const [completedModes, setCompletedModes] = useState<WatchMode[]>(initialCompletedModes);
    const [surveyUnlocked, setSurveyUnlocked] = useState(() => initialCompletedModes.length === modeSequence.length);
    const [currentMode, setCurrentMode] = useState<WatchMode>(initialCurrentMode);
    const [audioConfigurationSnapshots, setAudioConfigurationSnapshots] = useState<Partial<Record<WatchMode, AudioConfigurationSnapshot>>>({});

    const navigate = useNavigate();

    const completedCount = completedModes.length;
    const totalModes = modeSequence.length;
    const nextRequiredMode = modeSequence.find((mode) => !completedModes.includes(mode));

    const handleVideoEnd = () => {
        if (!resolvedVideoId) return;

        const nextCompletedModes = markWatchModeCompleted(resolvedVideoId, currentMode);
        setCompletedModes(nextCompletedModes);

        const remainingModes = modeSequence.filter((mode) => !nextCompletedModes.includes(mode));

        if (remainingModes.length === 0) {
            setSurveyUnlocked(true);
            return;
        }

        setCurrentMode(remainingModes[0]);
    }

    const handleAudioConfigurationReady = (snapshot: AudioConfigurationSnapshot) => {
        if (!hasTrackingConsent) {
            return;
        }

        setAudioConfigurationSnapshots((currentSnapshots) => ({
            ...currentSnapshots,
            [currentMode]: snapshot,
        }));
    };

    return (
        <>
            <h1>{video?.title}</h1>
            
            {isVideoLoading && <p>Loading video...</p>}
            {videoError && <WarningPopup title="Error" message={`Error loading video: ${videoError?.message}`} onClose={() => { navigate(-1) }} />}
            {video && (
                <>
                    <VideoPlayer
                        videoId={videoid!}
                        videoUrl={getPublicUrl(`${videoid}/${video.hls_url}`, "videos")}
                        title={video.title}
                        audios={audios}
                        key={`${videoid}-${currentMode}`}
                        canControlVideo={{ seek: true, rewind: true, pause: true, fullscreen: false }}
                        watchMode={currentMode}
                        onAudioConfigurationReady={handleAudioConfigurationReady}
                        onVideoEnd={handleVideoEnd}
                    />
                    {isAudioLoading && <p>Loading audio...</p>}
                    {audioError && <WarningPopup title="Error" message={`Error loading audio: ${audioError.message}`} onClose={() => { navigate(-1) }} />}

                </>
            )}
            <div className="spacer" style={{ height: "5rem" }}></div>
            <WatchModeProgressCard
                completedCount={completedCount}
                totalModes={totalModes}
                currentMode={currentMode}
                nextRequiredMode={nextRequiredMode}
                surveyUnlocked={surveyUnlocked}
            />
            <VideoSurvey
                videoId={videoid!}
                videoTitle={video?.title || "Unknown Video"}
                audioConfigurationSnapshot={audioConfigurationSnapshots[VideoWatchMode.Mixer] ?? null}
                unlocked={surveyUnlocked && hasTrackingConsent}
            />
        </>
    );
}

export default WatchPage;