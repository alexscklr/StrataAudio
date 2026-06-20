import type {
  AnalysisFilters,
  AnalysisRawData,
  BoxPlotStats,
  SurveyResponseRow,
  VideoRow,
} from "@/features/analysis/types/analysis";

export const DEFAULT_FILTERS: AnalysisFilters = {
  videoId: "all",
  genre: "all",
  audioOutputType: "all",
  ageGroup: "all",
  osName: "all",
  browserName: "all",
  disturbanceMin: 1,
  disturbanceMax: 7,
  maxDisturbanceSharePercent: 105,
  excludeNoVideos: false,
  syncDisturbance: "all",
  excludeBiasedParticipants: true,
};

export const getNumericAnswer = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const normalized = trimmed.includes(",") && !trimmed.includes(".")
      ? trimmed.replace(",", ".")
      : trimmed;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

export const getStringAnswer = (value: unknown): string | null =>
  typeof value === "string" ? value : null;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const extractAnswers = (payload: unknown): Record<string, unknown> => {
  if (!isRecord(payload)) {
    return {};
  }

  const answers = payload.answers;
  if (isRecord(answers)) {
    return answers;
  }

  const responses = payload.responses;
  if (isRecord(responses)) {
    const nestedAnswers = responses.answers;
    if (isRecord(nestedAnswers)) {
      return nestedAnswers;
    }
    return responses;
  }

  if (
    "id" in payload ||
    "participant_id" in payload ||
    "created_at" in payload
  ) {
    return {};
  }

  return payload;
};

export const getSyncDisturbanceValue = (
  response: SurveyResponseRow,
): "ja" | "nein" | null => {
  const answers = extractAnswers(response.responses);
  const sync2 = answers["sync-2"] ?? answers["sync2"];

  if (typeof sync2 === "boolean") {
    return sync2 ? "ja" : "nein";
  }

  if (typeof sync2 === "string") {
    const normalized = sync2.trim().toLowerCase();
    if (normalized === "ja") {
      return "ja";
    }
    if (normalized === "nein") {
      return "nein";
    }
  }

  return null;
};

const quantile = (sorted: number[], q: number): number => {
  if (sorted.length === 0) {
    return 0;
  }
  if (sorted.length === 1) {
    return sorted[0];
  }
  const index = (sorted.length - 1) * q;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) {
    return sorted[lower];
  }
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

export const toBoxPlotStats = (values: number[]): BoxPlotStats | null => {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((a, b) => a - b);
  return {
    min: sorted[0],
    q1: quantile(sorted, 0.25),
    median: quantile(sorted, 0.5),
    q3: quantile(sorted, 0.75),
    max: sorted[sorted.length - 1],
  };
};

export const mean = (values: number[]): number | null => {
  if (values.length === 0) {
    return null;
  }
  const total = values.reduce((acc, value) => acc + value, 0);
  return total / values.length;
};

export const median = (values: number[]): number | null => {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((a, b) => a - b);
  return quantile(sorted, 0.5);
};

export const stdDev = (values: number[]): number | null => {
  if (values.length < 2) {
    return null;
  }
  const avg = mean(values);
  if (avg === null) {
    return null;
  }
  const squaredDifferences = values.map((value) => (value - avg) ** 2);
  const variance = squaredDifferences.reduce((acc, diff) => acc + diff, 0) / (values.length - 1);
  return Math.sqrt(variance);
};

export const round = (value: number | null, digits = 2): number | null => {
  if (value === null || !Number.isFinite(value)) {
    return null;
  }
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

export const getTrackVolume = (state: unknown): number => {
  if (!isRecord(state)) {
    return 1;
  }

  const parsed =
    getNumericAnswer(state.volume) ??
    getNumericAnswer(state.vol) ??
    getNumericAnswer(state.gain) ??
    getNumericAnswer(state.value);

  if (parsed === null) {
    return 1;
  }

  return Math.max(0, Math.min(1, parsed));
};

export const getVideoLabelMap = (raw: AnalysisRawData): Map<string, string> => {
  const map = new Map<string, string>();
  for (const video of raw.videos) {
    const localized = video.video_contents && !Array.isArray(video.video_contents)
      ? video.video_contents.title_de || video.video_contents.title_en
      : null;
    map.set(video.id, localized || `Video ${video.id.slice(0, 8)}`);
  }
  return map;
};

const getGenreLabel = (video: VideoRow): string | null => {
  const genres = video.video_genres;
  const primaryGenre = Array.isArray(genres) ? genres[0] : genres;
  return primaryGenre?.label_de || primaryGenre?.label_en || video.genre_id || null;
};

export const getParticipantIdUniverse = (raw: AnalysisRawData): string[] => {
  const ids = new Set<string>();

  for (const participant of raw.participants) {
    ids.add(participant.id);
  }
  for (const demographics of raw.demographics) {
    ids.add(demographics.participant_id);
  }
  for (const response of raw.surveyResponses) {
    ids.add(response.participant_id);
  }
  for (const response of raw.endSurveyResponses) {
    ids.add(response.participant_id);
  }
  for (const configuration of raw.audioConfigurations) {
    ids.add(configuration.participant_id);
  }

  return Array.from(ids);
};

export const buildParticipantRows = (raw: AnalysisRawData): AnalysisRawData["participants"] => {
  const byId = new Map(raw.participants.map((participant) => [participant.id, participant]));
  const nowIso = new Date().toISOString();

  return getParticipantIdUniverse(raw)
    .map((id) => {
      const existing = byId.get(id);
      if (existing) {
        return existing;
      }

      return {
        id,
        created_at: nowIso,
        user_hash: "(restricted)",
        browser_name: null,
        browser_version: null,
        os_name: null,
        os_version: null,
        screen_res_width: null,
        screen_res_height: null,
      };
    })
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
};

export const buildLatestSurveyResponseByParticipantVideo = (
  surveyResponses: SurveyResponseRow[],
): Map<string, SurveyResponseRow> => {
  const map = new Map<string, SurveyResponseRow>();

  for (const response of surveyResponses) {
    const key = `${response.participant_id}::${response.video_id}`;
    const existing = map.get(key);

    if (!existing || response.created_at.localeCompare(existing.created_at) > 0) {
      map.set(key, response);
    }
  }

  return map;
};

export const buildAudioLabelMap = (raw: AnalysisRawData): Map<string, string> => {
  const audioLabelMap = new Map<string, string>();

  for (const audio of raw.audios) {
    const content = Array.isArray(audio.audio_contents)
      ? audio.audio_contents[0]
      : audio.audio_contents;
    const title = content?.title_de || content?.title_en;
    if (title) {
      audioLabelMap.set(audio.id, title);
    }
  }

  return audioLabelMap;
};

export const buildGenreMap = (videos: VideoRow[]): Map<string, string> => {
  const map = new Map<string, string>();
  for (const video of videos) {
    const genreLabel = getGenreLabel(video);
    if (genreLabel) {
      map.set(video.id, genreLabel);
    }
  }
  return map;
};

export const getAvailableGenres = (videos: VideoRow[]): string[] => {
  const labels = new Set<string>();
  for (const video of videos) {
    const genreLabel = getGenreLabel(video);
    if (genreLabel) {
      labels.add(genreLabel);
    }
  }
  return Array.from(labels).sort();
};

export const getAvailableVideoOptions = (
  raw: AnalysisRawData,
  filters: AnalysisFilters,
  videoLabelMap: Map<string, string>,
): Array<{ id: string; label: string }> => [
  { id: "all", label: "Alle Videos" },
  ...raw.videos
    .filter((video) => {
      const genreLabel = getGenreLabel(video);
      return filters.genre === "all" || genreLabel === filters.genre;
    })
    .map((video) => ({
      id: video.id,
      label: videoLabelMap.get(video.id) ?? `Video ${video.id.slice(0, 8)}`,
    })),
];

export const pickSortedDistinctStrings = (
  values: Array<string | null | undefined>,
): string[] => Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort();

export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
