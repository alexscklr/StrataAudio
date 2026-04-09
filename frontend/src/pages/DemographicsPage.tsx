import { Navigate } from 'react-router-dom';
import DemographicsSurvey from '@/features/analytics/components/DemographicsSurvey';
import { hasCompletedDemographics } from '@/features/analytics/utils/demographics';

function DemographicsPage() {
    if (hasCompletedDemographics()) {
        return <Navigate to="/videos" replace />;
    }

    return <DemographicsSurvey />;
}

export default DemographicsPage;