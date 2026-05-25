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

export function InteractionTimelinePanel({ points }: InteractionTimelinePanelProps) {
  return (
    <section className={styles.panel}>
      <h3>Interaktionslog Timeline (nach Typ & Video gefiltert)</h3>
      <div className={styles.timelineChart}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 10, right: 14, left: 4, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
            <XAxis
              dataKey="second"
              tick={{ fontSize: 10, fill: "var(--text-muted)" }}
              tickFormatter={(value: number) => `${value}s`}
              stroke="var(--border-color)"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--text-muted)" }}
              allowDecimals={false}
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
                const labelMap: Record<string, string> = {
                  count: "Gesamt",
                  muteCount: "Mute",
                  panCount: "Panorama",
                  volumeCount: "Lautstärke",
                };
                return [numeric, labelMap[String(name)] || String(name)];
              }}
              labelFormatter={(label: unknown) => `Sekunde: ${String(label)}s`}
            />
            <Line
              type="stepAfter"
              dataKey="count"
              stroke="var(--audio-wave)"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
              name="count"
            />
            <Line
              type="stepAfter"
              dataKey="volumeCount"
              stroke="var(--primary)"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
              name="volumeCount"
            />
            <Line
              type="stepAfter"
              dataKey="panCount"
              stroke="var(--strata-accent)"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
              name="panCount"
            />
            <Line
              type="stepAfter"
              dataKey="muteCount"
              stroke="var(--audio-glow)"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
              name="muteCount"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.timelineLegend}>
        <span className={styles.legendItem}><span className={styles.dot} style={{ backgroundColor: "var(--audio-wave)" }} /> Gesamt</span>
        <span className={styles.legendItem}><span className={styles.dot} style={{ backgroundColor: "var(--primary)" }} /> Lautstärke</span>
        <span className={styles.legendItem}><span className={styles.dot} style={{ backgroundColor: "var(--strata-accent)" }} /> Panorama</span>
        <span className={styles.legendItem}><span className={styles.dot} style={{ backgroundColor: "var(--audio-glow)" }} /> Mute</span>
      </div>
      <p className={styles.muted}>Darstellung als Stufendiagramm zur besseren Sichtbarkeit einzelner Interaktions-Peaks.</p>
    </section>
  );
}
