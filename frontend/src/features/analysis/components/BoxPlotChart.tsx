import type { BoxPlotStats } from "@/features/analysis/types/analysis";
import styles from "./AnalysisDashboard.module.css";

interface BoxPlotChartProps {
  label: string;
  stats: BoxPlotStats | null;
  minScale?: number;
  maxScale?: number;
}

const scale = (value: number, min: number, max: number): number => {
  if (max <= min) {
    return 50;
  }
  return ((value - min) / (max - min)) * 100;
};

export function BoxPlotChart({
  label,
  stats,
  minScale = 1,
  maxScale = 7,
}: BoxPlotChartProps) {
  if (!stats) {
    return (
      <article className={styles.chartCard}>
        <h4>{label}</h4>
        <p className={styles.muted}>Keine Daten im aktuellen Filter.</p>
      </article>
    );
  }

  const minX = scale(stats.min, minScale, maxScale);
  const q1X = scale(stats.q1, minScale, maxScale);
  const medianX = scale(stats.median, minScale, maxScale);
  const q3X = scale(stats.q3, minScale, maxScale);
  const maxX = scale(stats.max, minScale, maxScale);

  return (
    <article className={styles.chartCard}>
      <h4>{label}</h4>
      <svg
        className={styles.boxPlot}
        viewBox="0 0 100 44"
        role="img"
        aria-label={`${label} Boxplot`}
      >
        <line x1={minX} y1={22} x2={q1X} y2={22} className={styles.boxWhisker} />
        <line x1={q3X} y1={22} x2={maxX} y2={22} className={styles.boxWhisker} />
        <rect x={q1X} y={12} width={Math.max(q3X - q1X, 1)} height={20} className={styles.boxBody} />
        <line x1={medianX} y1={12} x2={medianX} y2={32} className={styles.boxMedian} />
        <line x1={minX} y1={16} x2={minX} y2={28} className={styles.boxCap} />
        <line x1={maxX} y1={16} x2={maxX} y2={28} className={styles.boxCap} />
      </svg>
      <div className={styles.boxPlotScale}>
        <span>{minScale}</span>
        <span>{Math.round((minScale + maxScale) / 2)}</span>
        <span>{maxScale}</span>
      </div>
      <p className={styles.muted}>
        Min {stats.min.toFixed(2)} | Q1 {stats.q1.toFixed(2)} | Median {stats.median.toFixed(2)} | Q3 {stats.q3.toFixed(2)} | Max {stats.max.toFixed(2)}
      </p>
    </article>
  );
}
