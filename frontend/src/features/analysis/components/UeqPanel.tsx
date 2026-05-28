import type { UeqResult } from "@/features/analysis/types/analysis";
import styles from "./AnalysisDashboard.module.css";

interface UeqPanelProps {
  items: UeqResult[];
}

export function UeqPanel({ items }: UeqPanelProps) {
  return (
    <section className={styles.panel}>
      <h3>UEQ-S Auswertung (User Experience Questionnaire)</h3>
      <p className={styles.muted}>
        Werte von -3 bis +3. Ein Wert über 0.8 gilt als positiv.
      </p>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(5, 1fr)", 
        gap: "1rem", 
        marginTop: "1rem" 
      }}>
        {items.map((item) => {
          const percent = ((item.score + 3) / 6) * 100;
          const isPositive = item.score >= 0.8;
          const isAggregate = ["Pragmatische Qualität", "Hedonische Qualität", "Gesamtqualität"].includes(item.dimension);
          
          return (
            <div 
              key={item.dimension} 
              style={{ 
                position: "relative",
                gridColumn: isAggregate ? "1 / -1" : "auto",
                background: isAggregate ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                padding: "0.8rem",
                borderRadius: "6px",
                border: "1px solid rgba(255,255,255,0.05)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem", alignItems: "center" }}>
                <span style={{ 
                  fontWeight: isAggregate ? 700 : 500, 
                  color: isAggregate ? "var(--audio-wave)" : "var(--text-main)", 
                  fontSize: isAggregate ? "0.95rem" : "0.85rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {item.dimension}
                </span>
                <span className={isPositive ? styles.badgeGreen : styles.badgeBlue} style={{ fontSize: "0.75rem", padding: "1px 6px" }}>
                  {item.score.toFixed(2)}
                </span>
              </div>
              
              <div style={{ 
                height: "6px", 
                background: "rgba(0,0,0,0.3)", 
                borderRadius: "3px", 
                overflow: "hidden",
                position: "relative" 
              }}>
                <div style={{ 
                  position: "absolute", 
                  left: "50%", 
                  top: 0, 
                  bottom: 0, 
                  width: "1px", 
                  background: "rgba(255,255,255,0.1)",
                  zIndex: 2
                }} />
                
                <div style={{ 
                  position: "absolute",
                  left: item.score >= 0 ? "50%" : `${percent}%`,
                  width: `${Math.abs(percent - 50)}%`,
                  height: "100%",
                  background: isPositive ? "var(--audio-wave)" : "var(--primary)",
                  transition: "all 0.4s ease-out"
                }} />
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", marginTop: "0.2rem", color: "var(--text-muted)", opacity: 0.6 }}>
                <span>-3</span>
                <span>0</span>
                <span>+3</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
