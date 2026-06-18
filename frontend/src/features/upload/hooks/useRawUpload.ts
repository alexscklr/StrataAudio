import { useMutation } from "@tanstack/react-query";
import { uploadRawSourcePackage } from "@/features/upload/lib/videoRawUpload";

interface UseRawUploadOptions {
  resetUploadForm: () => void;
}

export function useRawUpload({ resetUploadForm }: UseRawUploadOptions) {
  const rawUploadMutation = useMutation({
    mutationFn: uploadRawSourcePackage,
    onSuccess: () => {
      resetUploadForm();
    },
  });

  const rawUploadErrorMessage =
    rawUploadMutation.error instanceof Error
      ? rawUploadMutation.error.message
      : null;

  return {
    rawUploadMutation,
    rawUploadErrorMessage,
    isUploading: rawUploadMutation.isPending,
  };
}
