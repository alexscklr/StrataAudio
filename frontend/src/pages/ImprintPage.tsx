import mainPageStyles from "./styles/MainPageStyle.module.css";
import { useTranslation } from 'react-i18next';
import { PageMeta } from '@/shared/components/Seo/PageMeta';

function ImprintPage() {
    const { t } = useTranslation();

    return (
        <div className={`${mainPageStyles.pageCard} ${mainPageStyles.leftAlignedParagraphs}`}>
            <PageMeta title={t('imprintPage.metaTitle')} description={t('imprintPage.metaDescription')} />
            <h1>{t('imprintPage.title')}</h1>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{t('imprintPage.operator')}</h2>
                <p>
                    Alexander Sickler<br />
                    Nepomukstraße 76<br />
                    59556 Lippstadt<br />
                    Deutschland<br />
                    <a href="mailto:alexander.sickler@stud.hshl.de">alexander.sickler@stud.hshl.de</a>
                </p>
            </section>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{t('imprintPage.contentOwner')}</h2>
                <p>
                    Alexander Sickler<br />
                    Nepomukstraße 76<br />
                    59556 Lippstadt<br />
                    Deutschland<br />
                    <a href="mailto:alexander.sickler@stud.hshl.de">alexander.sickler@stud.hshl.de</a>
                </p>
            </section>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{t('imprintPage.liability')}</h2>
                <p>{t('imprintPage.liabilityText')}</p>
            </section>
        </div>
    );
}

export default ImprintPage;