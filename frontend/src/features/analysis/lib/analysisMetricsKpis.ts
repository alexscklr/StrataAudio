import type {
  AudioConfigurationRow,
  EndSurveyResponseRow,
  KpiSummary,
  PreferenceBreakdown,
  SurveyResponseRow,
} from "@/features/analysis/types/analysis";
import {
  extractAnswers,
  getNumericAnswer,
  mean,
  median,
  round,
  stdDev,
} from "@/features/analysis/lib/analysisMetricsShared";
import { buildUeqResults } from "@/features/analysis/lib/analysisMetricsSurvey";

const calculateSUS = (endResponses: EndSurveyResponseRow[]): number | null => {
  const normalizedScores = endResponses
    .map((response) => {
      const answers = extractAnswers(response.responses);
      const sus1 = getNumericAnswer(answers["sus-1"]);
      const sus2 = getNumericAnswer(answers["sus-2"]);
      const sus3 = getNumericAnswer(answers["sus-3"]);
      const sus4 = getNumericAnswer(answers["sus-4"]);
      if (sus1 === null || sus2 === null || sus3 === null || sus4 === null) {
        return null;
      }

      const pos1 = (sus1 - 1) / 6;
      const pos2 = (sus2 - 1) / 6;
      const pos3 = (sus3 - 1) / 6;
      const pos4 = (sus4 - 1) / 6;
      return ((pos1 + pos2 + pos3 + pos4) / 4) * 100;
    })
    .filter((value): value is number => value !== null);

  return round(mean(normalizedScores));
};

const calculateSUSScores = (endResponses: EndSurveyResponseRow[]): number[] => {
  return endResponses
    .map((response) => {
      const answers = extractAnswers(response.responses);
      const sus1 = getNumericAnswer(answers["sus-1"]);
      const sus2 = getNumericAnswer(answers["sus-2"]);
      const sus3 = getNumericAnswer(answers["sus-3"]);
      const sus4 = getNumericAnswer(answers["sus-4"]);
      if (sus1 === null || sus2 === null || sus3 === null || sus4 === null) {
        return null;
      }

      const pos1 = (sus1 - 1) / 6;
      const pos2 = (sus2 - 1) / 6;
      const pos3 = (sus3 - 1) / 6;
      const pos4 = (sus4 - 1) / 6;
      return ((pos1 + pos2 + pos3 + pos4) / 4) * 100;
    })
    .filter((value): value is number => value !== null);
};

const normalizeNpsValue = (value: number): number | null => {
  if (!Number.isFinite(value)) {
    return null;
  }

  if (value >= 1 && value <= 10) {
    return value - 1;
  }

  if (value >= 0 && value <= 10) {
    return value;
  }

  return null;
};

const calculateNPS = (endResponses: EndSurveyResponseRow[]): number | null => {
  const values = endResponses
    .map((response) => getNumericAnswer(extractAnswers(response.responses)["nps-1"]))
    .map((value) => (value === null ? null : normalizeNpsValue(value)))
    .filter((value): value is number => value !== null);

  if (values.length === 0) {
    return null;
  }

  const promoters = values.filter((value) => value >= 9).length;
  const detractors = values.filter((value) => value <= 6).length;
  const promoterPercent = (promoters / values.length) * 100;
  const detractorPercent = (detractors / values.length) * 100;

  // Standard-NPS: Promoter-% minus Detraktor-% auf der normierten 0-10-Skala.
  return round(promoterPercent - detractorPercent);
};

const calculateAverageNPSRating = (endResponses: EndSurveyResponseRow[]): number | null => {
  const values = endResponses
    .map((response) => getNumericAnswer(extractAnswers(response.responses)["nps-1"]))
    .map((value) => (value === null ? null : normalizeNpsValue(value)))
    .filter((value): value is number => value !== null);

  return round(mean(values));
};

const calculateAverageNPSRatings = (endResponses: EndSurveyResponseRow[]): number[] => {
  return endResponses
    .map((response) => getNumericAnswer(extractAnswers(response.responses)["nps-1"]))
    .map((value) => (value === null ? null : normalizeNpsValue(value)))
    .filter((value): value is number => value !== null);
};

export const buildKpis = (
  participantCount: number,
  demographicsCount: number,
  filteredSurveyResponses: SurveyResponseRow[],
  filteredEndSurveyResponses: EndSurveyResponseRow[],
  filteredConfigurations: AudioConfigurationRow[],
  preferenceBreakdown: PreferenceBreakdown,
): KpiSummary => {
  const totalPreferenceVotes = preferenceBreakdown.mixerCount + preferenceBreakdown.standardCount;
  const mixerPreferencePercent =
    totalPreferenceVotes > 0
      ? round((preferenceBreakdown.mixerCount / totalPreferenceVotes) * 100)
      : null;

  const timeToMixValues = filteredConfigurations
    .map((item) => item.time_to_mix_ms)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value))
    .map((value) => value / 1000);

  const completionRate =
    participantCount > 0
      ? round((filteredEndSurveyResponses.length / participantCount) * 100)
      : 0;

  const ueqResults = buildUeqResults(filteredEndSurveyResponses);
  const overallUeq = ueqResults.find((result) => result.dimension === "Gesamtqualität")?.score ?? null;

  // Calculate SUS scores for all individual responses
  const susScores = calculateSUSScores(filteredEndSurveyResponses);
  const susScoreStdDev = round(stdDev(susScores));

  // Calculate NPS ratings for all individual responses
  const npsRatings = calculateAverageNPSRatings(filteredEndSurveyResponses);
  const averageNpsRatingStdDev = round(stdDev(npsRatings));

  // For UEQ and NPS score, we cannot easily calculate per-response values from the aggregated results
  // So we estimate from UEQ results or leave as null
  // For a more accurate calculation, we would need to refactor buildUeqResults to return individual scores

  return {
    participantsCount: participantCount,
    demographicsCount,
    videoSurveyCount: filteredSurveyResponses.length,
    endSurveyCount: filteredEndSurveyResponses.length,
    completionRate: completionRate ?? 0,
    susScore: calculateSUS(filteredEndSurveyResponses),
    susScoreStdDev,
    npsScore: calculateNPS(filteredEndSurveyResponses),
    npsScoreStdDev: null, // NPS is a derived metric (difference between percentages), not directly from individual values
    ueqScore: overallUeq !== null ? round(overallUeq, 2) : null,
    ueqScoreStdDev: null, // Would need per-response UEQ calculation
    averageNpsRating: calculateAverageNPSRating(filteredEndSurveyResponses),
    averageNpsRatingStdDev,
    mixerPreferencePercent,
    medianTimeToFirstInteractionSec: round(median(timeToMixValues)),
    medianTimeToFirstInteractionSecStdDev: round(stdDev(timeToMixValues)),
  };
};
