// hCaptcha configuration
// Set this to your hCaptcha Site Key
export const HCAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY ?? '';

// Enable CAPTCHA for public uploads (via invite)
// When true, users uploading via invite will be required to complete CAPTCHA
export const CAPTCHA_ENABLED_FOR_PUBLIC_UPLOADS = true;
