import { useQuery } from "@tanstack/react-query";
import { fetchVideoCatalogWithWatchStatus } from "@/shared/lib/videoCatalog";
import { useTranslation } from 'react-i18next';

export const useVideoCatalog = (participantId: string | null) => {
    const { i18n } = useTranslation();
    const language = i18n.resolvedLanguage ?? i18n.language;

    return useQuery({
        queryKey: ['video-catalog', participantId, language],
        queryFn: () => fetchVideoCatalogWithWatchStatus(participantId),
        staleTime: 1000 * 60 * 5,
        retry: 2,
    });
};