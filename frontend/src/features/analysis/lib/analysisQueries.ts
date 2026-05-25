import { supabase } from "@/api/supabaseClient";
import type {
  AnalysisRawData,
  AudioConfigurationRow,
  DemographicsRow,
  EndSurveyResponseRow,
  ParticipantRow,
  SurveyResponseRow,
  VideoRow,
} from "@/features/analysis/types/analysis";

const formatWarning = (source: string, error: unknown): string => {
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message?: string }).message ?? "unknown error");
    return `${source}: ${message}`;
  }
  return `${source}: unknown error`;
};

const normalizeVideos = (rows: VideoRow[]): VideoRow[] =>
  rows.map((row) => {
    // Normalisiere video_contents
    let normalizedContents = row.video_contents;
    if (Array.isArray(row.video_contents)) {
      normalizedContents = row.video_contents[0] ?? null;
    }

    // Normalisiere video_genres
    let normalizedGenres = row.video_genres;
    if (Array.isArray(row.video_genres)) {
      normalizedGenres = row.video_genres[0] ?? null;
    }

    return {
      ...row,
      video_contents: normalizedContents,
      video_genres: normalizedGenres as any,
    };
  });

export const fetchAnalysisRawData = async (): Promise<AnalysisRawData> => {
  const warnings: string[] = [];

  const participantsPromise = supabase
    .from("participants")
    .select(
      "id, created_at, user_hash, browser_name, browser_version, os_name, os_version, screen_res_width, screen_res_height",
    )
    .returns<ParticipantRow[]>();

  const demographicsPromise = supabase
    .from("demographics")
    .select(
      "participant_id, streaming_usage, audio_balance_disturbance, audio_settings_satisfaction, age_group, gender, audio_output_type, created_at",
    )
    .returns<DemographicsRow[]>();

  const surveyResponsesPromise = supabase
    .from("survey_responses")
    .select("participant_id, video_id, first_watch_mode, responses, created_at")
    .returns<SurveyResponseRow[]>();

  const endSurveyResponsesPromise = supabase
    .from("end_survey_responses")
    .select("participant_id, responses, created_at")
    .returns<EndSurveyResponseRow[]>();

  const audioConfigurationsPromise = supabase
    .from("audio_configurations")
    .select(
      "id, participant_id, video_id, final_settings, interaction_log, total_interactions, time_to_mix_ms, created_at",
    )
    .returns<AudioConfigurationRow[]>();

  const videosPromise = supabase
    .from("videos")
    .select("*, video_genres(*), video_contents(*)")
    .returns<VideoRow[]>();

  const audiosPromise = supabase
    .from("audios")
    .select("id, audio_contents(title_de, title_en)")
    .returns<any[]>();

  const [
    participantsResult,
    demographicsResult,
    surveyResponsesResult,
    endSurveyResponsesResult,
    audioConfigurationsResult,
    videosResult,
    audiosResult,
  ] = await Promise.all([
    participantsPromise,
    demographicsPromise,
    surveyResponsesPromise,
    endSurveyResponsesPromise,
    audioConfigurationsPromise,
    videosPromise,
    audiosPromise,
  ]);

  const participants = participantsResult.error
    ? (warnings.push(formatWarning("participants", participantsResult.error)), [])
    : (participantsResult.data ?? []);

  const demographics = demographicsResult.error
    ? (warnings.push(formatWarning("demographics", demographicsResult.error)), [])
    : (demographicsResult.data ?? []);

  const surveyResponses = surveyResponsesResult.error
    ? (warnings.push(formatWarning("survey_responses", surveyResponsesResult.error)), [])
    : (surveyResponsesResult.data ?? []);

  const endSurveyResponses = endSurveyResponsesResult.error
    ? (warnings.push(formatWarning("end_survey_responses", endSurveyResponsesResult.error)), [])
    : (endSurveyResponsesResult.data ?? []);

  const audioConfigurations = audioConfigurationsResult.error
    ? (warnings.push(formatWarning("audio_configurations", audioConfigurationsResult.error)), [])
    : (audioConfigurationsResult.data ?? []);

  const videos = videosResult.error
    ? (warnings.push(formatWarning("videos", videosResult.error)), [])
    : normalizeVideos(videosResult.data ?? []);

  const audiosRaw = audiosResult.error
    ? (warnings.push(formatWarning("audios", audiosResult.error)), [])
    : (audiosResult.data ?? []);

  // Normalize audios to handle potential array structures from Supabase
  const audios = audiosRaw.map((a: any) => ({
    ...a,
    audio_contents: Array.isArray(a.audio_contents) ? a.audio_contents[0] : a.audio_contents
  }));

  return {
    participants,
    demographics,
    surveyResponses,
    endSurveyResponses,
    audioConfigurations,
    videos,
    audios,
    warnings,
  };
};
