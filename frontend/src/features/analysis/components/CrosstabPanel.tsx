import type { CrosstabData } from "@/features/analysis/types/analysis";
import styles from "./AnalysisDashboard.module.css";

interface CrosstabPanelProps {
  data: CrosstabData[];
}

export function CrosstabPanel({ data }: CrosstabPanelProps) {
  return (
    <section className={styles.panel}>
      <h3>Kreuztabellen (Gruppenvergleich)</h3>
      <p className={styles.muted}>
        Vergleich der SUS- und NPS-Werte zwischen verschiedenen demografischen Gruppen.
      </p>

      <div style={{ display: "grid", gap: "2.2rem", marginTop: "1.5rem" }}>
        {data.map((table) => (
          <div key={table.attribute}>
            <h4 style={{ color: "var(--strata-accent)", marginBottom: "1rem" }}>{table.attribute}</h4>
            <div className={styles.tableResponsive}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)", textAlign: "left" }}>
                    <th style={{ padding: "0.8rem" }}>Gruppe</th>
                    <th style={{ padding: "0.8rem" }}>n</th>
                    <th style={{ padding: "0.8rem" }}>Ø SUS (0-100)</th>
                    <th style={{ padding: "0.8rem" }}>Ø NPS (Rating)</th>
                    <th style={{ padding: "0.8rem" }}>Ø Aktivität (Delta Vol)</th>
                  </tr>
                </thead>
                <tbody>
                  {table.groups.map((group) => (
                    <tr key={group.name} style={{ borderBottom: "1px solid #2a2a2a" }}>
                      <td style={{ padding: "0.8rem", fontWeight: 500 }}>{group.name}</td>
                      <td style={{ padding: "0.8rem" }}>{group.count}</td>
                      <td style={{ padding: "0.8rem" }}>
                        {group.avgSus ? (
                          <span style={{ 
                            color: group.avgSus > 68 ? "var(--audio-wave)" : "inherit",
                            fontWeight: group.avgSus > 68 ? "bold" : "normal"
                          }}>
                            {group.avgSus.toFixed(1)}
                          </span>
                        ) : "—"}
                      </td>
                      <td style={{ padding: "0.8rem" }}>
                        {group.avgNps ? group.avgNps.toFixed(1) : "—"}
                      </td>
                      <td style={{ padding: "0.8rem" }}>
                        {group.avgDeltaVol ? (
                          <span style={{ 
                            color: group.avgDeltaVol > 15 ? "var(--strata-accent)" : "inherit",
                            fontWeight: group.avgDeltaVol > 15 ? 600 : 400
                          }}>
                            {group.avgDeltaVol.toFixed(1)}%
                          </span>
                        ) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
