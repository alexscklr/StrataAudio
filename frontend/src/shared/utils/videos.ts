export const compareStreamFolders = (left: string, right: string): number => {
  const leftNumber = Number(left.replace("stream_", ""));
  const rightNumber = Number(right.replace("stream_", ""));
  return leftNumber - rightNumber;
};

export const toRelativePath = (file: File): string => {
  const raw = file.webkitRelativePath || file.name;
  const parts = raw.split("/").filter(Boolean);
  return parts.length > 1 ? parts.slice(1).join("/") : parts[0] ?? file.name;
};

const getFileIdentity = (file: File): string => `${file.name}-${file.size}-${file.lastModified}`;

interface LocalizedMetadataInput {
  titleDe: string;
  titleEn: string;
  descriptionDe: string;
  descriptionEn: string;
  genreDe: string;
  genreEn: string;
}

export const normalizeLocalizedValue = (
  primaryValue: string,
  fallbackValue: string,
): string => primaryValue.trim() || fallbackValue.trim();

export const normalizeLocalizedMetadata = ({
  titleDe,
  titleEn,
  descriptionDe,
  descriptionEn,
  genreDe,
  genreEn,
}: LocalizedMetadataInput): LocalizedMetadataInput => ({
  titleDe: normalizeLocalizedValue(titleDe, titleEn),
  titleEn: normalizeLocalizedValue(titleEn, titleDe),
  descriptionDe: normalizeLocalizedValue(descriptionDe, descriptionEn),
  descriptionEn: normalizeLocalizedValue(descriptionEn, descriptionDe),
  genreDe: normalizeLocalizedValue(genreDe, genreEn),
  genreEn: normalizeLocalizedValue(genreEn, genreDe),
});

export const parseOptionalNumber = (value: string): number | null => {
  const parsed = value.trim() ? Number(value.trim()) : null;
  return parsed !== null && Number.isFinite(parsed) ? parsed : null;
};
