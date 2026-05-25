import { AnalysisDashboard } from "@/features/analysis/components/AnalysisDashboard";
import { PageMeta } from "@/shared/components/Seo/PageMeta";
import styles from "./styles/AnalysisPage.module.css";

function AnalysisPage() {
  return (
    <section className={styles.analysisPage}>
      <PageMeta
        title="Analysis Dashboard"
        description="Aggregierte Analyse von Survey- und Interaction-Daten"
      />
      <AnalysisDashboard />
    </section>
  );
}

export default AnalysisPage;