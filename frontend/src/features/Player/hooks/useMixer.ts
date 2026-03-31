import { useEffect, useState } from 'react';
import type { Audio } from '@/shared/types/media';
import type { MixerState } from '@/shared/types/mixer';

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
    const [mixerState, setMixerState] = useState<MixerState>(() => ({
        masterVolume: 1,
        trackstates: createTrackStates(audios),
        isMasterMuted: false,
    }));

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

    const calculateEffectiveVolume = (id: string) => {
        const trackState = mixerState.trackstates[id];
        if (!trackState) return mixerState.masterVolume;
        if (trackState.isMuted || mixerState.isMasterMuted) return 0;
        return trackState.volume * mixerState.masterVolume;
    };

    return {
        mixerState,
        handleVolumeChange,
        handleMuteToggle,
        calculateEffectiveVolume,
    };
}

export default useMixer;