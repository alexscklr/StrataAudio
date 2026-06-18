/**
 * Storage operation wrappers for video management.
 * Thin abstractions around storage utility functions to handle batching and error cases.
 */

import {
  listStoragePathsRecursively,
  removeStoragePaths,
} from "@/shared/utils/storage";
import { chunkArray } from "./videoValidators";

export const listStorageFilesRecursively = async (
  bucket: string,
  prefix: string
): Promise<string[]> => {
  return listStoragePathsRecursively(bucket, prefix);
};

export const removeStorageFiles = async (
  bucket: string,
  paths: string[]
): Promise<void> => {
  for (const chunk of chunkArray(paths, 1000)) {
    await removeStoragePaths(bucket, chunk);
  }
};
