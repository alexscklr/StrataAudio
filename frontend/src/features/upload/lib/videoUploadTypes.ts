export interface UploadVideoInput {
  titleDe: string;
  titleEn?: string;
  descriptionDe?: string;
  descriptionEn?: string;
  genreDe: string;
  genreEn?: string;
  isMandatory: boolean;
  durationSeconds?: number | null;
  mediaFolderFiles: File[];
  audioTracks: {
    streamFolder: string;
    titleDe: string;
    titleEn?: string;
    defaultVolume: number;
    iconFile?: File | null;
  }[];
}

export interface UploadRawSourceInput {
  title: string;
  description: string;
  isMandatory: boolean;
  durationSeconds?: number | null;
  videoFile: File;
  containsVideoAudio?: boolean;
  videoAudio?: {
    title: string;
    defaultVolume: number;
    iconFile?: File | null;
  };
  thumbnailFile?: File | null;
  audioFiles: {
    file: File;
    title: string;
    defaultVolume: number;
    iconFile?: File | null;
  }[];
  inviteToken?: string | null;
  captchaToken?: string | null;
  consentGiven?: boolean;
}

export interface CreateUploadInviteInput {
  label?: string;
  expiresInHours?: number;
  maxUses?: number;
}

export interface CreateUploadInviteResult {
  token: string;
  expiresAt: string;
  maxUses: number;
  label: string | null;
}
