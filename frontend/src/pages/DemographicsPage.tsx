import { Navigate } from 'react-router-dom';
import DemographicsSurvey from '@/features/analytics/components/DemographicsSurvey';
import { hasCompletedDemographics } from '@/features/analytics/utils/demographics';
import { useTranslation } from 'react-i18next';
import { PageMeta } from '@/shared/components/Seo/PageMeta';

function DemographicsPage() {
    const { t } = useTranslation();

    if (hasCompletedDemographics()) {
        return <Navigate to="/videos" replace />;
    }

    return (
        <>
            <PageMeta title={t('seo.demographics.title')} description={t('seo.demographics.description')} />
            <DemographicsSurvey />
        </>
    );
}

export default DemographicsPage;