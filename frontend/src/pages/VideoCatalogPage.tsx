import { useVideoCatalog } from "@/shared/hooks/useVideoCatalog";
import styles from "./styles/VideoCatalogPage.module.css";
import CatalogItem from "@/shared/components/CatalogItem/CatalogItem";
import { useContext } from "react";
import { AuthContext } from "@/features/auth/context/AuthContext";



function VideoCatalogPage() {
    const { participantId } = useContext(AuthContext);
    const { data: videoCatalog, isLoading, error } = useVideoCatalog(participantId);


    return (
        <section className={styles.catalogSection}>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error loading video catalog: {error.message}</p>}
            {videoCatalog && (
                <ul className={styles.catalogList}>
                    {videoCatalog.map((video) => (
                        <li key={video.id} className={styles.catalogListItem}>
                            <CatalogItem
                                thumbnailUrl={video.thumbnail_url}
                                title={video.title}
                                videoid={video.id}
                                hlsUrl={video.hls_url}
                                genre={video.genre}
                                description={video.description || undefined}
                                watched={video.watched}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default VideoCatalogPage;