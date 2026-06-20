import type {
  AudioConfigurationRow,
  InteractionDensityPoint,
  TrackDeviationItem,
} from "@/features/analysis/types/analysis";
import {
  getNumericAnswer,
  getTrackVolume,
  median,
  toBoxPlotStats,
} from "@/features/analysis/lib/analysisMetricsShared";

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

  for (const configuration of configurations) {
    const trackstates = configuration.final_settings?.trackstates ?? {};
    const touchedTrackIds = new Set<string>();

    for (const entry of configuration.interaction_log ?? []) {
      const parsed = parseTrackChangeLabel(String(entry.label || ""));
      if (!parsed) {
        continue;
      }

      const canonicalId = parsed.id.trim();
      if (canonicalId) {
        touchedTrackIds.add(canonicalId);
      }
    }

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
        if (!touchedTrackIds.has(primary.trackId) && !touchedTrackIds.has(secondary.trackId)) {
          continue;
        }
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

export const buildInteractionDensity = (
  configurations: AudioConfigurationRow[],
  windowSizeSeconds: number = 5,
): InteractionDensityPoint[] => {
  const windowMap = new Map<
    number,
    {
      totalInteractions: number;
      volumeInteractions: number;
      muteInteractions: number;
      panInteractions: number;
      participants: Set<string>;
    }
  >();

  let maxDuration = 0;

  // First pass: determine max duration
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

  // Second pass: aggregate interactions into windows
  for (const configuration of configurations) {
    for (const entry of configuration.interaction_log ?? []) {
      if (typeof entry?.t !== "number" || !Number.isFinite(entry.t)) {
        continue;
      }

      const second = Math.max(0, Math.floor(entry.t / 1000));
      if (second > 1200) {
        continue;
      }

      const windowStart = Math.floor(second / windowSizeSeconds) * windowSizeSeconds;
      const current = windowMap.get(windowStart) ?? {
        totalInteractions: 0,
        volumeInteractions: 0,
        muteInteractions: 0,
        panInteractions: 0,
        participants: new Set(),
      };

      current.totalInteractions += 1;
      current.participants.add(configuration.participant_id);

      const label = String(entry.label || "").toLowerCase();
      if (label.includes("mute")) {
        current.muteInteractions += 1;
      } else if (label.includes("pan")) {
        current.panInteractions += 1;
      } else if (label.includes("volume")) {
        current.volumeInteractions += 1;
      }

      windowMap.set(windowStart, current);
    }
  }

  // Build result array
  const points: InteractionDensityPoint[] = [];
  const normalizedMaxDuration = Math.max(0, maxDuration);
  for (let windowStart = 0; windowStart <= normalizedMaxDuration; windowStart += windowSizeSeconds) {
    const data = windowMap.get(windowStart) ?? {
      totalInteractions: 0,
      volumeInteractions: 0,
      muteInteractions: 0,
      panInteractions: 0,
      participants: new Set(),
    };

    points.push({
      windowStart,
      windowEnd: windowStart + windowSizeSeconds,
      totalInteractions: data.totalInteractions,
      volumeInteractions: data.volumeInteractions,
      muteInteractions: data.muteInteractions,
      panInteractions: data.panInteractions,
      participantCount: data.participants.size,
    });
  }

  return points;
};
