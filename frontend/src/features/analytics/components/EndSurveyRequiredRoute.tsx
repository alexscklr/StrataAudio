import { useContext, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/features/auth/context/AuthContext';
import { useVideoCatalog } from '@/shared/hooks/useVideoCatalog';

interface EndSurveyRequiredRouteProps {
    children: ReactNode;
}

function EndSurveyRequiredRoute({ children }: EndSurveyRequiredRouteProps) {
    const { participantId } = useContext(AuthContext);
    const { data: catalog, isLoading } = useVideoCatalog(participantId);

    if (isLoading) {
        return null;
    }

    const mandatoryVideos = (catalog ?? []).filter((video) => video.is_mandatory);
    const mandatoryTotal = mandatoryVideos.length;
    const mandatoryWatched = mandatoryVideos.filter((video) => video.watched).length;
    const isUnlocked = mandatoryTotal === 0 || mandatoryWatched === mandatoryTotal;

    if (!isUnlocked) {
        return <Navigate to="/videos" replace />;
    }

    return children;
}

export default EndSurveyRequiredRoute;
