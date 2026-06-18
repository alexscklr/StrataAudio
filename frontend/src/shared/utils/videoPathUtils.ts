/**
 * Path and storage location utilities for video management.
 * Handles relative path conversion, HLS path detection, and storage organization.
 */

import { sanitizeFileName, sanitizePathSegment } from "./videoSanitization";

export const toStorageRelativePath = (file: File): string => {
  const rawPath = file.webkitRelativePath || file.name;
  const segments = rawPath.split("/").filter(Boolean);
  const innerSegments = segments.length > 1 ? segments.slice(1) : segments;

  const sanitizedSegments = innerSegments.map((segment, index) => {
    const normalized = sanitizePathSegment(segment);
    if (!normalized) {
      throw new Error(`Ungueltiger Datei- oder Ordnername in Pfad: ${rawPath}`);
    }

    // Keep extension characters for file names while preserving folder names.
    if (index === innerSegments.length - 1 && segment.includes(".")) {
      return sanitizeFileName(segment);
    }

    return normalized;
  });

  if (sanitizedSegments.length === 0) {
    throw new Error("Ordnerstruktur konnte nicht erkannt werden.");
  }

  return sanitizedSegments.join("/");
};

export const getPlaylistPathForStream = (streamFolder: string, availablePaths: string[]): string => {
  const defaultPath = `${streamFolder}/playlist.m3u8`;
  const hasDefaultPath = availablePaths.some((path) => path === defaultPath);

  if (hasDefaultPath) {
    return defaultPath;
  }

  const fallbackPath = availablePaths.find(
    (path) => path.startsWith(`${streamFolder}/`) && path.toLowerCase().endsWith(".m3u8")
  );

  if (!fallbackPath) {
    throw new Error(`Keine Playlist fuer ${streamFolder} gefunden.`);
  }

  return fallbackPath;
};

export const detectVideoHlsPath = (relativePaths: string[]): string => {
  if (relativePaths.includes("stream_0/playlist.m3u8")) {
    return "stream_0/playlist.m3u8";
  }

  if (relativePaths.includes("master.m3u8")) {
    return "master.m3u8";
  }

  const fallback = relativePaths.find((path) => path.toLowerCase().endsWith(".m3u8"));
  if (!fallback) {
    throw new Error("Keine m3u8-Datei fuer den Video-Einstieg gefunden.");
  }

  return fallback;
};

export const detectThumbnailPath = (relativePaths: string[]): string | null => {
  const thumbnailPath = relativePaths.find((path) => /^thumbnail\./i.test(path));
  return thumbnailPath ?? null;
};
