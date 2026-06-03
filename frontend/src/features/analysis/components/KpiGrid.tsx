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
    { label: "4-Item Usability Index (0-100)", value: valueOrDash(kpis.susScore) },
    { label: "NPS-Score", value: valueOrDash(kpis.npsScore) },
    { label: "UEQ Gesamtqualität", value: valueOrDash(kpis.ueqScore) },
    { label: "Empfehlungswert (Ø 0-10)", value: valueOrDash(kpis.averageNpsRating) },
    {
      label: "Mixer-Präferenz",
      value: valueOrDash(kpis.mixerPreferencePercent, "%"),
    },
    {
      label: "Median Time-to-Mix",
      value: valueOrDash(kpis.medianTimeToFirstInteractionSec, " s"),
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
          </article>
        ))}
      </div>
    </section>
  );
};

export default KpiGrid;
