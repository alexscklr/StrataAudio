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
            <h4>Interaction Trends</h4>
            <p>
              Zeigt den durchschnittlichen Lautstärkeverlauf (isMute * masterVolume * trackVolume) über die Videodauer. Hilft zu verstehen, wann welche Spuren tendenziell lauter oder leiser gemischt wurden.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>Teilnehmer-Drilldown</h4>
            <p>
              Detaillierte Liste aller Einzelsessions. Ermöglicht die Einsicht in spezifische Antworten, demografische Profile und individuelle Interaktionsverläufe.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>Fragecode-Legende</h4>
            <p><strong>SUS (Endsurvey):</strong></p>
            <p>sus-1: System einfach zu bedienen</p>
            <p>sus-2: Bedienung schnell lernbar</p>
            <p>sus-3: Sicherheit bei der Nutzung</p>
            <p>sus-4: Funktionen gut integriert</p>
            <p><strong>Video-Survey:</strong></p>
            <p>sync-1: Synchronitaet von Ton und Bild</p>
            <p>sync-2: Stoerungen beim Tonmischen (Ja/Nein)</p>
            <p>experience-1: Interesse durch den Mixer</p>
            <p>experience-2: Bevorzugter Modus (Standard/Mixer)</p>
            <p>pan-1: Hilfreichkeit der PAN-Steuerung</p>
            <p>pan-2: Intuitivitaet der PAN-Slider</p>
            <p><strong>UEQ (Endsurvey):</strong></p>
            <p>ueq-1: Unerfreulich ↔ Erfreulich</p>
            <p>ueq-2: Ueberladen ↔ Uebersichtlich</p>
            <p>ueq-3: Ineffizient ↔ Effizient</p>
            <p>ueq-4: Phantasielos ↔ Kreativ</p>
            <p>ueq-5: Herkoemmlich ↔ Neuartig</p>
            <p><strong>NPS/Feedback (Endsurvey):</strong></p>
            <p>nps-1: Weiterempfehlungsbereitschaft (1-10)</p>
            <p>feedback-1: Offenes Freitext-Feedback</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
