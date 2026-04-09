import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { hasCompletedDemographics } from '../utils/demographics';

interface DemographicsRequiredRouteProps {
    children: ReactNode;
}

function DemographicsRequiredRoute({ children }: DemographicsRequiredRouteProps) {
    if (!hasCompletedDemographics()) {
        return <Navigate to="/demografie" replace />;
    }

    return children;
}

export default DemographicsRequiredRoute;