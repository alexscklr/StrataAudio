import type {
  AudioConfigurationRow,
  CrosstabData,
  DemographicsRow,
  EndSurveyResponseRow,
  SurveyResponseRow,
} from "@/features/analysis/types/analysis";
import {
  extractAnswers,
  getNumericAnswer,
  getStringAnswer,
  getTrackVolume,
  mean,
} from "@/features/analysis/lib/analysisMetricsShared";

export const buildCrosstabs = (
  demographics: DemographicsRow[],
  endResponses: EndSurveyResponseRow[],
  surveyResponses: SurveyResponseRow[],
  configurations: AudioConfigurationRow[],
): CrosstabData[] => {
  const calculateForFilter = (
    name: string,
    filterFn: (
      demographicsEntry: DemographicsRow | null,
      endResponse: EndSurveyResponseRow | null,
      participantSurveyResponses: SurveyResponseRow[],
      participantConfigurations: AudioConfigurationRow[],
    ) => boolean,
  ) => {
    const participantIds = new Set([
      ...demographics.map((entry) => entry.participant_id),
      ...endResponses.map((entry) => entry.participant_id),
      ...surveyResponses.map((entry) => entry.participant_id),
    ]);

    const susScores: number[] = [];
    const npsRatings: number[] = [];
    const activityDeltas: number[] = [];
    let count = 0;

    for (const participantId of participantIds) {
      const demographicsEntry = demographics.find((entry) => entry.participant_id === participantId) ?? null;
      const endResponse = endResponses.find((entry) => entry.participant_id === participantId) ?? null;
      const participantSurveyResponses = surveyResponses.filter((entry) => entry.participant_id === participantId);
      const participantConfigurations = configurations.filter((entry) => entry.participant_id === participantId);

      if (filterFn(demographicsEntry, endResponse, participantSurveyResponses, participantConfigurations)) {
        count += 1;

        if (endResponse) {
          const answers = extractAnswers(endResponse.responses);
          const sus1 = getNumericAnswer(answers["sus-1"]);
          const sus2 = getNumericAnswer(answers["sus-2"]);
          const sus3 = getNumericAnswer(answers["sus-3"]);
          const sus4 = getNumericAnswer(answers["sus-4"]);

          if (sus1 !== null && sus2 !== null && sus3 !== null && sus4 !== null) {
            const s1 = (sus1 - 1) / 6;
            const s2 = (7 - sus2) / 6;
            const s3 = (sus3 - 1) / 6;
            const s4 = (7 - sus4) / 6;
            susScores.push(((s1 + s2 + s3 + s4) / 4) * 100);
          }

          const nps = getNumericAnswer(answers["nps-1"]);
          if (nps !== null) {
            npsRatings.push(nps);
          }
        }

        let participantDeltaTotal = 0;
        let participantTrackCount = 0;

        for (const configuration of participantConfigurations) {
          const trackstates = configuration.final_settings?.trackstates ?? {};
          for (const state of Object.values(trackstates)) {
            const volume = getTrackVolume(state);
            participantDeltaTotal += Math.abs(volume - 1);
            participantTrackCount += 1;
          }
        }

        if (participantTrackCount > 0) {
          activityDeltas.push((participantDeltaTotal / participantTrackCount) * 100);
        }
      }
    }

    return {
      name,
      avgSus: mean(susScores),
      avgNps: mean(npsRatings),
      avgDeltaVol: mean(activityDeltas),
      count,
    };
  };

  const getPreferredMode = (participantSurveyResponses: SurveyResponseRow[]) => {
    const lastResponse = participantSurveyResponses[participantSurveyResponses.length - 1];
    if (!lastResponse) {
      return null;
    }

    const answers = extractAnswers(lastResponse.responses);
    return getStringAnswer(answers["experience-2"])?.toLowerCase();
  };

  return [
    {
      attribute: "Störungs-Empfinden (Alltag)",
      groups: [
        calculateForFilter(
          "Gering (1-3)",
          (entry) => !!entry?.audio_balance_disturbance && entry.audio_balance_disturbance <= 3,
        ),
        calculateForFilter(
          "Hoch (4-7)",
          (entry) => !!entry?.audio_balance_disturbance && entry.audio_balance_disturbance >= 4,
        ),
      ],
    },
    {
      attribute: "Nutzungs-Präferenz (Mixer vs. Standard)",
      groups: [
        calculateForFilter("Bevorzugt Mixer", (_, __, responses) => getPreferredMode(responses) === "mixer"),
        calculateForFilter("Bevorzugt Standard", (_, __, responses) => getPreferredMode(responses) === "standard"),
      ],
    },
    {
      attribute: "Audio-Ausgabe",
      groups: [
        calculateForFilter("Kopfhörer", (entry) => entry?.audio_output_type === "headphones"),
        calculateForFilter(
          "Lautsprecher",
          (entry) =>
            entry?.audio_output_type === "built_in_speakers" ||
            entry?.audio_output_type === "external_speakers",
        ),
      ],
    },
  ];
};
