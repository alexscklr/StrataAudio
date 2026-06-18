import type {
  InferencePrimaryTest,
  PairedTTestResult,
  SurveyResponseRow,
  WilcoxonSignedRankResult,
  WithinSubjectInferenceMetric,
} from "@/features/analysis/types/analysis";
import {
  extractAnswers,
  getNumericAnswer,
  mean,
  median,
} from "@/features/analysis/lib/analysisMetricsShared";

interface MetricConfig {
  id: string;
  label: string;
}

const METRICS: MetricConfig[] = [
  { id: "sync-1", label: "Sync-Passung (1-7)" },
  { id: "experience-1", label: "Interesse durch Mixer (1-7)" },
  { id: "pan-1", label: "Nützlichkeit PAN (1-7)" },
  { id: "pan-2", label: "Intuitivität PAN (1-7)" },
];

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const erf = (value: number): number => {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y =
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-x * x);
  return sign * y;
};

const normalCdf = (value: number): number => 0.5 * (1 + erf(value / Math.SQRT2));

const logGamma = (value: number): number => {
  const coefficients = [
    676.5203681218851,
    -1259.1392167224028,
    771.3234287776531,
    -176.6150291621406,
    12.507343278686905,
    -0.13857109526572012,
    9.984369578019572e-6,
    1.5056327351493116e-7,
  ];

  if (value < 0.5) {
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * value)) - logGamma(1 - value);
  }

  let x = 0.9999999999998099;
  const z = value - 1;

  for (let i = 0; i < coefficients.length; i += 1) {
    x += coefficients[i] / (z + i + 1);
  }

  const t = z + coefficients.length - 0.5;
  return (
    0.5 * Math.log(2 * Math.PI) +
    (z + 0.5) * Math.log(t) -
    t +
    Math.log(x)
  );
};

const betaContinuedFraction = (a: number, b: number, x: number): number => {
  const maxIterations = 200;
  const epsilon = 3e-12;
  const fpMin = 1e-30;

  let qab = a + b;
  let qap = a + 1;
  let qam = a - 1;

  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < fpMin) {
    d = fpMin;
  }
  d = 1 / d;
  let h = d;

  for (let m = 1; m <= maxIterations; m += 1) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < fpMin) {
      d = fpMin;
    }
    c = 1 + aa / c;
    if (Math.abs(c) < fpMin) {
      c = fpMin;
    }
    d = 1 / d;
    h *= d * c;

    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < fpMin) {
      d = fpMin;
    }
    c = 1 + aa / c;
    if (Math.abs(c) < fpMin) {
      c = fpMin;
    }
    d = 1 / d;
    const delta = d * c;
    h *= delta;

    if (Math.abs(delta - 1) <= epsilon) {
      break;
    }

    qab = a + b;
    qap = a + 1;
    qam = a - 1;
  }

  return h;
};

const regularizedIncompleteBeta = (a: number, b: number, x: number): number => {
  if (x <= 0) {
    return 0;
  }
  if (x >= 1) {
    return 1;
  }

  const bt = Math.exp(
    logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x),
  );

  if (x < (a + 1) / (a + b + 2)) {
    return (bt * betaContinuedFraction(a, b, x)) / a;
  }

  return 1 - (bt * betaContinuedFraction(b, a, 1 - x)) / b;
};

const studentTCdf = (value: number, degreesOfFreedom: number): number => {
  if (!Number.isFinite(value) || degreesOfFreedom <= 0) {
    return Number.NaN;
  }

  if (value === 0) {
    return 0.5;
  }

  const x = degreesOfFreedom / (degreesOfFreedom + value * value);
  const ib = regularizedIncompleteBeta(degreesOfFreedom / 2, 0.5, x);

  if (value > 0) {
    return 1 - 0.5 * ib;
  }
  return 0.5 * ib;
};

const inverseStudentT = (probability: number, degreesOfFreedom: number): number => {
  if (probability <= 0) {
    return -Infinity;
  }
  if (probability >= 1) {
    return Infinity;
  }

  let low = -50;
  let high = 50;

  for (let i = 0; i < 100; i += 1) {
    const mid = (low + high) / 2;
    const cdf = studentTCdf(mid, degreesOfFreedom);
    if (cdf < probability) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
};

const sampleVariance = (values: number[]): number | null => {
  if (values.length < 2) {
    return null;
  }

  const avg = mean(values);
  if (avg === null) {
    return null;
  }

  const squared = values.reduce((acc, current) => acc + (current - avg) ** 2, 0);
  return squared / (values.length - 1);
};

const calculateNormalityDiagnostics = (differences: number[]) => {
  if (differences.length < 3) {
    return {
      method: "jarque-bera" as const,
      pValue: null,
      skewness: null,
      excessKurtosis: null,
    };
  }

  const avg = mean(differences);
  if (avg === null) {
    return {
      method: "jarque-bera" as const,
      pValue: null,
      skewness: null,
      excessKurtosis: null,
    };
  }

  const n = differences.length;
  const centered = differences.map((value) => value - avg);
  const m2 = centered.reduce((acc, value) => acc + value ** 2, 0) / n;

  if (m2 <= 0) {
    return {
      method: "jarque-bera" as const,
      pValue: 1,
      skewness: 0,
      excessKurtosis: -3,
    };
  }

  const m3 = centered.reduce((acc, value) => acc + value ** 3, 0) / n;
  const m4 = centered.reduce((acc, value) => acc + value ** 4, 0) / n;

  const skewness = m3 / m2 ** 1.5;
  const excessKurtosis = m4 / (m2 * m2) - 3;
  const jarqueBera = (n / 6) * (skewness * skewness + (excessKurtosis * excessKurtosis) / 4);
  const pValue = Math.exp(-jarqueBera / 2);

  return {
    method: "jarque-bera" as const,
    pValue,
    skewness,
    excessKurtosis,
  };
};

const calculatePairedT = (differences: number[]): PairedTTestResult | null => {
  if (differences.length < 2) {
    return null;
  }

  const meanDifference = mean(differences);
  const variance = sampleVariance(differences);

  if (meanDifference === null || variance === null || variance <= 0) {
    return null;
  }

  const n = differences.length;
  const sd = Math.sqrt(variance);
  const standardError = sd / Math.sqrt(n);
  if (standardError <= 0) {
    return null;
  }

  const tStatistic = meanDifference / standardError;
  const degreesOfFreedom = n - 1;
  const pValue = 2 * (1 - studentTCdf(Math.abs(tStatistic), degreesOfFreedom));
  const tCritical = inverseStudentT(0.975, degreesOfFreedom);

  return {
    tStatistic,
    degreesOfFreedom,
    pValue: clamp01(pValue),
    meanDifference,
    ci95Lower: meanDifference - tCritical * standardError,
    ci95Upper: meanDifference + tCritical * standardError,
    cohenDz: meanDifference / sd,
  };
};

const calculateWilcoxon = (differences: number[]): WilcoxonSignedRankResult | null => {
  const nonZero = differences.filter((difference) => difference !== 0);
  if (nonZero.length === 0) {
    return {
      wPlus: 0,
      wMinus: 0,
      zStatistic: 0,
      pValue: 1,
      rankBiserialCorrelation: 0,
    };
  }

  const ranked = nonZero
    .map((difference) => ({
      sign: Math.sign(difference) as -1 | 1,
      abs: Math.abs(difference),
      rank: 0,
    }))
    .sort((a, b) => a.abs - b.abs);

  let currentRank = 1;
  let tieCorrection = 0;

  for (let i = 0; i < ranked.length; ) {
    let j = i + 1;
    while (j < ranked.length && ranked[j].abs === ranked[i].abs) {
      j += 1;
    }

    const tieSize = j - i;
    const averageRank = (currentRank + (currentRank + tieSize - 1)) / 2;

    for (let k = i; k < j; k += 1) {
      ranked[k].rank = averageRank;
    }

    if (tieSize > 1) {
      tieCorrection += tieSize * (tieSize + 1) * (2 * tieSize + 1);
    }

    currentRank += tieSize;
    i = j;
  }

  const wPlus = ranked
    .filter((entry) => entry.sign > 0)
    .reduce((acc, entry) => acc + entry.rank, 0);
  const totalRankSum = (ranked.length * (ranked.length + 1)) / 2;
  const wMinus = totalRankSum - wPlus;

  const meanRank = totalRankSum / 2;
  const variance = (ranked.length * (ranked.length + 1) * (2 * ranked.length + 1) - tieCorrection) / 24;

  if (variance <= 0) {
    return null;
  }

  const zRaw = (wPlus - meanRank - 0.5 * Math.sign(wPlus - meanRank || 1)) / Math.sqrt(variance);
  const pValue = 2 * (1 - normalCdf(Math.abs(zRaw)));

  return {
    wPlus,
    wMinus,
    zStatistic: zRaw,
    pValue: clamp01(pValue),
    rankBiserialCorrelation: (wPlus - wMinus) / totalRankSum,
  };
};

const applyHolmCorrection = (
  rows: Array<{ index: number; pValue: number }>,
): Map<number, number> => {
  const result = new Map<number, number>();
  if (rows.length === 0) {
    return result;
  }

  const sorted = [...rows].sort((a, b) => a.pValue - b.pValue);
  let runningMax = 0;

  for (let i = 0; i < sorted.length; i += 1) {
    const factor = sorted.length - i;
    const adjusted = clamp01(sorted[i].pValue * factor);
    runningMax = Math.max(runningMax, adjusted);
    result.set(sorted[i].index, runningMax);
  }

  return result;
};

const decidePrimaryTest = (
  pairs: number,
  normalityPValue: number | null,
  pairedT: PairedTTestResult | null,
  wilcoxon: WilcoxonSignedRankResult | null,
): InferencePrimaryTest => {
  if (pairs < 2 || (!pairedT && !wilcoxon)) {
    return "insufficient-data";
  }

  if (!pairedT && wilcoxon) {
    return "wilcoxon";
  }

  if (!wilcoxon && pairedT) {
    return "paired-t";
  }

  if (pairs < 8) {
    return "wilcoxon";
  }

  if (normalityPValue !== null && normalityPValue >= 0.05) {
    return "paired-t";
  }

  return "wilcoxon";
};

export const buildWithinSubjectInference = (
  surveyResponses: SurveyResponseRow[],
): WithinSubjectInferenceMetric[] => {
  const rows = METRICS.map((metric) => {
    const byParticipant = new Map<
      string,
      { standard: number[]; mixer: number[] }
    >();

    for (const response of surveyResponses) {
      const mode = response.first_watch_mode;
      if (mode !== "standard" && mode !== "mixer") {
        continue;
      }

      const value = getNumericAnswer(extractAnswers(response.responses)[metric.id]);
      if (value === null) {
        continue;
      }

      const current = byParticipant.get(response.participant_id) ?? {
        standard: [],
        mixer: [],
      };
      current[mode].push(value);
      byParticipant.set(response.participant_id, current);
    }

    const standardMeans: number[] = [];
    const mixerMeans: number[] = [];
    const differences: number[] = [];

    for (const participantValues of byParticipant.values()) {
      if (participantValues.standard.length === 0 || participantValues.mixer.length === 0) {
        continue;
      }

      const standardMean = mean(participantValues.standard);
      const mixerMean = mean(participantValues.mixer);

      if (standardMean === null || mixerMean === null) {
        continue;
      }

      standardMeans.push(standardMean);
      mixerMeans.push(mixerMean);
      differences.push(mixerMean - standardMean);
    }

    const pairs = differences.length;
    const normality = calculateNormalityDiagnostics(differences);
    const pairedT = calculatePairedT(differences);
    const wilcoxon = calculateWilcoxon(differences);
    const primaryTest = decidePrimaryTest(pairs, normality.pValue, pairedT, wilcoxon);

    const primaryPValue =
      primaryTest === "paired-t"
        ? pairedT?.pValue ?? null
        : primaryTest === "wilcoxon"
          ? wilcoxon?.pValue ?? null
          : null;

    return {
      metricId: metric.id,
      metricLabel: metric.label,
      pairs,
      meanStandard: mean(standardMeans) ?? 0,
      meanMixer: mean(mixerMeans) ?? 0,
      meanDifferenceMixerMinusStandard: mean(differences) ?? 0,
      medianDifferenceMixerMinusStandard: median(differences) ?? 0,
      normality,
      pairedT,
      wilcoxon,
      primaryTest,
      primaryPValue,
      holmAdjustedPrimaryPValue: null,
    } as WithinSubjectInferenceMetric;
  });

  const validPrimaryRows = rows
    .map((row, index) => ({ index, pValue: row.primaryPValue }))
    .filter((entry): entry is { index: number; pValue: number } => entry.pValue !== null);

  const adjustedPValues = applyHolmCorrection(validPrimaryRows);

  return rows.map((row, index) => ({
    ...row,
    holmAdjustedPrimaryPValue: adjustedPValues.get(index) ?? null,
  }));
};
