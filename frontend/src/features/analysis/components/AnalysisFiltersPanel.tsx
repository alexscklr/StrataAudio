import type { AnalysisDerivedData, AnalysisFilters } from "@/features/analysis/types/analysis";
import styles from "./AnalysisDashboard.module.css";

interface AnalysisFiltersPanelProps {
  filters: AnalysisFilters;
  setFilters: React.Dispatch<React.SetStateAction<AnalysisFilters>>;
  derived: AnalysisDerivedData;
}

export function AnalysisFiltersPanel({
  filters,
  setFilters,
  derived,
}: AnalysisFiltersPanelProps) {
  const disturbanceTrackLeft = ((filters.disturbanceMin - 1) / 6) * 100;
  const disturbanceTrackRight = 100 - ((filters.disturbanceMax - 1) / 6) * 100;

  return (
    <section>
      <label>
        Video
        <select
          value={filters.videoId}
          onChange={(event) => {
            const next = event.target.value;
            setFilters((current) => ({ ...current, videoId: next }));
          }}
        >
          {derived.availableVideoOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Genre
        <select
          value={filters.genre}
          onChange={(event) => {
            const next = event.target.value;
            setFilters((current) => ({ ...current, genre: next, videoId: "all" }));
          }}
        >
          <option value="all">Alle Genres</option>
          {derived.availableGenres?.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </label>

      <label>
        Audio-Output
        <select
          value={filters.audioOutputType}
          onChange={(event) => {
            const next = event.target.value;
            setFilters((current) => ({ ...current, audioOutputType: next }));
          }}
        >
          <option value="all">Alle</option>
          {derived.availableAudioOutputs.map((outputType) => (
            <option key={outputType} value={outputType}>
              {outputType}
            </option>
          ))}
        </select>
      </label>

      <label>
        Altersgruppe
        <select
          value={filters.ageGroup}
          onChange={(event) => {
            const next = event.target.value;
            setFilters((current) => ({ ...current, ageGroup: next }));
          }}
        >
          <option value="all">Alle</option>
          {derived.availableAgeGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </label>

      <label>
        Betriebssystem (OS)
        <select
          value={filters.osName}
          onChange={(event) => {
            const next = event.target.value;
            setFilters((current) => ({ ...current, osName: next }));
          }}
        >
          <option value="all">Alle</option>
          {derived.availableOsNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Browser
        <select
          value={filters.browserName}
          onChange={(event) => {
            const next = event.target.value;
            setFilters((current) => ({ ...current, browserName: next }));
          }}
        >
          <option value="all">Alle</option>
          {derived.availableBrowserNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <label style={{ flexDirection: "row", alignItems: "center", cursor: "pointer", gap: "0.8rem", marginTop: "0.4rem" }}>
        <input
          type="checkbox"
          checked={filters.excludeNoVideos}
          onChange={(event) => {
            const next = event.target.checked;
            setFilters((current) => ({ ...current, excludeNoVideos: next }));
          }}
          style={{ width: "1.2rem", height: "1.2rem", cursor: "pointer" }}
        />
        Nur Teilnehmer mit Videos
      </label>

      <label>
        Technische Störungen (Sync-2)
        <select
          value={filters.syncDisturbance}
          onChange={(event) => {
            const next = event.target.value as any;
            setFilters((current) => ({ ...current, syncDisturbance: next }));
          }}
        >
          <option value="all">Alle anzeigen</option>
          <option value="nein">Nur ohne Störungen</option>
          <option value="ja">Nur mit Störungen</option>
        </select>
      </label>

      <div className={styles.disturbanceRangeGroup}>
        <p className={styles.disturbanceRangeTitle}>Störungsgrad (1-7)</p>
        <p className={styles.disturbanceRangeValue}>
          {filters.disturbanceMin} - {filters.disturbanceMax}
        </p>

        <div className={styles.disturbanceRangeWrap}>
          <div
            className={styles.disturbanceRangeActiveTrack}
            style={{
              left: `${disturbanceTrackLeft}%`,
              right: `${disturbanceTrackRight}%`,
            }}
          />

          <input
            type="range"
            min={1}
            max={7}
            step={1}
            value={filters.disturbanceMin}
            aria-label="Störungsgrad Minimum"
            className={`${styles.disturbanceRangeThumb} ${styles.disturbanceRangeThumbMin}`}
            style={{ zIndex: filters.disturbanceMin > 3 ? 10 : 2 }}
            onChange={(event) => {
              const raw = Number(event.target.value);
              const next = Number.isFinite(raw) ? Math.max(1, Math.min(7, raw)) : 1;
              setFilters((current) => ({
                ...current,
                disturbanceMin: Math.min(next, current.disturbanceMax),
              }));
            }}
          />

          <input
            type="range"
            min={1}
            max={7}
            step={1}
            value={filters.disturbanceMax}
            aria-label="Störungsgrad Maximum"
            className={`${styles.disturbanceRangeThumb} ${styles.disturbanceRangeThumbMax}`}
            style={{ zIndex: filters.disturbanceMax < 5 ? 10 : 1 }}
            onChange={(event) => {
              const raw = Number(event.target.value);
              const next = Number.isFinite(raw) ? Math.max(1, Math.min(7, raw)) : 7;
              setFilters((current) => ({
                ...current,
                disturbanceMax: Math.max(next, current.disturbanceMin),
              }));
            }}
          />
        </div>

        <div className={styles.disturbanceRangeScale}>
          <span>1</span>
          <span>7</span>
        </div>
      </div>
    </section>
  );
}
