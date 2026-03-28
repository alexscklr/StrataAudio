import { useQuery } from '@tanstack/react-query';
import { fetchAudioDetails } from '../lib/audio';

export function useAudio(videoId: string) {
    return useQuery({
        queryKey: ['audio', videoId],
        queryFn: () => fetchAudioDetails(videoId),
        enabled: !!videoId,
        staleTime: 1000 * 60 * 10,
    });
}