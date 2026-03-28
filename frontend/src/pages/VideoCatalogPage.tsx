import { useVideoCatalog } from "@/shared/hooks/useVideoCatalog";
import styles from "./styles/VideoCatalogPage.module.css";
import CatalogItem from "@/shared/components/CatalogItem/CatalogItem";
import { Link } from "react-router-dom";
import { getPublicUrl } from "@/shared/utils/storage";



function VideoCatalogPage() {
    const { data: videoCatalog, isLoading, error } = useVideoCatalog();
    

    return (
        <>
            <section className={styles.catalogSection}>
                {isLoading && <p>Loading...</p>}
                {error && <p>Error loading video catalog: {error.message}</p>}
                {videoCatalog && (
                    <ul className={styles.catalogList}>
                        {videoCatalog.map((video) => (
                            <li key={video.id} className={styles.catalogListItem}>
                                <Link to={`/videos/${video.id}`} state={{ videoUrl: getPublicUrl(`${video.id}/${video.hls_url}`, "videos") }}>
                                    <CatalogItem>
                                        {video.thumbnail_url && (
                                            <img src={getPublicUrl(`${video.id}/${video.thumbnail_url}`, "videos")} alt={`${video.title} thumbnail`} className={styles.thumbnail} />
                                        )}
                                        <h2 className={styles.catalogTitle}>{video.title}</h2>
                                        {video.description && (<p className={styles.catalogDescription}>{(video.description.length > 100) ? video.description.substring(0, 100) + "..." : video.description}</p>)}
                                    </CatalogItem>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </>
    );
}

export default VideoCatalogPage;