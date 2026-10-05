import { SavedHandwriting, ThemeSettings, UserAccount } from '../types/kanji';

const STORAGE_KEYS = {
  USERS_LIST: 'kanjiviet_users_list_v2',
  ACTIVE_USER_ID: 'kanjiviet_active_user_id_v2',
};

const DEFAULT_SETTINGS: ThemeSettings = {
  themeId: 'sakura',
  fontSize: 'normal',
  kanjiFont: 'serif',
};

const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: 'user_sakura',
    username: 'sinhvien_a',
    displayName: 'Thanh Trúc (Nhật Bản Học)',
    avatar: '🌸',
    role: 'Sinh viên Chuyên ngành Dịch thuật',
    themeSettings: {
      themeId: 'sakura',
      fontSize: 'normal',
      kanjiFont: 'serif',
    },
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'user_jlpt_n2',
    username: 'jlpt_master',
    displayName: 'Quốc Huy (Ôn thi JLPT N2)',
    avatar: '🍵',
    role: 'Luyện thi N3 → N1',
    themeSettings: {
      themeId: 'matcha',
      fontSize: 'comfortable',
      kanjiFont: 'serif',
    },
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'user_wisteria',
    username: 'lan_anh',
    displayName: 'Lan Anh (Đọc báo Nihon)',
    avatar: '🪻',
    role: 'Dịch thuật Kinh tế - Xã hội',
    themeSettings: {
      themeId: 'hydrangea',
      fontSize: 'normal',
      kanjiFont: 'serif',
    },
    createdAt: Date.now() - 86400000 * 1,
  },
];

export function getAllAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const accounts = JSON.parse(raw);
    return accounts.length > 0 ? accounts : DEFAULT_ACCOUNTS;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

export function getActiveAccount(): UserAccount {
  const accounts = getAllAccounts();
  try {
    const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
    const matched = accounts.find((a) => a.id === activeId);
    if (matched) return matched;
  } catch {
    // fallback
  }
  // Default to first account
  const defaultAcc = accounts[0];
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, defaultAcc.id);
  } catch {
    // ignore
  }
  return defaultAcc;
}

export function setActiveAccount(userId: string): UserAccount {
  const accounts = getAllAccounts();
  const found = accounts.find((a) => a.id === userId);
  if (found) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, found.id);
    return found;
  }
  return accounts[0];
}

export function createAccount(data: {
  username: string;
  displayName: string;
  avatar: string;
  role?: string;
  themeId?: ThemeSettings['themeId'];
}): UserAccount {
  const accounts = getAllAccounts();
  const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
  const newAccount: UserAccount = {
    id,
    username: data.username.trim().toLowerCase(),
    displayName: data.displayName.trim() || data.username.trim(),
    avatar: data.avatar || '🌸',
    role: data.role || 'Người học Kanji',
    themeSettings: {
      ...DEFAULT_SETTINGS,
      themeId: data.themeId || 'sakura',
    },
    createdAt: Date.now(),
  };

  const updated = [...accounts, newAccount];
  localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(updated));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, newAccount.id);
  return newAccount;
}

export function updateAccountSettings(
  userId: string,
  settings: Partial<ThemeSettings>
): UserAccount {
  const accounts = getAllAccounts();
  const index = accounts.findIndex((a) => a.id === userId);
  if (index >= 0) {
    accounts[index].themeSettings = {
      ...accounts[index].themeSettings,
      ...settings,
    };
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(accounts));
    return accounts[index];
  }
  return getActiveAccount();
}

export function deleteAccount(userId: string): UserAccount {
  const accounts = getAllAccounts();
  if (accounts.length <= 1) {
    // Cannot delete the only account
    return accounts[0];
  }
  const updated = accounts.filter((a) => a.id !== userId);
  localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(updated));
  return setActiveAccount(updated[0].id);
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
