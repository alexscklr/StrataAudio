import { describe, it, expect, beforeEach, vi } from 'vitest';
import { supabase } from '@/api/supabaseClient';
import { fetchVideoCatalog, fetchVideoCatalogWithWatchStatus } from './videoCatalog';

// Mock Supabase client
vi.mock('@/api/supabaseClient', () => ({
    supabase: {
        from: vi.fn(),
    },
}));

// Mock mediaLocalization helpers
vi.mock('./mediaLocalization', () => ({
    localizedText: (de: string, en: string | null, locale: string) =>
        locale === 'en' && en ? en : de,
    localizedNullableText: (de: string | null, en: string | null, locale: string) =>
        locale === 'en' && en ? en : de ?? null,
    readRelation: (data: any) => (Array.isArray(data) && data.length > 0 ? data[0] : null),
    resolveLocale: () => 'de',
}));

const mockVideoRow = (overrides?: Record<string, any>) => ({
    id: 'video-1',
    created_at: '2025-06-01T00:00:00Z',
    hls_url: 'https://example.com/video.m3u8',
    thumbnail_url: 'https://example.com/thumb.jpg',
    is_mandatory: true,
    duration_seconds: 300,
    video_contents: [
        {
            title_de: 'Test Video',
            title_en: 'Test Video EN',
            description_de: 'Beschreibung',
            description_en: 'Description',
        },
    ],
    video_genres: [
        {
            label_de: 'Musik',
            label_en: 'Music',
        },
    ],
    ...overrides,
});

const mockSurveyResponseRow = (videoId: string) => ({
    video_id: videoId,
});

// Helper to build Supabase query chain mocks
const mockSupabaseQueryChain = (data: any, error: any = null) => ({
    select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data, error }),
    }),
});

const mockSupabaseQueryChainForSurvey = (data: any, error: any = null) => ({
    select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
            not: vi.fn().mockResolvedValue({ data, error }),
        }),
    }),
});

describe('videoCatalog', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('fetchVideoCatalog', () => {
        it('fetches and maps videos correctly', async () => {
            const mockData = [mockVideoRow()];

            (supabase.from as any).mockReturnValue(
                mockSupabaseQueryChain(mockData, null)
            );

            const result = await fetchVideoCatalog();

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                id: 'video-1',
                title: 'Test Video',
                description: 'Beschreibung',
                genre: 'Musik',
                is_mandatory: true,
            });
        });

        it('returns multiple videos ordered by created_at', async () => {
            const mockData = [
                mockVideoRow({ id: 'video-2', created_at: '2025-06-02T00:00:00Z' }),
                mockVideoRow({ id: 'video-1', created_at: '2025-06-01T00:00:00Z' }),
            ];

            (supabase.from as any).mockReturnValue(
                mockSupabaseQueryChain(mockData, null)
            );

            const result = await fetchVideoCatalog();

            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('video-2');
        });

        it('throws error on Supabase failure', async () => {
            const error = new Error('Database error');

            (supabase.from as any).mockReturnValue(
                mockSupabaseQueryChain(null, error)
            );

            await expect(fetchVideoCatalog()).rejects.toThrow('Database error');
        });

        it('handles videos with null relations gracefully', async () => {
            const mockData = [
                mockVideoRow({
                    video_contents: [],
                    video_genres: [],
                }),
            ];

            (supabase.from as any).mockReturnValue(
                mockSupabaseQueryChain(mockData, null)
            );

            const result = await fetchVideoCatalog();

            // When relations are empty, readRelation returns null, so localized fields are undefined
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('video-1');
        });
    });

    describe('fetchVideoCatalogWithWatchStatus', () => {
        it('adds watched status when participantId is provided', async () => {
            const videoCatalogData = [
                mockVideoRow({ id: 'video-1' }),
                mockVideoRow({ id: 'video-2' }),
            ];
            const watchedData = [mockSurveyResponseRow('video-1')];

            (supabase.from as any).mockImplementation((table: string) => {
                if (table === 'videos') {
                    return mockSupabaseQueryChain(videoCatalogData, null);
                } else if (table === 'survey_responses') {
                    return mockSupabaseQueryChainForSurvey(watchedData, null);
                }
            });

            const result = await fetchVideoCatalogWithWatchStatus('participant-1');

            expect(result).toHaveLength(2);
            expect(result[0]).toMatchObject({ id: 'video-1', watched: true });
            expect(result[1]).toMatchObject({ id: 'video-2', watched: false });
        });

        it('deduplicates watched video IDs', async () => {
            const videoCatalogData = [mockVideoRow({ id: 'video-1' })];
            const watchedData = [
                mockSurveyResponseRow('video-1'),
                mockSurveyResponseRow('video-1'),
                mockSurveyResponseRow('video-1'),
            ];

            (supabase.from as any).mockImplementation((table: string) => {
                if (table === 'videos') {
                    return mockSupabaseQueryChain(videoCatalogData, null);
                } else if (table === 'survey_responses') {
                    return mockSupabaseQueryChainForSurvey(watchedData, null);
                }
            });

            const result = await fetchVideoCatalogWithWatchStatus('participant-1');

            expect(result[0]).toMatchObject({ watched: true });
        });

        it('returns all videos as unwatched when participantId is null', async () => {
            const videoCatalogData = [
                mockVideoRow({ id: 'video-1' }),
                mockVideoRow({ id: 'video-2' }),
            ];

            (supabase.from as any).mockReturnValue(
                mockSupabaseQueryChain(videoCatalogData, null)
            );

            const result = await fetchVideoCatalogWithWatchStatus(null);

            expect(result).toHaveLength(2);
            expect(result.every((v) => v.watched === false)).toBe(true);
        });

        it('handles survey_responses query error gracefully', async () => {
            const videoCatalogData = [mockVideoRow()];
            const surveyError = new Error('Survey query failed');

            (supabase.from as any).mockImplementation((table: string) => {
                if (table === 'videos') {
                    return mockSupabaseQueryChain(videoCatalogData, null);
                } else if (table === 'survey_responses') {
                    return mockSupabaseQueryChainForSurvey(null, surveyError);
                }
            });

            await expect(fetchVideoCatalogWithWatchStatus('participant-1')).rejects.toThrow(
                'Survey query failed'
            );
        });
    });
});
