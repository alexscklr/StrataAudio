import type {
  AnalysisFilters,
  AnalysisRawData,
  AudioConfigurationRow,
  DemographicsRow,
  SurveyResponseRow,
} from "@/features/analysis/types/analysis";
import {
  buildLatestSurveyResponseByParticipantVideo,
  getParticipantIdUniverse,
  getSyncDisturbanceValue,
  isFiniteNumber,
} from "@/features/analysis/lib/analysisMetricsShared";

export const collectParticipantIdsByFilter = (
  raw: AnalysisRawData,
  demographics: DemographicsRow[],
  filters: AnalysisFilters,
): Set<string> => {
  const participantIds = getParticipantIdUniverse(raw);
  const demographicsByParticipant = new Map(
    demographics.map((entry) => [entry.participant_id, entry]),
  );
  const biasByParticipant = new Map(
    raw.participantBiasFlags.map((entry) => [entry.participant_id, entry]),
  );
  const latestSurveyResponses = Array.from(
    buildLatestSurveyResponseByParticipantVideo(raw.surveyResponses).values(),
  );
  const disturbanceShareByParticipant = new Map<
    string,
    { withDisturbance: number; total: number }
  >();

  for (const response of latestSurveyResponses) {
    const disturbance = getSyncDisturbanceValue(response);
    if (disturbance === null) {
      continue;
    }

    const current = disturbanceShareByParticipant.get(response.participant_id) ?? {
      withDisturbance: 0,
      total: 0,
    };

    current.total += 1;
    if (disturbance === "ja") {
      current.withDisturbance += 1;
    }

    disturbanceShareByParticipant.set(response.participant_id, current);
  }

  const filtered = participantIds.filter((participantId) => {
    if (filters.excludeNoVideos) {
      const hasSurvey = raw.surveyResponses.some((response) => response.participant_id === participantId);
      const hasAudio = raw.audioConfigurations.some((configuration) => configuration.participant_id === participantId);
      if (!hasSurvey && !hasAudio) {
        return false;
      }
    }

    if (filters.excludeBiasedParticipants) {
      const biasEntry = biasByParticipant.get(participantId);
      if (biasEntry?.is_biased) {
        return false;
      }
    }

    if (filters.osName !== "all" || filters.browserName !== "all") {
      const participant = raw.participants.find((entry) => entry.id === participantId);
      if (participant) {
        if (filters.osName !== "all" && participant.os_name !== filters.osName) {
          return false;
        }
        if (filters.browserName !== "all" && participant.browser_name !== filters.browserName) {
          return false;
        }
      }
    }

    if (filters.maxDisturbanceSharePercent <= 100) {
      const stats = disturbanceShareByParticipant.get(participantId);
      if (stats && stats.total > 0) {
        const disturbanceSharePercent = (stats.withDisturbance / stats.total) * 100;
        if (disturbanceSharePercent >= filters.maxDisturbanceSharePercent) {
          return false;
        }
      }
    }

    const demographicsEntry = demographicsByParticipant.get(participantId);
    if (!demographicsEntry) {
      return true;
    }

    const outputMatch =
      filters.audioOutputType === "all" ||
      demographicsEntry.audio_output_type === filters.audioOutputType;
    const ageMatch =
      filters.ageGroup === "all" ||
      demographicsEntry.age_group === filters.ageGroup;

    if (!outputMatch || !ageMatch) {
      return false;
    }

    if (demographicsEntry.audio_balance_disturbance === null) {
      return true;
    }

    return (
      demographicsEntry.audio_balance_disturbance >= filters.disturbanceMin &&
      demographicsEntry.audio_balance_disturbance <= filters.disturbanceMax
    );
  });

  return new Set(filtered);
};

export const filterSurveyResponses = (
  surveyResponses: SurveyResponseRow[],
  allowedParticipantIds: Set<string>,
  filters: AnalysisFilters,
  videoGenreMap: Map<string, string>,
): SurveyResponseRow[] =>
  surveyResponses.filter((response) => {
    const participantMatch = allowedParticipantIds.has(response.participant_id);
    const genreMatch =
      filters.genre === "all" || videoGenreMap.get(response.video_id) === filters.genre;
    const videoMatch = filters.videoId === "all" || response.video_id === filters.videoId;
    const syncDisturbanceValue = getSyncDisturbanceValue(response);
    const syncMatch =
      filters.syncDisturbance === "all" ||
      syncDisturbanceValue === filters.syncDisturbance;

    return participantMatch && genreMatch && videoMatch && syncMatch;
  });

export const filterAudioConfigurations = (
  configurations: AudioConfigurationRow[],
  allowedParticipantIds: Set<string>,
  filters: AnalysisFilters,
  videoGenreMap: Map<string, string>,
  allowedSurveyKeys: Set<string>,
): AudioConfigurationRow[] =>
  configurations.filter((configuration) => {
    const participantMatch = allowedParticipantIds.has(configuration.participant_id);
    const genreMatch =
      filters.genre === "all" || videoGenreMap.get(configuration.video_id) === filters.genre;
    const videoMatch = filters.videoId === "all" || configuration.video_id === filters.videoId;
    const surveyKey = `${configuration.participant_id}::${configuration.video_id}`;
    const surveyMatch = allowedSurveyKeys.has(surveyKey);

    return participantMatch && genreMatch && videoMatch && surveyMatch;
  });

export const normalizeTimeToMixConfigurations = (
  configurations: AudioConfigurationRow[],
  surveyResponses: SurveyResponseRow[],
  videos: AnalysisRawData["videos"],
): AudioConfigurationRow[] => {
  const latestSurveyByParticipantVideo = buildLatestSurveyResponseByParticipantVideo(surveyResponses);
  const videoDurationMsById = new Map(
    videos
      .filter((video) => isFiniteNumber(video.duration_seconds))
      .map((video) => [video.id, Number(video.duration_seconds) * 1000]),
  );

  return configurations.map((configuration) => {
    if (!isFiniteNumber(configuration.time_to_mix_ms)) {
      return configuration;
    }

    const key = `${configuration.participant_id}::${configuration.video_id}`;
    const matchingSurvey = latestSurveyByParticipantVideo.get(key);

    if (matchingSurvey?.first_watch_mode !== "standard") {
      return configuration;
    }

    const videoDurationMs = videoDurationMsById.get(configuration.video_id);
    if (!videoDurationMs || videoDurationMs <= 120_000) {
      return configuration;
    }

    if (configuration.time_to_mix_ms < videoDurationMs / 2) {
      return configuration;
    }

    return {
      ...configuration,
      time_to_mix_ms: Math.max(0, configuration.time_to_mix_ms - videoDurationMs / 2),
    };
  });
};
