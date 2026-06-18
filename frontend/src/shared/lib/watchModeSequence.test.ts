import { describe, it, expect, beforeEach } from 'vitest';
import { VideoWatchMode } from '@/shared/types/media';
import type { AudioConfigurationSnapshot } from '@/shared/types/mixer';
import {
    clearWatchModeState,
    getAudioConfigurationSnapshots,
    getCompletedWatchModes,
    getOrCreateWatchModeSequence,
    markWatchModeCompleted,
    saveAudioConfigurationSnapshot,
    setCompletedWatchModes,
} from './watchModeSequence';

const VIDEO_ID = 'video-1';

const createSnapshot = (): AudioConfigurationSnapshot => ({
    final_settings: {
        masterVolume: 0.8,
        masterPan: 0,
        isMasterMuted: false,
        trackstates: {
            drums: { volume: 0.6, isMuted: false, pan: 0 },
        },
    },
    interaction_log: [{ t: 10, label: 'masterVolume', val: 0.8 }],
    total_interactions: 1,
    time_to_mix_ms: 1200,
});

describe('watchModeSequence', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('returns a persisted valid mode sequence', () => {
        localStorage.setItem(
            `watch-mode-sequence:${VIDEO_ID}`,
            JSON.stringify([VideoWatchMode.Mixer, VideoWatchMode.Standard]),
        );

        const sequence = getOrCreateWatchModeSequence(VIDEO_ID);

        expect(sequence).toEqual([VideoWatchMode.Mixer, VideoWatchMode.Standard]);
    });

    it('creates and stores a sequence when storage is invalid', () => {
        localStorage.setItem(`watch-mode-sequence:${VIDEO_ID}`, '{broken-json');

        const sequence = getOrCreateWatchModeSequence(VIDEO_ID);
        const stored = JSON.parse(localStorage.getItem(`watch-mode-sequence:${VIDEO_ID}`) ?? '[]');

        expect(sequence).toHaveLength(2);
        expect(sequence[0]).not.toBe(sequence[1]);
        expect(stored).toEqual(sequence);
    });

    it('deduplicates completed modes', () => {
        markWatchModeCompleted(VIDEO_ID, VideoWatchMode.Mixer);
        const completed = markWatchModeCompleted(VIDEO_ID, VideoWatchMode.Mixer);

        expect(completed).toEqual([VideoWatchMode.Mixer]);
        expect(getCompletedWatchModes(VIDEO_ID)).toEqual([VideoWatchMode.Mixer]);
    });

    it('returns empty completed modes for malformed storage', () => {
        localStorage.setItem(`watch-mode-progress:${VIDEO_ID}`, '{broken-json');

        expect(getCompletedWatchModes(VIDEO_ID)).toEqual([]);
    });

    it('filters invalid modes in setCompletedWatchModes', () => {
        const result = setCompletedWatchModes(VIDEO_ID, [
            VideoWatchMode.Standard,
            'invalid-mode' as unknown as (typeof VideoWatchMode)[keyof typeof VideoWatchMode],
            VideoWatchMode.Standard,
        ]);

        expect(result).toEqual([VideoWatchMode.Standard]);
        expect(getCompletedWatchModes(VIDEO_ID)).toEqual([VideoWatchMode.Standard]);
    });

    it('saves and restores only valid audio snapshots', () => {
        const snapshot = createSnapshot();
        saveAudioConfigurationSnapshot(VIDEO_ID, VideoWatchMode.Mixer, snapshot);

        localStorage.setItem(
            `watch-mode-audio-config:${VIDEO_ID}`,
            JSON.stringify({
                ...getAudioConfigurationSnapshots(VIDEO_ID),
                [VideoWatchMode.Standard]: { invalid: true },
            }),
        );

        const snapshots = getAudioConfigurationSnapshots(VIDEO_ID);

        expect(snapshots[VideoWatchMode.Mixer]).toEqual(snapshot);
        expect(snapshots[VideoWatchMode.Standard]).toBeUndefined();
    });

    it('clears sequence, progress, and audio snapshot state', () => {
        markWatchModeCompleted(VIDEO_ID, VideoWatchMode.Standard);
        saveAudioConfigurationSnapshot(VIDEO_ID, VideoWatchMode.Mixer, createSnapshot());
        getOrCreateWatchModeSequence(VIDEO_ID);

        clearWatchModeState(VIDEO_ID);

        expect(localStorage.getItem(`watch-mode-sequence:${VIDEO_ID}`)).toBeNull();
        expect(localStorage.getItem(`watch-mode-progress:${VIDEO_ID}`)).toBeNull();
        expect(localStorage.getItem(`watch-mode-audio-config:${VIDEO_ID}`)).toBeNull();
    });
});
