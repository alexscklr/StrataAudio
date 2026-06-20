import type { KpiSummary } from "@/features/analysis/types/analysis";
import styles from "./AnalysisDashboard.module.css";

interface KpiGridProps {
  kpis: KpiSummary;
}

const valueOrDash = (value: number | null, suffix = ""): string =>
  value === null ? "-" : `${value}${suffix}`;

const KpiGrid = ({ kpis }: KpiGridProps) => {
  const cards = [
    { label: "Teilnehmende", value: String(kpis.participantsCount) },
    { label: "Demografie-Datensätze", value: String(kpis.demographicsCount) },
    { label: "Video-Survey Responses", value: String(kpis.videoSurveyCount) },
    { label: "Endsurvey Responses", value: String(kpis.endSurveyCount) },
    { label: "Completion Rate", value: valueOrDash(kpis.completionRate, "%") },
    { label: "4-Item Usability Index (0-100)", value: valueOrDash(kpis.susScore), stdDev: kpis.susScoreStdDev },
    { label: "NPS-Score", value: valueOrDash(kpis.npsScore), stdDev: kpis.npsScoreStdDev },
    { label: "UEQ Gesamtqualität", value: valueOrDash(kpis.ueqScore), stdDev: kpis.ueqScoreStdDev },
    { label: "Empfehlungswert (Ø 0-10)", value: valueOrDash(kpis.averageNpsRating), stdDev: kpis.averageNpsRatingStdDev },
    {
      label: "Mixer-Präferenz",
      value: valueOrDash(kpis.mixerPreferencePercent, "%"),
    },
    {
      label: "Median Time-to-Mix",
      value: valueOrDash(kpis.medianTimeToFirstInteractionSec, " s"),
      stdDev: kpis.medianTimeToFirstInteractionSecStdDev,
    },
  ];

  return (
    <section className={styles.panel}>
      <h3>Big Picture KPIs</h3>
      <div className={styles.kpiGrid}>
        {cards.map((card) => (
          <article key={card.label} className={styles.kpiCard}>
            <p className={styles.kpiLabel}>{card.label}</p>
            <p className={styles.kpiValue}>{card.value}</p>
            {card.stdDev !== undefined && card.stdDev !== null && (
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
                σ = {card.stdDev.toFixed(2)}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default KpiGrid;
