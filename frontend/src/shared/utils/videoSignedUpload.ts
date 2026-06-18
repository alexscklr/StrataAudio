/**
 * Signed URL upload utilities for video and media files.
 * Handles creation and finalization of signed uploads via Supabase Edge Functions.
 */

import { supabase } from "@/api/supabaseClient";
import { getStorageProvider } from "@/shared/utils/storage";

type SignedUploadFileDescriptor = {
  path: string;
  mimeType: string;
  sizeBytes: number;
};

const getPublicUploadSignedProvider = (): "supabase" | "r2" => {
  const explicitProvider = (import.meta.env.VITE_PUBLIC_UPLOAD_SIGNED_PROVIDER ?? "")
    .trim()
    .toLowerCase();
  if (explicitProvider === "supabase") {
    return "supabase";
  }

  if (explicitProvider === "r2") {
    return "r2";
  }

  return getStorageProvider();
};

export const createSignedUploadMap = async (
  bucket: string,
  uploadId: string,
  files: SignedUploadFileDescriptor[],
  inviteToken?: string | null,
  captchaToken?: string | null
): Promise<Map<string, string>> => {
  const { data, error } = await supabase.functions.invoke("create-user-upload-urls", {
    body: {
      action: "issue",
      storageProvider: getPublicUploadSignedProvider(),
      bucket,
      uploadId,
      files,
      inviteToken: inviteToken ?? null,
      captchaToken: captchaToken ?? null,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const uploads = (
    data as { uploads?: Array<{ path?: string; token?: string; url?: string }> } | null
  )?.uploads ?? [];
  const tokenMap = new Map<string, string>();

  for (const upload of uploads) {
    const uploadCredential = upload.token ?? upload.url;
    if (!upload.path || !uploadCredential) {
      continue;
    }

    tokenMap.set(upload.path, uploadCredential);
  }

  if (tokenMap.size !== files.length) {
    throw new Error("Signed upload URLs konnten nicht vollstaendig erstellt werden.");
  }

  return tokenMap;
};

export const finalizeSignedUpload = async (
  bucket: string,
  uploadId: string,
  inviteToken?: string | null,
  captchaToken?: string | null
): Promise<void> => {
  const { error } = await supabase.functions.invoke("create-user-upload-urls", {
    body: {
      action: "finalize",
      storageProvider: getPublicUploadSignedProvider(),
      bucket,
      uploadId,
      inviteToken: inviteToken ?? null,
      captchaToken: captchaToken ?? null,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
};

export type { SignedUploadFileDescriptor };
