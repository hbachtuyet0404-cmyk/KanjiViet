import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  Trash2,
  Volume2,
  Download,
  Search,
  Edit3,
  Check,
  FileText,
  ArrowRight,
  Sparkles,
  BookOpen,
  GraduationCap,
  Plus,
  PenTool,
  CheckCircle2,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { FavoriteEntry, UserAccount } from '../types/kanji';
import { speakJapanese } from '../utils/kanjiDatabase';
import { ThemeConfig } from '../utils/themeManager';
import {
  ALL_CURRICULUM_KANJI,
  CurriculumKanji,
  JLPT_LEVEL_COUNTS,
  JLPT_N1_KANJI,
  JLPT_N2_KANJI,
  JLPT_N3_KANJI,
  JLPT_N4_KANJI,
  JLPT_N5_KANJI,
} from '../data/jlptKanjiCurriculum';

interface FavoritesViewProps {
  favorites: FavoriteEntry[];
  onRemoveFavorite: (word: string) => void;
  onUpdateNote: (id: string, note: string) => void;
  onSelectWord: (word: string) => void;
  onAddFavorite?: (item: { word: string; reading: string; hanViet: string; meaning: string; jlpt?: string }) => void;
  theme: ThemeConfig;
  user: UserAccount;
  onToast?: (msg: string) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onRemoveFavorite,
  onUpdateNote,
  onSelectWord,
  onAddFavorite,
  theme,
  user,
  onToast,
}) => {
  // Main view tab: 'my_saves' (Sổ tay của tôi) or 'jlpt_curriculum' (Gợi ý theo năng lực)
  const [activeTab, setActiveTab] = useState<'my_saves' | 'jlpt_curriculum'>('my_saves');

  // Search & filter for personal saves
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJlpt, setSelectedJlpt] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState('');

  // Curriculum state (N5: 100, N4: 200, N3: 500, N2: 500, N1: 700)
  const [curriculumLevel, setCurriculumLevel] = useState<'all' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('all');
  const [curriculumSearch, setCurriculumSearch] = useState('');
  const [displayLimit, setDisplayLimit] = useState(60);

  // Check which words are already saved in favorites
  const savedWordsSet = useMemo(() => new Set(favorites.map((f) => f.word)), [favorites]);

  // Filter personal saves
  const filteredFavorites = useMemo(() => {
    return favorites.filter((fav) => {
      const matchesSearch =
        fav.word.includes(searchTerm) ||
        fav.hanViet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (fav.note && fav.note.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesJlpt = selectedJlpt === 'all' || fav.jlpt === selectedJlpt;
      return matchesSearch && matchesJlpt;
    });
  }, [favorites, searchTerm, selectedJlpt]);

  // Filter curriculum kanji
  const rawCurriculumList = useMemo(() => {
    if (curriculumLevel === 'N5') return JLPT_N5_KANJI;
    if (curriculumLevel === 'N4') return JLPT_N4_KANJI;
    if (curriculumLevel === 'N3') return JLPT_N3_KANJI;
    if (curriculumLevel === 'N2') return JLPT_N2_KANJI;
    if (curriculumLevel === 'N1') return JLPT_N1_KANJI;
    return ALL_CURRICULUM_KANJI;
  }, [curriculumLevel]);

  const filteredCurriculum = useMemo(() => {
    const q = curriculumSearch.trim().toLowerCase();
    if (!q) return rawCurriculumList;

    return rawCurriculumList.filter((item) => {
      return (
        item.kanji.includes(q) ||
        item.hanViet.toLowerCase().includes(q) ||
        item.meaning.toLowerCase().includes(q) ||
        item.on.some((r) => r.toLowerCase().includes(q)) ||
        item.kun.some((r) => r.toLowerCase().includes(q))
      );
    });
  }, [rawCurriculumList, curriculumSearch]);

  const visibleCurriculum = useMemo(() => {
    return filteredCurriculum.slice(0, displayLimit);
  }, [filteredCurriculum, displayLimit]);

  const handleStartEdit = (fav: FavoriteEntry) => {
    setEditingId(fav.id);
    setEditNoteText(fav.note || '');
  };

  const handleSaveNote = (id: string) => {
    onUpdateNote(id, editNoteText.trim());
    setEditingId(null);
  };

  const handleQuickSaveCurriculum = (item: CurriculumKanji) => {
    if (savedWordsSet.has(item.kanji)) {
      onRemoveFavorite(item.kanji);
      onToast?.(`Đã bỏ lưu chữ [${item.kanji}] khỏi sổ tay`);
    } else {
      const reading = item.kun[0] || item.on[0] || '';
      onAddFavorite?.({
        word: item.kanji,
        reading,
        hanViet: item.hanViet,
        meaning: item.meaning,
        jlpt: item.jlpt,
      });
      onToast?.(`Đã lưu chữ [${item.kanji} - ${item.hanViet}] vào sổ tay của ${user.displayName}!`);
    }
  };

  const exportToAnki = () => {
    if (favorites.length === 0) return;
    const content = favorites
      .map((f) => `${f.word}\t${f.reading}\t${f.hanViet}\t${f.meaning}\t${f.note || ''}`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/tab-separated-values;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kanjiviet_${user.username}_anki_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToMarkdown = () => {
    if (favorites.length === 0) return;
    let md = `# Sổ tay Hán tự của ${user.displayName} (${favorites.length} từ)\n\n`;
    md += `| Từ Kanji | Cách đọc | Âm Hán Việt | Ý nghĩa | Ghi chú cá nhân |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;
    favorites.forEach((f) => {
      md += `| **${f.word}** | ${f.reading || '-'} | **${f.hanViet}** | ${f.meaning} | ${f.note || '-'} |\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kanjiviet_${user.username}_notebook_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation Segmented Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-rose-600" />
            <span>Sổ Tay & Kho Kanji Năng Lực</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Gồm sổ tay cá nhân của <strong>{user.isGoogleUser ? user.email : user.displayName}</strong> và kho 2000 chữ Kanji gợi ý chuẩn JLPT (N5: 100, N4: 200, N3: 500, N2: 500, N1: 700).
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200 shrink-0">
          <button
            onClick={() => setActiveTab('my_saves')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'my_saves'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-rose-600" />
            <span>Sổ tay của tôi ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('jlpt_curriculum')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'jlpt_curriculum'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kanji theo năng lực ({JLPT_LEVEL_COUNTS.TOTAL})</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: SỔ TAY CÁ NHÂN (MY SAVES)                                    */}
      {/* =================================================================== */}
      {activeTab === 'my_saves' && (
        <div className="space-y-5 animate-fade-in">
          {/* Controls: Search, JLPT filter, Export */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm trong sổ tay theo Kanji, Hán Việt, hoặc ý nghĩa..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* JLPT Filter */}
              <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200">
                {['all', 'N1', 'N2', 'N3', 'N4', 'N5'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedJlpt(lvl)}
                    className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors ${
                      selectedJlpt === lvl
                        ? 'bg-white text-stone-900 shadow-2xs font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {lvl === 'all' ? 'Tất cả' : lvl}
                  </button>
                ))}
              </div>

              {/* Export Buttons */}
              {favorites.length > 0 && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={exportToAnki}
                    className="p-2 sm:px-3 sm:py-1.5 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 border border-stone-200 shadow-2xs"
                    title="Xuất file Anki (.txt)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Anki</span>
                  </button>
                  <button
                    onClick={exportToMarkdown}
                    className="p-2 sm:px-3 sm:py-1.5 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 border border-stone-200 shadow-2xs"
                    title="Xuất Markdown"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Markdown</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          {filteredFavorites.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-500 space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-3xl bg-stone-100 flex items-center justify-center mx-auto text-2xl">
                🔖
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-stone-800">
                  {favorites.length === 0
                    ? `Sổ tay của ${user.displayName} hiện chưa có từ nào.`
                    : 'Không tìm thấy từ nào phù hợp với bộ lọc.'}
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Bạn có thể lưu các từ khi tra cứu hoặc chọn nhanh các chữ từ mục <strong>&quot;Kanji theo năng lực&quot;</strong> bên cạnh!
                </p>
              </div>
              <button
                onClick={() => setActiveTab('jlpt_curriculum')}
                className={`px-4 py-2 ${theme.primaryBg} text-white rounded-xl text-xs font-bold shadow-xs hover:opacity-95 transition-opacity inline-flex items-center gap-1.5`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Xem 2000 Kanji gợi ý theo năng lực JLPT</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFavorites.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border ${theme.borderSubtle} shadow-2xs p-5 hover:shadow-xs transition-all flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-3xl font-kanji font-bold text-stone-900 tracking-wide">
                            {item.word}
                          </h3>
                          <button
                            onClick={() => speakJapanese(item.word)}
                            title="Nghe phát âm"
                            className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        {item.reading && (
                          <p className="text-xs text-stone-500">{item.reading}</p>
                        )}

                        <div className="pt-1 flex items-center gap-2">
                          <span className={`text-xs uppercase tracking-wider font-bold ${theme.badgeText} ${theme.badgeBg} px-2 py-0.5 rounded border ${theme.badgeBorder}`}>
                            {item.hanViet}
                          </span>
                          {item.jlpt && (
                            <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-1.5 py-0.2 rounded">
                              {item.jlpt}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onSelectWord(item.word)}
                          title="Phân tích chi tiết thành tố Hán tự"
                          className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemoveFavorite(item.word)}
                          title="Xóa khỏi sổ tay"
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-stone-800 font-medium">
                      {item.meaning}
                    </div>

                    {/* Personal Study Notes */}
                    <div className={`mt-3 pt-3 border-t ${theme.borderSubtle}`}>
                      {editingId === item.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editNoteText}
                            onChange={(e) => setEditNoteText(e.target.value)}
                            placeholder="Ghi chú thêm về từ này (ngữ cảnh sử dụng, lưu ý khi dịch)..."
                            rows={2}
                            className="w-full text-xs p-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2 py-1 text-xs text-stone-500 hover:text-stone-800 rounded"
                            >
                              Hủy
                            </button>
                            <button
                              onClick={() => handleSaveNote(item.id)}
                              className={`px-2.5 py-1 text-xs ${theme.primaryBg} text-white rounded font-medium flex items-center gap-1`}
                            >
                              <Check className="w-3 h-3" />
                              <span>Lưu ghi chú</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2 text-xs text-stone-500">
                          <div className="italic">
                            {item.note ? (
                              <span className="text-stone-700 not-italic">
                                Ghi chú: {item.note}
                              </span>
                            ) : (
                              <span className="text-stone-400">Chưa có ghi chú cá nhân</span>
                            )}
                          </div>
                          <button
                            onClick={() => handleStartEdit(item)}
                            title="Chỉnh sửa ghi chú"
                            className="text-stone-400 hover:text-stone-800 p-1 rounded"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: KHO KANJI GỢI Ý THEO NĂNG LỰC (JLPT CURRICULUM)              */}
      {/* N5: 100 chữ | N4: 200 chữ | N3: 500 chữ | N2: 500 chữ | N1: 700 chữ */}
      {/* =================================================================== */}
      {activeTab === 'jlpt_curriculum' && (
        <div className="space-y-5 animate-fade-in">
          {/* Banner & Level Picker */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  <span>Kho Kanji Gợi Ý Chuẩn Theo Năng Lực JLPT</span>
                  <span className="text-xs font-mono-numbers px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                    {JLPT_LEVEL_COUNTS.TOTAL} Chữ
                  </span>
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Được phân bổ chuẩn theo 5 cấp độ: <strong>N5 (100 chữ)</strong>, <strong>N4 (200 chữ)</strong>, <strong>N3 (500 chữ)</strong>, <strong>N2 (500 chữ)</strong>, <strong>N1 (700 chữ)</strong>.
                </p>
              </div>

              <div className="text-xs text-stone-500 font-medium">
                Đã lưu vào sổ tay: <strong className="text-emerald-700 font-mono-numbers">{savedWordsSet.size}</strong> từ
              </div>
            </div>

            {/* Level Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'all', label: 'Tất cả các cấp', count: JLPT_LEVEL_COUNTS.TOTAL, desc: 'Toàn bộ' },
                { id: 'N5', label: 'JLPT N5', count: JLPT_LEVEL_COUNTS.N5, desc: '100 chữ căn bản' },
                { id: 'N4', label: 'JLPT N4', count: JLPT_LEVEL_COUNTS.N4, desc: '200 chữ sơ cấp' },
                { id: 'N3', label: 'JLPT N3', count: JLPT_LEVEL_COUNTS.N3, desc: '500 chữ trung cấp' },
                { id: 'N2', label: 'JLPT N2', count: JLPT_LEVEL_COUNTS.N2, desc: '500 chữ cao cấp' },
                { id: 'N1', label: 'JLPT N1', count: JLPT_LEVEL_COUNTS.N1, desc: '700 chữ thượng cấp' },
              ].map((lvl) => {
                const isSelected = curriculumLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => {
                      setCurriculumLevel(lvl.id as any);
                      setDisplayLimit(60);
                    }}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs ring-2 ring-emerald-400/30'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    <span>{lvl.label}</span>
                    <span
                      className={`text-[10px] font-mono-numbers px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {lvl.count} chữ
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search bar inside curriculum */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={curriculumSearch}
                onChange={(e) => {
                  setCurriculumSearch(e.target.value);
                  setDisplayLimit(60);
                }}
                placeholder="Tra nhanh chữ Kanji, âm Hán Việt (vd: NHẬT, KINH, ÁI), Onyomi, Kunyomi hoặc nghĩa..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs"
              />
            </div>
            <span className="text-xs text-stone-500 font-mono-numbers whitespace-nowrap">
              Tìm thấy: <strong>{filteredCurriculum.length}</strong> chữ
            </span>
          </div>

          {/* Curriculum Kanji Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {visibleCurriculum.map((item) => {
              const isSaved = savedWordsSet.has(item.kanji);

              return (
                <div
                  key={item.kanji}
                  className={`bg-white rounded-2xl border transition-all p-3.5 flex flex-col justify-between space-y-2 hover:shadow-xs group relative ${
                    isSaved
                      ? 'border-rose-300 bg-rose-50/20 ring-1 ring-rose-200'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {/* Top Bar: Kanji glyph + Level badge + Audio */}
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-kanji font-bold text-stone-900 group-hover:text-rose-600 transition-colors">
                        {item.kanji}
                      </span>
                      <button
                        onClick={() => speakJapanese(item.kanji)}
                        title="Nghe phát âm"
                        className="p-1 text-stone-400 hover:text-stone-700 rounded transition-colors"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono-numbers ${
                        item.jlpt === 'N5'
                          ? 'bg-blue-100 text-blue-800'
                          : item.jlpt === 'N4'
                          ? 'bg-cyan-100 text-cyan-800'
                          : item.jlpt === 'N3'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.jlpt === 'N2'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {item.jlpt}
                    </span>
                  </div>

                  {/* Han Viet & Meaning */}
                  <div className="space-y-0.5">
                    <div className="text-xs font-black text-rose-700 tracking-wide truncate">
                      [{item.hanViet}]
                    </div>
                    <p className="text-[11px] text-stone-600 line-clamp-2 leading-tight">
                      {item.meaning}
                    </p>
                  </div>

                  {/* Readings */}
                  <div className="text-[10px] text-stone-500 font-mono-numbers space-y-0.5 pt-1 border-t border-stone-100">
                    {item.on.length > 0 && (
                      <div className="truncate">
                        <span className="text-stone-400">On: </span>
                        <span>{item.on.slice(0, 2).join(', ')}</span>
                      </div>
                    )}
                    {item.kun.length > 0 && (
                      <div className="truncate">
                        <span className="text-stone-400">Kun: </span>
                        <span>{item.kun.slice(0, 2).join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 flex items-center justify-between gap-1 border-t border-stone-100">
                    <button
                      onClick={() => handleQuickSaveCurriculum(item)}
                      title={isSaved ? 'Đã lưu trong sổ tay (Bấm để bỏ lưu)' : 'Thêm vào sổ tay cá nhân'}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                        isSaved
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-700' : ''}`} />
                      <span className="text-[10px]">{isSaved ? 'Đã lưu' : 'Lưu'}</span>
                    </button>

                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => onSelectWord(item.kanji)}
                        title="Bóc tách chi tiết chữ này"
                        className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {visibleCurriculum.length < filteredCurriculum.length && (
            <div className="pt-4 flex justify-center">
              <button
                onClick={() => setDisplayLimit((prev) => prev + 60)}
                className="px-6 py-2.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs font-bold rounded-2xl shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <span>Xem thêm 60 chữ tiếp theo (còn {filteredCurriculum.length - visibleCurriculum.length} chữ)</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
