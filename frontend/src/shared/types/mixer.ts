
export interface AudioTrackState {
    volume: number;
    isMuted: boolean;
    //isSolo: boolean;
}

export interface MixerState {
    masterVolume: number;
    trackstates: Record<string, AudioTrackState>; 
    isMasterMuted: boolean;
}