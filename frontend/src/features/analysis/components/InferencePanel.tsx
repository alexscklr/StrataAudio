import type { WithinSubjectInferenceMetric } from "@/features/analysis/types/analysis";
import styles from "./AnalysisDashboard.module.css";

interface InferencePanelProps {
  items: WithinSubjectInferenceMetric[];
}

const formatNumber = (value: number | null, digits = 3): string => {
  if (value === null || !Number.isFinite(value)) {
    return "—";
  }
  return value.toFixed(digits);
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

const getPrimaryLabel = (test: WithinSubjectInferenceMetric["primaryTest"]): string => {
  if (test === "paired-t") {
    return "Primär: gepaarter t-Test";
  }
  if (test === "wilcoxon") {
    return "Primär: Wilcoxon-Vorzeichen-Rangtest";
  }
  return "Primär: unzureichende Daten";
};

export function InferencePanel({ items }: InferencePanelProps) {
  return (
    <section className={styles.panel}>
      <h3>Within-Subjects Inferenzstatistik</h3>
      <p className={styles.muted}>
        Für jede Skala werden Teilnehmer-Mittelwerte pro Modus gepaart verglichen (Differenz = Mixer - Standard).
        Primärtest: bei kleinen Stichproben oder verletzter Normalität Wilcoxon, sonst gepaarter t-Test.
        p-Werte werden zusätzlich mit Holm korrigiert.
      </p>

      <div className={styles.inferenceGrid}>
        {items.map((item) => (
          <article key={item.metricId} className={styles.inferenceCard}>
            <header className={styles.inferenceHeader}>
              <h4>{item.metricLabel}</h4>
              <span className={styles.badgeBlue}>Paare: {item.pairs}</span>
            </header>

            <div className={styles.inferenceRow}>
              <span>Mean Standard</span>
              <strong>{formatNumber(item.meanStandard, 2)}</strong>
            </div>
            <div className={styles.inferenceRow}>
              <span>Mean Mixer</span>
              <strong>{formatNumber(item.meanMixer, 2)}</strong>
            </div>
            <div className={styles.inferenceRow}>
              <span>Delta Mean (M-S)</span>
              <strong>{formatNumber(item.meanDifferenceMixerMinusStandard, 3)}</strong>
            </div>
            <div className={styles.inferenceRow}>
              <span>Delta Median (M-S)</span>
              <strong>{formatNumber(item.medianDifferenceMixerMinusStandard, 3)}</strong>
            </div>

            <div className={styles.inferenceDivider} />

            <p className={styles.inferenceMethod}>{getPrimaryLabel(item.primaryTest)}</p>
            <div className={styles.inferenceRow}>
              <span>Primär p</span>
              <strong>{formatPValue(item.primaryPValue)}</strong>
            </div>
            <div className={styles.inferenceRow}>
              <span>Holm-korr. p</span>
              <strong>{formatPValue(item.holmAdjustedPrimaryPValue)}</strong>
            </div>

            <div className={styles.inferenceDivider} />

            <p className={styles.inferenceSubheading}>Normalitätsdiagnostik (Jarque-Bera)</p>
            <div className={styles.inferenceRow}>
              <span>p</span>
              <strong>{formatPValue(item.normality.pValue)}</strong>
            </div>
            <div className={styles.inferenceRow}>
              <span>Schiefe</span>
              <strong>{formatNumber(item.normality.skewness, 3)}</strong>
            </div>
            <div className={styles.inferenceRow}>
              <span>Exzess-Kurtosis</span>
              <strong>{formatNumber(item.normality.excessKurtosis, 3)}</strong>
            </div>

            <div className={styles.inferenceDivider} />

            <p className={styles.inferenceSubheading}>Gepaarter t-Test</p>
            <div className={styles.inferenceRow}>
              <span>t (df)</span>
              <strong>
                {item.pairedT
                  ? `${formatNumber(item.pairedT.tStatistic, 3)} (${item.pairedT.degreesOfFreedom})`
                  : "—"}
              </strong>
            </div>
            <div className={styles.inferenceRow}>
              <span>p</span>
              <strong>{formatPValue(item.pairedT?.pValue ?? null)}</strong>
            </div>
            <div className={styles.inferenceRow}>
              <span>95% CI Delta</span>
              <strong>
                {item.pairedT
                  ? `[${formatNumber(item.pairedT.ci95Lower, 3)}, ${formatNumber(item.pairedT.ci95Upper, 3)}]`
                  : "—"}
              </strong>
            </div>
            <div className={styles.inferenceRow}>
              <span>Cohen dz</span>
              <strong>{formatNumber(item.pairedT?.cohenDz ?? null, 3)}</strong>
            </div>

            <div className={styles.inferenceDivider} />

            <p className={styles.inferenceSubheading}>Wilcoxon</p>
            <div className={styles.inferenceRow}>
              <span>z</span>
              <strong>{formatNumber(item.wilcoxon?.zStatistic ?? null, 3)}</strong>
            </div>
            <div className={styles.inferenceRow}>
              <span>p</span>
              <strong>{formatPValue(item.wilcoxon?.pValue ?? null)}</strong>
            </div>
            <div className={styles.inferenceRow}>
              <span>r biserial</span>
              <strong>{formatNumber(item.wilcoxon?.rankBiserialCorrelation ?? null, 3)}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
