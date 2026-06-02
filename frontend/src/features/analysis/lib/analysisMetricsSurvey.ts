import type {
  EndSurveyResponseRow,
  LikertBoxPlotItem,
  PreferenceBreakdown,
  SurveyResponseRow,
  UeqResult,
} from "@/features/analysis/types/analysis";
import {
  extractAnswers,
  getNumericAnswer,
  getStringAnswer,
  mean,
  toBoxPlotStats,
} from "@/features/analysis/lib/analysisMetricsShared";

export const buildLikertItems = (surveyResponses: SurveyResponseRow[]): LikertBoxPlotItem[] => {
  const keys: Array<{ id: string; label: string }> = [
    { id: "sync-1", label: "Sync-Passung (1-7)" },
    { id: "experience-1", label: "Interesse durch Mixer (1-7)" },
    { id: "pan-1", label: "Nützlichkeit PAN (1-7)" },
    { id: "pan-2", label: "Intuitivität PAN (1-7)" },
  ];

  return keys.map((key) => {
    const values = surveyResponses
      .map((response) => getNumericAnswer(extractAnswers(response.responses)[key.id]))
      .filter((value): value is number => value !== null);

    return {
      id: key.id,
      label: key.label,
      values,
      stats: toBoxPlotStats(values),
    };
  });
};

export const buildPreferenceBreakdown = (
  surveyResponses: SurveyResponseRow[],
): PreferenceBreakdown => {
  let mixerCount = 0;
  let standardCount = 0;

  for (const response of surveyResponses) {
    const answer = getStringAnswer(extractAnswers(response.responses)["experience-2"]);
    if (!answer) {
      continue;
    }

    const normalized = answer.trim().toLowerCase();
    if (normalized === "mixer") {
      mixerCount += 1;
    }
    if (normalized === "standard") {
      standardCount += 1;
    }
  }

  return { mixerCount, standardCount };
};

export const buildAudioDisturbances = (surveyResponses: SurveyResponseRow[]) => {
  let yes = 0;
  let no = 0;

  for (const response of surveyResponses) {
    const answers = extractAnswers(response.responses);
    const sync2 = answers["sync-2"] || answers["sync2"];
    if (sync2 === "Ja" || sync2 === true) {
      yes += 1;
    } else if (sync2 === "Nein" || sync2 === false) {
      no += 1;
    }
  }

  return { yes, no };
};

export const buildUeqResults = (endResponses: EndSurveyResponseRow[]): UeqResult[] => {
  const dimensions = [
    { label: "Attraktivität", keys: ["ueq-1"] },
    { label: "Durchschaubarkeit", keys: ["ueq-2"] },
    { label: "Effizienz", keys: ["ueq-3"] },
    { label: "Stimulation", keys: ["ueq-4"] },
    { label: "Originalität", keys: ["ueq-5"] },
  ];

  if (endResponses.length === 0) {
    return [
      ...dimensions.map((dimension) => ({ dimension: dimension.label, score: 0 })),
      { dimension: "Pragmatische Qualität", score: 0 },
      { dimension: "Hedonische Qualität", score: 0 },
      { dimension: "Gesamtqualität", score: 0 },
    ];
  }

  const dimResults = dimensions.map((dimension) => {
    const scores: number[] = [];

    for (const response of endResponses) {
      const answers = extractAnswers(response.responses);
      for (const key of dimension.keys) {
        const value = getNumericAnswer(answers[key]);
        if (value !== null) {
          scores.push(value - 4);
        }
      }
    }

    return {
      dimension: dimension.label,
      score: mean(scores) ?? 0,
    };
  });

  const pragmaticScore = (dimResults[1].score + dimResults[2].score) / 2;
  const hedonicScore = (dimResults[3].score + dimResults[4].score) / 2;
  const overallScore = dimResults.reduce((acc, current) => acc + current.score, 0) / 5;

  return [
    ...dimResults,
    { dimension: "Pragmatische Qualität", score: pragmaticScore },
    { dimension: "Hedonische Qualität", score: hedonicScore },
    { dimension: "Gesamtqualität", score: overallScore },
  ];
};
