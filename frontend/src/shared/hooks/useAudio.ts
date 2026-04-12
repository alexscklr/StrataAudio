import { useQuery } from '@tanstack/react-query';
import { fetchAudioDetails } from '../lib/audio';
import { useTranslation } from 'react-i18next';

export function useAudio(videoId: string) {
    const { i18n } = useTranslation();
    const language = i18n.resolvedLanguage ?? i18n.language;

    return useQuery({
        queryKey: ['audio', videoId, language],
        queryFn: () => fetchAudioDetails(videoId),
        enabled: !!videoId,
        staleTime: 1000 * 60 * 10,
    });
}