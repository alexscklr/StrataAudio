import { useQuery } from '@tanstack/react-query';
import { fetchVideoDetails } from '../lib/video';
import { useTranslation } from 'react-i18next';

export function useVideo(videoId: string) {
    const { i18n } = useTranslation();
    const language = i18n.resolvedLanguage ?? i18n.language;

    return useQuery({
        queryKey: ['video', videoId, language],
        queryFn: () => fetchVideoDetails(videoId),
        enabled: !!videoId,
        staleTime: 1000 * 60 * 10,
    });
}