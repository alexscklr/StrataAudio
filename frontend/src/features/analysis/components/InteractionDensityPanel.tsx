import React from "react";
import type { InteractionDensityPoint } from "@/features/analysis/types/analysis";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./AnalysisDashboard.module.css";

interface InteractionDensityPanelProps {
  points: InteractionDensityPoint[];
}

export function InteractionDensityPanel({ points }: InteractionDensityPanelProps) {
  const chartData = React.useMemo(() => {
    return points.map((point) => ({
      ...point,
      timeLabel: `${point.windowStart}–${point.windowEnd}s`,
    }));
  }, [points]);

  const maxInteractions = React.useMemo(() => {
    return Math.max(...points.map((p) => p.totalInteractions), 1);
  }, [points]);

  return (
    <section className={styles.panel}>
      <h3>Interaktions-Dichte über die Zeit</h3>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "1rem" }}>
        Visualisiert die kumulierte Häufigkeit aller Reglerbewegungen (Slider-Events) über die Videodauer.
        Zeigt „Aufmerksamkeits-Hotspots": Zeitfenster mit besonders hoher Interaktivität deuten auf
        Explorationsphase oder dramaturgische Schlüsselmomente hin.
      </p>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "-0.2rem", marginBottom: "1rem" }}>
        Hinweis: Bei Videos &gt; 120s und erstem Modus "standard" wird die zweite Hälfte nach dem Midpoint-Switch
        auf t=0 umgerechnet; Ereignisse aus der ersten Hälfte sind in dieser Kurve nicht enthalten.
      </p>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="timeLabel"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              stroke="var(--border-color)"
            />
            <YAxis
              label={{ value: "Anzahl Interaktionen", angle: -90, position: "insideLeft" }}
              tick={{ fontSize: 10, fill: "var(--text-muted)" }}
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
                const labels: Record<string, string> = {
                  totalInteractions: "Total",
                  volumeInteractions: "Lautstärke",
                  muteInteractions: "Stumm",
                  panInteractions: "Pan",
                  participantCount: "Teilnehmer",
                };
                return [value, labels[String(name)] || String(name)];
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="square"
              formatter={(value: string) => {
                const labels: Record<string, string> = {
                  totalInteractions: "Alle Interaktionen",
                  volumeInteractions: "Lautstärke-Änderungen",
                  muteInteractions: "Stumm-Änderungen",
                  panInteractions: "Pan-Änderungen",
                  participantCount: "Teilnehmer mit Interaktionen",
                };
                return labels[value] || value;
              }}
            />
            <Bar
              dataKey="totalInteractions"
              stackId="a"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="volumeInteractions"
              stackId="b"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="muteInteractions"
              stackId="c"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="panInteractions"
              stackId="d"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(0,0,0,0.1)", borderRadius: "var(--radius)" }}>
        <h4 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Statistik</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", fontSize: "0.9rem" }}>
          <div>
            <strong>Max Interaktionen pro Fenster:</strong>
            <p style={{ margin: "0.25rem 0", color: "var(--text-muted)" }}>{maxInteractions}</p>
          </div>
          <div>
            <strong>Fenster mit Interaktionen:</strong>
            <p style={{ margin: "0.25rem 0", color: "var(--text-muted)" }}>
              {points.filter((p) => p.totalInteractions > 0).length} von {points.length}
            </p>
          </div>
          <div>
            <strong>Fenster-Größe:</strong>
            <p style={{ margin: "0.25rem 0", color: "var(--text-muted)" }}>
              {points.length > 0 ? points[0].windowEnd - points[0].windowStart : 0}s
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
