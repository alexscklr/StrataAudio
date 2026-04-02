import { useQuery } from "@tanstack/react-query";
import { fetchVideoCatalogWithWatchStatus } from "@/shared/lib/videoCatalog";

export const useVideoCatalog = (participantId: string | null) => {
    return useQuery({
        queryKey: ['video-catalog', participantId],
        queryFn: () => fetchVideoCatalogWithWatchStatus(participantId),
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });
};