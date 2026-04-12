import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface PageMetaProps {
    title: string;
    description: string;
}

export function PageMeta({ title, description }: PageMetaProps) {
    const { i18n, t } = useTranslation();
    const locale = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'de';
    const siteName = t('seo.siteName');
    const pageTitle = title === siteName ? siteName : `${title} | ${siteName}`;

    return (
        <Helmet>
            <html lang={locale} />
            <title>{pageTitle}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={description} />
        </Helmet>
    );
}