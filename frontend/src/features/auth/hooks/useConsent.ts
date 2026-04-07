import { useEffect, useState } from 'react';

export const useConsent = () => {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem('user-consent') === 'true';
    setHasConsent(consent);
  }, []);

  return hasConsent;
};
