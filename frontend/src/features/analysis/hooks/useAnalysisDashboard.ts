import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAnalysisRawData } from "@/features/analysis/lib/analysisQueries";
import {
  buildAnalysisDerivedData,
  getDefaultAnalysisFilters,
} from "@/features/analysis/lib/analysisMetrics";

export const useAnalysisDashboard = () => {
  const [filters, setFilters] = useState(getDefaultAnalysisFilters());

  const rawDataQuery = useQuery({
    queryKey: ["analysis-dashboard-raw-data"],
    queryFn: fetchAnalysisRawData,
  });

  const derived = useMemo(() => {
    const raw = rawDataQuery.data;
    if (!raw) {
      return null;
    }
    return buildAnalysisDerivedData(raw, filters);
  }, [rawDataQuery.data, filters]);

  return {
    filters,
    setFilters,
    derived,
    warnings: rawDataQuery.data?.warnings ?? [],
    isLoading: rawDataQuery.isLoading,
    isError: rawDataQuery.isError,
    error: rawDataQuery.error,
    refetch: rawDataQuery.refetch,
  };
};
