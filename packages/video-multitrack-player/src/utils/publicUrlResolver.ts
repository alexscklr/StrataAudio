export type PlayerStorageBucket = 'videos' | 'system' | string;

export type ResolvePublicUrl = (path: string, bucket?: PlayerStorageBucket) => string;

export const passthroughPublicUrlResolver: ResolvePublicUrl = (path) => path;