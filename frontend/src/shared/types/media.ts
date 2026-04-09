import type { BaseEntity } from "./base";

export interface Video extends BaseEntity {
  title: string;
  description: string | null;
  hls_url: string;
  genre: string;
  thumbnail_url?: string;
  is_mandatory: boolean;
}

export interface VideoCatalogItem extends Video {
  watched: boolean;
}

export type CatalogItemStatus = "unlocked" | "locked" | "watched";

export interface Audio extends Omit<BaseEntity, "created_at"> {
  title: string;
  hls_url: string;
  type: string;
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
  Mixer: "mixer"
}

export type VideoWatchMode = typeof VideoWatchMode[keyof typeof VideoWatchMode];

export interface AudioControlPermissions {
  changeSingleTracksVolume: boolean;
  muteSingleTracks: boolean;
}