import { VideoWatchMode, type VideoWatchMode as WatchMode } from '@/shared/types/media';

const MODE_SEQUENCE_STORAGE_PREFIX = 'watch-mode-sequence';
const MODE_PROGRESS_STORAGE_PREFIX = 'watch-mode-progress';

const getSequenceStorageKey = (videoId: string) => `${MODE_SEQUENCE_STORAGE_PREFIX}:${videoId}`;
const getProgressStorageKey = (videoId: string) => `${MODE_PROGRESS_STORAGE_PREFIX}:${videoId}`;

const isValidMode = (value: unknown): value is WatchMode => {
    return value === VideoWatchMode.Mixer || value === VideoWatchMode.Standard;
};

const sanitizeModeList = (value: unknown): WatchMode[] => {
    if (!Array.isArray(value)) return [];
    return value.filter(isValidMode);
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
