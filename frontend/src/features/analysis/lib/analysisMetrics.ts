import type {
  AnalysisDerivedData,
  AnalysisFilters,
  AnalysisRawData,
  AudioConfigurationRow,
  BoxPlotStats,
  CrosstabData,
  DemographicsRow,
  EndSurveyResponseRow,
  InteractionTimelinePoint,
  KpiSummary,
  LikertBoxPlotItem,
  ParticipantDetail,
  PreferenceBreakdown,
  SurveyResponseRow,
  TrackDeviationItem,
} from "@/features/analysis/types/analysis";

const DEFAULT_FILTERS: AnalysisFilters = {
  videoId: "all",
  genre: "all",
  audioOutputType: "all",
  ageGroup: "all",
  osName: "all",
  browserName: "all",
  disturbanceMin: 1,
  disturbanceMax: 7,
  excludeNoVideos: false,
  syncDisturbance: "all",
  excludeBiasedParticipants: true,
};

const getNumericAnswer = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
};

const getStringAnswer = (value: unknown): string | null => {
  if (typeof value === "string") {
    return value;
  }
  return null;
};

const extractAnswers = (payload: any): Record<string, unknown> => {
  if (!payload) return {};
  
  // Case 1: Standard wrapper { answers: { ... } }
  if (payload.answers && typeof payload.answers === "object") {
    return payload.answers;
  }
  
  // Case 2: Deeply nested { responses: { answers: { ... } } } or { responses: { ... } }
  if (payload.responses && typeof payload.responses === "object") {
    if (payload.responses.answers && typeof payload.responses.answers === "object") {
      return payload.responses.answers;
    }
    return payload.responses;
  }

  // Case 3: Payload is already the dictionary of answers
  // We exclude common root keys to avoid returning the whole row if passed by mistake
  if (payload.id || payload.participant_id || payload.created_at) {
    // This looks like a database row, not a payload
    return {};
  }

  return payload;
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

const toBoxPlotStats = (values: number[]): BoxPlotStats | null => {
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

const mean = (values: number[]): number | null => {
  if (values.length === 0) {
    return null;
  }
  const total = values.reduce((acc, value) => acc + value, 0);
  return total / values.length;
};

const median = (values: number[]): number | null => {
  if (values.length === 0) {
    return null;
  }
  const sorted = [...values].sort((a, b) => a - b);
  return quantile(sorted, 0.5);
};

const round = (value: number | null, digits = 2): number | null => {
  if (value === null || !Number.isFinite(value)) {
    return null;
  }
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

const getVideoLabelMap = (raw: AnalysisRawData): Map<string, string> => {
  const map = new Map<string, string>();
  for (const video of raw.videos) {
    const localized = video.video_contents && !Array.isArray(video.video_contents)
      ? video.video_contents.title_de || video.video_contents.title_en
      : null;
    map.set(video.id, localized || `Video ${video.id.slice(0, 8)}`);
  }
  return map;
};

const getParticipantIdUniverse = (raw: AnalysisRawData): string[] => {
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

const buildParticipantRows = (raw: AnalysisRawData) => {
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

const collectParticipantIdsByFilter = (
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

  const filtered = participantIds.filter((participantId) => {
    // 1. Filter: excludeNoVideos
    if (filters.excludeNoVideos) {
      const hasSurvey = raw.surveyResponses.some((r) => r.participant_id === participantId);
      const hasAudio = raw.audioConfigurations.some((r) => r.participant_id === participantId);
      if (!hasSurvey && !hasAudio) return false;
    }

    // 2. Filter: sync-2 (Technical disturbances)
    if (filters.syncDisturbance !== "all") {
      const pResponses = raw.surveyResponses.filter((r) => r.participant_id === participantId);
      const hasJa = pResponses.some((r) => extractAnswers(r.responses)["sync-2"] === "Ja");
      
      if (filters.syncDisturbance === "ja" && !hasJa) return false;
      if (filters.syncDisturbance === "nein" && hasJa) return false;
    }

    // 3. Filter: exclude participants flagged as biased in admin drilldown
    if (filters.excludeBiasedParticipants) {
      const biasEntry = biasByParticipant.get(participantId);
      if (biasEntry?.is_biased) {
        return false;
      }
    }

    // 4. Filter: OS & Browser
    if (filters.osName !== "all" || filters.browserName !== "all") {
      const p = raw.participants.find(p => p.id === participantId);
      if (p) {
        if (filters.osName !== "all" && p.os_name !== filters.osName) return false;
        if (filters.browserName !== "all" && p.browser_name !== filters.browserName) return false;
      }
    }

    const entry = demographicsByParticipant.get(participantId);

    if (!entry) {
      // Teilnehmer ohne demografischen Datensatz bleiben sichtbar,
      // damit das Dashboard bei partiellen RLS/Datensätzen nicht leer wird.
      return true;
    }

    const outputMatch =
      filters.audioOutputType === "all" ||
      entry.audio_output_type === filters.audioOutputType;

    const ageMatch =
      filters.ageGroup === "all" ||
      entry.age_group === filters.ageGroup;

    if (!outputMatch || !ageMatch) {
      return false;
    }

    if (entry.audio_balance_disturbance === null) {
      return true;
    }

    return (
      entry.audio_balance_disturbance >= filters.disturbanceMin &&
      entry.audio_balance_disturbance <= filters.disturbanceMax
    );
  });

  return new Set(filtered);
};

const filterSurveyResponses = (
  surveyResponses: SurveyResponseRow[],
  allowedParticipantIds: Set<string>,
  filters: AnalysisFilters,
  videoGenreMap: Map<string, string>,
): SurveyResponseRow[] =>
  surveyResponses.filter((response) => {
    const participantMatch = allowedParticipantIds.has(response.participant_id);
    const genreMatch = filters.genre === "all" || videoGenreMap.get(response.video_id) === filters.genre;
    const videoMatch = filters.videoId === "all" || response.video_id === filters.videoId;
    return participantMatch && genreMatch && videoMatch;
  });

const filterAudioConfigurations = (
  configurations: AudioConfigurationRow[],
  allowedParticipantIds: Set<string>,
  filters: AnalysisFilters,
  videoGenreMap: Map<string, string>,
): AudioConfigurationRow[] =>
  configurations.filter((configuration) => {
    const participantMatch = allowedParticipantIds.has(configuration.participant_id);
    const genreMatch = filters.genre === "all" || videoGenreMap.get(configuration.video_id) === filters.genre;
    const videoMatch = filters.videoId === "all" || configuration.video_id === filters.videoId;
    return participantMatch && genreMatch && videoMatch;
  });

const buildLikertItems = (surveyResponses: SurveyResponseRow[]): LikertBoxPlotItem[] => {
  const keys: Array<{ id: string; label: string }> = [
    { id: "sync-1", label: "Sync-Passung (1-7)" },
    { id: "experience-1", label: "Interesse durch Mixer (1-7)" },
    { id: "pan-1", label: "Nützlichkeit PAN (1-7)" },
    { id: "pan-2", label: "Intuitivität PAN (1-7)" },
  ];

  return keys.map((key) => {
    const values = surveyResponses
      .map((response) => getNumericAnswer(extractAnswers(response.responses)[key.id]))
      .filter((value): value is number => value !== null);

    return {
      id: key.id,
      label: key.label,
      values,
      stats: toBoxPlotStats(values),
    };
  });
};

const buildPreferenceBreakdown = (surveyResponses: SurveyResponseRow[]): PreferenceBreakdown => {
  let mixerCount = 0;
  let standardCount = 0;

  for (const response of surveyResponses) {
    const answer = getStringAnswer(extractAnswers(response.responses)["experience-2"]);
    if (!answer) {
      continue;
    }
    const normalized = answer.trim().toLowerCase();
    if (normalized === "mixer") {
      mixerCount += 1;
    }
    if (normalized === "standard") {
      standardCount += 1;
    }
  }

  return { mixerCount, standardCount };
};

const buildInteractionTimeline = (
  configurations: AudioConfigurationRow[],
  audioLabelMap: Map<string, string>,
): InteractionTimelinePoint[] => {
  const interactionBins = new Map<number, { count: number; mute: number; pan: number; volume: number }>();
  const stateBins = new Map<number, Record<string, { sum: number; count: number }>>();
  let maxDuration = 180;

  // 1. Identify max duration across all selected configurations
  for (const configuration of configurations) {
    for (const entry of configuration.interaction_log ?? []) {
      if (typeof entry?.t === "number" && Number.isFinite(entry.t)) {
        const second = Math.max(0, Math.floor(entry.t / 1000));
        if (second > maxDuration && second < 1200) { // Cap at 20 min sanity check
          maxDuration = second;
        }
      }
    }
  }

  for (const configuration of configurations) {
    // Interaction event counting
    for (const entry of configuration.interaction_log ?? []) {
      if (typeof entry?.t !== "number" || !Number.isFinite(entry.t)) {
        continue;
      }
      const second = Math.max(0, Math.floor(entry.t / 1000));
      if (second > 1200) continue;

      const current = interactionBins.get(second) ?? { count: 0, mute: 0, pan: 0, volume: 0 };
      current.count += 1;

      const label = String(entry.label || "").toLowerCase();
      if (label.includes("mute")) {
        current.mute += 1;
      } else if (label.includes("pan")) {
        current.pan += 1;
      } else if (label.includes("volume")) {
        current.volume += 1;
      }

      interactionBins.set(second, current);
    }

    // Reconstruct volume state over time
    let masterVol = 1.0;
    let masterMuted = false;
    const trackStates = new Map<string, { vol: number; muted: boolean }>();
    
    // Initialize track states from final_settings if available, or default to 1.0
    // Actually, usually they start at 1.0 unless we have the metadata.
    const trackIds = Object.keys(configuration.final_settings?.trackstates ?? {});
    for (const id of trackIds) {
      trackStates.set(id, { vol: 1.0, muted: false });
    }

    const log = [...(configuration.interaction_log ?? [])].sort((a, b) => (a.t || 0) - (b.t || 0));
    let logIdx = 0;

    for (let s = 0; s <= maxDuration; s++) {
      while (logIdx < log.length && (log[logIdx].t || 0) <= s * 1000) {
        const entry = log[logIdx];
        const label = String(entry.label || "").toLowerCase();
        const val = entry.val;

        // Support various label formats: "master.volume", "masterVolume", "volume", "master.mute", "masterMuted", etc.
        if (label === "master.volume" || label === "mastervolume" || label === "volume") {
          masterVol = typeof val === "number" ? val : masterVol;
        } else if (label === "master.mute" || label === "mastermute" || label === "mastermuted" || label === "mute") {
          masterMuted = !!val;
        } else {
          // Check for track specific changes: "trackId.volume", "volume:trackId", etc.
          let id = "";
          let type = "";
          if (label.includes(":")) {
            [type, id] = label.split(":");
          } else if (label.includes(".")) {
            [id, type] = label.split(".");
          }

          if (id && type) {
            const state = trackStates.get(id) || { vol: 1.0, muted: false };
            if (type === "volume") {
              state.vol = typeof val === "number" ? val : state.vol;
            } else if (type === "mute") {
              state.muted = !!val;
            }
            trackStates.set(id, state);
          }
        }
        logIdx++;
      }

      const bin = stateBins.get(s) ?? {};
      for (const [id, state] of trackStates.entries()) {
        const trackLabel = audioLabelMap.get(id) || id || "Unknown Track";
        const effectiveVol = masterMuted || state.muted ? 0 : masterVol * state.vol;

        const stats = bin[trackLabel] ?? { sum: 0, count: 0 };
        stats.sum += effectiveVol;
        stats.count += 1;
        bin[trackLabel] = stats;
      }
      stateBins.set(s, bin);
    }
  }

  const points: InteractionTimelinePoint[] = [];
  for (let second = 0; second <= maxDuration; second += 1) {
    const interactionData = interactionBins.get(second) ?? { count: 0, mute: 0, pan: 0, volume: 0 };
    const stateData = stateBins.get(second) ?? {};

    const trackVolumes: Record<string, number> = {};
    for (const [label, stats] of Object.entries(stateData)) {
      trackVolumes[label] = stats.count > 0 ? stats.sum / stats.count : 0;
    }

    points.push({
      second,
      count: interactionData.count,
      muteCount: interactionData.mute,
      panCount: interactionData.pan,
      volumeCount: interactionData.volume,
      trackVolumes,
    });
  }
  return points;
};

const buildTrackDeviations = (
  configurations: AudioConfigurationRow[],
  audioLabelMap: Map<string, string>,
): TrackDeviationItem[] => {
  const map = new Map<string, { volumeDeltaTotal: number; panTotal: number; panAbsTotal: number; count: number }>();

  for (const configuration of configurations) {
    const trackstates = configuration.final_settings?.trackstates ?? {};
    for (const [trackId, state] of Object.entries(trackstates)) {
      const volume = typeof state.volume === "number" ? state.volume : 1;
      const pan = typeof state.pan === "number" ? state.pan : 0;
      const current = map.get(trackId) ?? { volumeDeltaTotal: 0, panTotal: 0, panAbsTotal: 0, count: 0 };
      current.volumeDeltaTotal += volume - 1;
      current.panTotal += pan;
      current.panAbsTotal += Math.abs(pan);
      current.count += 1;
      map.set(trackId, current);
    }
  }

  return Array.from(map.entries())
    .map(([trackId, value]) => ({
      trackId: audioLabelMap.get(trackId) ?? trackId,
      averageVolumeDelta: value.count > 0 ? value.volumeDeltaTotal / value.count : 0,
      averagePan: value.count > 0 ? value.panTotal / value.count : 0,
      panAbsDeviation: value.count > 0 ? value.panAbsTotal / value.count : 0,
      sampleCount: value.count,
    }))
    .sort((a, b) => b.sampleCount - a.sampleCount);
};

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
      const neg2 = (7 - sus2) / 6;
      const pos3 = (sus3 - 1) / 6;
      const neg4 = (7 - sus4) / 6;
      return ((pos1 + neg2 + pos3 + neg4) / 4) * 100;
    })
    .filter((value): value is number => value !== null);

  return round(mean(normalizedScores));
};

const calculateNPS = (endResponses: EndSurveyResponseRow[]): number | null => {
  const values = endResponses
    .map((response) => getNumericAnswer(extractAnswers(response.responses)["nps-1"]))
    .filter((value): value is number => value !== null);

  if (values.length === 0) {
    return null;
  }

  const promoters = values.filter((value) => value >= 9).length;
  const detractors = values.filter((value) => value <= 6).length;
  const promoterPercent = (promoters / values.length) * 100;
  const detractorPercent = (detractors / values.length) * 100;
  return round(promoterPercent - detractorPercent);
};

const calculateAverageNPSRating = (endResponses: EndSurveyResponseRow[]): number | null => {
  const values = endResponses
    .map((response) => getNumericAnswer(extractAnswers(response.responses)["nps-1"]))
    .filter((value): value is number => value !== null);

  return round(mean(values));
};

const buildKpis = (
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
  const overallUeq = ueqResults.find(r => r.dimension === "Gesamtqualität")?.score ?? null;

  return {
    participantsCount: participantCount,
    demographicsCount,
    videoSurveyCount: filteredSurveyResponses.length,
    endSurveyCount: filteredEndSurveyResponses.length,
    completionRate: completionRate ?? 0,
    susScore: calculateSUS(filteredEndSurveyResponses),
    npsScore: calculateNPS(filteredEndSurveyResponses),
    ueqScore: overallUeq !== null ? round(overallUeq, 2) : null,
    averageNpsRating: calculateAverageNPSRating(filteredEndSurveyResponses),
    mixerPreferencePercent,
    medianTimeToFirstInteractionSec: round(median(timeToMixValues)),
  };
};

const buildParticipantDetails = (
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

export const getDefaultAnalysisFilters = (): AnalysisFilters => ({ ...DEFAULT_FILTERS });

const buildAudioDisturbances = (surveyResponses: SurveyResponseRow[]) => {
  let yes = 0;
  let no = 0;
  for (const resp of surveyResponses) {
    const answers = extractAnswers(resp.responses);
    const sync2 = answers["sync-2"] || answers["sync2"];
    if (sync2 === "Ja" || sync2 === true) {
      yes++;
    } else if (sync2 === "Nein" || sync2 === false) {
      no++;
    }
  }
  return { yes, no };
};

const buildUeqResults = (endResponses: EndSurveyResponseRow[]) => {
  const dimensions = [
    { label: "Attraktivität", keys: ["ueq-1"] },
    { label: "Durchschaubarkeit", keys: ["ueq-2"] },
    { label: "Effizienz", keys: ["ueq-3"] },
    { label: "Stimulation", keys: ["ueq-4"] },
    { label: "Originalität", keys: ["ueq-5"] },
  ];

  if (endResponses.length === 0) {
    return [
      ...dimensions.map(d => ({ dimension: d.label, score: 0 })),
      { dimension: "Pragmatische Qualität", score: 0 },
      { dimension: "Hedonische Qualität", score: 0 },
      { dimension: "Gesamtqualität", score: 0 },
    ];
  }

  const dimResults = dimensions.map((dim) => {
    const scores: number[] = [];
    for (const resp of endResponses) {
      const answers = extractAnswers(resp.responses as any);
      for (const key of dim.keys) {
        const val = getNumericAnswer(answers[key]);
        if (val !== null) {
          scores.push(val - 4); // Map 1-7 to -3..3
        }
      }
    }
    return {
      dimension: dim.label,
      score: mean(scores) ?? 0,
    };
  });

  // Calculate aggregates
  // Pragmatic: Durchschaubarkeit (1) + Effizienz (2)
  const pragmaticScore = (dimResults[1].score + dimResults[2].score) / 2;
  // Hedonic: Stimulation (3) + Originalität (4)
  const hedonicScore = (dimResults[3].score + dimResults[4].score) / 2;
  // Overall: Mean of all 5
  const overallScore = dimResults.reduce((acc, curr) => acc + curr.score, 0) / 5;

  return [
    ...dimResults,
    { dimension: "Pragmatische Qualität", score: pragmaticScore },
    { dimension: "Hedonische Qualität", score: hedonicScore },
    { dimension: "Gesamtqualität", score: overallScore },
  ];
};

const buildCrosstabs = (
  demographics: DemographicsRow[],
  endResponses: EndSurveyResponseRow[],
  surveyResponses: SurveyResponseRow[],
  configurations: AudioConfigurationRow[]
): CrosstabData[] => {
  const calculateForFilter = (
    name: string,
    filterFn: (d: DemographicsRow | null, er: EndSurveyResponseRow | null, srs: SurveyResponseRow[], configs: AudioConfigurationRow[]) => boolean
  ) => {
    // We iterate over the "Universe" of participants in this slice
    const participantIds = new Set([
      ...demographics.map(d => d.participant_id),
      ...endResponses.map(er => er.participant_id),
      ...surveyResponses.map(sr => sr.participant_id)
    ]);

    const susScores: number[] = [];
    const npsRatings: number[] = [];
    const activityDeltas: number[] = [];
    let count = 0;

    for (const pId of participantIds) {
      const demo = demographics.find(d => d.participant_id === pId) || null;
      const endResp = endResponses.find(er => er.participant_id === pId) || null;
      const sResponses = surveyResponses.filter(sr => sr.participant_id === pId);
      const pConfigs = configurations.filter(c => c.participant_id === pId);

      if (filterFn(demo, endResp, sResponses, pConfigs)) {
        count++;

        // Calculate SUS for this participant
        if (endResp) {
          const answers = extractAnswers(endResp.responses);
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
          if (nps !== null) npsRatings.push(nps);
        }

        // Calculate Average Activity (Abs Volume Delta)
        let participantDeltaTotal = 0;
        let participantTrackCount = 0;
        for (const config of pConfigs) {
          const trackstates = config.final_settings?.trackstates ?? {};
          for (const state of Object.values(trackstates)) {
            const vol = typeof state.volume === "number" ? state.volume : 1;
            participantDeltaTotal += Math.abs(vol - 1);
            participantTrackCount++;
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

  const getPreferredMode = (srs: SurveyResponseRow[]) => {
    const last = srs[srs.length - 1]; // Assume last response is representative
    if (!last) return null;
    const ans = extractAnswers(last.responses);
    return getStringAnswer(ans["experience-2"])?.toLowerCase();
  };

  return [
    {
      attribute: "Störungs-Empfinden (Alltag)",
      groups: [
        calculateForFilter("Gering (1-3)", (d) => !!d?.audio_balance_disturbance && d.audio_balance_disturbance <= 3),
        calculateForFilter("Hoch (4-7)", (d) => !!d?.audio_balance_disturbance && d.audio_balance_disturbance >= 4),
      ],
    },
    {
      attribute: "Nutzungs-Präferenz (Mixer vs. Standard)",
      groups: [
        calculateForFilter("Bevorzugt Mixer", (_, __, srs) => getPreferredMode(srs) === "mixer"),
        calculateForFilter("Bevorzugt Standard", (_, __, srs) => getPreferredMode(srs) === "standard"),
      ],
    },
    {
      attribute: "Audio-Ausgabe",
      groups: [
        calculateForFilter("Kopfhörer", (d) => d?.audio_output_type === "headphones"),
        calculateForFilter("Lautsprecher", (d) => d?.audio_output_type === "built_in_speakers" || d?.audio_output_type === "external_speakers"),
      ],
    },
  ];
};

export const buildAnalysisDerivedData = (
  raw: AnalysisRawData,
  filters: AnalysisFilters,
): AnalysisDerivedData => {
  const participants = buildParticipantRows(raw);
  const videoLabelMap = getVideoLabelMap(raw);
  const videoGenreMap = new Map<string, string>();
  const genresSet = new Set<string>();

  const audioLabelMap = new Map<string, string>();
  for (const a of raw.audios) {
    let content = a.audio_contents;
    if (Array.isArray(content)) {
      content = content[0];
    }
    const title = content?.title_de || content?.title_en;
    if (title) {
      audioLabelMap.set(a.id, title);
    }
  }

  for (const v of raw.videos) {
    const genres = v.video_genres as any;
    const genreLabel = genres?.label_de || genres?.label_en || v.genre_id;
    if (genreLabel) {
      videoGenreMap.set(v.id, genreLabel);
      genresSet.add(genreLabel);
    }
  }

  const availableGenres = Array.from(genresSet).sort();

  const availableVideoOptions = [
    { id: "all", label: "Alle Videos" },
    ...raw.videos
      .filter((v) => {
        const genres = v.video_genres as any;
        const genreLabel = genres?.label_de || genres?.label_en || v.genre_id;
        return filters.genre === "all" || genreLabel === filters.genre;
      })
      .map((video) => ({
        id: video.id,
        label: videoLabelMap.get(video.id) ?? `Video ${video.id.slice(0, 8)}`,
      })),
  ];

  const availableAudioOutputs = Array.from(
    new Set(raw.demographics.map((entry) => entry.audio_output_type).filter((value): value is string => Boolean(value))),
  ).sort();

  const availableAgeGroups = Array.from(
    new Set(raw.demographics.map((entry) => entry.age_group).filter((value): value is string => Boolean(value))),
  ).sort();

  const availableOsNames = Array.from(
    new Set(raw.participants.map((p) => p.os_name).filter((value): value is string => Boolean(value))),
  ).sort();

  const availableBrowserNames = Array.from(
    new Set(raw.participants.map((p) => p.browser_name).filter((value): value is string => Boolean(value))),
  ).sort();

  const allowedParticipantIds = collectParticipantIdsByFilter(raw, raw.demographics, filters);

  const filteredParticipants = participants.filter((p) => allowedParticipantIds.has(p.id));

  const filteredSurveyResponses = filterSurveyResponses(
    raw.surveyResponses,
    allowedParticipantIds,
    filters,
    videoGenreMap,
  );
  const filteredEndSurveyResponses = raw.endSurveyResponses.filter((entry) =>
    allowedParticipantIds.has(entry.participant_id),
  );
  const filteredConfigurations = filterAudioConfigurations(
    raw.audioConfigurations,
    allowedParticipantIds,
    filters,
    videoGenreMap,
  );

  const filteredDemographics = raw.demographics.filter((d) =>
    allowedParticipantIds.has(d.participant_id),
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
      filteredConfigurations,
      preferenceBreakdown,
    ),
    likertBoxPlots: buildLikertItems(filteredSurveyResponses),
    preferenceBreakdown,
    interactionTimeline: buildInteractionTimeline(filteredConfigurations, audioLabelMap),
    trackDeviations: buildTrackDeviations(filteredConfigurations, audioLabelMap),
    participantDetails: buildParticipantDetails(
      filteredParticipants,
      raw.demographics,
      raw.participantBiasFlags,
      filteredSurveyResponses,
      filteredEndSurveyResponses,
      filteredConfigurations,
    ),
    audioDisturbances: buildAudioDisturbances(filteredSurveyResponses),
    ueqResults: buildUeqResults(filteredEndSurveyResponses),
    crosstabs: buildCrosstabs(
      filteredDemographics,
      filteredEndSurveyResponses,
      filteredSurveyResponses,
      filteredConfigurations,
    ),
    videoLabelMap: Object.fromEntries(videoLabelMap),
    audioLabelMap: Object.fromEntries(audioLabelMap),
  };
};
