import { describe, expect, it } from "vitest";
import type { SurveyResponseRow } from "@/features/analysis/types/analysis";
import { buildWithinSubjectInference } from "@/features/analysis/lib/analysisMetricsInference";

const buildResponse = (
  participantId: string,
  mode: "standard" | "mixer",
  values: Record<string, number>,
  createdAt: string,
): SurveyResponseRow => ({
  participant_id: participantId,
  video_id: "video-a",
  first_watch_mode: mode,
  responses: {
    answers: values,
  },
  created_at: createdAt,
});

describe("buildWithinSubjectInference", () => {
  it("computes paired inference and Holm-corrected p-values for multiple metrics", () => {
    const responses: SurveyResponseRow[] = [];
    const offsets = [0.3, 0.5, 0.8, 0.6, 1.1, 0.9, 0.4, 0.7, 1.0, 0.55];

    offsets.forEach((offset, index) => {
      const participantId = `p-${index + 1}`;
      const standardValues = {
        "sync-1": 4,
        "experience-1": 4,
        "pan-1": 3,
        "pan-2": 3,
      };
      const mixerValues = {
        "sync-1": 4 + offset,
        "experience-1": 4 + offset * 0.9,
        "pan-1": 3 + offset * 0.7,
        "pan-2": 3 + offset * 0.6,
      };

      responses.push(
        buildResponse(participantId, "standard", standardValues, `2026-01-01T00:00:${String(index).padStart(2, "0")}Z`),
      );
      responses.push(
        buildResponse(participantId, "mixer", mixerValues, `2026-01-01T00:10:${String(index).padStart(2, "0")}Z`),
      );
    });

    const results = buildWithinSubjectInference(responses);

    expect(results).toHaveLength(4);

    for (const metric of results) {
      expect(metric.pairs).toBe(10);
      expect(metric.meanDifferenceMixerMinusStandard).toBeGreaterThan(0);
      expect(metric.pairedT).not.toBeNull();
      expect(metric.wilcoxon).not.toBeNull();
      expect(metric.primaryPValue).not.toBeNull();
      expect(metric.holmAdjustedPrimaryPValue).not.toBeNull();
      expect(metric.holmAdjustedPrimaryPValue ?? 0).toBeGreaterThanOrEqual(metric.primaryPValue ?? 0);
      expect(metric.holmAdjustedPrimaryPValue ?? 0).toBeLessThanOrEqual(1);
    }
  });

  it("uses Wilcoxon as primary test for small paired samples", () => {
    const responses: SurveyResponseRow[] = [];

    [0.6, 0.4, 0.8, 0.7].forEach((offset, index) => {
      const participantId = `p-small-${index + 1}`;
      responses.push(
        buildResponse(
          participantId,
          "standard",
          {
            "sync-1": 4,
          },
          `2026-01-01T00:00:${String(index).padStart(2, "0")}Z`,
        ),
      );
      responses.push(
        buildResponse(
          participantId,
          "mixer",
          {
            "sync-1": 4 + offset,
          },
          `2026-01-01T00:10:${String(index).padStart(2, "0")}Z`,
        ),
      );
    });

    const syncResult = buildWithinSubjectInference(responses).find((item) => item.metricId === "sync-1");

    expect(syncResult).toBeDefined();
    expect(syncResult?.pairs).toBe(4);
    expect(syncResult?.primaryTest).toBe("wilcoxon");
    expect(syncResult?.primaryPValue).toBe(syncResult?.wilcoxon?.pValue ?? null);
  });
});
