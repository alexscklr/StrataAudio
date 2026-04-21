
import mainPageStyles from "./styles/MainPageStyle.module.css";
import { useTranslation } from "react-i18next";
import { PageMeta } from "@/shared/components/Seo/PageMeta";

function PrivacyPolicyPage() {
  const { t } = useTranslation();
  const purposeList = t("privacyPolicyPage.purposeList", {
    returnObjects: true,
  }) as string[];
  const dataTypesList = t("privacyPolicyPage.dataTypesList", {
    returnObjects: true,
  }) as string[];
  const rightsList = t("privacyPolicyPage.rightsList", {
    returnObjects: true,
  }) as string[];

  return (
    <div
      className={`${mainPageStyles.pageCard} ${mainPageStyles.leftAlignedParagraphs} ${mainPageStyles.sectionCounter}`}
    >
      <PageMeta
        title={t("privacyPolicyPage.metaTitle")}
        description={t("privacyPolicyPage.metaDescription")}
      />
      <header className={mainPageStyles.pageSection}>
        <h1>{t("privacyPolicyPage.title")}</h1>
        <p>{t("privacyPolicyPage.intro")}</p>
        <p>{t("privacyPolicyPage.version")}</p>
      </header>

      <section
        className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}
      >
        <h2>{t("privacyPolicyPage.controllerTitle")}</h2>
        <p>
          Alexander Sickler
          <br />
          Nepomukstraße 76
          <br />
          59556 Lippstadt
          <br />
          E-Mail: alexander.sickler@stud.hshl.de
        </p>
      </section>

      <section
        className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}
      >
        <h2>{t("privacyPolicyPage.purposeTitle")}</h2>
        <p>{t("privacyPolicyPage.purposeText")}</p>
        <ul>
          {purposeList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          <strong>{t("privacyPolicyPage.legalBasisLabel")}</strong>{" "}
          {t("privacyPolicyPage.legalBasisText")}
        </p>
      </section>

      <section
        className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}
      >
        <h2>{t("privacyPolicyPage.dataTypesTitle")}</h2>
        <p>{t("privacyPolicyPage.dataTypesLead")}</p>
        <ul>
          {dataTypesList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>


      <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
        <h2>{t("privacyPolicyPage.retentionTitle")}</h2>
        <p>{t("privacyPolicyPage.hostingIntro")}</p>
        <ul className={mainPageStyles.providerList}>
          <li>
            <strong>{t("privacyPolicyPage.vercelLabel")}</strong> {t("privacyPolicyPage.vercelText")}{" "}
            <a href="https://vercel.com/legal/privacy" target="_blank" rel="noopener noreferrer">Vercel Privacy</a>
          </li>
          <li>
            <strong>{t("privacyPolicyPage.supabaseLabel")}</strong> {t("privacyPolicyPage.supabaseText")}{" "}
            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase Privacy</a>
          </li>
          <li>
            <strong>{t("privacyPolicyPage.cloudflareLabel")}</strong> {t("privacyPolicyPage.cloudflareText")}{" "}
            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">Cloudflare Privacy</a>
          </li>
        </ul>
        <p style={{ marginTop: "20px" }}>
          <strong>{t("privacyPolicyPage.retentionPeriodLabel")}</strong> {t("privacyPolicyPage.retentionPeriodText")}
        </p>
        <p>
          <strong>{t("privacyPolicyPage.withdrawalLabel")}</strong> {t("privacyPolicyPage.withdrawalText")}
        </p>
      </section>

      <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
        <h2>{t("privacyPolicyPage.cookiesTitle")}</h2>
        <p>{t("privacyPolicyPage.cookiesText")}</p>
      </section>


      <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
        <h2>{t("privacyPolicyPage.hcaptchaTitle")}</h2>
        <p>
          {t("privacyPolicyPage.hcaptchaText")}
          <a href={t("privacyPolicyPage.hcaptchaLinkText")} target="_blank" rel="noopener noreferrer">
            {t("privacyPolicyPage.hcaptchaLabel")}
          </a>
        </p>
      </section>

      <section className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}>
        <h2>{t("privacyPolicyPage.privacyNotesTitle")}</h2>
        <p>{t("privacyPolicyPage.privacyNotesText")}</p>
      </section>

      <section
        className={`${mainPageStyles.pageSection} ${mainPageStyles.sectionIndented}`}
      >
        <h2>{t("privacyPolicyPage.rightsTitle")}</h2>
        <p>{t("privacyPolicyPage.rightsLead")}</p>
        <ul>
          {rightsList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{t("privacyPolicyPage.rightsClosing")}</p>
      </section>
    </div>
  );
}

export default PrivacyPolicyPage;
