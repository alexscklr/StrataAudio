import { describe, expect, it } from "vitest";
import type { SurveyResponseRow } from "@/features/analysis/types/analysis";
import { buildWithinSubjectInference } from "@/features/analysis/lib/analysisMetricsInference";

const buildResponse = (
  participantId: string,
  mode: "standard" | "mixer",
  values: Record<string, number | string>,
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
  it("builds likert midpoint tests plus preference and disturbance binomial tests", () => {
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
        "experience-2": index % 2 === 0 ? "Mixer" : "Standard",
        "sync-2": index % 3 === 0 ? "Ja" : "Nein",
      };

      responses.push(
        buildResponse(participantId, "standard", standardValues, `2026-01-01T00:00:${String(index).padStart(2, "0")}Z`),
      );
      responses.push(
        buildResponse(participantId, "mixer", mixerValues, `2026-01-01T00:10:${String(index).padStart(2, "0")}Z`),
      );
    });

    const results = buildWithinSubjectInference(responses);

    expect(results).toHaveLength(6);

    const likertRows = results.filter((row) => row.testKind === "likert-midpoint");
    expect(likertRows).toHaveLength(4);

    for (const metric of likertRows) {
      expect(metric.sampleSize).toBe(10);
      expect(metric.summaryRows.some((row) => row.label === "Delta zu 4 (Mean)")).toBe(true);
      expect(metric.primaryPValue).not.toBeNull();
      expect(metric.holmAdjustedPrimaryPValue).not.toBeNull();
      expect(metric.holmAdjustedPrimaryPValue ?? 0).toBeGreaterThanOrEqual(metric.primaryPValue ?? 0);
      expect(metric.holmAdjustedPrimaryPValue ?? 0).toBeLessThanOrEqual(1);
    }

    const preference = results.find((row) => row.metricId === "experience-2");
    expect(preference).toBeDefined();
    expect(preference?.testKind).toBe("binomial-preference");
    expect(preference?.sampleSize).toBe(10);
    expect(preference?.primaryPValue).not.toBeNull();

    const disturbance = results.find((row) => row.metricId === "sync-2");
    expect(disturbance).toBeDefined();
    expect(disturbance?.testKind).toBe("binomial-proportion");
    expect(disturbance?.sampleSize).toBe(10);
    expect(disturbance?.primaryPValue).not.toBeNull();
  });

  it("uses non-parametric primary label for small samples", () => {
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
    expect(syncResult?.sampleSize).toBe(4);
    expect(syncResult?.primaryTestLabel).toContain("Wilcoxon");
    expect(syncResult?.primaryPValue).not.toBeNull();
  });

  it("aggregates participant means independent of first_watch_mode", () => {
    const responses: SurveyResponseRow[] = [
      buildResponse("p-paired", "standard", { "sync-1": 4 }, "2026-01-01T00:00:00Z"),
      buildResponse("p-paired", "mixer", { "sync-1": 5 }, "2026-01-01T00:01:00Z"),
      buildResponse("p-only-standard", "standard", { "sync-1": 2 }, "2026-01-01T00:02:00Z"),
      buildResponse("p-only-mixer", "mixer", { "sync-1": 7 }, "2026-01-01T00:03:00Z"),
    ];

    const result = buildWithinSubjectInference(responses).find((item) => item.metricId === "sync-1");

    expect(result).toBeDefined();
    expect(result?.sampleSize).toBe(3);
    const meanRow = result?.summaryRows.find((row) => row.label === "Mittelwert");
    expect(meanRow?.value).toBe(4.5);
  });

  it("parses preference and disturbance answers case-insensitively", () => {
    const responses: SurveyResponseRow[] = [
      {
        participant_id: "p-1",
        video_id: "video-a",
        first_watch_mode: "standard",
        responses: { answers: { "experience-2": "mixer", "sync-2": "yes" } },
        created_at: "2026-01-01T00:00:00Z",
      },
      {
        participant_id: "p-2",
        video_id: "video-a",
        first_watch_mode: "mixer",
        responses: { answers: { "experience-2": "Standard", "sync-2": "Nein" } },
        created_at: "2026-01-01T00:01:00Z",
      },
    ];

    const results = buildWithinSubjectInference(responses);
    const preference = results.find((row) => row.metricId === "experience-2");
    const disturbance = results.find((row) => row.metricId === "sync-2");

    expect(preference?.sampleSize).toBe(2);
    expect(disturbance?.sampleSize).toBe(2);
  });
});
