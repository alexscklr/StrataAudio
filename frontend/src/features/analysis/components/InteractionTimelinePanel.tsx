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
  const trackLabels = React.useMemo(() => {
    if (points.length === 0) return [];
    // Collect all unique track labels across all points (just in case)
    const labels = new Set<string>();
    points.forEach(p => Object.keys(p.trackVolumes).forEach(l => labels.add(l)));
    return Array.from(labels).sort();
  }, [points]);

  const chartData = React.useMemo(() => {
    return points.map((p) => ({
      ...p,
      ...p.trackVolumes,
    }));
  }, [points]);

  return (
    <div className={styles.timelineContainer}>
      <section className={styles.panel}>
        <h3>Ø Lautstärkenverlauf pro Audiospur (Interaktions-Trends)</h3>
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
                domain={[0, 1.2]}
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
                formatter={(value: unknown, name: any) => {
                  const numeric = typeof value === "number" ? value : Number(value ?? 0);
                  return [`${(numeric * 100).toFixed(1)}%`, name];
                }}
                labelFormatter={(label: unknown) => `Sekunde: ${String(label)}s`}
              />
              {trackLabels.map((label, index) => (
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
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.timelineLegend}>
          {trackLabels.map((label, index) => (
            <span key={label} className={styles.legendItem}>
              <span className={styles.dot} style={{ backgroundColor: TRACK_COLORS[index % TRACK_COLORS.length] }} />
              {label}
            </span>
          ))}
        </div>
        <p className={styles.muted}>Durchschnittliche effektive Lautstärke (isMute * masterVolume * trackVolume) über alle Teilnehmer.</p>
      </section>
    </div>
  );
}
