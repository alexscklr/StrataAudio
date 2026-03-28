import type { BaseEntity } from "./base";

export interface Video extends BaseEntity {
  title: string;
  description: string | null;
  hls_url: string;
  thumbnail_url?: string;
  audio_tracks?: AudioTrack[];
}

export interface Audio extends Omit<BaseEntity, "created_at"> {
  title: string;
  hls_url: string;
  type: string;
  icon_url?: string;
}

export interface AudioTrack extends BaseEntity {
  video_id: string;
  label: string;
  hls_stream_id: number;
  default_volume: number;
}

export interface AudioNodeMap {
  [trackId: string]: {
    gainNode: GainNode;
    sourceNode: MediaElementAudioSourceNode;
  };
}