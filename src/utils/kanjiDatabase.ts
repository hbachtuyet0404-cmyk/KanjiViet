import { CompoundWord, FavoriteEntry, KanjiDetail, SearchHistoryEntry, SearchResult } from '../types/kanji';
import { CURATED_COMPOUNDS } from '../data/curatedCompounds';
import { CURATED_KANJI } from '../data/curatedKanji';
import { JOYO_HAN_VIET_MAP } from '../data/joyoHanVietMap';
import { getActiveAccount } from './accountManager';

function getUserKey(prefix: string, userId?: string): string {
  const uid = userId || getActiveAccount().id;
  return `kanjiviet_${uid}_${prefix}`;
}

// Remove Vietnamese accents for loose matching
export function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

// Check if a character is Kanji
export function isKanjiChar(char: string): boolean {
  return /[\u4e00-\u9faf\u3400-\u4dbf]/.test(char);
}

// Extract all Kanji characters from a string
export function extractKanjiCharacters(text: string): string[] {
  const matches = text.match(/[\u4e00-\u9faf\u3400-\u4dbf]/g);
  return matches ? Array.from(new Set(matches)) : [];
}

// Search History per user
export function getSavedHistory(userId?: string): SearchHistoryEntry[] {
  try {
    const raw = localStorage.getItem(getUserKey('history', userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSearchHistory(
  entry: Omit<SearchHistoryEntry, 'id' | 'timestamp'>,
  userId?: string
): SearchHistoryEntry[] {
  try {
    const history = getSavedHistory(userId);
    const filtered = history.filter((h) => h.query.toLowerCase() !== entry.query.toLowerCase());
    const newEntry: SearchHistoryEntry = {
      ...entry,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
    };
    const updated = [newEntry, ...filtered].slice(0, 30);
    localStorage.setItem(getUserKey('history', userId), JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function deleteHistoryItem(id: string, userId?: string): SearchHistoryEntry[] {
  try {
    const history = getSavedHistory(userId);
    const updated = history.filter((h) => h.id !== id);
    localStorage.setItem(getUserKey('history', userId), JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearSearchHistory(userId?: string): void {
  try {
    localStorage.removeItem(getUserKey('history', userId));
  } catch {
    // ignore
  }
}

// Favorites per user
export function getFavorites(userId?: string): FavoriteEntry[] {
  try {
    const raw = localStorage.getItem(getUserKey('favorites', userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(
  item: {
    word: string;
    reading: string;
    hanViet: string;
    meaning: string;
    jlpt?: string;
    note?: string;
  },
  userId?: string
): { favorites: FavoriteEntry[]; isSaved: boolean } {
  try {
    const favs = getFavorites(userId);
    const existingIndex = favs.findIndex((f) => f.word === item.word);
    if (existingIndex >= 0) {
      favs.splice(existingIndex, 1);
      localStorage.setItem(getUserKey('favorites', userId), JSON.stringify(favs));
      return { favorites: favs, isSaved: false };
    } else {
      const newFav: FavoriteEntry = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        word: item.word,
        reading: item.reading,
        hanViet: item.hanViet,
        meaning: item.meaning,
        jlpt: item.jlpt,
        note: item.note || '',
        savedAt: Date.now(),
      };
      const updated = [newFav, ...favs];
      localStorage.setItem(getUserKey('favorites', userId), JSON.stringify(updated));
      return { favorites: updated, isSaved: true };
    }
  } catch {
    return { favorites: [], isSaved: false };
  }
}

export function updateFavoriteNote(id: string, note: string, userId?: string): FavoriteEntry[] {
  try {
    const favs = getFavorites(userId);
    const index = favs.findIndex((f) => f.id === id);
    if (index >= 0) {
      favs[index].note = note;
      localStorage.setItem(getUserKey('favorites', userId), JSON.stringify(favs));
    }
    return favs;
  } catch {
    return [];
  }
}

// Custom data expansion per user
export function getCustomKanji(userId?: string): Record<string, KanjiDetail> {
  try {
    const raw = localStorage.getItem(getUserKey('custom_kanji', userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCustomKanji(kanji: KanjiDetail, userId?: string): void {
  try {
    const existing = getCustomKanji(userId);
    existing[kanji.kanji] = { ...kanji, isCustom: true };
    localStorage.setItem(getUserKey('custom_kanji', userId), JSON.stringify(existing));
  } catch {
    // ignore
  }
}

export function deleteCustomKanji(kanjiChar: string, userId?: string): void {
  try {
    const existing = getCustomKanji(userId);
    delete existing[kanjiChar];
    localStorage.setItem(getUserKey('custom_kanji', userId), JSON.stringify(existing));
  } catch {
    // ignore
  }
}

export function getCustomCompounds(userId?: string): CompoundWord[] {
  try {
    const raw = localStorage.getItem(getUserKey('custom_compounds', userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomCompound(compound: CompoundWord, userId?: string): void {
  try {
    const existing = getCustomCompounds(userId);
    const filtered = existing.filter((c) => c.word !== compound.word);
    const updated = [{ ...compound, isCustom: true }, ...filtered];
    localStorage.setItem(getUserKey('custom_compounds', userId), JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function deleteCustomCompound(word: string, userId?: string): void {
  try {
    const existing = getCustomCompounds(userId);
    const updated = existing.filter((c) => c.word !== word);
    localStorage.setItem(getUserKey('custom_compounds', userId), JSON.stringify(updated));
  } catch {
    // ignore
  }
}

// Export & Import entire personal database per user
export function exportPersonalDatabase(userId?: string): string {
  const uid = userId || getActiveAccount().id;
  const data = {
    version: 2,
    userId: uid,
    exportedAt: new Date().toISOString(),
    customCompounds: getCustomCompounds(uid),
    customKanji: getCustomKanji(uid),
    favorites: getFavorites(uid),
    history: getSavedHistory(uid),
  };
  return JSON.stringify(data, null, 2);
}

export function importPersonalDatabase(jsonString: string, userId?: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonString);
    const uid = userId || getActiveAccount().id;
    if (parsed.customCompounds && Array.isArray(parsed.customCompounds)) {
      localStorage.setItem(getUserKey('custom_compounds', uid), JSON.stringify(parsed.customCompounds));
    }
    if (parsed.customKanji && typeof parsed.customKanji === 'object') {
      localStorage.setItem(getUserKey('custom_kanji', uid), JSON.stringify(parsed.customKanji));
    }
    if (parsed.favorites && Array.isArray(parsed.favorites)) {
      localStorage.setItem(getUserKey('favorites', uid), JSON.stringify(parsed.favorites));
    }
    return { success: true, message: 'Nhập dữ liệu thành công vào tài khoản hiện tại!' };
  } catch {
    return { success: false, message: 'File JSON không hợp lệ hoặc dữ liệu bị lỗi.' };
  }
}

// Export printable study sheets (HTML preview/print)
export function exportStudySheetHTML(compounds: CompoundWord[], title = 'Danh sách Hán tự'): void {
  const rows = compounds
    .map(
      (c) => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 10px; font-size: 24px; font-weight: bold; font-family: serif; color: #111827;">${c.word}</td>
      <td style="padding: 10px; font-size: 14px; color: #4b5563;">${c.reading || '—'}</td>
      <td style="padding: 10px; font-size: 15px; font-weight: bold; color: #b91c1c;">${c.hanViet}</td>
      <td style="padding: 10px; font-size: 14px; color: #1f2937;">${c.meaning}</td>
      <td style="padding: 10px; font-size: 12px; color: #6b7280;">${c.jlpt} · ${c.category}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="utf-8">
      <title>${title} - KanjiViet</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; padding: 30px; color: #111; }
        h1 { margin-bottom: 5px; font-size: 20px; }
        p { color: #666; font-size: 13px; margin-top: 0; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th { background: #f3f4f6; padding: 10px; font-size: 12px; text-transform: uppercase; color: #374151; }
        @media print { button { display: none; } }
      </style>
    </head>
    <body>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1>${title}</h1>
          <p>Tài liệu học tập xuất từ KanjiViet · Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}</p>
        </div>
        <button onclick="window.print()" style="padding: 8px 16px; background: #b91c1c; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">In tài liệu / Lưu PDF</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Từ Kanji</th>
            <th>Cách đọc</th>
            <th>Âm Hán Việt</th>
            <th>Ý nghĩa</th>
            <th>Cấp độ</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (!win) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `kanjiviet_studysheet_${Date.now()}.html`;
    a.click();
  }
}

// Get all active compounds (curated + user custom)
export function getAllCompounds(userId?: string): CompoundWord[] {
  const custom = getCustomCompounds(userId);
  const customWords = new Set(custom.map((c) => c.word));
  const filteredCurated = CURATED_COMPOUNDS.filter((c) => !customWords.has(c.word));
  return [...custom, ...filteredCurated];
}

// Get a single Kanji detail from all sources
export function getKanjiDetail(kanjiChar: string, userId?: string): KanjiDetail {
  const custom = getCustomKanji(userId);
  if (custom[kanjiChar]) return custom[kanjiChar];
  if (CURATED_KANJI[kanjiChar]) return CURATED_KANJI[kanjiChar];

  const joyo = JOYO_HAN_VIET_MAP[kanjiChar];
  if (joyo) {
    return {
      kanji: kanjiChar,
      hanViet: joyo.hv,
      meaning: joyo.m,
      on: joyo.on || [],
      kun: joyo.kun || [],
      radical: joyo.radical || 'Chưa rõ',
      radicalMeaning: 'Thành phần cấu tạo',
      strokeCount: joyo.strokes || 1,
      jlpt: joyo.jlpt || 'N3',
      mnemonic: joyo.mnemonic || `Hán tự [${kanjiChar}], âm Hán Việt là [${joyo.hv}], mang nghĩa cốt lõi: ${joyo.m}.`,
      compounds: [],
    };
  }

  // Fallback for uncommon or CJK kanji
  return {
    kanji: kanjiChar,
    hanViet: 'HÁN TỰ',
    meaning: 'Ký tự Hán tự tiếng Nhật',
    on: [],
    kun: [],
    radical: 'Bộ thủ',
    radicalMeaning: 'Thành phần cấu tạo',
    strokeCount: 1,
    jlpt: 'N1',
    mnemonic: `Ký tự Kanji [${kanjiChar}]. Bạn có thể chỉnh sửa và bổ sung âm Hán Việt trong mục Khai thác dữ liệu.`,
    compounds: [],
  };
}

// The core instant search parser
export function parseKanjiQuery(query: string, userId?: string): SearchResult {
  const clean = query.trim();
  const allCompounds = getAllCompounds(userId);

  if (!clean) {
    const defaultCompound = allCompounds[0] || CURATED_COMPOUNDS[0];
    const kanjis = extractKanjiCharacters(defaultCompound.word);
    return {
      query: defaultCompound.word,
      matchedCompound: defaultCompound,
      compoundHanViet: defaultCompound.hanViet,
      kanjiList: kanjis.map((k) => getKanjiDetail(k, userId)),
      otherMatchingCompounds: allCompounds.slice(1, 5),
    };
  }

  const queryKanjiChars = extractKanjiCharacters(clean);

  // 1. Direct Japanese Compound match
  const exactCompound = allCompounds.find((c) => c.word === clean);
  if (exactCompound) {
    const kanjiList = extractKanjiCharacters(exactCompound.word).map((k) => getKanjiDetail(k, userId));
    const related = allCompounds
      .filter((c) => c.word !== exactCompound.word && kanjiList.some((k) => c.word.includes(k.kanji)))
      .slice(0, 6);
    return {
      query: clean,
      matchedCompound: exactCompound,
      compoundHanViet: exactCompound.hanViet,
      kanjiList,
      otherMatchingCompounds: related,
    };
  }

  // 2. Input contains Kanji characters (e.g. "持続可能", "曖昧", "日本の経済")
  if (queryKanjiChars.length > 0) {
    const partialCompound = allCompounds.find((c) => clean.includes(c.word) || c.word.includes(clean));
    const kanjiList = queryKanjiChars.map((k) => getKanjiDetail(k, userId));
    const combinedHanViet = kanjiList.map((k) => k.hanViet).join(' ');

    const related = allCompounds
      .filter((c) => c.word !== partialCompound?.word && queryKanjiChars.some((k) => c.word.includes(k)))
      .slice(0, 6);

    return {
      query: clean,
      matchedCompound: partialCompound || {
        word: clean,
        reading: '',
        romaji: '',
        hanViet: combinedHanViet,
        meaning: `Tập hợp gồm ${kanjiList.length} chữ Hán cấu thành: ${kanjiList.map((k) => `${k.kanji} (${k.hanViet})`).join(' + ')}`,
        jlpt: kanjiList.some((k) => k.jlpt === 'N1') ? 'N1' : kanjiList.some((k) => k.jlpt === 'N2') ? 'N2' : 'N3',
        category: 'Từ vựng phân tích',
      },
      compoundHanViet: combinedHanViet,
      kanjiList,
      otherMatchingCompounds: related,
    };
  }

  // 3. Search by Sino-Vietnamese (Hán Việt) or Romaji or Reading
  const normalizedQuery = removeVietnameseAccents(clean);

  // Check compound words matching Hán Việt or reading/romaji
  const matchingCompounds = allCompounds.filter((c) => {
    const normHv = removeVietnameseAccents(c.hanViet);
    const normMeaning = removeVietnameseAccents(c.meaning);
    const normRomaji = c.romaji.toLowerCase();
    const normReading = c.reading;
    return (
      normHv.includes(normalizedQuery) ||
      normRomaji.includes(normalizedQuery) ||
      normReading.includes(clean) ||
      normMeaning.includes(normalizedQuery)
    );
  });

  // Check Joyo & Curated Kanji matching Hán Việt or meaning
  const matchingKanjiChars: string[] = [];

  // Check custom kanji first
  const customKanjiMap = getCustomKanji(userId);
  for (const [char, detail] of Object.entries(customKanjiMap)) {
    if (
      removeVietnameseAccents(detail.hanViet).includes(normalizedQuery) ||
      removeVietnameseAccents(detail.meaning).includes(normalizedQuery)
    ) {
      if (!matchingKanjiChars.includes(char)) matchingKanjiChars.push(char);
    }
  }

  // Check curated kanji
  for (const [char, detail] of Object.entries(CURATED_KANJI)) {
    if (
      removeVietnameseAccents(detail.hanViet).includes(normalizedQuery) ||
      removeVietnameseAccents(detail.meaning).includes(normalizedQuery)
    ) {
      if (!matchingKanjiChars.includes(char)) matchingKanjiChars.push(char);
    }
  }

  // Check Joyo map
  for (const [char, info] of Object.entries(JOYO_HAN_VIET_MAP)) {
    if (
      removeVietnameseAccents(info.hv).includes(normalizedQuery) ||
      removeVietnameseAccents(info.m).includes(normalizedQuery)
    ) {
      if (!matchingKanjiChars.includes(char)) matchingKanjiChars.push(char);
    }
  }

  if (matchingCompounds.length > 0) {
    const topCompound = matchingCompounds[0];
    const kanjiList = extractKanjiCharacters(topCompound.word).map((k) => getKanjiDetail(k, userId));
    return {
      query: clean,
      matchedCompound: topCompound,
      compoundHanViet: topCompound.hanViet,
      kanjiList,
      otherMatchingCompounds: matchingCompounds.slice(1, 7),
    };
  }

  if (matchingKanjiChars.length > 0) {
    const kanjiList = matchingKanjiChars.slice(0, 8).map((k) => getKanjiDetail(k, userId));
    const topKanji = kanjiList[0];
    return {
      query: clean,
      matchedCompound: {
        word: topKanji.kanji,
        reading: topKanji.on[0] || topKanji.kun[0] || '',
        romaji: '',
        hanViet: topKanji.hanViet,
        meaning: topKanji.meaning,
        jlpt: topKanji.jlpt,
        category: 'Hán tự đơn lẻ',
      },
      compoundHanViet: topKanji.hanViet,
      kanjiList,
      otherMatchingCompounds: [],
    };
  }

  // No match found
  return {
    query: clean,
    matchedCompound: undefined,
    compoundHanViet: '',
    kanjiList: [],
    otherMatchingCompounds: [],
  };
}

// Copy formatting for academic note taking / Anki
export function formatBreakdownForCopy(result: SearchResult): string {
  const { matchedCompound, compoundHanViet, kanjiList } = result;
  const word = matchedCompound?.word || result.query;
  const reading = matchedCompound?.reading ? `(${matchedCompound.reading})` : '';
  const meaning = matchedCompound?.meaning || '';

  const kanjiBreakdown = kanjiList
    .map((k) => `• ${k.kanji}【${k.hanViet}】: ${k.meaning} (On: ${k.on.join(', ') || '-'} | Kun: ${k.kun.join(', ') || '-'})`)
    .join('\n');

  return `【${word}】${reading}\nÂm Hán Việt: ${compoundHanViet || matchedCompound?.hanViet || ''}\nÝ nghĩa: ${meaning}\n\n[Phân tích thành tố Hán tự]:\n${kanjiBreakdown}`;
}

// Speech synthesis
export function speakJapanese(text: string): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}
