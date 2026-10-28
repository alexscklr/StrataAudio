import { useRef } from "react";
import styles from "./SkipToVideopageModal.module.css";
import { useTranslation } from "react-i18next";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function SkipToVideopageModal() {
  const { t } = useTranslation();
  const popupRef = useRef<any>(null);

  const handleSkip = () => {
    window.location.href = "/videos";
  };

  return (
    <Popup
      ref={popupRef}
      open
      closeOnDocumentClick={false}
      modal
      overlayStyle={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      contentStyle={{
        width: "100%",
        maxWidth: "none",
        height: "100%",
        maxHeight: "none",
        padding: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none",
      }}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{t("consentPage.skipModal.title")}</h2>
        <p>{t("consentPage.skipModal.text")}</p>
        <div className={styles.btnRow}>
          <button onClick={handleSkip} className="primary">
            {t("consentPage.skipModal.button")}
          </button>
          <button
            className={styles.closeButton}
            onClick={() => popupRef.current.close()}
          >
            {t("consentPage.skipModal.cancelButton")}
          </button>
        </div>
      </div>
    </Popup>
  );
}
