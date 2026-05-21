import { useEffect, useState } from "react";
import { CAPTCHA_ENABLED_FOR_PUBLIC_UPLOADS } from "@/config/captcha";
import type {
  EmbeddedAudioFormState,
  RawAudioFileFormState,
} from "@/shared/types/videos";

interface UseRawUploadFormOptions {
  isAdmin: boolean;
}

export function useRawUploadForm({ isAdmin }: UseRawUploadFormOptions) {
  const [inviteGranted, setInviteGranted] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationSeconds, setDurationSeconds] = useState("");

  const [rawVideoFile, setRawVideoFile] = useState<File | null>(null);
  const [rawVideoContainsAudio, setRawVideoContainsAudio] = useState(false);
  const [rawVideoAudioMeta, setRawVideoAudioMeta] =
    useState<EmbeddedAudioFormState>({
      title: "",
      defaultVolume: "1",
      iconFile: null,
    });
  const [rawThumbnailFile, setRawThumbnailFile] = useState<File | null>(null);
  const [rawAudioFiles, setRawAudioFiles] = useState<RawAudioFileFormState[]>(
    [],
  );

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    const storedInviteToken =
      sessionStorage.getItem("upload-invite-token")?.trim() ?? "";

    const url = new URL(window.location.href);
    const inviteFromQuery = url.searchParams.get("invite")?.trim() ?? "";

    const hasStoredInvite = storedInviteToken.length > 0;
    const hasQueryInvite = inviteFromQuery.length > 0;

    if (hasQueryInvite) {
      sessionStorage.setItem("upload-invite-token", inviteFromQuery);
      setInviteToken(inviteFromQuery);
      url.searchParams.delete("invite");
      window.history.replaceState(
        {},
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
    } else if (hasStoredInvite) {
      setInviteToken(storedInviteToken);
    }

    setInviteGranted(hasStoredInvite || hasQueryInvite);
  }, []);

  const updateRawVideoAudioMeta = (
    updater: (current: EmbeddedAudioFormState) => EmbeddedAudioFormState,
  ) => {
    setRawVideoAudioMeta((previous) => updater(previous));
  };

  const updateRawAudio = (
    index: number,
    updater: (current: RawAudioFileFormState) => RawAudioFileFormState,
  ) => {
    setRawAudioFiles((previous) =>
      previous.map((audio, currentIndex) =>
        currentIndex === index ? updater(audio) : audio,
      ),
    );
  };

  const onRawAudioFileChange = (index: number, file: File | null) => {
    setRawAudioFiles((previous) => {
      if (!file) {
        if (index < 0 || index >= previous.length) {
          return previous;
        }

        return previous.filter((_, currentIndex) => currentIndex !== index);
      }

      const next = [...previous];
      if (index >= 0 && index < next.length) {
        next[index] = { ...next[index], file };
        return next;
      }

      const fileBaseName = file.name.replace(/\.[^.]+$/, "");
      next.push({
        file,
        title: fileBaseName,
        defaultVolume: "1",
        iconFile: null,
      } satisfies RawAudioFileFormState);

      return next;
    });
  };

  const resetUploadForm = () => {
    setTitle("");
    setDescription("");
    setDurationSeconds("");
    setRawVideoFile(null);
    setRawVideoContainsAudio(false);
    setRawVideoAudioMeta({
      title: "",
      defaultVolume: "1",
      iconFile: null,
    });
    setRawThumbnailFile(null);
    setRawAudioFiles([]);
    setConsentGiven(false);
    setCaptchaToken(null);
  };

  const canUploadWithInvite = !isAdmin && inviteGranted;
  const minRawAudioFiles = rawVideoContainsAudio ? 1 : 2;
  const hasRequiredRawMetadata =
    Boolean(title.trim()) && Boolean(description.trim());
  const hasRequiredRawAudios = rawAudioFiles.length >= minRawAudioFiles;
  const hasRequiredRawVideoAudioMetadata =
    !rawVideoContainsAudio || Boolean(rawVideoAudioMeta.title.trim());
  const hasRequiredRawAudioMetadata = rawAudioFiles.every(
    (audio) => audio.title.trim(),
  );
  const showCaptcha =
    canUploadWithInvite && CAPTCHA_ENABLED_FOR_PUBLIC_UPLOADS;
  const isRawUploadReady =
    hasRequiredRawMetadata &&
    Boolean(rawVideoFile) &&
    hasRequiredRawVideoAudioMetadata &&
    hasRequiredRawAudios &&
    hasRequiredRawAudioMetadata &&
    (!canUploadWithInvite || consentGiven) &&
    (!showCaptcha || Boolean(captchaToken));

  return {
    inviteGranted,
    inviteToken,
    title,
    setTitle,
    description,
    setDescription,
    durationSeconds,
    setDurationSeconds,
    rawVideoFile,
    setRawVideoFile,
    rawVideoContainsAudio,
    setRawVideoContainsAudio,
    rawVideoAudioMeta,
    rawThumbnailFile,
    setRawThumbnailFile,
    rawAudioFiles,
    captchaToken,
    setCaptchaToken,
    consentGiven,
    setConsentGiven,
    updateRawVideoAudioMeta,
    updateRawAudio,
    onRawAudioFileChange,
    resetUploadForm,
    canUploadWithInvite,
    minRawAudioFiles,
    hasRequiredRawMetadata,
    hasRequiredRawAudios,
    hasRequiredRawVideoAudioMetadata,
    hasRequiredRawAudioMetadata,
    showCaptcha,
    isRawUploadReady,
  };
}
