import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useRef } from 'react';
import styles from '@/pages/styles/ManagementPage.module.css';

interface CaptchaWidgetProps {
  siteKey: string;
  onTokenChange: (token: string | null) => void;
  isVisible: boolean;
}

export function CaptchaWidget({ siteKey, onTokenChange, isVisible }: CaptchaWidgetProps) {
  const captchaRef = useRef<HCaptcha>(null);

  if (!isVisible || !siteKey) {
    return null;
  }

  const handleCaptchaChange = (token: string | null) => {
    onTokenChange(token);
  };

  const handleExpire = () => {
    onTokenChange(null);
  };

  return (
    <div className={styles.fullWidth} style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
      <HCaptcha
        ref={captchaRef}
        sitekey={siteKey}
        onVerify={handleCaptchaChange}
        onExpire={handleExpire}
        theme="light"
      />
    </div>
  );
}
