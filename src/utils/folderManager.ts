import { UserPracticeFolder } from '../types/kanji';

const DEFAULT_FOLDERS: Record<string, UserPracticeFolder[]> = {
  default: [
    {
      id: 'folder_n5_n4',
      name: 'Từ vựng N5-N4 Nền tảng',
      icon: '📁',
      description: 'Các từ vựng và chữ Hán cơ bản nhất trong đời sống học tập',
      words: ['学', '国', '語', '漢', '字', '先生', '日本', '友達', '家族', '勉強', '時間', '学校'],
      createdAt: Date.now() - 86400000 * 5,
    },
    {
      id: 'folder_economy_n2',
      name: 'Kinh tế & Xã hội N3-N2',
      icon: '💼',
      description: 'Chuyên đề thời sự, doanh nghiệp, thương mại và thuật ngữ báo chí',
      words: ['経済', '曖昧', '持続', '可能', '企業', '貿易', '発展', '政策', '市場', '投資', '労働', '経営'],
      createdAt: Date.now() - 86400000 * 3,
    },
    {
      id: 'folder_nature_seasons',
      name: 'Bốn mùa & Văn hóa Nhật',
      icon: '🏮',
      description: 'Chữ Hán về thiên nhiên, phong cảnh và nét đẹp văn hóa xứ Phù Tang',
      words: ['桜', '花火', '紅葉', '雪景色', '富士山', '森林', '温泉', '太陽', '季節', '風情'],
      createdAt: Date.now() - 86400000 * 1,
    },
  ],
};

function getStorageKey(userId: string): string {
  return `kanjiviet_folders_${userId}`;
}

export function getUserFolders(userId: string): UserPracticeFolder[] {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) {
      const initial = DEFAULT_FOLDERS.default;
      localStorage.setItem(getStorageKey(userId), JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_FOLDERS.default;
  } catch {
    return DEFAULT_FOLDERS.default;
  }
}

export function createFolder(
  userId: string,
  name: string,
  icon: string = '📁',
  description: string = '',
  initialWords: string[] = []
): UserPracticeFolder {
  const current = getUserFolders(userId);
  const newFolder: UserPracticeFolder = {
    id: `f_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    name: name.trim() || 'Thư mục mới',
    icon: icon || '📁',
    description: description.trim(),
    words: Array.from(new Set(initialWords.filter((w) => Boolean(w && w.trim())))),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const updated = [newFolder, ...current];
  localStorage.setItem(getStorageKey(userId), JSON.stringify(updated));
  return newFolder;
}

export function updateFolder(
  userId: string,
  folderId: string,
  updates: Partial<Omit<UserPracticeFolder, 'id' | 'createdAt'>>
): UserPracticeFolder[] {
  const current = getUserFolders(userId);
  const updated = current.map((f) => {
    if (f.id === folderId) {
      return {
        ...f,
        ...updates,
        updatedAt: Date.now(),
      };
    }
    return f;
  });
  localStorage.setItem(getStorageKey(userId), JSON.stringify(updated));
  return updated;
}

export function deleteFolder(userId: string, folderId: string): UserPracticeFolder[] {
  const current = getUserFolders(userId);
  const updated = current.filter((f) => f.id !== folderId);
  localStorage.setItem(getStorageKey(userId), JSON.stringify(updated));
  return updated;
}

export function addWordsToFolder(userId: string, folderId: string, words: string[]): UserPracticeFolder[] {
  const current = getUserFolders(userId);
  const updated = current.map((f) => {
    if (f.id === folderId) {
      const merged = Array.from(new Set([...f.words, ...words.filter((w) => Boolean(w && w.trim()))]));
      return {
        ...f,
        words: merged,
        updatedAt: Date.now(),
      };
    }
    return f;
  });
  localStorage.setItem(getStorageKey(userId), JSON.stringify(updated));
  return updated;
}

export function removeWordFromFolder(userId: string, folderId: string, word: string): UserPracticeFolder[] {
  const current = getUserFolders(userId);
  const updated = current.map((f) => {
    if (f.id === folderId) {
      return {
        ...f,
        words: f.words.filter((w) => w !== word),
        updatedAt: Date.now(),
      };
    }
    return f;
  });
  localStorage.setItem(getStorageKey(userId), JSON.stringify(updated));
  return updated;
}
