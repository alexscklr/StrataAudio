import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadVideo } from "@/shared/lib/videos";

interface UseCatalogUploadOptions {
  resetUploadForm: () => void;
}

export function useCatalogUpload({ resetUploadForm }: UseCatalogUploadOptions) {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: uploadVideo,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["video-management"] });
      void queryClient.invalidateQueries({ queryKey: ["video-catalog"] });
      resetUploadForm();
    },
  });

  const uploadErrorMessage =
    uploadMutation.error instanceof Error
      ? uploadMutation.error.message
      : null;

  return {
    uploadMutation,
    uploadErrorMessage,
    isUploading: uploadMutation.isPending,
  };
}
