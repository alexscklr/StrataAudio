import type {
  AnalysisDerivedData,
  AnalysisFilters,
  AnalysisRawData,
} from "@/features/analysis/types/analysis";
import {
  buildAudioDisturbances,
  buildCrosstabs,
  buildInteractionTimeline,
  buildKpis,
  buildLikertItems,
  buildParticipantDetails,
  buildPreferenceBreakdown,
  buildTrackDeviations,
  buildUeqResults,
} from "@/features/analysis/lib/analysisMetricsAggregations";
import {
  collectParticipantIdsByFilter,
  filterAudioConfigurations,
  filterSurveyResponses,
  normalizeTimeToMixConfigurations,
} from "@/features/analysis/lib/analysisMetricsFiltering";
import {
  buildAudioLabelMap,
  buildGenreMap,
  buildParticipantRows,
  DEFAULT_FILTERS,
  getAvailableGenres,
  getAvailableVideoOptions,
  getVideoLabelMap,
  pickSortedDistinctStrings,
} from "@/features/analysis/lib/analysisMetricsShared";

export const getDefaultAnalysisFilters = (): AnalysisFilters => ({ ...DEFAULT_FILTERS });

export const buildAnalysisDerivedData = (
  raw: AnalysisRawData,
  filters: AnalysisFilters,
): AnalysisDerivedData => {
  const participants = buildParticipantRows(raw);
  const videoLabelMap = getVideoLabelMap(raw);
  const audioLabelMap = buildAudioLabelMap(raw);
  const videoGenreMap = buildGenreMap(raw.videos);

  const availableGenres = getAvailableGenres(raw.videos);
  const availableVideoOptions = getAvailableVideoOptions(raw, filters, videoLabelMap);
  const availableAudioOutputs = pickSortedDistinctStrings(
    raw.demographics.map((entry) => entry.audio_output_type),
  );
  const availableAgeGroups = pickSortedDistinctStrings(
    raw.demographics.map((entry) => entry.age_group),
  );
  const availableOsNames = pickSortedDistinctStrings(
    raw.participants.map((participant) => participant.os_name),
  );
  const availableBrowserNames = pickSortedDistinctStrings(
    raw.participants.map((participant) => participant.browser_name),
  );

  const allowedParticipantIds = collectParticipantIdsByFilter(raw, raw.demographics, filters);
  const filteredParticipants = participants.filter((participant) =>
    allowedParticipantIds.has(participant.id),
  );
  const filteredSurveyResponses = filterSurveyResponses(
    raw.surveyResponses,
    allowedParticipantIds,
    filters,
    videoGenreMap,
  );
  const allowedSurveyKeys = new Set(
    filteredSurveyResponses.map((entry) => `${entry.participant_id}::${entry.video_id}`),
  );
  const filteredEndSurveyResponses = raw.endSurveyResponses.filter((entry) =>
    allowedParticipantIds.has(entry.participant_id),
  );
  const filteredConfigurations = filterAudioConfigurations(
    raw.audioConfigurations,
    allowedParticipantIds,
    filters,
    videoGenreMap,
    allowedSurveyKeys,
  );
  const normalizedConfigurations = normalizeTimeToMixConfigurations(
    filteredConfigurations,
    filteredSurveyResponses,
    raw.videos,
  );
  const filteredDemographics = raw.demographics.filter((entry) =>
    allowedParticipantIds.has(entry.participant_id),
  );

  const preferenceBreakdown = buildPreferenceBreakdown(filteredSurveyResponses);

  return {
    filters,
    availableVideoOptions,
    availableGenres,
    availableAudioOutputs,
    availableAgeGroups,
    availableOsNames,
    availableBrowserNames,
    kpis: buildKpis(
      filteredParticipants.length,
      filteredDemographics.length,
      filteredSurveyResponses,
      filteredEndSurveyResponses,
      normalizedConfigurations,
      preferenceBreakdown,
    ),
    likertBoxPlots: buildLikertItems(filteredSurveyResponses),
    preferenceBreakdown,
    interactionTimeline: buildInteractionTimeline(normalizedConfigurations, audioLabelMap),
    trackDeviations: buildTrackDeviations(normalizedConfigurations, audioLabelMap),
    participantDetails: buildParticipantDetails(
      filteredParticipants,
      raw.demographics,
      raw.participantBiasFlags,
      filteredSurveyResponses,
      filteredEndSurveyResponses,
      normalizedConfigurations,
    ),
    audioDisturbances: buildAudioDisturbances(filteredSurveyResponses),
    ueqResults: buildUeqResults(filteredEndSurveyResponses),
    crosstabs: buildCrosstabs(
      filteredDemographics,
      filteredEndSurveyResponses,
      filteredSurveyResponses,
      normalizedConfigurations,
    ),
    videoLabelMap: Object.fromEntries(videoLabelMap),
    audioLabelMap: Object.fromEntries(audioLabelMap),
  };
};
