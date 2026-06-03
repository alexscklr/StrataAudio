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
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "1rem", 
        marginTop: "1rem" 
      }}>
        {data.map((table) => (
          <div key={table.attribute} className={styles.detailCard} style={{ padding: "1rem" }}>
            <h4 style={{ 
              color: "var(--strata-accent)", 
              marginBottom: "1rem",
              fontSize: "0.95rem",
              borderBottom: "1px solid #333",
              paddingBottom: "0.4rem"
            }}>
              {table.attribute}
            </h4>
            
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {table.groups.map((group) => (
                <div key={group.name} style={{ 
                  background: "rgba(255,255,255,0.02)", 
                  padding: "0.6rem 0.8rem", 
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.05)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{group.name}</span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>n = {group.count}</span>
                  </div>

                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                    SUS n = {group.susCount} · NPS n = {group.npsCount} · Aktivität n = {group.deltaVolCount}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.4rem" }}>
                    <div style={{ textAlign: "center", padding: "0.3rem", background: "rgba(0,0,0,0.2)", borderRadius: "4px" }}>
                      <p style={{ fontSize: "0.6rem", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.1rem" }}>SUS</p>
                      <span style={{
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        color: (group.avgSus ?? 0) > 68 ? "var(--audio-wave)" : "inherit"
                      }}>
                        {group.avgSus !== null && group.avgSus !== undefined ? group.avgSus.toFixed(1) : "—"}
                      </span>
                    </div>
                    
                    <div style={{ textAlign: "center", padding: "0.3rem", background: "rgba(0,0,0,0.2)", borderRadius: "4px" }}>
                      <p style={{ fontSize: "0.6rem", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.1rem" }}>Empfehlungswert (Ø 0-10)</p>
                      <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>
                        {group.avgNps !== null && group.avgNps !== undefined ? group.avgNps.toFixed(1) : "—"}
                      </span>
                    </div>

                    <div style={{ textAlign: "center", padding: "0.3rem", background: "rgba(0,0,0,0.2)", borderRadius: "4px" }}>
                      <p style={{ fontSize: "0.6rem", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.1rem" }}>Aktivität</p>
                      <span style={{ 
                        fontSize: "0.85rem", 
                        fontWeight: "bold",
                        color: (group.avgDeltaVol ?? 0) > 15 ? "var(--strata-accent)" : "inherit"
                      }}>
                        {group.avgDeltaVol !== null && group.avgDeltaVol !== undefined ? `${Math.round(group.avgDeltaVol)}%` : "—"}
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
