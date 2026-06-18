import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createUploadInvite } from "@/features/auth/lib/uploadInvites";
import { deleteVideo } from "@/features/upload/lib/videoDeletion";
import { fetchManagedVideos } from "@/features/upload/lib/videoManagement";

export function useAdminVideos() {
  const queryClient = useQueryClient();
  const [createdInviteLink, setCreatedInviteLink] = useState<string | null>(
    null,
  );
  const [inviteLabel, setInviteLabel] = useState("");
  const [inviteExpiresHours, setInviteExpiresHours] = useState("72");
  const [inviteMaxUses, setInviteMaxUses] = useState("1");

  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ["video-management"],
    queryFn: fetchManagedVideos,
    staleTime: 1000 * 30,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVideo,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["video-management"] });
      void queryClient.invalidateQueries({ queryKey: ["video-catalog"] });
    },
  });

  const createInviteMutation = useMutation({
    mutationFn: createUploadInvite,
    onSuccess: (result) => {
      const inviteUrl = new URL(window.location.href);
      inviteUrl.pathname = "/upload";
      inviteUrl.search = "";
      inviteUrl.searchParams.set("invite", result.token);
      setCreatedInviteLink(inviteUrl.toString());
    },
  });

  const deleteErrorMessage =
    deleteMutation.error instanceof Error
      ? deleteMutation.error.message
      : null;
  const createInviteErrorMessage =
    createInviteMutation.error instanceof Error
      ? createInviteMutation.error.message
      : null;

  const copyInviteLink = async () => {
    if (!createdInviteLink || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(createdInviteLink);
  };

  const createInvite = () => {
    const parsedExpiresHours = Number(inviteExpiresHours);
    const parsedMaxUses = Number(inviteMaxUses);

    createInviteMutation.mutate({
      label: inviteLabel,
      expiresInHours:
        Number.isFinite(parsedExpiresHours) && parsedExpiresHours > 0
          ? parsedExpiresHours
          : 72,
      maxUses:
        Number.isFinite(parsedMaxUses) && parsedMaxUses > 0 ? parsedMaxUses : 1,
    });
  };

  return {
    videos,
    isLoading,
    error,
    deleteMutation,
    createInviteMutation,
    createdInviteLink,
    deleteErrorMessage,
    createInviteErrorMessage,
    copyInviteLink,
    inviteLabel,
    inviteExpiresHours,
    inviteMaxUses,
    setInviteLabel,
    setInviteExpiresHours,
    setInviteMaxUses,
    createInvite,
  };
}
