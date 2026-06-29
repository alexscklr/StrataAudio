import type {
  PreferenceBreakdown,
  TrackDeviationItem,
} from "@/features/analysis/types/analysis";
import { BoxPlotChart } from "./BoxPlotChart";
import styles from "./AnalysisDashboard.module.css";

interface PreferencePanelProps {
  preference: PreferenceBreakdown;
  trackDeviations: TrackDeviationItem[];
}

const toPercent = (value: number, total: number): number => {
  if (total <= 0) {
    return 0;
  }
  return Math.round((value / total) * 1000) / 10;
};

export function PreferencePanel({ preference, trackDeviations }: PreferencePanelProps) {
  const total = preference.mixerCount + preference.standardCount;
  const mixerPercent = toPercent(preference.mixerCount, total);
  const standardPercent = toPercent(preference.standardCount, total);

  return (
    <section className={styles.panel}>
      <h3>Nutzungspräferenz & Audio-Tendenzen</h3>
      
      <div style={{ marginBottom: "2rem" }}>
        <p className={styles.muted} style={{ marginBottom: "0.8rem" }}>
          Bevorzugter Modus nach Interaktion (N={total}):
        </p>
        <div className={styles.preferenceBar}>
          <div style={{ width: `${mixerPercent}%`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700 }} className={styles.preferenceMixer}>
            Mixer {mixerPercent}%
          </div>
          <div style={{ width: `${standardPercent}%`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700 }} className={styles.preferenceStandard}>
            Standard {standardPercent}%
          </div>
        </div>
      </div>

      <div className={styles.trackGrid} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 20rem), 20rem))", justifyContent: "start", gap: "1rem" }}>
        {trackDeviations.slice(0, 8).map((track) => {
          const relationText =
            track.medianVolumeDifference === 0
              ? `${track.primaryTrackId} und ${track.secondaryTrackId} sind im Schnitt gleich laut.`
              : track.medianVolumeDifference > 0
                ? `${track.primaryTrackId} ist im Schnitt lauter als ${track.secondaryTrackId}.`
                : `${track.primaryTrackId} ist im Schnitt leiser als ${track.secondaryTrackId}.`;
          
          return (
            <div key={track.pairId} className={styles.logSummary} style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: "1.3", color: "var(--text-main)" }}>
                  {track.primaryTrackId} vs. {track.secondaryTrackId}
                </span>
                <span className={styles.badge} style={{ opacity: 0.6, fontSize: "0.7rem", flexShrink: 0 }}>n={track.sampleCount}</span>
              </div>

              <p className={styles.muted} style={{ fontSize: "0.78rem", margin: 0 }}>{relationText}</p>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.4rem" }}>
                  <span className={styles.muted}>Median Lautstärke-Unterschied</span>
                  <span style={{ fontWeight: 700 }}>
                    {track.medianVolumeDifference > 0 ? "+" : ""}{(track.medianVolumeDifference * 100).toFixed(1)}%
                  </span>
                </div>
                <BoxPlotChart
                  label="Verteilung"
                  stats={track.volumeDifferenceStats}
                  minScale={-1}
                  maxScale={1}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
