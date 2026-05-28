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
        Vergleich der wichtigsten Metriken zwischen verschiedenen demografischen Gruppen.
      </p>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
        gap: "1.5rem", 
        marginTop: "1.5rem" 
      }}>
        {data.map((table) => (
          <div key={table.attribute} className={styles.detailCard} style={{ padding: "1.2rem" }}>
            <h4 style={{ 
              color: "var(--strata-accent)", 
              marginBottom: "1.2rem",
              fontSize: "1rem",
              borderBottom: "1px solid #333",
              paddingBottom: "0.5rem"
            }}>
              {table.attribute}
            </h4>
            
            <div style={{ display: "grid", gap: "1rem" }}>
              {table.groups.map((group) => (
                <div key={group.name} style={{ 
                  background: "rgba(255,255,255,0.02)", 
                  padding: "0.8rem", 
                  borderRadius: "8px",
                  border: "1px solid rgba(255,255,255,0.05)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{group.name}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>n = {group.count}</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                    <div style={{ textAlign: "center", padding: "0.4rem", background: "rgba(0,0,0,0.2)", borderRadius: "4px" }}>
                      <p style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.2rem" }}>SUS</p>
                      <span style={{ 
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        color: (group.avgSus ?? 0) > 68 ? "var(--audio-wave)" : "inherit"
                      }}>
                        {group.avgSus ? group.avgSus.toFixed(1) : "—"}
                      </span>
                    </div>
                    
                    <div style={{ textAlign: "center", padding: "0.4rem", background: "rgba(0,0,0,0.2)", borderRadius: "4px" }}>
                      <p style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.2rem" }}>NPS (Ø)</p>
                      <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                        {group.avgNps ? group.avgNps.toFixed(1) : "—"}
                      </span>
                    </div>

                    <div style={{ textAlign: "center", padding: "0.4rem", background: "rgba(0,0,0,0.2)", borderRadius: "4px" }}>
                      <p style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.2rem" }}>Aktivität</p>
                      <span style={{ 
                        fontSize: "0.9rem", 
                        fontWeight: "bold",
                        color: (group.avgDeltaVol ?? 0) > 15 ? "var(--strata-accent)" : "inherit"
                      }}>
                        {group.avgDeltaVol ? `${group.avgDeltaVol.toFixed(1)}%` : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
