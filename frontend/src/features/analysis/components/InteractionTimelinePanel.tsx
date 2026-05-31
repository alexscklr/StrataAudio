import React from "react";
import type { InteractionTimelinePoint } from "@/features/analysis/types/analysis";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./AnalysisDashboard.module.css";

interface InteractionTimelinePanelProps {
  points: InteractionTimelinePoint[];
}

const TRACK_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f472b6", // Light Pink
];

export function InteractionTimelinePanel({ points }: InteractionTimelinePanelProps) {
  const [showDifferenceMode, setShowDifferenceMode] = React.useState(false);

  const trackLabels = React.useMemo(() => {
    if (points.length === 0) return [];
    // Collect all unique track labels across all points (just in case)
    const labels = new Set<string>();
    points.forEach(p => Object.keys(p.trackVolumes).forEach(l => labels.add(l)));
    return Array.from(labels).sort();
  }, [points]);

  const trackPairs = React.useMemo(() => {
    const pairs: Array<{
      id: string;
      primary: string;
      secondary: string;
      label: string;
    }> = [];

    for (let i = 0; i < trackLabels.length; i += 1) {
      for (let j = i + 1; j < trackLabels.length; j += 1) {
        const primary = trackLabels[i];
        const secondary = trackLabels[j];
        pairs.push({
          id: `${primary}::${secondary}`,
          primary,
          secondary,
          label: `${primary} vs. ${secondary}`,
        });
      }
    }

    return pairs;
  }, [trackLabels]);

  const [selectedPairId, setSelectedPairId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (trackPairs.length === 0) {
      setSelectedPairId(null);
      return;
    }

    if (!selectedPairId || !trackPairs.some((pair) => pair.id === selectedPairId)) {
      setSelectedPairId(trackPairs[0].id);
    }
  }, [trackPairs, selectedPairId]);

  const selectedPair = React.useMemo(
    () => trackPairs.find((pair) => pair.id === selectedPairId) ?? null,
    [trackPairs, selectedPairId],
  );

  const chartData = React.useMemo(() => {
    return points.map((p) => ({
      ...p,
      ...p.trackVolumes,
      pairDifference:
        selectedPair
          ? (p.trackVolumes[selectedPair.primary] ?? 0) - (p.trackVolumes[selectedPair.secondary] ?? 0)
          : 0,
    }));
  }, [points, selectedPair]);

  const displayedTrackLabels = React.useMemo(() => {
    if (!showDifferenceMode || !selectedPair) {
      return trackLabels;
    }

    return [selectedPair.primary, selectedPair.secondary];
  }, [showDifferenceMode, selectedPair, trackLabels]);

  const yDomain = React.useMemo<[number, number]>(() => {
    if (!showDifferenceMode || !selectedPair || chartData.length === 0) {
      return [0, 1.2];
    }

    const values = chartData.flatMap((row) => {
      const primary = Number(row.trackVolumes?.[selectedPair.primary] ?? 0);
      const secondary = Number(row.trackVolumes?.[selectedPair.secondary] ?? 0);
      const difference = Number(row.pairDifference ?? 0);
      return [primary, secondary, difference];
    });

    const maxAbs = values.reduce((current, value) => Math.max(current, Math.abs(value)), 0);
    const padded = Math.max(0.15, Math.min(1.2, maxAbs * 1.1));
    return [-padded, padded];
  }, [showDifferenceMode, selectedPair, chartData]);

  const showDifferenceLine = showDifferenceMode && selectedPair !== null;

  return (
    <div className={styles.timelineContainer}>
      <section className={styles.panel}>
        <h3>Ø Lautstärkenverlauf pro Audiospur (Interaktions-Trends)</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", alignItems: "center" }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
            <input
              type="checkbox"
              checked={showDifferenceMode}
              onChange={(event) => setShowDifferenceMode(event.target.checked)}
            />
            Differenzmodus (Spur A - Spur B)
          </label>
          {showDifferenceMode && (
            <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
              Spurpaar
              <select
                value={selectedPairId ?? ""}
                onChange={(event) => setSelectedPairId(event.target.value)}
                disabled={trackPairs.length === 0}
                style={{
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius)",
                  padding: "0.35rem 0.5rem",
                  background: "#232323",
                  color: "var(--text-main)",
                  minWidth: "220px",
                }}
              >
                {trackPairs.map((pair) => (
                  <option key={pair.id} value={pair.id}>
                    {pair.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <div className={styles.timelineChart}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 14, left: 4, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
              <XAxis
                dataKey="second"
                tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                tickFormatter={(value: number) => `${value}s`}
                stroke="var(--border-color)"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                domain={yDomain}
                tickFormatter={(val: number) => `${(val * 100).toFixed(0)}%`}
                stroke="var(--border-color)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#232323",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius)",
                  fontSize: "12px",
                }}
                itemStyle={{ fontSize: "11px", padding: "2px 0" }}
                labelStyle={{ color: "var(--text-main)", marginBottom: "4px", fontWeight: "bold" }}
                formatter={(value: unknown, name: unknown) => {
                  const numeric = typeof value === "number" ? value : Number(value ?? 0);
                  return [`${(numeric * 100).toFixed(1)}%`, String(name)];
                }}
                labelFormatter={(label: unknown) => `Sekunde: ${String(label)}s`}
              />
              {displayedTrackLabels.map((label, index) => (
                <Line
                  key={label}
                  type="monotone"
                  dataKey={label}
                  stroke={TRACK_COLORS[index % TRACK_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                  name={label}
                />
              ))}
              {showDifferenceLine && selectedPair && (
                <Line
                  type="monotone"
                  dataKey="pairDifference"
                  stroke="#f97316"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={false}
                  isAnimationActive={false}
                  name={`Differenz (${selectedPair.primary} - ${selectedPair.secondary})`}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.timelineLegend}>
          {displayedTrackLabels.map((label, index) => (
            <span key={label} className={styles.legendItem}>
              <span className={styles.dot} style={{ backgroundColor: TRACK_COLORS[index % TRACK_COLORS.length] }} />
              {label}
            </span>
          ))}
          {showDifferenceLine && selectedPair && (
            <span className={styles.legendItem}>
              <span className={styles.dot} style={{ backgroundColor: "#f97316" }} />
              Differenz ({selectedPair.primary} - {selectedPair.secondary})
            </span>
          )}
        </div>
        <p className={styles.muted}>
          Median effektive Lautstärke (isMute * masterVolume * trackVolume) über alle Teilnehmer.
          {showDifferenceLine && " Im Differenzmodus zeigt die gestrichelte Linie den Abstand zwischen zwei Spuren über die Zeit."}
        </p>
      </section>
    </div>
  );
}
