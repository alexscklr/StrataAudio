import mainPageStyles from "./styles/MainPageStyle.module.css";

function ImprintPage() {

    return (
        <div className={`${mainPageStyles.pageCard} ${mainPageStyles.leftAlignedParagraphs}`}>
            <h1>Impressum</h1>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>Betreiber der Webseite</h2>
                <p>
                    Alexander Sickler<br />
                    Nepomukstraße 76<br />
                    59556 Lippstadt<br />
                    Deutschland<br />
                    <a href="mailto:alexander.sickler@stud.hshl.de">alexander.sickler@stud.hshl.de</a>
                </p>
            </section>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>Verantwortlicher für den Inhalt</h2>
                <p>
                    Alexander Sickler<br />
                    Nepomukstraße 76<br />
                    59556 Lippstadt<br />
                    Deutschland<br />
                    <a href="mailto:alexander.sickler@stud.hshl.de">alexander.sickler@stud.hshl.de</a>
                </p>
            </section>
            <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
                <h2>Haftungshinweis</h2>
                <p>
                    Diese Website wurde im Rahmen einer Bachelorarbeit an der Hochschule Hamm-Lippstadt (HSHL) erstellt.
                    Sie dient ausschließlich wissenschaftlichen Zwecken und verfolgt keine kommerziellen Interessen.
                    Trotz sorgfältiger inhaltlicher Kontrolle übernehme ich keine Haftung für die Inhalte externer Links.
                    Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
                </p>
            </section>
        </div>
    );
}

export default ImprintPage;