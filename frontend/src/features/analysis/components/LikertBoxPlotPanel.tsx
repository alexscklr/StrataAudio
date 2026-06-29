import type { LikertBoxPlotItem } from "@/features/analysis/types/analysis";
import { BoxPlotChart } from "./BoxPlotChart";
import styles from "./AnalysisDashboard.module.css";

interface LikertBoxPlotPanelProps {
  items: LikertBoxPlotItem[];
  disturbances: { yes: number; no: number };
}

export function LikertBoxPlotPanel({ items, disturbances }: LikertBoxPlotPanelProps) {
  const totalSync = disturbances.yes + disturbances.no;
  const yesPercent = totalSync > 0 ? (disturbances.yes / totalSync) * 100 : 0;
  const noPercent = totalSync > 0 ? (disturbances.no / totalSync) * 100 : 0;

  return (
    <section className={styles.panel}>
      <h3>Videoergebnisse</h3>
      
      <div className={`${styles.panelInset} ${styles.disturbanceSummary}`}>
        <h4 style={{ fontSize: "0.95rem", marginBottom: "0.8rem" }}>Gab es Störungen? (Sync-2)</h4>
        <div className={styles.disturbanceBarRow}>
          <div className={styles.disturbanceBar}>
            <div style={{ width: `${yesPercent}%`, background: "var(--audio-glow)" }} />
            <div style={{ width: `${noPercent}%`, background: "var(--primary)" }} />
          </div>
          <div className={styles.disturbanceLegend}>
            <span style={{ color: "var(--audio-glow)", fontWeight: "bold" }}>Ja: {disturbances.yes} ({yesPercent.toFixed(1)}%)</span>
            <span style={{ margin: "0 0.5rem", opacity: 0.3 }}>|</span>
            <span style={{ color: "var(--primary)", fontWeight: "bold" }}>Nein: {disturbances.no} ({noPercent.toFixed(1)}%)</span>
          </div>
        </div>
      </div>

      <p className={styles.muted}>
        Verteilung der Likert-Skalen (1-7) für Sync-Passung und Nutzererlebnis.
      </p>
      <div className={styles.boxPlotGrid}>
        {items.map((item) => (
          <BoxPlotChart key={item.id} label={item.label} stats={item.stats} />
        ))}
      </div>
    </section>
  );
}
