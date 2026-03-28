import { useQuery } from '@tanstack/react-query';
import { fetchVideoDetails } from '../lib/video';

export function useVideo(videoId: string) {
    return useQuery({
        queryKey: ['video', videoId],
        queryFn: () => fetchVideoDetails(videoId),
        enabled: !!videoId,
        staleTime: 1000 * 60 * 10,
    });
}