import { VideoWatchMode, type VideoWatchMode as WatchMode } from '@/shared/types/media';
import type { AudioConfigurationSnapshot } from '@/shared/types/mixer';

const MODE_SEQUENCE_STORAGE_PREFIX = 'watch-mode-sequence';
const MODE_PROGRESS_STORAGE_PREFIX = 'watch-mode-progress';
const AUDIO_CONFIGURATION_STORAGE_PREFIX = 'watch-mode-audio-config';

const getSequenceStorageKey = (videoId: string) => `${MODE_SEQUENCE_STORAGE_PREFIX}:${videoId}`;
const getProgressStorageKey = (videoId: string) => `${MODE_PROGRESS_STORAGE_PREFIX}:${videoId}`;
const getAudioConfigurationStorageKey = (videoId: string) => `${AUDIO_CONFIGURATION_STORAGE_PREFIX}:${videoId}`;

const isValidMode = (value: unknown): value is WatchMode => {
    return value === VideoWatchMode.Mixer || value === VideoWatchMode.Standard;
};

const sanitizeModeList = (value: unknown): WatchMode[] => {
    if (!Array.isArray(value)) return [];
    return value.filter(isValidMode);
};

const isValidAudioConfigurationSnapshot = (value: unknown): value is AudioConfigurationSnapshot => {
    if (!value || typeof value !== 'object') return false;

    const snapshot = value as Partial<AudioConfigurationSnapshot>;
    return Boolean(
        snapshot.final_settings &&
        snapshot.interaction_log &&
        typeof snapshot.total_interactions === 'number' &&
        typeof snapshot.time_to_mix_ms === 'number'
    );
};

const createRandomModeSequence = (): WatchMode[] => {
    return Math.random() < 0.5
        ? [VideoWatchMode.Mixer, VideoWatchMode.Standard]
        : [VideoWatchMode.Standard, VideoWatchMode.Mixer];
};

export const getOrCreateWatchModeSequence = (videoId: string): WatchMode[] => {
    const storageKey = getSequenceStorageKey(videoId);
    const rawSequence = localStorage.getItem(storageKey);

    if (rawSequence) {
        try {
            const parsed = JSON.parse(rawSequence);
            const sanitized = sanitizeModeList(parsed);
            if (sanitized.length === 2 && sanitized[0] !== sanitized[1]) {
                return sanitized;
            }
        } catch {
            // Ignore invalid storage content and overwrite with a new randomized order.
        }
    }

    const randomizedSequence = createRandomModeSequence();
    localStorage.setItem(storageKey, JSON.stringify(randomizedSequence));
    return randomizedSequence;
};

export const getCompletedWatchModes = (videoId: string): WatchMode[] => {
    const storageKey = getProgressStorageKey(videoId);
    const rawProgress = localStorage.getItem(storageKey);

    if (!rawProgress) return [];

    try {
        const parsed = JSON.parse(rawProgress);
        const sanitized = sanitizeModeList(parsed);
        return Array.from(new Set(sanitized));
    } catch {
        return [];
    }
};

export const markWatchModeCompleted = (videoId: string, mode: WatchMode): WatchMode[] => {
    const storageKey = getProgressStorageKey(videoId);
    const nextCompletedModes = Array.from(new Set([...getCompletedWatchModes(videoId), mode]));
    localStorage.setItem(storageKey, JSON.stringify(nextCompletedModes));
    return nextCompletedModes;
};

export const setCompletedWatchModes = (videoId: string, completedModes: WatchMode[]): WatchMode[] => {
    const storageKey = getProgressStorageKey(videoId);
    const sanitized = Array.from(new Set(completedModes.filter(isValidMode)));
    localStorage.setItem(storageKey, JSON.stringify(sanitized));
    return sanitized;
};

export const getAudioConfigurationSnapshots = (videoId: string): Partial<Record<WatchMode, AudioConfigurationSnapshot>> => {
    const rawSnapshots = localStorage.getItem(getAudioConfigurationStorageKey(videoId));

    if (!rawSnapshots) return {};

    try {
        const parsed = JSON.parse(rawSnapshots) as Record<string, unknown>;
        const snapshots: Partial<Record<WatchMode, AudioConfigurationSnapshot>> = {};

        for (const mode of [VideoWatchMode.Mixer, VideoWatchMode.Standard] as const) {
            if (isValidAudioConfigurationSnapshot(parsed?.[mode])) {
                snapshots[mode] = parsed[mode];
            }
        }

        return snapshots;
    } catch {
        return {};
    }
};

export const saveAudioConfigurationSnapshot = (
    videoId: string,
    mode: WatchMode,
    snapshot: AudioConfigurationSnapshot,
): void => {
    const existingSnapshots = getAudioConfigurationSnapshots(videoId);
    const nextSnapshots = {
        ...existingSnapshots,
        [mode]: snapshot,
    };

    localStorage.setItem(getAudioConfigurationStorageKey(videoId), JSON.stringify(nextSnapshots));
};

const clearAudioConfigurationSnapshots = (videoId: string): void => {
    localStorage.removeItem(getAudioConfigurationStorageKey(videoId));
};

const clearWatchModeProgress = (videoId: string): void => {
    localStorage.removeItem(getProgressStorageKey(videoId));
};

export const clearWatchModeState = (videoId: string): void => {
    localStorage.removeItem(getProgressStorageKey(videoId));
    localStorage.removeItem(getSequenceStorageKey(videoId));
    clearAudioConfigurationSnapshots(videoId);
};
