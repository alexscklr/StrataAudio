import { supabase } from '@/api/supabaseClient';

const USER_HASH_STORAGE_KEY = 'user-hash';
const PARTICIPANT_ID_STORAGE_KEY = 'participant-id';
const PARTICIPANT_CREATED_STORAGE_KEY = 'participant-created';

interface BrowserInfo {
  browserName: string;
  browserVersion: string;
}

interface OsInfo {
  osName: string;
  osVersion: string;
}

export interface ClientEnvironmentInfo {
  browserName: string;
  browserVersion: string;
  osName: string;
  osVersion: string;
  screenWidth: number;
  screenHeight: number;
}

const parseBrowserInfo = (userAgent: string): BrowserInfo => {
  const normalizedUa = userAgent.toLowerCase();

  if (normalizedUa.includes('edg/')) {
    const version = /edg\/([\d.]+)/i.exec(userAgent)?.[1] ?? 'unknown';
    return { browserName: 'Edge', browserVersion: version };
  }

  if (normalizedUa.includes('chrome/') && !normalizedUa.includes('edg/')) {
    const version = /chrome\/([\d.]+)/i.exec(userAgent)?.[1] ?? 'unknown';
    return { browserName: 'Chrome', browserVersion: version };
  }

  if (normalizedUa.includes('firefox/')) {
    const version = /firefox\/([\d.]+)/i.exec(userAgent)?.[1] ?? 'unknown';
    return { browserName: 'Firefox', browserVersion: version };
  }

  if (normalizedUa.includes('safari/') && !normalizedUa.includes('chrome/')) {
    const version = /version\/([\d.]+)/i.exec(userAgent)?.[1] ?? 'unknown';
    return { browserName: 'Safari', browserVersion: version };
  }

  return { browserName: 'unknown', browserVersion: 'unknown' };
};

const parseOsInfo = (userAgent: string): OsInfo => {
  const windowsMatch = /Windows NT ([\d.]+)/i.exec(userAgent);
  if (windowsMatch) {
    return { osName: 'Windows', osVersion: windowsMatch[1] };
  }

  const macMatch = /Mac OS X ([\d_]+)/i.exec(userAgent);
  if (macMatch) {
    return { osName: 'macOS', osVersion: macMatch[1].replace(/_/g, '.') };
  }

  const androidMatch = /Android ([\d.]+)/i.exec(userAgent);
  if (androidMatch) {
    return { osName: 'Android', osVersion: androidMatch[1] };
  }

  const iosMatch = /OS ([\d_]+) like Mac OS X/i.exec(userAgent);
  if (iosMatch) {
    return { osName: 'iOS', osVersion: iosMatch[1].replace(/_/g, '.') };
  }

  if (/Linux/i.test(userAgent)) {
    return { osName: 'Linux', osVersion: 'unknown' };
  }

  return { osName: 'unknown', osVersion: 'unknown' };
};

const getOrCreateUserHash = (): string => {
  const storedUserHash = localStorage.getItem(USER_HASH_STORAGE_KEY);
  if (storedUserHash) return storedUserHash;

  const newUserHash = crypto.randomUUID();
  localStorage.setItem(USER_HASH_STORAGE_KEY, newUserHash);
  return newUserHash;
};

export const getStoredParticipantId = (): string | null => {
  return localStorage.getItem(PARTICIPANT_ID_STORAGE_KEY);
};

export const getStoredUserHash = (): string | null => {
  return localStorage.getItem(USER_HASH_STORAGE_KEY);
};

export const getClientEnvironmentInfo = (): ClientEnvironmentInfo => {
  const userAgent = navigator.userAgent;
  const { browserName, browserVersion } = parseBrowserInfo(userAgent);
  const { osName, osVersion } = parseOsInfo(userAgent);

  return {
    browserName,
    browserVersion,
    osName,
    osVersion,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
  };
};

export const ensureParticipantExists = async (): Promise<string> => {
  const storedParticipantId = getStoredParticipantId();
  const userHash = getOrCreateUserHash();
  const participantId = storedParticipantId ?? crypto.randomUUID();
  const environmentInfo = getClientEnvironmentInfo();

  const { error } = await supabase
    .from('participants')
    .insert({
      id: participantId,
      created_at: new Date().toISOString(),
      user_hash: userHash,
      browser_name: environmentInfo.browserName,
      browser_version: environmentInfo.browserVersion,
      os_name: environmentInfo.osName,
      os_version: environmentInfo.osVersion,
      screen_res_width: environmentInfo.screenWidth,
      screen_res_height: environmentInfo.screenHeight,
    });

  if (error) {
    // 23505 = unique_violation. If participant already exists, we can continue.
    if (error.code !== '23505') {
      // Keep hash in localStorage even when insert fails; next session can retry.
      throw error;
    }
  }

  localStorage.setItem(PARTICIPANT_ID_STORAGE_KEY, participantId);
  localStorage.setItem(PARTICIPANT_CREATED_STORAGE_KEY, 'true');
  return participantId;
};
