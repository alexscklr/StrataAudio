import type {
  AnalysisRawData,
  AudioConfigurationRow,
  EndSurveyResponseRow,
  ParticipantDetail,
  SurveyResponseRow,
} from "@/features/analysis/types/analysis";

export const buildParticipantDetails = (
  participants: AnalysisRawData["participants"],
  demographics: AnalysisRawData["demographics"],
  participantBiasFlags: AnalysisRawData["participantBiasFlags"],
  filteredSurveyResponses: SurveyResponseRow[],
  filteredEndSurveyResponses: EndSurveyResponseRow[],
  filteredConfigurations: AudioConfigurationRow[],
): ParticipantDetail[] => {
  const demographicsByParticipant = new Map(
    demographics.map((entry) => [entry.participant_id, entry]),
  );
  const biasByParticipant = new Map(
    participantBiasFlags.map((entry) => [entry.participant_id, entry]),
  );
  const endSurveyByParticipant = new Map(
    filteredEndSurveyResponses.map((entry) => [entry.participant_id, entry]),
  );

  return participants
    .map((participant) => {
      const videoResponses = filteredSurveyResponses.filter(
        (entry) => entry.participant_id === participant.id,
      );
      const configurations = filteredConfigurations.filter(
        (entry) => entry.participant_id === participant.id,
      );

      return {
        participant,
        demographics: demographicsByParticipant.get(participant.id) ?? null,
        biasFlag: biasByParticipant.get(participant.id) ?? null,
        videoResponses,
        endSurveyResponse: endSurveyByParticipant.get(participant.id) ?? null,
        configurations,
      };
    })
    .filter((detail) => detail.videoResponses.length > 0 || detail.endSurveyResponse !== null)
    .sort((a, b) => a.participant.created_at.localeCompare(b.participant.created_at));
};
