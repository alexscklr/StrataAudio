export type UploadMode = "catalog" | "raw";

export interface AudioTrackFormState {
  streamFolder: string;
  titleDe: string;
  titleEn: string;
  defaultVolume: string;
  iconFile: File | null;
}

export interface RawAudioFileFormState {
  file: File;
  titleDe: string;
  titleEn: string;
  defaultVolume: string;
  iconFile: File | null;
}

export interface EmbeddedAudioFormState {
  titleDe: string;
  titleEn: string;
  defaultVolume: string;
  iconFile: File | null;
}
