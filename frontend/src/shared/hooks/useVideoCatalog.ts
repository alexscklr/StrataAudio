import { useQuery } from "@tanstack/react-query";
import { fetchVideoCatalog } from "@/shared/lib/videoCatalog";

export const useVideoCatalog = () => {
    return useQuery({
        queryKey: ['video-catalog'],
        queryFn: fetchVideoCatalog,
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });
};