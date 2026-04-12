import mainPageStyles from "./styles/MainPageStyle.module.css";
import { useTranslation } from 'react-i18next';
import { PageMeta } from '@/shared/components/Seo/PageMeta';

function ImprintPage() {
    const { i18n } = useTranslation();
    const isEn = i18n.resolvedLanguage?.startsWith('en');

    const copy = isEn
        ? {
            title: 'Imprint',
            operator: 'Website operator',
            contentOwner: 'Responsible for content',
            liability: 'Liability notice',
            liabilityText: 'This website was created as part of a bachelor thesis at Hamm-Lippstadt University of Applied Sciences (HSHL). It is intended exclusively for scientific purposes and does not pursue commercial interests. Despite careful content control, I accept no liability for the content of external links. The operators of linked pages are solely responsible for their content.',
        }
        : {
            title: 'Impressum',
            operator: 'Betreiber der Webseite',
            contentOwner: 'Verantwortlicher fuer den Inhalt',
            liability: 'Haftungshinweis',
            liabilityText: 'Diese Website wurde im Rahmen einer Bachelorarbeit an der Hochschule Hamm-Lippstadt (HSHL) erstellt. Sie dient ausschliesslich wissenschaftlichen Zwecken und verfolgt keine kommerziellen Interessen. Trotz sorgfaeltiger inhaltlicher Kontrolle uebernehme ich keine Haftung fuer die Inhalte externer Links. Fuer den Inhalt der verlinkten Seiten sind ausschliesslich deren Betreiber verantwortlich.',
        };

    return (
        <div className={`${mainPageStyles.pageCard} ${mainPageStyles.leftAlignedParagraphs}`}>
            <PageMeta title={isEn ? 'Imprint' : 'Impressum'} description={isEn ? 'Legal notice and contact details for the StrataAudio research web application.' : 'Rechtliche Angaben und Kontaktdaten zur Forschungs-Webanwendung StrataAudio.'} />
            <h1>{copy.title}</h1>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{copy.operator}</h2>
                <p>
                    Alexander Sickler<br />
                    Nepomukstraße 76<br />
                    59556 Lippstadt<br />
                    Deutschland<br />
                    <a href="mailto:alexander.sickler@stud.hshl.de">alexander.sickler@stud.hshl.de</a>
                </p>
            </section>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{copy.contentOwner}</h2>
                <p>
                    Alexander Sickler<br />
                    Nepomukstraße 76<br />
                    59556 Lippstadt<br />
                    Deutschland<br />
                    <a href="mailto:alexander.sickler@stud.hshl.de">alexander.sickler@stud.hshl.de</a>
                </p>
            </section>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>{copy.liability}</h2>
                <p>{copy.liabilityText}</p>
            </section>
        </div>
    );
}

export default ImprintPage;