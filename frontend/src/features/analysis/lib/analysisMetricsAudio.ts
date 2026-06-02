import type {
  AudioConfigurationRow,
  InteractionTimelinePoint,
  TrackDeviationItem,
} from "@/features/analysis/types/analysis";
import {
  getNumericAnswer,
  getTrackVolume,
  median,
  toBoxPlotStats,
} from "@/features/analysis/lib/analysisMetricsShared";

export const buildInteractionTimeline = (
  configurations: AudioConfigurationRow[],
  audioLabelMap: Map<string, string>,
): InteractionTimelinePoint[] => {
  const audioIdByLower = new Map<string, string>();
  for (const id of audioLabelMap.keys()) {
    audioIdByLower.set(id.toLowerCase(), id);
  }

  const unknownTrackLabels = new Map<string, string>();

  const isMasterTrackId = (trackId: string): boolean => {
    const normalized = trackId.trim().toLowerCase();
    return (
      normalized === "master" ||
      normalized === "master_track" ||
      normalized === "master-track" ||
      normalized === "mastertrack"
    );
  };

  const resolveCanonicalTrackId = (trackId: string): string =>
    audioIdByLower.get(trackId.toLowerCase()) ?? trackId;

  const resolveTrackLabel = (trackId: string): string => {
    const mapped = audioLabelMap.get(trackId);
    if (mapped) {
      return mapped;
    }

    const existing = unknownTrackLabels.get(trackId);
    if (existing) {
      return existing;
    }

    const generated = `Spur ${unknownTrackLabels.size + 1}`;
    unknownTrackLabels.set(trackId, generated);
    return generated;
  };

  const parseTrackChangeLabel = (
    rawLabel: string,
  ): { id: string; type: "volume" | "mute" } | null => {
    const trimmed = rawLabel.trim();
    if (!trimmed) {
      return null;
    }

    if (trimmed.includes(":")) {
      const [rawType, ...rest] = trimmed.split(":");
      const type = rawType.trim().toLowerCase();
      const id = rest.join(":").trim();
      if (!id || (type !== "volume" && type !== "mute")) {
        return null;
      }
      return { id, type };
    }

    if (trimmed.includes(".")) {
      const parts = trimmed.split(".");
      if (parts.length < 2) {
        return null;
      }
      const type = parts[parts.length - 1].trim().toLowerCase();
      const id = parts.slice(0, -1).join(".").trim();
      if (!id || (type !== "volume" && type !== "mute")) {
        return null;
      }
      return { id, type };
    }

    return null;
  };

  const interactionBins = new Map<number, { count: number; mute: number; pan: number; volume: number }>();
  const stateBins = new Map<number, Record<string, number[]>>();
  let maxDuration = 180;

  for (const configuration of configurations) {
    for (const entry of configuration.interaction_log ?? []) {
      if (typeof entry?.t === "number" && Number.isFinite(entry.t)) {
        const second = Math.max(0, Math.floor(entry.t / 1000));
        if (second > maxDuration && second < 1200) {
          maxDuration = second;
        }
      }
    }
  }

  for (const configuration of configurations) {
    for (const entry of configuration.interaction_log ?? []) {
      if (typeof entry?.t !== "number" || !Number.isFinite(entry.t)) {
        continue;
      }
      const second = Math.max(0, Math.floor(entry.t / 1000));
      if (second > 1200) {
        continue;
      }

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

    let masterVol = 1;
    let masterMuted = false;
    const trackStates = new Map<string, { vol: number; muted: boolean }>();

    const trackIds = Object.keys(configuration.final_settings?.trackstates ?? {});
    for (const id of trackIds) {
      const canonicalId = resolveCanonicalTrackId(id);
      if (!isMasterTrackId(canonicalId)) {
        trackStates.set(canonicalId, { vol: 1, muted: false });
      }
    }

    const log = [...(configuration.interaction_log ?? [])].sort((a, b) => (a.t || 0) - (b.t || 0));
    let logIdx = 0;

    for (let second = 0; second <= maxDuration; second += 1) {
      while (logIdx < log.length && (log[logIdx].t || 0) <= second * 1000) {
        const entry = log[logIdx];
        const rawLabel = String(entry.label || "");
        const label = rawLabel.trim().toLowerCase();
        const value = entry.val;

        if (label === "master.volume" || label === "mastervolume" || label === "volume") {
          const parsed = getNumericAnswer(value);
          if (parsed !== null) {
            masterVol = Math.max(0, Math.min(1, parsed));
          }
        } else if (
          label === "master.mute" ||
          label === "mastermute" ||
          label === "mastermuted" ||
          label === "mute"
        ) {
          masterMuted = Boolean(value);
        } else {
          const parsed = parseTrackChangeLabel(rawLabel);
          if (parsed) {
            const canonicalId = resolveCanonicalTrackId(parsed.id);
            if (isMasterTrackId(canonicalId)) {
              logIdx += 1;
              continue;
            }

            const state = trackStates.get(canonicalId) ?? { vol: 1, muted: false };
            if (parsed.type === "volume") {
              const parsedVolume = getNumericAnswer(value);
              if (parsedVolume !== null) {
                state.vol = Math.max(0, Math.min(1, parsedVolume));
              }
            } else {
              state.muted = Boolean(value);
            }
            trackStates.set(canonicalId, state);
          }
        }

        logIdx += 1;
      }

      const bin = stateBins.get(second) ?? {};
      for (const [trackId, state] of trackStates.entries()) {
        const trackLabel = resolveTrackLabel(trackId);
        const effectiveVolume = masterMuted || state.muted ? 0 : masterVol * state.vol;
        const values = bin[trackLabel] ?? [];
        values.push(effectiveVolume);
        bin[trackLabel] = values;
      }
      stateBins.set(second, bin);
    }
  }

  const points: InteractionTimelinePoint[] = [];
  for (let second = 0; second <= maxDuration; second += 1) {
    const interactionData = interactionBins.get(second) ?? { count: 0, mute: 0, pan: 0, volume: 0 };
    const stateData = stateBins.get(second) ?? {};

    const trackVolumes: Record<string, number> = {};
    for (const [label, values] of Object.entries(stateData)) {
      trackVolumes[label] = median(values) ?? 0;
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

export const buildTrackDeviations = (
  configurations: AudioConfigurationRow[],
  audioLabelMap: Map<string, string>,
): TrackDeviationItem[] => {
  const map = new Map<
    string,
    {
      primaryTrackId: string;
      secondaryTrackId: string;
      volumeDifferences: number[];
    }
  >();

  for (const configuration of configurations) {
    const trackstates = configuration.final_settings?.trackstates ?? {};

    const tracks = Object.entries(trackstates)
      .map(([trackId, state]) => ({
        trackId,
        label: audioLabelMap.get(trackId) ?? trackId,
        volume: getTrackVolume(state),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    for (let i = 0; i < tracks.length; i += 1) {
      for (let j = i + 1; j < tracks.length; j += 1) {
        const primary = tracks[i];
        const secondary = tracks[j];
        const key = `${primary.trackId}::${secondary.trackId}`;
        const current = map.get(key) ?? {
          primaryTrackId: primary.trackId,
          secondaryTrackId: secondary.trackId,
          volumeDifferences: [],
        };
        current.volumeDifferences.push(primary.volume - secondary.volume);
        map.set(key, current);
      }
    }
  }

  return Array.from(map.entries())
    .map(([pairId, value]) => ({
      pairId,
      primaryTrackId: audioLabelMap.get(value.primaryTrackId) ?? value.primaryTrackId,
      secondaryTrackId: audioLabelMap.get(value.secondaryTrackId) ?? value.secondaryTrackId,
      medianVolumeDifference: median(value.volumeDifferences) ?? 0,
      volumeDifferenceStats: toBoxPlotStats(value.volumeDifferences),
      sampleCount: value.volumeDifferences.length,
    }))
    .sort((a, b) => Math.abs(b.medianVolumeDifference) - Math.abs(a.medianVolumeDifference));
};
