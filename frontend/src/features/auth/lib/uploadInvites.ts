import { supabase } from "@/api/supabaseClient";
import type {
  CreateUploadInviteInput,
  CreateUploadInviteResult,
} from "@/features/upload/lib/videoUploadTypes";

const getAdminAccessToken = async (): Promise<string> => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();
  const currentSession = refreshedData.session ?? sessionData.session;

  if (refreshError && !currentSession) {
    throw new Error("Admin-Session abgelaufen. Bitte neu einloggen.");
  }

  const accessToken = currentSession?.access_token;
  if (!accessToken) {
    throw new Error("Nicht eingeloggt. Bitte als Admin anmelden.");
  }

  return accessToken;
};

export const createUploadInvite = async (
  input: CreateUploadInviteInput
): Promise<CreateUploadInviteResult> => {
  const accessToken = await getAdminAccessToken();
  supabase.functions.setAuth(accessToken);

  const { data, error } = await supabase.functions.invoke("create-upload-invite", {
    body: {
      label: input.label?.trim() || null,
      expiresInHours: input.expiresInHours,
      maxUses: input.maxUses,
    },
  });

  if (error) {
    if (error.message.includes("401")) {
      throw new Error("Nicht autorisiert. Bitte erneut als Admin einloggen.");
    }

    if (error.message.includes("403")) {
      throw new Error("Kein Zugriff. Dein Account ist nicht fuer Upload-Invites freigeschaltet.");
    }

    throw new Error(error.message);
  }

  const parsed = data as Partial<CreateUploadInviteResult> | null;
  if (!parsed?.token || !parsed?.expiresAt || typeof parsed.maxUses !== "number") {
    throw new Error("Ungueltige Antwort beim Erstellen des Upload-Invites.");
  }

  return {
    token: parsed.token,
    expiresAt: parsed.expiresAt,
    maxUses: parsed.maxUses,
    label: parsed.label ?? null,
  };
};
