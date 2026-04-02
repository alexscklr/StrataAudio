import { useEffect, useRef, useState } from 'react';
import type { Audio } from '@/shared/types/media';
import type { AudioConfigurationSnapshot, MixerInteractionEntry, MixerState } from '@/shared/types/mixer';

const DEFAULT_TRACK_STATE = { volume: 1, isMuted: false };

function createDefaultTrackState(audio: Audio) {
    return {
        volume: Number.isFinite(audio.default_volume) ? audio.default_volume : DEFAULT_TRACK_STATE.volume,
        isMuted: DEFAULT_TRACK_STATE.isMuted,
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

    const calculateEffectiveVolume = (id: string) => {
        const trackState = mixerState.trackstates[id];
        if (!trackState) return mixerState.masterVolume;
        if (trackState.isMuted || mixerState.isMasterMuted) return 0;
        return trackState.volume * mixerState.masterVolume;
    };

    const getAudioConfigurationSnapshot = (): AudioConfigurationSnapshot => {
        return {
            final_settings: {
                masterVolume: mixerState.masterVolume,
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
        handleMuteToggle,
        calculateEffectiveVolume,
        getAudioConfigurationSnapshot,
    };
}

export default useMixer;