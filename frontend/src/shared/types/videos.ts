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
  title: string;
  defaultVolume: string;
  iconFile: File | null;
}

export interface EmbeddedAudioFormState {
  title: string;
  defaultVolume: string;
  iconFile: File | null;
}
