import type { WithinSubjectInferenceMetric } from "@/features/analysis/types/analysis";
import styles from "./AnalysisDashboard.module.css";

interface InferencePanelProps {
  items: WithinSubjectInferenceMetric[];
}

const formatValue = (value: number | string | null): string => {
  if (value === null) {
    return "—";
  }
  if (typeof value === "string") {
    return value;
  }
  if (!Number.isFinite(value)) {
    return "—";
  }

  if (value >= 0 && value <= 1) {
    return value.toFixed(3);
  }

  return value.toFixed(2);
};

const formatPValue = (value: number | null): string => {
  if (value === null || !Number.isFinite(value)) {
    return "—";
  }
  if (value < 0.001) {
    return "< 0.001";
  }
  return value.toFixed(3);
};

const findNumericSummaryValue = (
  item: WithinSubjectInferenceMetric,
  label: string,
): number | null => {
  const row = item.summaryRows.find((entry) => entry.label === label);
  if (!row || typeof row.value !== "number" || !Number.isFinite(row.value)) {
    return null;
  }
  return row.value;
};

const findFirstNumericSummaryValue = (
  item: WithinSubjectInferenceMetric,
  labels: string[],
): number | null => {
  for (const label of labels) {
    const value = findNumericSummaryValue(item, label);
    if (value !== null) {
      return value;
    }
  }
  return null;
};

const getEffectSizeMagnitude = (value: number | null): string => {
  if (value === null) {
    return "unbekannt";
  }

  const absolute = Math.abs(value);
  if (absolute < 0.2) {
    return "sehr klein";
  }
  if (absolute < 0.5) {
    return "klein";
  }
  if (absolute < 0.8) {
    return "mittel";
  }
  return "gross";
};

const buildInterpretation = (item: WithinSubjectInferenceMetric): string => {
  const adjustedP = item.holmAdjustedPrimaryPValue;
  const isSignificant = adjustedP !== null && adjustedP < 0.05;
  const effectSize = findFirstNumericSummaryValue(item, [
    "Effektstärke (Cohen's dz)",
    "Effektstärke (Rang-biseriales r)",
    "Effektstärke (Cohen's h)",
    "Effektstärke",
  ]);
  const effectMagnitude = getEffectSizeMagnitude(effectSize);

  if (item.testKind === "likert-midpoint") {
    const delta = findNumericSummaryValue(item, "Delta zu 4 (Mean)");
    const direction = delta === null ? "" : delta > 0 ? "oberhalb des Neutralpunkts" : delta < 0 ? "unterhalb des Neutralpunkts" : "genau am Neutralpunkt";
    const effectLabel = item.primaryTestLabel.includes("Wilcoxon")
      ? "rang-biseriales r"
      : item.primaryTestLabel.includes("t-Test")
        ? "Cohen's dz"
        : "Effektstärke";

    if (adjustedP === null) {
      return `Keine belastbare Signifikanzbewertung moeglich (n=${item.sampleSize}).`;
    }

    return isSignificant
      ? `Signifikant (Holm-korr. p=${formatPValue(adjustedP)}): Der Wert liegt ${direction}. ${effectLabel}=${formatValue(effectSize)} weist auf einen ${effectMagnitude}en Effekt hin.`
      : `Nicht signifikant (Holm-korr. p=${formatPValue(adjustedP)}): Tendenz ${direction}, ${effectLabel}=${formatValue(effectSize)} (${effectMagnitude}er Effekt), aber statistisch nicht abgesichert.`;
  }

  if (item.testKind === "binomial-preference") {
    const share = findNumericSummaryValue(item, "Mixer-Anteil");
    const percent = share === null ? null : Math.round(share * 100);
    if (adjustedP === null) {
      return `Keine belastbare Signifikanzbewertung moeglich (n=${item.sampleSize}).`;
    }
    return isSignificant
      ? `Signifikant (Holm-korr. p=${formatPValue(adjustedP)}): Die Praeferenz weicht von 50/50 ab${percent === null ? "" : ` (Mixer ${percent}%).`} Cohen's h=${formatValue(effectSize)} zeigt einen ${effectMagnitude}en Effekt.`
      : `Nicht signifikant (Holm-korr. p=${formatPValue(adjustedP)}): Keine klare Abweichung von einer 50/50-Praeferenz${percent === null ? "." : ` (Mixer ${percent}%).`} Cohen's h=${formatValue(effectSize)} (${effectMagnitude}er Effekt).`;
  }

  const share = findNumericSummaryValue(item, "Stoerungsanteil");
  const percent = share === null ? null : Math.round(share * 100);
  if (adjustedP === null) {
    return `Keine belastbare Signifikanzbewertung moeglich (n=${item.sampleSize}).`;
  }
  return isSignificant
    ? `Signifikant (Holm-korr. p=${formatPValue(adjustedP)}): Der Stoerungsanteil weicht von 50% ab${percent === null ? "." : ` (${percent}%).`} Cohen's h=${formatValue(effectSize)} zeigt einen ${effectMagnitude}en Effekt.`
    : `Nicht signifikant (Holm-korr. p=${formatPValue(adjustedP)}): Kein klarer Hinweis auf Abweichung von 50%${percent === null ? "." : ` (${percent}%).`} Cohen's h=${formatValue(effectSize)} (${effectMagnitude}er Effekt).`;
};

export function InferencePanel({ items }: InferencePanelProps) {
  return (
    <section className={styles.panel}>
      <h3>Inferenzstatistik</h3>
      <p className={styles.muted}>
        Der Abschnitt nutzt datenpassende Tests: Likert-Items gegen den Neutralpunkt 4,
        Moduspräferenz per exaktem Binomialtest und Störungsanteile mit Binomialtest und 95%-Konfidenzintervall.
        Neben p-Werten werden passende Effektstärken ausgewiesen; p-Werte werden zusätzlich mit Holm korrigiert.
      </p>

      <div className={styles.inferenceGrid}>
        {items.map((item) => (
          <article key={item.metricId} className={styles.inferenceCard}>
            <header className={styles.inferenceHeader}>
              <h4>{item.metricLabel}</h4>
              <span className={styles.badgeBlue}>n: {item.sampleSize}</span>
            </header>

            <p className={styles.inferenceSubheading}>Test</p>
            <div className={styles.inferenceRow}>
              <span>Primärtest</span>
              <strong>{item.primaryTestLabel}</strong>
            </div>

            <div className={styles.inferenceDivider} />

            <p className={styles.inferenceSubheading}>Ergebnisse</p>
            {item.summaryRows.map((row) => (
              <div key={`${item.metricId}-${row.label}`} className={styles.inferenceRow}>
                <span>{row.label}</span>
                <strong>{formatValue(row.value)}</strong>
              </div>
            ))}

            <div className={styles.inferenceDivider} />

            <div className={styles.inferenceRow}>
              <span>Primär p</span>
              <strong>{formatPValue(item.primaryPValue)}</strong>
            </div>
            <div className={styles.inferenceRow}>
              <span>Holm-korr. p</span>
              <strong>{formatPValue(item.holmAdjustedPrimaryPValue)}</strong>
            </div>

            <div className={styles.inferenceDivider} />
            <p className={styles.inferenceMethod}>{buildInterpretation(item)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
