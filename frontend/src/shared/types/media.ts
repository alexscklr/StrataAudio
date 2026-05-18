import type { BaseEntity } from "./base";

export interface Video extends BaseEntity {
  title: string;
  description: string | null;
  hls_url: string;
  genre: string;
  thumbnail_url?: string;
  is_mandatory: boolean;
  duration_seconds: number | null;
  technical_metadata?: VideoTechnicalMetadataItem[];
}

export interface VideoTechnicalMetadataItem {
  category: string;
  source: string;
  source_url?: string;
  license: string;
}

export interface VideoCatalogItem extends Video {
  watched: boolean;
}

export type CatalogItemStatus = "unlocked" | "locked" | "watched";

export interface Audio extends Omit<BaseEntity, "created_at"> {
  title: string;
  hls_url: string;
  icon_url?: string;
  default_volume: number;
}

export interface IconAttribution {
  id: string;
  file_name: string;
  source_name: string;
  source_url: string | null;
  author_name: string;
  author_url: string | null;
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