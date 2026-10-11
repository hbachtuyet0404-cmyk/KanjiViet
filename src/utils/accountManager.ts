import { SavedHandwriting, ThemeSettings, UserAccount } from '../types/kanji';

const STORAGE_KEYS = {
  CURRENT_USER: 'kanjiviet_current_google_user_v3',
  OLD_USERS_LIST: 'kanjiviet_users_list_v2',
  OLD_ACTIVE_USER: 'kanjiviet_active_user_id_v2',
};

// Cleanup old mock data on boot
try {
  localStorage.removeItem(STORAGE_KEYS.OLD_USERS_LIST);
  localStorage.removeItem(STORAGE_KEYS.OLD_ACTIVE_USER);
} catch {
  // ignore
}

export const DEFAULT_SETTINGS: ThemeSettings = {
  themeId: 'sakura',
  fontSize: 'normal',
  kanjiFont: 'serif',
};

export const GUEST_ACCOUNT: UserAccount = {
  id: 'guest',
  username: 'khach',
  displayName: 'Khách (Chưa đăng nhập)',
  avatar: '👤',
  isGoogleUser: false,
  role: 'Khách vãng lai',
  themeSettings: DEFAULT_SETTINGS,
  createdAt: 0,
};

/**
 * Returns the currently authenticated Google account, or guest if not logged in.
 */
export function getActiveAccount(): UserAccount {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) {
      const parsed: UserAccount = JSON.parse(raw);
      if (parsed && parsed.id && parsed.isGoogleUser) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return GUEST_ACCOUNT;
}

/**
 * Login with a user's own Google account.
 */
export function loginWithGoogleAccount(data: {
  email: string;
  displayName: string;
  photoUrl?: string;
  role?: string;
}): UserAccount {
  const cleanEmail = data.email.trim().toLowerCase();
  const username = cleanEmail.split('@')[0];
  const id = `google_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;

  const currentTheme = getActiveAccount().themeSettings || DEFAULT_SETTINGS;

  const user: UserAccount = {
    id,
    email: cleanEmail,
    username,
    displayName: data.displayName.trim() || username,
    avatar: '🌐',
    photoUrl: data.photoUrl || '',
    isGoogleUser: true,
    role: data.role || 'Tài khoản Google',
    themeSettings: currentTheme,
    createdAt: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (err) {
    console.error('Failed to save Google account', err);
  }
  return user;
}

/**
 * Logout the user, restoring guest state.
 */
export function logoutAccount(): UserAccount {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (err) {
    console.error('Failed to logout', err);
  }
  return GUEST_ACCOUNT;
}

/**
 * Update theme or font settings for the active user.
 */
export function updateAccountSettings(
  userId: string,
  settings: Partial<ThemeSettings>
): UserAccount {
  const current = getActiveAccount();
  const updated: UserAccount = {
    ...current,
    themeSettings: {
      ...current.themeSettings,
      ...settings,
    },
  };

  try {
    if (updated.isGoogleUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
    }
  } catch {
    // ignore
  }
  return updated;
}

/**
 * Backward compatibility helpers
 */
export function getAllAccounts(): UserAccount[] {
  const active = getActiveAccount();
  return active.isGoogleUser ? [active] : [];
}

export function setActiveAccount(userId: string): UserAccount {
  return getActiveAccount();
}

export function createAccount(data: {
  username: string;
  displayName: string;
  avatar: string;
  role?: string;
  themeId?: ThemeSettings['themeId'];
}): UserAccount {
  return loginWithGoogleAccount({
    email: `${data.username}@gmail.com`,
    displayName: data.displayName,
    role: data.role,
  });
}

export function deleteAccount(userId: string): UserAccount {
  return logoutAccount();
}

// User-scoped handwriting saves
export function getUserHandwriting(userId: string): SavedHandwriting[] {
  try {
    const raw = localStorage.getItem(`kanjiviet_hw_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUserHandwriting(
  userId: string,
  kanji: string,
  hanViet: string,
  dataUrl: string
): SavedHandwriting[] {
  try {
    const list = getUserHandwriting(userId);
    const newEntry: SavedHandwriting = {
      id: `hw_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      kanji,
      hanViet,
      dataUrl,
      createdAt: Date.now(),
    };
    const updated = [newEntry, ...list].slice(0, 30);
    localStorage.setItem(`kanjiviet_hw_${userId}`, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function deleteUserHandwriting(userId: string, id: string): SavedHandwriting[] {
  try {
    const list = getUserHandwriting(userId);
    const updated = list.filter((item) => item.id !== id);
    localStorage.setItem(`kanjiviet_hw_${userId}`, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

// User-scoped custom Kanji Practice Queue
export function getUserPracticeQueue(userId: string): string[] {
  try {
    const raw = localStorage.getItem(`kanjiviet_${userId}_practice_queue`);
    return raw ? JSON.parse(raw) : ['経', '済', '学', '曖', '昧', '持', '続', '能', '国', '語'];
  } catch {
    return ['経', '済', '学', '曖', '昧', '持', '続', '能', '国', '語'];
  }
}

export function addToUserPracticeQueue(userId: string, kanjiChars: string[]): string[] {
  try {
    const existing = getUserPracticeQueue(userId);
    const set = new Set(existing);
    kanjiChars.forEach((c) => {
      if (c && c.trim()) set.add(c.trim());
    });
    const updated = Array.from(set);
    localStorage.setItem(`kanjiviet_${userId}_practice_queue`, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function removeFromUserPracticeQueue(userId: string, kanjiChar: string): string[] {
  try {
    const existing = getUserPracticeQueue(userId);
    const updated = existing.filter((c) => c !== kanjiChar);
    localStorage.setItem(`kanjiviet_${userId}_practice_queue`, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}
