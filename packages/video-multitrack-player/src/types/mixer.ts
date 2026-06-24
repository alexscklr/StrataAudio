export interface AudioTrackState {
    volume: number;
    isMuted: boolean;
    pan: number;
}

export interface MixerInteractionEntry {
    t: number;
    label: string;
    val: number | boolean;
}

export interface AudioConfigurationSnapshot {
    final_settings: {
        masterVolume: number;
        masterPan: number;
        isMasterMuted: boolean;
        trackstates: Record<string, AudioTrackState>;
    };
    interaction_log: MixerInteractionEntry[];
    total_interactions: number;
    time_to_mix_ms: number;
}

export interface MixerState {
    masterVolume: number;
    masterPan: number;
    trackstates: Record<string, AudioTrackState>;
    isMasterMuted: boolean;
}