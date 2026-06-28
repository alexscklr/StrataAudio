import { AnalysisFiltersPanel } from "./AnalysisFiltersPanel";
import KpiGrid from "./KpiGrid";
import { InteractionDensityPanel } from "./InteractionDensityPanel";
import { UeqPanel } from "./UeqPanel";
import { CrosstabPanel } from "./CrosstabPanel";
import { LikertBoxPlotPanel } from "./LikertBoxPlotPanel";
import { ParticipantDetailPanel } from "./ParticipantDetailPanel";
import { PreferencePanel } from "./PreferencePanel";
import { InferencePanel } from "./InferencePanel";
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
              Einige Tabellen konnten nicht gelesen werden. KPIs können dadurch 0 oder leer erscheinen.
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

        <InferencePanel items={derived.withinSubjectInference} />

        <LikertBoxPlotPanel
          items={derived.likertBoxPlots}
          disturbances={derived.audioDisturbances}
        />
        <PreferencePanel
          preference={derived.preferenceBreakdown}
          trackDeviations={derived.trackDeviations}
        />
        <InteractionDensityPanel points={derived.interactionDensity} />
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
              <strong>Interpretation Completion Rate:</strong> Je höher, desto belastbarer sind die Ergebnisse. Sehr niedrige Werte deuten oft auf Abbrüche, Unklarheiten im Flow oder technische Probleme hin.
            </p>
            <p>
              <strong>4-Item Usability Index (0-100):</strong> Interner Vergleichswert auf Basis von 4 positiv formulierten Usability-Items. Höher bedeutet bessere wahrgenommene Bedienbarkeit. Das ist kein klassischer SUS mit invertierten Items, sondern ein Mittelwert der normierten Zustimmung.
            </p>
            <p>
              <strong>Deutung:</strong> Unter 50 = eher schwach, 50-65 = mittel, 65-80 = gut, über 80 = sehr gut. Wichtiger als ein fixer Grenzwert ist die Entwicklung über mehrere Messungen.
            </p>
            <p>
              <strong>NPS Score (-100 bis +100):</strong> Standard-NPS auf Basis der Endsurvey-Antworten. Antworten auf der 1-10-Skala werden für die Berechnung auf 0-10 normiert; Promoter sind 9-10, Passive 7-8, Detraktoren 0-6. Der Score ist Promoter-% minus Detraktor-%.
            </p>
            <p>
              <strong>UEQ Gesamt (-3 bis +3):</strong> Unter 0 = eher negative Experience, 0 bis 0,8 = neutral bis leicht positiv, über 0,8 = deutlich positiv.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>UEQ-S Auswertung</h4>
            <p>
              Wertebereich von -3 (sehr schlecht) bis +3 (sehr gut).
            </p>
            <p>
              <strong>Pragmatische Qualität:</strong> Wie gut Nutzer Aufgaben erledigen können. Hohe Werte bedeuten: klar, effizient, gut steuerbar.
            </p>
            <p>
              <strong>Hedonische Qualität:</strong> Wie ansprechend und neuartig sich das Erlebnis anfühlt. Hohe Werte bedeuten: motivierend und interessant.
            </p>
            <p>
              Faustregel: Unter 0 kritisch, ab 0 positiv, ab 0,8 klar positiv.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>Kreuztabellen (Crosstabs)</h4>
            <p>
              <strong>Ø Aktivität (Delta Vol):</strong> Zeigt, wie stark Lautstärken vom Standard abweichen. Höhere Werte bedeuten mehr aktives Mischen, sehr niedrige Werte eher passives Zuschauen.
            </p>
            <p>
              Für den Vergleich gilt: Unterschiede zwischen Gruppen sind wichtiger als der absolute Einzelwert.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>Inferenzstatistik (datenpassend)</h4>
            <p>
              Die Auswertung folgt der tatsaechlichen Datenerhebung: Likert-Items werden gegen den Neutralpunkt 4 getestet,
              die Moduspraeferenz (experience-2) und Stoerungsangaben (sync-2) per exaktem Binomialtest gegen 50%.
            </p>
            <p>
              <strong>Likert-Items:</strong> Primärtest ist Ein-Stichproben t-Test gegen 4 (bei ausreichender Naeherung) oder Wilcoxon Signed-Rank gegen 4.
              Die Delta-Werte in der Karte zeigen die Richtung: positiv = oberhalb Neutralpunkt, negativ = unterhalb Neutralpunkt.
            </p>
            <p>
              <strong>Praeferenz/Stoerungen:</strong> Der Binomialtest prueft, ob der beobachtete Anteil signifikant von 50% abweicht.
              Zusaetzlich zeigt die Karte ein 95%-Konfidenzintervall fuer den Anteil.
            </p>
            <p>
              <strong>Signifikanz:</strong> Entscheidend ist der Holm-korrigierte p-Wert.
              p &lt; 0.05 = statistisch abgesicherter Hinweis, p ≥ 0.05 = kein abgesicherter Unterschied.
              Der p-Wert allein belegt aber keine praktische Relevanz; deshalb zeigen die Karten zusätzlich Effektstärken.
            </p>
            <p>
              <strong>Effektstärken:</strong> Bei Likert-Items wird je nach Primärtest Cohen&apos;s dz oder rang-biseriales r ausgewiesen,
              bei Anteilen Cohen&apos;s h. Als grobe Orientierung gelten etwa 0.2 = klein, 0.5 = mittel, 0.8 = gross.
            </p>
            <p>
              <strong>Bewertung in den Karten:</strong> Jede Karte enthaelt eine automatische Deutung,
              die Signifikanz und praktische Richtung (z. B. oberhalb/unterhalb Neutralpunkt, Abweichung von 50/50) zusammenfasst.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>Methodik & Grenzen</h4>
            <p>
              Die Kreuztabellen zeigen neben der Gruppengröße auch die effektiven Nenner je Kennzahl, weil SUS, NPS und Aktivität nicht immer auf denselben Fällen beruhen.
            </p>
            <p>
              Die Inferenz basiert auf Post-Exposure-Urteilen nach Ansicht beider Modi. Dadurch sind die Tests robust fuer die aktuellen Daten,
              aber kein klassischer kausaler Within-Subject-Modusvergleich mit getrennten Outcome-Werten pro Modus.
            </p>
            <p>
              Einige Kennzahlen werden gerundet dargestellt, damit das Dashboard lesbar bleibt. Für exakte Reproduktionen sind die zugrunde liegenden Rohwerte und die Berechnungslogik maßgeblich.
            </p>
            <p>
              Bias-Flags werden im Teilnehmer-Drilldown manuell gepflegt. Das Ausschlusskriterium ist aktuell ein boolean-Flag; die inhaltlichen Setzregeln sollten separat dokumentiert werden.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>Likert Boxplots</h4>
            <p>
              Visualisieren die Verteilung der 7er-Likert-Fragen. Die farbige Box umfasst die mittleren 50% der Antworten (Interquartilsabstand). Die weiße Linie markiert den Median.
            </p>
            <p>
              Interpretation: Median nahe 6-7 = starke Zustimmung, nahe 1-2 = klare Ablehnung. Breite Box = uneinheitliche Meinungen, schmale Box = hohe Einigkeit.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>Nutzungspräferenz & Trends</h4>
            <p>
              <strong>Lautstärke-Unterschiede zwischen Spuren:</strong> Gezeigt wird der Median-Unterschied zwischen zwei Spuren (z. B. Musik vs. Stimme).
            </p>
            <p>
              Positive Werte bedeuten: erste Spur lauter als zweite. Negative Werte bedeuten: erste Spur leiser als zweite.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>Average Mix</h4>
            <p>
              Zeigt die durchschnittliche End-Einstellung gegenüber dem Standard (Vol: 100%, Pan: 0). Negative Volumenwerte bedeuten leiser als Standard, positive lauter.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>Interaktions-Dichte</h4>
            <p>
              Zeigt die kumulierte Anzahl aller Interaktionen pro Zeitfenster (standardmaessig 5 Sekunden). Hohe Balken markieren Aufmerksamkeits-Hotspots im Video.
            </p>
            <p>
              Bei Videos ueber 120 Sekunden mit erstem Modus Standard wird die zweite Videohaelfte (nach Midpoint-Switch auf Mixer) auf t=0 normalisiert; Interaktionen aus der ersten Haelfte werden fuer diese Kurve nicht beruecksichtigt.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>Teilnehmer-Drilldown</h4>
            <p>
              Detailansicht einzelner Sessions. Geeignet, um Ausreißer zu prüfen und zu verstehen, warum Gruppenwerte hoch oder niedrig ausfallen.
            </p>
          </div>

          <div className={styles.explanationItem}>
            <h4>Fragecode-Legende</h4>
            <p>
              Hinweis zur Deutung: Bei 1-7 Skalen steht 1 meist für negativ/gering und 7 für positiv/hoch.
            </p>
            <p><strong>SUS (Endsurvey):</strong></p>
            <p>sus-1: System einfach zu bedienen</p>
            <p>sus-2: Bedienung schnell lernbar</p>
            <p>sus-3: Sicherheit bei der Nutzung</p>
            <p>sus-4: Funktionen gut integriert</p>
            <p><strong>Video-Survey:</strong></p>
            <p>sync-1: Synchronität von Ton und Bild</p>
            <p>sync-2: Störungen beim Tonmischen (Ja/Nein)</p>
            <p>experience-1: Interesse durch den Mixer</p>
            <p>experience-2: Bevorzugter Modus (Standard/Mixer)</p>
            <p>pan-1: Hilfreichkeit der PAN-Steuerung</p>
            <p>pan-2: Intuitivität der PAN-Slider</p>
            <p><strong>UEQ (Endsurvey):</strong></p>
            <p>ueq-1: Unerfreulich ↔ Erfreulich</p>
            <p>ueq-2: Überladen ↔ Übersichtlich</p>
            <p>ueq-3: Ineffizient ↔ Effizient</p>
            <p>ueq-4: Phantasielos ↔ Kreativ</p>
            <p>ueq-5: Herkömmlich ↔ Neuartig</p>
            <p><strong>NPS/Feedback (Endsurvey):</strong></p>
            <p>nps-1: Weiterempfehlungsbereitschaft (1-10, für NPS auf 0-10 normiert)</p>
            <p>feedback-1: Offenes Freitext-Feedback</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
