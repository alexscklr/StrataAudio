import { fetchVideoCatalog } from "@/shared/lib/videoCatalog";
import type { Video } from "@/shared/types/media";

export const fetchManagedVideos = async (): Promise<Video[]> => fetchVideoCatalog();
