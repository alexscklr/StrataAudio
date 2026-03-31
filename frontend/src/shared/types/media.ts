import type { BaseEntity } from "./base";

export interface Video extends BaseEntity {
  title: string;
  description: string | null;
  hls_url: string;
  genre: string;
  thumbnail_url?: string;
}

export interface Audio extends Omit<BaseEntity, "created_at"> {
  title: string;
  hls_url: string;
  type: string;
  icon_url?: string;
  default_volume: number;
}