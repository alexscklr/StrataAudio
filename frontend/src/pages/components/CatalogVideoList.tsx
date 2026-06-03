import CatalogItem from "@/shared/components/CatalogItem/CatalogItem";
import type { CatalogItemStatus, VideoCatalogItem } from "@/shared/types/media";

interface CatalogVideoListProps {
  videos: VideoCatalogItem[];
  firstVisibleVideoId?: string;
  getStatus: (video: VideoCatalogItem) => CatalogItemStatus;
  listClassName: string;
  listItemClassName: string;
  emptyMessage: string;
  emptyClassName: string;
}

function CatalogVideoList({
  videos,
  firstVisibleVideoId,
  getStatus,
  listClassName,
  listItemClassName,
  emptyMessage,
  emptyClassName,
}: CatalogVideoListProps) {
  if (videos.length === 0) {
    return <p className={emptyClassName}>{emptyMessage}</p>;
  }

  return (
    <ul className={listClassName}>
      {videos.map((video) => (
        <li key={video.id} className={listItemClassName}>
          <CatalogItem
            thumbnailUrl={video.thumbnail_url}
            title={video.title}
            videoid={video.id}
            hlsUrl={video.hls_url}
            genre={video.genre}
            description={video.description || undefined}
            status={getStatus(video)}
            duration={video.duration_seconds ?? undefined}
            prioritizeImage={video.id === firstVisibleVideoId}
          />
        </li>
      ))}
    </ul>
  );
}

export default CatalogVideoList;
