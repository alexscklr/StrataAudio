import type {
  PreferenceBreakdown,
  TrackDeviationItem,
} from "@/features/analysis/types/analysis";
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

      <div className={styles.trackGrid} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
        {trackDeviations.slice(0, 8).map((track) => {
          const volColor = track.averageVolumeDifference > 0 ? "var(--audio-wave)" : "var(--primary)";
          const volPercent = Math.min(100, Math.abs(track.averageVolumeDifference) * 100);
          const relationText =
            track.averageVolumeDifference === 0
              ? `${track.primaryTrackId} und ${track.secondaryTrackId} sind im Schnitt gleich laut.`
              : track.averageVolumeDifference > 0
                ? `${track.primaryTrackId} ist im Schnitt lauter als ${track.secondaryTrackId}.`
                : `${track.primaryTrackId} ist im Schnitt leiser als ${track.secondaryTrackId}.`;
          
          return (
            <div key={track.pairId} className={styles.logSummary} style={{ padding: "1.2rem", background: "rgba(255,255,255,0.03)", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontWeight: 700, fontSize: "0.95rem", lineHeight: "1.3", color: "var(--text-main)" }}>
                  {track.primaryTrackId} vs. {track.secondaryTrackId}
                </span>
                <span className={styles.badge} style={{ opacity: 0.6, fontSize: "0.7rem", flexShrink: 0 }}>n={track.sampleCount}</span>
              </div>

              <p className={styles.muted} style={{ fontSize: "0.78rem", margin: 0 }}>{relationText}</p>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.4rem" }}>
                  <span className={styles.muted}>Mittlerer Lautstärke-Unterschied</span>
                  <span style={{ color: volColor, fontWeight: 700 }}>
                    {track.averageVolumeDifference > 0 ? "+" : ""}{(track.averageVolumeDifference * 100).toFixed(1)}%
                  </span>
                </div>
                <div style={{ height: "6px", background: "#222", borderRadius: "3px", position: "relative", overflow: "hidden" }}>
                  <div style={{ 
                    position: "absolute", 
                    left: "50%", 
                    width: "1px", 
                    height: "100%", 
                    background: "rgba(255,255,255,0.2)",
                    zIndex: 2
                  }} />
                  <div style={{ 
                    position: "absolute",
                    left: track.averageVolumeDifference >= 0 ? "50%" : `${50 - volPercent/2}%`,
                    width: `${volPercent/2}%`,
                    height: "100%",
                    background: volColor,
                    borderRadius: "3px"
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
