import type {
  SurveyResponseRow,
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

type InferencePrimaryTest = "paired-t" | "wilcoxon" | "insufficient-data";

interface PairedTTestResult {
  tStatistic: number;
  degreesOfFreedom: number;
  pValue: number;
  meanDifference: number;
  ci95Lower: number;
  ci95Upper: number;
  cohenDz: number;
}

interface WilcoxonSignedRankResult {
  wPlus: number;
  wMinus: number;
  zStatistic: number;
  pValue: number;
  rankBiserialCorrelation: number;
}

interface NormalityDiagnostic {
  pValue: number | null;
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

const calculateNormalityDiagnostics = (differences: number[]): NormalityDiagnostic => {
  if (differences.length < 3) {
    return {
      pValue: null,
    };
  }

  const avg = mean(differences);
  if (avg === null) {
    return {
      pValue: null,
    };
  }

  const n = differences.length;
  const centered = differences.map((value) => value - avg);
  const m2 = centered.reduce((acc, value) => acc + value ** 2, 0) / n;

  if (m2 <= 0) {
    return {
      pValue: 1,
    };
  }

  const m3 = centered.reduce((acc, value) => acc + value ** 3, 0) / n;
  const m4 = centered.reduce((acc, value) => acc + value ** 4, 0) / n;

  const skewness = m3 / m2 ** 1.5;
  const excessKurtosis = m4 / (m2 * m2) - 3;
  const jarqueBera = (n / 6) * (skewness * skewness + (excessKurtosis * excessKurtosis) / 4);
  const pValue = Math.exp(-jarqueBera / 2);

  return {
    pValue,
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

const logCombination = (n: number, k: number): number =>
  logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);

const exactBinomialTwoSidedPValue = (successes: number, trials: number): number | null => {
  if (trials <= 0 || successes < 0 || successes > trials) {
    return null;
  }

  const logPObserved = logCombination(trials, successes) - trials * Math.log(2);
  let sum = 0;

  for (let k = 0; k <= trials; k += 1) {
    const logPk = logCombination(trials, k) - trials * Math.log(2);
    if (logPk <= logPObserved + 1e-12) {
      sum += Math.exp(logPk);
    }
  }

  return clamp01(sum);
};

const wilsonInterval95 = (successes: number, trials: number): { lower: number; upper: number } | null => {
  if (trials <= 0) {
    return null;
  }

  const z = 1.959963984540054;
  const pHat = successes / trials;
  const denominator = 1 + (z * z) / trials;
  const center = pHat + (z * z) / (2 * trials);
  const margin = z * Math.sqrt((pHat * (1 - pHat)) / trials + (z * z) / (4 * trials * trials));

  return {
    lower: clamp01((center - margin) / denominator),
    upper: clamp01((center + margin) / denominator),
  };
};

const calculateCohensH = (proportion: number, referenceProportion = 0.5): number | null => {
  if (
    !Number.isFinite(proportion) ||
    !Number.isFinite(referenceProportion) ||
    proportion < 0 ||
    proportion > 1 ||
    referenceProportion < 0 ||
    referenceProportion > 1
  ) {
    return null;
  }

  return 2 * Math.asin(Math.sqrt(proportion)) - 2 * Math.asin(Math.sqrt(referenceProportion));
};

const parsePreference = (value: unknown): "standard" | "mixer" | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "standard") {
    return "standard";
  }
  if (normalized === "mixer") {
    return "mixer";
  }
  return null;
};

const parseSyncDisturbance = (value: unknown): "ja" | "nein" | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "ja" || normalized === "yes") {
    return "ja";
  }
  if (normalized === "nein" || normalized === "no") {
    return "nein";
  }
  return null;
};

export const buildWithinSubjectInference = (
  surveyResponses: SurveyResponseRow[],
): WithinSubjectInferenceMetric[] => {
  const likertMidpoint = 4;

  const likertRows = METRICS.map((metric) => {
    const participantsSeen = new Set<string>();
    const byParticipant = new Map<string, number[]>();

    for (const response of surveyResponses) {
      participantsSeen.add(response.participant_id);

      const value = getNumericAnswer(extractAnswers(response.responses)[metric.id]);
      if (value === null) {
        continue;
      }

      const current = byParticipant.get(response.participant_id) ?? [];
      current.push(value);
      byParticipant.set(response.participant_id, current);
    }

    const mixerMeans: number[] = [];
    const differences: number[] = [];

    for (const participantId of participantsSeen) {
      const participantValues = byParticipant.get(participantId);
      if (!participantValues || participantValues.length === 0) {
        continue;
      }

      const participantMean = mean(participantValues);
      if (participantMean === null) {
        continue;
      }

      mixerMeans.push(participantMean);
      differences.push(participantMean - likertMidpoint);
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

    const primaryTestLabel =
      primaryTest === "paired-t"
        ? "Ein-Stichproben t-Test gegen 4"
        : primaryTest === "wilcoxon"
          ? "Wilcoxon Signed-Rank gegen 4"
          : "Unzureichende Daten";

    return {
      metricId: metric.id,
      metricLabel: metric.label,
      testKind: "likert-midpoint" as const,
      sampleSize: pairs,
      primaryTestLabel,
      summaryRows: [
        { label: "Mittelwert", value: mean(mixerMeans) },
        { label: "Median", value: median(mixerMeans) },
        { label: "Delta zu 4 (Mean)", value: mean(differences) },
        { label: "Delta zu 4 (Median)", value: median(differences) },
        {
          label:
            primaryTest === "paired-t"
              ? "Effektstärke (Cohen's dz)"
              : primaryTest === "wilcoxon"
                ? "Effektstärke (Rang-biseriales r)"
                : "Effektstärke",
          value:
            primaryTest === "paired-t"
              ? pairedT?.cohenDz ?? null
              : primaryTest === "wilcoxon"
                ? wilcoxon?.rankBiserialCorrelation ?? null
                : null,
        },
      ],
      primaryPValue,
      holmAdjustedPrimaryPValue: null,
    } as WithinSubjectInferenceMetric;
  });

  let preferenceMixer = 0;
  let preferenceStandard = 0;
  for (const response of surveyResponses) {
    const answers = extractAnswers(response.responses);
    const preference = parsePreference(answers["experience-2"]);
    if (preference === "mixer") {
      preferenceMixer += 1;
    }
    if (preference === "standard") {
      preferenceStandard += 1;
    }
  }

  const preferenceN = preferenceMixer + preferenceStandard;
  const preferenceP = exactBinomialTwoSidedPValue(preferenceMixer, preferenceN);
  const preferenceCi = wilsonInterval95(preferenceMixer, preferenceN);
  const preferenceShare = preferenceN > 0 ? preferenceMixer / preferenceN : null;
  const preferenceEffectSize =
    preferenceShare === null ? null : calculateCohensH(preferenceShare, 0.5);

  const preferenceRow: WithinSubjectInferenceMetric = {
    metricId: "experience-2",
    metricLabel: "Moduspräferenz (Standard vs Mixer)",
    testKind: "binomial-preference",
    sampleSize: preferenceN,
    primaryTestLabel: "Exakter Binomialtest (zweiseitig, p0 = 0.5)",
    summaryRows: [
      { label: "Mixer", value: preferenceMixer },
      { label: "Standard", value: preferenceStandard },
      { label: "Mixer-Anteil", value: preferenceShare },
      { label: "95%-KI Mixer-Anteil unten", value: preferenceCi?.lower ?? null },
      { label: "95%-KI Mixer-Anteil oben", value: preferenceCi?.upper ?? null },
      { label: "Effektstärke (Cohen's h)", value: preferenceEffectSize },
    ],
    primaryPValue: preferenceP,
    holmAdjustedPrimaryPValue: null,
  };

  let disturbanceYes = 0;
  let disturbanceNo = 0;
  for (const response of surveyResponses) {
    const answers = extractAnswers(response.responses);
    const disturbance = parseSyncDisturbance(answers["sync-2"]);
    if (disturbance === "ja") {
      disturbanceYes += 1;
    }
    if (disturbance === "nein") {
      disturbanceNo += 1;
    }
  }

  const disturbanceN = disturbanceYes + disturbanceNo;
  const disturbanceP = exactBinomialTwoSidedPValue(disturbanceYes, disturbanceN);
  const disturbanceCi = wilsonInterval95(disturbanceYes, disturbanceN);
  const disturbanceShare = disturbanceN > 0 ? disturbanceYes / disturbanceN : null;
  const disturbanceEffectSize =
    disturbanceShare === null ? null : calculateCohensH(disturbanceShare, 0.5);

  const disturbanceRow: WithinSubjectInferenceMetric = {
    metricId: "sync-2",
    metricLabel: "Technische Störungen (Ja/Nein)",
    testKind: "binomial-proportion",
    sampleSize: disturbanceN,
    primaryTestLabel: "Exakter Binomialtest (zweiseitig, p0 = 0.5)",
    summaryRows: [
      { label: "Ja", value: disturbanceYes },
      { label: "Nein", value: disturbanceNo },
      { label: "Störungsanteil", value: disturbanceShare },
      { label: "95%-KI Anteil unten", value: disturbanceCi?.lower ?? null },
      { label: "95%-KI Anteil oben", value: disturbanceCi?.upper ?? null },
      { label: "Effektstärke (Cohen's h)", value: disturbanceEffectSize },
    ],
    primaryPValue: disturbanceP,
    holmAdjustedPrimaryPValue: null,
  };

  const rows = [...likertRows, preferenceRow, disturbanceRow];

  const validPrimaryRows = rows
    .map((row, index) => ({ index, pValue: row.primaryPValue }))
    .filter((entry): entry is { index: number; pValue: number } => entry.pValue !== null);

  const adjustedPValues = applyHolmCorrection(validPrimaryRows);

  return rows.map((row, index) => ({
    ...row,
    holmAdjustedPrimaryPValue: adjustedPValues.get(index) ?? null,
  }));
};
