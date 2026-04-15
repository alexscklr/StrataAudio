import mainPageStyles from "./styles/MainPageStyle.module.css";
import { useTranslation } from 'react-i18next';
import { PageMeta } from '@/shared/components/Seo/PageMeta';

function PrivacyPolicyPage() {
    const { t } = useTranslation();
    const purposeList = t('privacyPolicyPage.purposeList', { returnObjects: true }) as string[];
    const dataTypesList = t('privacyPolicyPage.dataTypesList', { returnObjects: true }) as string[];
    const rightsList = t('privacyPolicyPage.rightsList', { returnObjects: true }) as string[];

    return (
        <div className={`${mainPageStyles.pageCard} ${mainPageStyles.leftAlignedParagraphs} ${mainPageStyles.sectionCounter}`}>
            <PageMeta title={t('privacyPolicyPage.metaTitle')} description={t('privacyPolicyPage.metaDescription')} />
            <header className={mainPageStyles.pageSection}>
                <h1>{t('privacyPolicyPage.title')}</h1>
                <p>{t('privacyPolicyPage.intro')}</p>
                <p>{t('privacyPolicyPage.version')}</p>
            </header>

            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{t('privacyPolicyPage.controllerTitle')}</h2>
                <p>
                    Alexander Sickler<br />
                    Nepomukstraße 76<br />
                    59556 Lippstadt<br />
                    E-Mail: alexander.sickler@stud.hshl.de
                </p>
            </section>

            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{t('privacyPolicyPage.purposeTitle')}</h2>
                <p>{t('privacyPolicyPage.purposeText')}</p>
                <ul>
                    {purposeList.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
                <p>
                    <strong>{t('privacyPolicyPage.legalBasisLabel')}</strong> {t('privacyPolicyPage.legalBasisText')}
                </p>
            </section>

            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{t('privacyPolicyPage.dataTypesTitle')}</h2>
                <p>{t('privacyPolicyPage.dataTypesLead')}</p>
                <ul>
                    {dataTypesList.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            </section>

            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{t('privacyPolicyPage.retentionTitle')}</h2>
                <p>
                    <strong>{t('privacyPolicyPage.hostingLabel')}</strong> {t('privacyPolicyPage.hostingTextPrefix')}
                    <strong> Supabase, Inc.</strong> {t('privacyPolicyPage.hostingTextSuffix')}
                    <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
                        https://supabase.com/privacy
                    </a>.
                </p>
                <p>
                    <strong>{t('privacyPolicyPage.retentionPeriodLabel')}</strong> {t('privacyPolicyPage.retentionPeriodText')}
                </p>
                <p>
                    <strong>{t('privacyPolicyPage.withdrawalLabel')}</strong> {t('privacyPolicyPage.withdrawalText')}
                </p>
            </section>

            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{t('privacyPolicyPage.rightsTitle')}</h2>
                <p>{t('privacyPolicyPage.rightsLead')}</p>
                <ul>
                    {rightsList.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
                <p>{t('privacyPolicyPage.rightsClosing')}</p>
            </section>
        </div>
    );
}

export default PrivacyPolicyPage;