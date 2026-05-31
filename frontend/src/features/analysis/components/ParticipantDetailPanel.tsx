import { useMemo, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import type { ParticipantDetail, SurveyResponseRow } from "@/features/analysis/types/analysis";
import styles from "./AnalysisDashboard.module.css";

interface ParticipantDetailPanelProps {
  participants: ParticipantDetail[];
  videoLabelMap: Record<string, string>;
}

const DataField = ({ label, value }: { label: string; value: any }) => (
  <div className={styles.dataItem}>
    <span className={styles.dataLabel}>{label}</span>
    <span className={styles.dataValue}>{value ?? "—"}</span>
  </div>
);

const VideoSurveyDisplay = ({ 
  response, 
  videoLabelMap 
}: { 
  response: SurveyResponseRow; 
  videoLabelMap: Record<string, string> 
}) => {
  const answers = response.responses?.answers ?? {};
  const label = videoLabelMap[response.video_id] || response.video_id.slice(0, 8);
  return (
    <div className={styles.logSummary}>
      <span className={styles.badgeBlue}>Video: {label}</span>
      <span className={styles.badgeGreen}>Mode: {response.first_watch_mode}</span>
      <div style={{ width: "100%", marginTop: "0.5rem", fontSize: "0.85rem", opacity: 0.8 }}>
        {Object.entries(answers).map(([key, val]) => (
          <span key={key} style={{ marginRight: "1rem" }}><strong>{key}:</strong> {String(val)}</span>
        ))}
      </div>
    </div>
  );
};

export function ParticipantDetailPanel({ 
  participants,
  videoLabelMap,
}: ParticipantDetailPanelProps) {
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>("");
  const [reasonDraftByParticipant, setReasonDraftByParticipant] = useState<Record<string, string>>({});
  const [localBiasByParticipant, setLocalBiasByParticipant] = useState<Record<string, { is_biased: boolean; reason: string | null }>>({});
  const [savingBiasFlag, setSavingBiasFlag] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const effectiveParticipantId = selectedParticipantId || participants[0]?.participant.id || "";

  const selected = useMemo(
    () => participants.find((item) => item.participant.id === effectiveParticipantId) ?? null,
    [participants, effectiveParticipantId],
  );

  const selectedBiasState = selected
    ? localBiasByParticipant[selected.participant.id] ?? {
        is_biased: Boolean(selected.biasFlag?.is_biased),
        reason: selected.biasFlag?.reason ?? null,
      }
    : { is_biased: false, reason: null };

  const reasonDraft = selected
    ? reasonDraftByParticipant[selected.participant.id] ?? selectedBiasState.reason ?? ""
    : "";

  const saveBiasFlag = async (isBiased: boolean) => {
    if (!selected) {
      return;
    }

    setSavingBiasFlag(true);
    setSaveMessage(null);

    const participantId = selected.participant.id;
    const reasonValue = (reasonDraftByParticipant[participantId] ?? selected.biasFlag?.reason ?? "").trim();

    const { error } = await supabase
      .from("participant_analysis_flags")
      .upsert(
        {
          participant_id: participantId,
          is_biased: isBiased,
          reason: reasonValue.length > 0 ? reasonValue : null,
        },
        { onConflict: "participant_id" },
      );

    if (error) {
      setSaveMessage(`Speichern fehlgeschlagen: ${error.message}`);
      setSavingBiasFlag(false);
      return;
    }

    setLocalBiasByParticipant((current) => ({
      ...current,
      [participantId]: {
        is_biased: isBiased,
        reason: reasonValue.length > 0 ? reasonValue : null,
      },
    }));

    setSaveMessage(isBiased ? "Bias-Flag gespeichert." : "Bias-Flag entfernt.");
    setSavingBiasFlag(false);
  };

  if (participants.length === 0) {
    return (
      <section className={styles.panel}>
        <h3>Teilnehmer-Drilldown</h3>
        <p className={styles.muted}>Keine Teilnehmerdaten im aktuellen Filter.</p>
      </section>
    );
  }

  return (
    <section className={styles.panel}>
      <h3>Teilnehmer-Drilldown</h3>
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Teilnehmer auswählen
          <select
            value={effectiveParticipantId}
            onChange={(event) => {
              setSelectedParticipantId(event.target.value);
            }}
            style={{ marginLeft: "1rem" }}
          >
            {participants.map((entry) => (
              <option key={entry.participant.id} value={entry.participant.id}>
                {entry.participant.id.slice(0, 8)} | {new Date(entry.participant.created_at).toLocaleDateString()}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selected && (
        <div className={styles.detailGrid}>
          <article className={styles.detailCard}>
            <h4>Basisdaten & Gerät</h4>
            <div className={styles.dataList}>
              <DataField label="ID" value={selected.participant.id} />
              <DataField label="Hash" value={selected.participant.user_hash} />
              <DataField label="Browser" value={`${selected.participant.browser_name} ${selected.participant.browser_version}`} />
              <DataField label="OS" value={`${selected.participant.os_name} ${selected.participant.os_version}`} />
              <DataField label="Screen" value={`${selected.participant.screen_res_width}x${selected.participant.screen_res_height}`} />
              <DataField label="Datum" value={new Date(selected.participant.created_at).toLocaleString()} />
            </div>
          </article>

          <article className={styles.detailCard}>
            <h4>Demografie</h4>
            {selected.demographics ? (
              <div className={styles.dataList}>
                <DataField label="Alter" value={selected.demographics.age_group} />
                <DataField label="Geschlecht" value={selected.demographics.gender} />
                <DataField label="Streaming-Häufigkeit" value={selected.demographics.streaming_usage} />
                <DataField label="Ausgabegerät" value={selected.demographics.audio_output_type} />
                <DataField label="Aktuelles Störgefühl (1-7)" value={selected.demographics.audio_balance_disturbance} />
                <DataField label="Aktuelle Mixing Zufriedenheit" value={selected.demographics.audio_settings_satisfaction} />
              </div>
            ) : <p className={styles.muted}>Keine demografischen Daten vorhanden.</p>}
          </article>

          <article className={styles.detailCard}>
            <h4>Flagged-Status</h4>
            <p className={styles.muted} style={{ marginBottom: "0.6rem" }}>
              Status: {selectedBiasState.is_biased ? "Biased (wird ausgeschlossen)" : "Nicht biased"}
            </p>

            <label style={{ display: "grid", gap: "0.4rem" }}>
              Grund
              <textarea
                value={reasonDraft}
                onChange={(event) => {
                  const next = event.target.value;
                  setReasonDraftByParticipant((current) => ({
                    ...current,
                    [selected.participant.id]: next,
                  }));
                }}
                rows={3}
                placeholder="Grund für Bias-Markierung"
                style={{
                  width: "100%",
                  resize: "vertical",
                  borderRadius: "8px",
                  border: "1.5px solid var(--border-color)",
                  background: "#232323",
                  color: "var(--text-main)",
                  padding: "0.55rem 0.65rem",
                  fontSize: "0.9rem",
                  boxSizing: "border-box",
                }}
              />
            </label>

            <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.8rem", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => void saveBiasFlag(true)}
                disabled={savingBiasFlag}
              >
                Als biased speichern
              </button>
              <button
                type="button"
                onClick={() => void saveBiasFlag(false)}
                disabled={savingBiasFlag}
                style={{ background: "#475569" }}
              >
                Bias-Flag entfernen
              </button>
            </div>

            {saveMessage && (
              <p className={styles.muted} style={{ marginTop: "0.7rem" }}>
                {saveMessage}
              </p>
            )}
          </article>

          <article className={styles.detailCard}>
            <h4>Video Surveys ({selected.videoResponses.length})</h4>
            <div style={{ display: "grid", gap: "0.8rem" }}>
              {selected.videoResponses.map((resp, i) => (
                <VideoSurveyDisplay key={i} response={resp} videoLabelMap={videoLabelMap} />
              ))}
            </div>
          </article>

          <article className={styles.detailCard}>
            <h4>Endsurvey</h4>
            {selected.endSurveyResponse ? (
              <div style={{ background: "#232323", padding: "0.8rem", borderRadius: "8px" }}>
                {Object.entries(selected.endSurveyResponse.responses?.answers ?? {}).map(([key, val]) => (
                  <div key={key} style={{ marginBottom: "0.4rem" }}>
                    <span className={styles.dataLabel} style={{ minWidth: "120px", display: "inline-block" }}>{key}:</span>
                    <span className={styles.dataValue}>{String(val)}</span>
                  </div>
                ))}
              </div>
            ) : <p className={styles.muted}>Nicht abgeschlossen.</p>}
          </article>

          <article className={styles.detailCard}>
            <h4>Mixer-Sessions ({selected.configurations.length})</h4>
            <div style={{ display: "grid", gap: "0.8rem" }}>
              {selected.configurations.map((config, i) => (
                <div key={i} className={styles.logSummary}>
                  <span className={styles.badgeBlue}>
                    Video: {videoLabelMap[config.video_id] || config.video_id.slice(0, 8)}
                  </span>
                  <span className={styles.badgeGreen}>Interaktionen: {config.total_interactions}</span>
                  <span className={styles.badge}>Zeit: {(config.time_to_mix_ms ?? 0) / 1000}s</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
