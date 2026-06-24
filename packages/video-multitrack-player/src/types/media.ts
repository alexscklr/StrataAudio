export interface Audio {
    id: string;
    title: string;
    hls_url: string;
    icon_url?: string;
    default_volume: number;
}

export interface VideoControlPermissions {
    seek: boolean;
    rewind: boolean;
    pause: boolean;
    fullscreen: boolean;
}

export const VideoWatchMode = {
    Standard: "standard",
    Mixer: "mixer",
};

export type VideoWatchMode = typeof VideoWatchMode[keyof typeof VideoWatchMode];