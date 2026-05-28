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
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
        gap: "1.5rem", 
        marginTop: "1.5rem" 
      }}>
        {items.map((item, index) => {
          const percent = ((item.score + 3) / 6) * 100;
          const isPositive = item.score >= 0.8;
          const isAggregate = ["Pragmatische Qualität", "Hedonische Qualität", "Gesamtqualität"].includes(item.dimension);
          
          return (
            <div 
              key={item.dimension} 
              style={{ 
                position: "relative",
                gridColumn: isAggregate ? "1 / -1" : "auto",
                background: isAggregate ? "rgba(255,255,255,0.03)" : "transparent",
                padding: isAggregate ? "1rem" : "0",
                borderRadius: "var(--radius)",
                border: isAggregate ? "1px solid #333" : "none"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span style={{ fontWeight: isAggregate ? 800 : 600, color: isAggregate ? "var(--audio-wave)" : "inherit", fontSize: isAggregate ? "1rem" : "0.9rem" }}>
                  {item.dimension}
                </span>
                <span className={isPositive ? styles.badgeGreen : styles.badgeBlue} style={{ fontSize: "0.8rem" }}>
                  {item.score.toFixed(2)}
                </span>
              </div>
              
              <div style={{ 
                height: "8px", 
                background: "#2a2a2a", 
                borderRadius: "4px", 
                overflow: "hidden",
                position: "relative" 
              }}>
                {/* Neutral line at 0 (which is 50%) */}
                <div style={{ 
                  position: "absolute", 
                  left: "50%", 
                  top: 0, 
                  bottom: 0, 
                  width: "1px", 
                  background: "rgba(255,255,255,0.2)",
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
              
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", marginTop: "0.2rem", color: "var(--text-muted)" }}>
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
