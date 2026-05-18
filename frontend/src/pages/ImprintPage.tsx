import mainPageStyles from "./styles/MainPageStyle.module.css";
import { useTranslation } from "react-i18next";
import { PageMeta } from "@/shared/components/Seo/PageMeta";
import { useEffect, useState } from "react";
import { getPublicUrl } from "@/shared/utils/storage";
import type { IconAttribution } from "@/shared/types/media";
import { fetchIconAttributions } from "@/shared/lib/icons";

function ImprintPage() {
  const { t } = useTranslation();
  const [icons, setIcons] = useState<IconAttribution[]>([]);
  const [iconLoadError, setIconLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadIconAttributions = async () => {
      try {
        const data = await fetchIconAttributions();
        setIconLoadError(null);
        setIcons(data);
      } catch (error) {
        setIconLoadError(
          error instanceof Error ? error.message : String(error),
        );
        return;
      }
    };

    void loadIconAttributions();
  }, []);

  return (
    <div
      className={`${mainPageStyles.pageCard} ${mainPageStyles.leftAlignedParagraphs}`}
    >
      <PageMeta
        title={t("imprintPage.metaTitle")}
        description={t("imprintPage.metaDescription")}
      />
      <h1>{t("imprintPage.title")}</h1>
      <section
        className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}
      >
        <h2>{t("imprintPage.operator")}</h2>
        <p>
          Alexander Sickler
          <br />
          Nepomukstraße 76
          <br />
          59556 Lippstadt
          <br />
          Deutschland
          <br />
          <a href="mailto:alexander.sickler@stud.hshl.de">
            alexander.sickler@stud.hshl.de
          </a>
        </p>
      </section>
      <section
        className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}
      >
        <h2>{t("imprintPage.contentOwner")}</h2>
        <p>
          Alexander Sickler
          <br />
          Nepomukstraße 76
          <br />
          59556 Lippstadt
          <br />
          Deutschland
          <br />
          <a href="mailto:alexander.sickler@stud.hshl.de">
            alexander.sickler@stud.hshl.de
          </a>
        </p>
      </section>
      <section
        className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}
      >
        <h2>{t("imprintPage.liability")}</h2>
        <p>{t("imprintPage.liabilityText")}</p>
      </section>
      <section
        className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}
      >
        <h2>{t("imprintPage.iconCreditsTitle")}</h2>
        <p>{t("imprintPage.iconCreditsText")}</p>
        {iconLoadError && (
          <p>
            {t("imprintPage.iconCreditsLoadError", { message: iconLoadError })}
          </p>
        )}
        {!iconLoadError && icons.length === 0 && (
          <p>{t("imprintPage.iconCreditsEmpty")}</p>
        )}
        {!iconLoadError && icons.length > 0 && (
          <div className={mainPageStyles.tableWrapper}>
            <table className={mainPageStyles.dataTable}>
              <thead>
                <tr>
                  <th>{t("imprintPage.iconHeader")}</th>
                  <th>{t("imprintPage.sourceHeader")}</th>
                  <th>{t("imprintPage.authorHeader")}</th>
                </tr>
              </thead>
              <tbody>
                {icons.map((icon) => (
                  <tr key={icon.id}>
                    <td>
                      <div className={mainPageStyles.iconAttributionCell}>
                        <img
                          src={getPublicUrl(
                            `icons/${icon.file_name}`,
                            "system",
                          )}
                          alt={icon.file_name}
                          width={28}
                          height={28}
                        />
                        <span>{icon.file_name}</span>
                      </div>
                    </td>
                    <td>
                      {icon.source_url ? (
                        <a
                          href={icon.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {icon.source_name}
                        </a>
                      ) : (
                        icon.source_name
                      )}
                    </td>
                    <td>
                      {icon.author_url ? (
                        <a
                          href={icon.author_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {icon.author_name}
                        </a>
                      ) : (
                        icon.author_name
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default ImprintPage;
