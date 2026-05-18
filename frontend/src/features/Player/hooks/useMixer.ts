import { useEffect, useRef, useState } from 'react';
import type { Audio } from '@/shared/types/media';
import type { AudioConfigurationSnapshot, MixerInteractionEntry, MixerState } from '@/shared/types/mixer';

const DEFAULT_TRACK_STATE = { volume: 1, isMuted: false, pan: 0 };

function createDefaultTrackState(audio: Audio) {
    return {
        volume: Number.isFinite(audio.default_volume) ? audio.default_volume : DEFAULT_TRACK_STATE.volume,
        isMuted: DEFAULT_TRACK_STATE.isMuted,
        pan: DEFAULT_TRACK_STATE.pan,
    };
}

function createTrackStates(audios: Audio[] | undefined, currentTrackStates: MixerState['trackstates'] = {}) {
    if (!audios?.length) {
        return currentTrackStates;
    }

    return audios.reduce<MixerState['trackstates']>((accumulator, audio) => {
        accumulator[audio.id] = currentTrackStates[audio.id] ?? createDefaultTrackState(audio);
        return accumulator;
    }, {});
}

function useMixer(audios: Audio[] | undefined) {
    const sessionStartedAtRef = useRef<number>(performance.now());
    const firstInteractionDelayMsRef = useRef<number | null>(null);
    const [interactionLog, setInteractionLog] = useState<MixerInteractionEntry[]>([]);
    const [totalInteractions, setTotalInteractions] = useState(0);

    const [mixerState, setMixerState] = useState<MixerState>(() => ({
        masterVolume: 1,
        masterPan: 0,
        trackstates: createTrackStates(audios),
        isMasterMuted: false,
    }));

    const appendInteraction = (label: string, val: number | boolean) => {
        const now = performance.now();

        if (firstInteractionDelayMsRef.current === null) {
            firstInteractionDelayMsRef.current = Math.round(now - sessionStartedAtRef.current);
        }

        const entry: MixerInteractionEntry = {
            t: Math.round(now - sessionStartedAtRef.current),
            label,
            val,
        };

        setInteractionLog(prev => [...prev, entry]);
        setTotalInteractions(prev => prev + 1);
    };

    useEffect(() => {
        setMixerState(prev => ({
            ...prev,
            trackstates: createTrackStates(audios, prev.trackstates),
        }));
    }, [audios]);

    const handleVolumeChange = (id: string, val: number) => {
        setMixerState(prev => ({
            ...prev,
            trackstates: {
                ...prev.trackstates,
                [id]: {
                    ...(prev.trackstates[id] ?? DEFAULT_TRACK_STATE),
                    volume: val
                }
            }
        }));
    };

    const handleMuteToggle = (id: string) => {
        const nextMutedValue = !(mixerState.trackstates[id]?.isMuted ?? false);
        appendInteraction(`${id}.mute`, nextMutedValue);

        setMixerState(prev => ({
            ...prev,
            trackstates: {
                ...prev.trackstates,
                [id]: {
                    ...(prev.trackstates[id] ?? DEFAULT_TRACK_STATE),
                    isMuted: !(prev.trackstates[id]?.isMuted ?? false)
                }
            }
        }));
    };

    const handleMasterVolumeChange = (val: number) => {
        setMixerState(prev => ({
            ...prev,
            masterVolume: val,
        }));
    };

    const handleVolumeCommit = (id: string, val: number) => {
        appendInteraction(`${id}.volume`, val);
    };

    const handleMasterVolumeCommit = (val: number) => {
        appendInteraction('master.volume', val);
    };

    const handlePanChange = (id: string, val: number) => {
        const clampedVal = Math.max(-1, Math.min(1, val));
        setMixerState(prev => ({
            ...prev,
            trackstates: {
                ...prev.trackstates,
                [id]: {
                    ...(prev.trackstates[id] ?? DEFAULT_TRACK_STATE),
                    pan: clampedVal
                }
            }
        }));
    };

    const handlePanCommit = (id: string, val: number) => {
        const clampedVal = Math.max(-1, Math.min(1, val));
        appendInteraction(`${id}.pan`, clampedVal);
    };

    const handleMasterPanChange = (val: number) => {
        const clampedVal = Math.max(-1, Math.min(1, val));
        setMixerState(prev => ({
            ...prev,
            masterPan: clampedVal,
        }));
    };

    const handleMasterPanCommit = (val: number) => {
        const clampedVal = Math.max(-1, Math.min(1, val));
        appendInteraction('master.pan', clampedVal);
    };

    const calculateEffectiveVolume = (id: string) => {
        const trackState = mixerState.trackstates[id];
        if (!trackState) return mixerState.masterVolume;
        if (trackState.isMuted || mixerState.isMasterMuted) return 0;
        return trackState.volume * mixerState.masterVolume;
    };

    const calculateEffectivePan = (id: string) => {
        const trackState = mixerState.trackstates[id];
        if (!trackState) return 0;
        if (trackState.isMuted || mixerState.isMasterMuted) return 0;
        return Math.max(-1, Math.min(1, trackState.pan));
    };

    const getAudioConfigurationSnapshot = (): AudioConfigurationSnapshot => {
        return {
            final_settings: {
                masterVolume: mixerState.masterVolume,
                masterPan: mixerState.masterPan,
                isMasterMuted: mixerState.isMasterMuted,
                trackstates: mixerState.trackstates,
            },
            interaction_log: interactionLog,
            total_interactions: totalInteractions,
            time_to_mix_ms: firstInteractionDelayMsRef.current ?? 0,
        };
    };

    return {
        mixerState,
        handleVolumeChange,
        handleVolumeCommit,
        handleMasterVolumeChange,
        handleMasterVolumeCommit,
        handlePanChange,
        handlePanCommit,
        handleMasterPanChange,
        handleMasterPanCommit,
        handleMuteToggle,
        calculateEffectiveVolume,
        calculateEffectivePan,
        getAudioConfigurationSnapshot,
    };
}

export default useMixer;