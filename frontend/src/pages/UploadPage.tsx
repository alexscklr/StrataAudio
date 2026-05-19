import { useTranslation } from "react-i18next";
import { PageMeta } from "@/shared/components/Seo/PageMeta";
import mainPageStyles from "./styles/MainPageStyle.module.css";
import { RawUploadSection } from "@/features/upload/components/RawUploadSection";

function UploadPage() {
  const { t } = useTranslation();

  return (
    <section className={mainPageStyles.pageGrid}>
      <PageMeta
        title={t("seo.videoManagement.title")}
        description={t("seo.videoManagement.description")}
      />
      <RawUploadSection />
    </section>
  );
}

export default UploadPage;
