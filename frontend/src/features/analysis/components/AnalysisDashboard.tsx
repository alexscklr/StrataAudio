import { AnalysisFiltersPanel } from "./AnalysisFiltersPanel";
import { InteractionTimelinePanel } from "./InteractionTimelinePanel";
import KpiGrid from "./KpiGrid";
import { UeqPanel } from "./UeqPanel";
import { CrosstabPanel } from "./CrosstabPanel";
import { LikertBoxPlotPanel } from "./LikertBoxPlotPanel";
import { ParticipantDetailPanel } from "./ParticipantDetailPanel";
import { PreferencePanel } from "./PreferencePanel";
import { useAnalysisDashboard } from "@/features/analysis/hooks/useAnalysisDashboard";
import styles from "./AnalysisDashboard.module.css";

export function AnalysisDashboard() {
  const {
    filters,
    setFilters,
    derived,
    warnings,
    isLoading,
    isError,
    error,
    refetch,
  } = useAnalysisDashboard();

  if (isLoading) {
    return (
      <section className={styles.analysisRoot}>
        <p>Lade Analyse-Daten...</p>
      </section>
    );
  }

  if (isError || !derived) {
    return (
      <section className={styles.analysisRoot}>
        <h2>Analysis Dashboard</h2>
        <p>Fehler beim Laden der Analyse-Daten.</p>
        <p className={styles.muted}>
          {error instanceof Error ? error.message : "Unbekannter Fehler"}
        </p>
        <button type="button" onClick={() => void refetch()}>
          Erneut laden
        </button>
      </section>
    );
  }

  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.filterSidebar}>
        <h3>Filter</h3>
        <AnalysisFiltersPanel filters={filters} setFilters={setFilters} derived={derived} />
      </aside>

      <section className={styles.analysisRoot}>
        <header className={styles.headerRow}>
          <div>
            <h2>Analysis Dashboard</h2>
            <p className={styles.muted}>
              KPI-Übersicht, Filter, BoxPlots, Präferenzen, Telemetrie und Teilnehmer-Drilldown.
            </p>
          </div>
          <button type="button" onClick={() => void refetch()}>
            Refresh
          </button>
        </header>

        {warnings.length > 0 && (
          <section className={styles.warningPanel}>
            <h3>Datenzugriff-Hinweise ({warnings.length})</h3>
            <p className={styles.muted}>
              Einige Tabellen konnten nicht gelesen werden. KPIs koennen dadurch 0 oder leer erscheinen.
            </p>
            <ul>
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </section>
        )}

        <KpiGrid kpis={derived.kpis} />
        
        <UeqPanel items={derived.ueqResults} />

        <CrosstabPanel data={derived.crosstabs} />

        <LikertBoxPlotPanel 
          items={derived.likertBoxPlots} 
          disturbances={derived.audioDisturbances}
        />
        <PreferencePanel
          preference={derived.preferenceBreakdown}
          trackDeviations={derived.trackDeviations}
        />
        <InteractionTimelinePanel points={derived.interactionTimeline} />
        <ParticipantDetailPanel 
          participants={derived.participantDetails} 
          videoLabelMap={derived.videoLabelMap}
        />
      </section>

      <aside className={styles.explanationSidebar}>
        <h3>Erklärungen</h3>

        <div className={styles.explanationSection}>
          <div className={styles.explanationItem}>
            <h4>KPIs (Kennzahlen)</h4>
            <p>
              <strong>Completion Rate:</strong> Anteil der Teilnehmer, die die gesamte Studie (inkl. End-Fragebogen) abgeschlossen haben.
            </p>
            <p>
              <strong>SUS Score:</strong> System Usability Scale (0-100). Maß für die subjektiv empfundene Benutzerfreundlichkeit. Werte &gt; 68 gelten als gut.
            </p>
            <p>
              <strong>NPS Score:</strong> Net Promoter Score (-100 bis +100). Maß für die Weiterempfehlungsbereitschaft (Promotoren vs. Detraktoren).
            </p>
            <p>
              <strong>UEQ Gesamt:</strong> Globaler Index der User Experience Questionnaire Kurzversion. Fokus auf pragmatische und hedonische Qualität.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>UEQ-S Auswertung</h4>
            <p>
              Wertebereich von -3 (sehr schlecht) bis +3 (sehr gut).
            </p>
            <p>
              <strong>Pragmatische Qualität:</strong> Beschreibt Aufgabenbezogenheit (Durchschaubarkeit, Effizienz).
            </p>
            <p>
              <strong>Hedonische Qualität:</strong> Beschreibt Nicht-Aufgabenbezogenes (Stimulation, Originalität).
            </p>
            <p>
              Werte über 0,8 deuten auf eine positive Wahrnehmung hin.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>Kreuztabellen (Crosstabs)</h4>
            <p>
              <strong>Ø Aktivität (Delta Vol):</strong> Mathematischer Beleg für die Nutzung. Zeigt, wie weit Regler im Schnitt bewegt wurden. Hohe Aktivität bei Mixer-Präferenz belegt den Nutzen.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>Likert Boxplots</h4>
            <p>
              Visualisieren die Verteilung der 7er-Likert-Fragen. Die farbige Box umfasst die mittleren 50% der Antworten (Interquartilsabstand). Die weiße Linie markiert den Median.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>Nutzungspräferenz & Trends</h4>
            <p>
              <strong>Lautstärke-Tendenz:</strong> Visualisiert die Abweichung vom Video-Standard. Ein Balken unter der Null-Linie (blau) bedeutet, die Spur war tendenziell zu laut abgemischt.
            </p>
            <p>
              <strong>Stereo & Streuung:</strong> Weißer Punkt = Mittelwert. Die schattierte Fläche zeigt die <em>Ø absolute Abweichung</em>. Je breiter, desto aktiver wurde im Raum verteilt.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>Average Mix</h4>
            <p>
              Gibt die durchschnittliche Abweichung der Audio-Einstellungen vom Standard (Vol: 100%, Pan: 0) zum Zeitpunkt des Beendens an.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>Interaction Timeline</h4>
            <p>
              Zeigt die kumulierten Interaktionen (Mute, Volume, Pan) über die Videodauer. Hilft zu verstehen, wann und wie intensiv Teilnehmer den Mixer genutzt haben.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>Teilnehmer-Drilldown</h4>
            <p>
              Detaillierte Liste aller Einzelsessions. Ermöglicht die Einsicht in spezifische Antworten, demografische Profile und individuelle Interaktionsverläufe.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
