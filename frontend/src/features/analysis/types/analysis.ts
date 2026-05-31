export interface AnalysisFilters {
  videoId: string;
  genre: string;
  audioOutputType: string;
  ageGroup: string;
  osName: string;
  browserName: string;
  disturbanceMin: number;
  disturbanceMax: number;
  maxDisturbanceSharePercent: number;
  excludeNoVideos: boolean;
  syncDisturbance: "all" | "ja" | "nein";
  excludeBiasedParticipants: boolean;
}

export interface ParticipantBiasFlagRow {
  participant_id: string;
  is_biased: boolean;
  reason: string | null;
}

export interface ParticipantRow {
  id: string;
  created_at: string;
  user_hash: string;
  browser_name: string | null;
  browser_version: string | null;
  os_name: string | null;
  os_version: string | null;
  screen_res_width: number | null;
  screen_res_height: number | null;
}

export interface DemographicsRow {
  participant_id: string;
  streaming_usage: string | null;
  audio_balance_disturbance: number | null;
  audio_settings_satisfaction: number | null;
  age_group: string | null;
  gender: string | null;
  audio_output_type: string | null;
  created_at: string;
}

export interface SurveyAnswersPayload {
  survey_id?: string;
  answers?: Record<string, unknown>;
}

export interface SurveyResponseRow {
  participant_id: string;
  video_id: string;
  first_watch_mode: "standard" | "mixer" | null;
  responses: SurveyAnswersPayload;
  created_at: string;
}

export interface EndSurveyResponseRow {
  participant_id: string;
  responses: SurveyAnswersPayload;
  created_at: string;
}

export interface AudioTrackStateLike {
  volume?: number;
  pan?: number;
  isMuted?: boolean;
}

export interface FinalSettingsLike {
  masterVolume?: number;
  masterPan?: number;
  isMasterMuted?: boolean;
  trackstates?: Record<string, AudioTrackStateLike>;
}

export interface InteractionEntryLike {
  t?: number;
  label?: string;
  val?: number | boolean;
}

export interface AudioConfigurationRow {
  id: string;
  participant_id: string;
  video_id: string;
  final_settings: FinalSettingsLike;
  interaction_log: InteractionEntryLike[];
  total_interactions: number | null;
  time_to_mix_ms: number | null;
  created_at: string;
}

export interface VideoRow {
  id: string;
  genre_id: string;
  video_genres: {
    id: string;
    label_de: string;
    label_en: string | null;
  } | {
    id: string;
    label_de: string;
    label_en: string | null;
  }[] | null;
  duration_seconds: number | null;
  video_contents:
    | {
        title_de: string;
        title_en: string | null;
      }
    | {
        title_de: string;
        title_en: string | null;
      }[]
    | null;
}

export interface AudioRowSnippet {
  id: string;
  audio_contents: {
    title_de: string;
    title_en: string | null;
  } | {
    title_de: string;
    title_en: string | null;
  }[] | null;
}

export interface AnalysisRawData {
  participants: ParticipantRow[];
  demographics: DemographicsRow[];
  participantBiasFlags: ParticipantBiasFlagRow[];
  surveyResponses: SurveyResponseRow[];
  endSurveyResponses: EndSurveyResponseRow[];
  audioConfigurations: AudioConfigurationRow[];
  videos: VideoRow[];
  audios: AudioRowSnippet[];
  warnings: string[];
}

export interface BoxPlotStats {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

export interface LikertBoxPlotItem {
  id: string;
  label: string;
  values: number[];
  stats: BoxPlotStats | null;
}

export interface KpiSummary {
  participantsCount: number;
  demographicsCount: number;
  videoSurveyCount: number;
  endSurveyCount: number;
  completionRate: number;
  susScore: number | null;
  npsScore: number | null;
  ueqScore: number | null;
  averageNpsRating: number | null;
  mixerPreferencePercent: number | null;
  medianTimeToFirstInteractionSec: number | null;
}

export interface PreferenceBreakdown {
  mixerCount: number;
  standardCount: number;
}

export interface InteractionTimelinePoint {
  second: number;
  count: number;
  muteCount: number;
  panCount: number;
  volumeCount: number;
  trackVolumes: Record<string, number>;
}

export interface TrackDeviationItem {
  pairId: string;
  primaryTrackId: string;
  secondaryTrackId: string;
  averageVolumeDifference: number; // primaryTrackId volume minus secondaryTrackId volume
  sampleCount: number;
}

export interface ParticipantDetail {
  participant: ParticipantRow;
  demographics: DemographicsRow | null;
  biasFlag: ParticipantBiasFlagRow | null;
  videoResponses: SurveyResponseRow[];
  endSurveyResponse: EndSurveyResponseRow | null;
  configurations: AudioConfigurationRow[];
}

export interface UeqResult {
  dimension: string;
  score: number;
}

export interface CrosstabData {
  attribute: string;
  groups: Array<{
    name: string;
    avgSus: number | null;
    avgNps: number | null;
    avgDeltaVol: number | null; // Average absolute volume deviation (activity)
    count: number;
  }>;
}

export interface AnalysisDerivedData {
  filters: AnalysisFilters;
  availableVideoOptions: Array<{ id: string; label: string }>;
  availableGenres: string[];
  availableAudioOutputs: string[];
  availableAgeGroups: string[];
  availableOsNames: string[];
  availableBrowserNames: string[];
  kpis: KpiSummary;
  likertBoxPlots: LikertBoxPlotItem[];
  preferenceBreakdown: PreferenceBreakdown;
  interactionTimeline: InteractionTimelinePoint[];
  trackDeviations: TrackDeviationItem[];
  participantDetails: ParticipantDetail[];
  audioDisturbances: { yes: number; no: number };
  ueqResults: UeqResult[];
  crosstabs: CrosstabData[];
  videoLabelMap: Record<string, string>;
  audioLabelMap: Record<string, string>;
}
