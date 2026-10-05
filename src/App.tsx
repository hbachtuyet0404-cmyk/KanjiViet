/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CompoundCard } from './components/CompoundCard';
import { KanjiGrid } from './components/KanjiGrid';
import { SearchHistoryDrawer } from './components/SearchHistoryDrawer';
import { FavoritesView } from './components/FavoritesView';
import { DataExplorationView } from './components/DataExplorationView';
import { QuizMode } from './components/QuizMode';
import { HandwritingPad } from './components/HandwritingPad';
import { HandwritingSearchModal } from './components/HandwritingSearchModal';
import { ExternalSearchCard } from './components/ExternalSearchCard';
import { ThemeAccountModal } from './components/ThemeAccountModal';
import {
  ExternalSearchResult,
  FavoriteEntry,
  SearchHistoryEntry,
  SearchResult,
  UserAccount,
} from './types/kanji';
import {
  parseKanjiQuery,
  getSavedHistory,
  saveSearchHistory,
  deleteHistoryItem,
  clearSearchHistory,
  getFavorites,
  toggleFavorite,
  updateFavoriteNote,
  getAllCompounds,
} from './utils/kanjiDatabase';
import { getActiveAccount } from './utils/accountManager';
import { THEME_CONFIGS, ThemeConfig } from './utils/themeManager';
import { Layers, ArrowRight, Check, Palette, Globe, Sparkles, PenTool } from 'lucide-react';

export default function App() {
  // User Account & Theme state
  const [activeUser, setActiveUser] = useState<UserAccount>(() => getActiveAccount());
  const theme: ThemeConfig = useMemo(() => {
    const tId = activeUser.themeSettings?.themeId || 'sakura';
    return THEME_CONFIGS[tId] || THEME_CONFIGS.sakura;
  }, [activeUser.themeSettings?.themeId]);

  const [activeTab, setActiveTab] = useState<'search' | 'handwriting' | 'favorites' | 'data' | 'quiz'>('search');
  const [query, setQuery] = useState('経済学');
  const [searchResult, setSearchResult] = useState<SearchResult>(() => parseKanjiQuery('経済学', activeUser.id));
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isHandwritingSearchOpen, setIsHandwritingSearchOpen] = useState(false);
  const [isExternalSearchActive, setIsExternalSearchActive] = useState(false);
  const [sharedExternalResult, setSharedExternalResult] = useState<ExternalSearchResult | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Character targeted for handwriting practice
  const [practiceChar, setPracticeChar] = useState<string>('経');

  // Load account-scoped history and favorites whenever activeUser changes
  useEffect(() => {
    setHistory(getSavedHistory(activeUser.id));
    setFavorites(getFavorites(activeUser.id));
    setSearchResult(parseKanjiQuery(query, activeUser.id));
  }, [activeUser.id]);

  // Show quick toast notification
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  }, []);

  // Update search results whenever query changes
  useEffect(() => {
    const result = parseKanjiQuery(query, activeUser.id);
    setSearchResult(result);

    if (result.kanjiList.length > 0) {
      setPracticeChar(result.kanjiList[0].kanji);
    }

    if (query.trim() && result.kanjiList.length > 0) {
      const timer = setTimeout(() => {
        const updated = saveSearchHistory(
          {
            query: query.trim(),
            displayWord: result.matchedCompound?.word || query.trim(),
            hanViet: result.compoundHanViet,
            meaning: result.matchedCompound?.meaning || '',
          },
          activeUser.id
        );
        setHistory(updated);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [query, activeUser.id]);

  // Is current displayed word saved in favorites?
  const currentWord = searchResult.matchedCompound?.word || searchResult.query;
  const isCurrentFavorite = useMemo(() => {
    return favorites.some((f) => f.word === currentWord);
  }, [favorites, currentWord]);

  const handleToggleFavorite = () => {
    const { favorites: updatedFavs, isSaved } = toggleFavorite(
      {
        word: currentWord,
        reading: searchResult.matchedCompound?.reading || '',
        hanViet: searchResult.compoundHanViet,
        meaning: searchResult.matchedCompound?.meaning || '',
        jlpt: searchResult.matchedCompound?.jlpt,
      },
      activeUser.id
    );
    setFavorites(updatedFavs);
    showToast(isSaved ? `Đã lưu [${currentWord}] vào sổ tay của ${activeUser.displayName}!` : `Đã bỏ lưu [${currentWord}]`);
  };

  const handleRemoveFavorite = (word: string) => {
    const { favorites: updatedFavs } = toggleFavorite(
      {
        word,
        reading: '',
        hanViet: '',
        meaning: '',
      },
      activeUser.id
    );
    setFavorites(updatedFavs);
    showToast(`Đã xóa [${word}] khỏi sổ tay`);
  };

  const handleUpdateNote = (id: string, note: string) => {
    const updated = updateFavoriteNote(id, note, activeUser.id);
    setFavorites(updated);
    showToast('Đã cập nhật ghi chú!');
  };

  const handleAddCustomFavorite = (item: {
    word: string;
    reading: string;
    hanViet: string;
    meaning: string;
    jlpt?: string;
  }) => {
    const { favorites: updatedFavs } = toggleFavorite(
      {
        word: item.word,
        reading: item.reading,
        hanViet: item.hanViet,
        meaning: item.meaning,
        jlpt: item.jlpt,
      },
      activeUser.id
    );
    setFavorites(updatedFavs);
  };

  const handleSelectWord = (word: string) => {
    setQuery(word);
    setActiveTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePracticeHandwriting = (kanjiChar: string) => {
    setPracticeChar(kanjiChar);
    setActiveTab('handwriting');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Đã nạp chữ [${kanjiChar}] lên bảng vẽ để luyện viết!`);
  };

  const handleRandomWord = () => {
    const all = getAllCompounds(activeUser.id);
    if (all.length > 0) {
      const random = all[Math.floor(Math.random() * all.length)];
      setQuery(random.word);
      setActiveTab('search');
      showToast(`Đã mở ngẫu nhiên từ: ${random.word} [${random.hanViet}]`);
    }
  };

  const handleClearHistory = () => {
    clearSearchHistory(activeUser.id);
    setHistory([]);
    showToast('Đã xóa toàn bộ lịch sử tra cứu của tài khoản này');
  };

  const handleDeleteHistory = (id: string) => {
    const updated = deleteHistoryItem(id, activeUser.id);
    setHistory(updated);
  };

  const currentFirstKanjiDetail = searchResult.kanjiList.find((k) => k.kanji === practiceChar) || searchResult.kanjiList[0];

  return (
    <div className={`min-h-screen ${theme.bgCanvas} text-stone-900 flex flex-col font-sans-ui transition-colors duration-300 selection:bg-rose-100 selection:text-rose-900`}>
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-stone-700 text-xs font-medium flex items-center gap-2 animate-bounce-subtle">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favorites.length}
        onRandomWord={handleRandomWord}
        activeUser={activeUser}
        theme={theme}
        onOpenThemeAccountModal={() => setIsThemeModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* TAB 1: SEARCH & BREAKDOWN */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Search Bar & Instant Presets */}
            <div className={`bg-white p-4 sm:p-5 rounded-2xl border ${theme.borderSubtle} shadow-2xs`}>
              <SearchBar
                query={query}
                setQuery={setQuery}
                onClear={() => setQuery('')}
                onSelectSample={(sample) => setQuery(sample)}
                onToggleHistory={() => setIsHistoryOpen(true)}
                historyCount={history.length}
                onOpenHandwritingSearch={() => setIsHandwritingSearchOpen(true)}
                onToggleExternalSearch={() => setIsExternalSearchActive((prev) => !prev)}
                isExternalSearchActive={isExternalSearchActive}
                theme={theme}
              />
            </div>

            {/* External Online & AI Search View (Tra cứu từ mới bên ngoài) */}
            {isExternalSearchActive && (
              <ExternalSearchCard
                initialQuery={query}
                sharedResult={sharedExternalResult}
                onResultChange={setSharedExternalResult}
                theme={theme}
                userId={activeUser.id}
                onSelectWord={handleSelectWord}
                onPracticeHandwriting={handlePracticeHandwriting}
                onToast={showToast}
                onAddedToLocalData={() => {
                  setSearchResult(parseKanjiQuery(query, activeUser.id));
                }}
              />
            )}

            {/* Results Section */}
            {searchResult.kanjiList.length > 0 ? (
              <div className="space-y-8 animate-fade-in">
                {/* Master Compound Word Dissection Card */}
                <CompoundCard
                  result={searchResult}
                  isFavorite={isCurrentFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  onCopySuccess={showToast}
                  theme={theme}
                  fontSize={activeUser.themeSettings.fontSize}
                  kanjiFont={activeUser.themeSettings.kanjiFont}
                  onPracticeHandwriting={handlePracticeHandwriting}
                />

                {/* Banner: Prompt to explore external new words if desired */}
                {!isExternalSearchActive && (
                  <div className={`p-3.5 rounded-xl border ${theme.borderSubtle} bg-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs shadow-2xs`}>
                    <div className="flex items-center gap-2 text-stone-600">
                      <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Bạn muốn tìm hiểu thêm nghĩa học thuật, ngữ cảnh mới hoặc tra các từ mới bên ngoài?</span>
                    </div>
                    <button
                      onClick={() => setIsExternalSearchActive(true)}
                      className={`font-bold ${theme.primaryText} hover:underline flex items-center gap-1 shrink-0 text-left`}
                    >
                      <span>Mở tra cứu bên ngoài (AI & Trực tuyến)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Per-character Kanji Dissection Grid */}
                <KanjiGrid
                  kanjiList={searchResult.kanjiList}
                  onSelectWord={handleSelectWord}
                  theme={theme}
                  kanjiFont={activeUser.themeSettings.kanjiFont}
                  onPracticeHandwriting={handlePracticeHandwriting}
                />

                {/* Related Compound Words Section */}
                {searchResult.otherMatchingCompounds.length > 0 && (
                  <div className={`bg-white rounded-xl border ${theme.borderSubtle} p-5 md:p-6 space-y-3`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                        <Layers className={`w-4 h-4 ${theme.primaryText}`} />
                        <span>Từ ghép liên quan chứa các Hán tự này ({searchResult.otherMatchingCompounds.length})</span>
                      </h3>
                      <span className="text-xs text-stone-400">Bấm để phân tích tức thì</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                      {searchResult.otherMatchingCompounds.map((cp) => (
                        <button
                          key={cp.word}
                          onClick={() => handleSelectWord(cp.word)}
                          className={`p-3 bg-stone-50 hover:${theme.bgSubtle} hover:${theme.borderSubtle} active:scale-98 rounded-xl border border-stone-200 text-left transition-all group flex items-center justify-between`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-kanji font-bold text-lg text-stone-900 group-hover:text-rose-950">
                                {cp.word}
                              </span>
                              <span className={`text-xs font-semibold ${theme.primaryText}`}>
                                [{cp.hanViet}]
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 truncate mt-0.5 max-w-[200px]">
                              {cp.meaning}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-rose-600 transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Empty state / No match found */
              <div className={`bg-white rounded-2xl border ${theme.borderSubtle} p-8 sm:p-12 text-center text-stone-500 space-y-4`}>
                <div className={`w-16 h-16 ${theme.bgSubtle} rounded-full flex items-center justify-center mx-auto text-stone-400 font-kanji text-3xl`}>
                  字
                </div>
                <h3 className="text-lg font-bold text-stone-800">
                  Không tìm thấy chữ Kanji phù hợp với &quot;{query}&quot; trong từ điển nội bộ
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                  Từ này có thể là từ mới, thuật ngữ chuyên ngành hoặc thành ngữ ngoài danh sách cơ bản. Bạn có thể tra cứu mở rộng bên ngoài ngay bây giờ hoặc vẽ tay chữ Kanji bạn muốn tìm.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                  <button
                    onClick={() => setIsExternalSearchActive(true)}
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Tra cứu từ mới &quot;{query}&quot; bên ngoài bằng AI</span>
                  </button>
                  <button
                    onClick={() => setIsHandwritingSearchOpen(true)}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 border border-stone-200"
                  >
                    <PenTool className="w-4 h-4 text-rose-700" />
                    <span>Vẽ tay chữ này</span>
                  </button>
                  <button
                    onClick={() => setQuery('曖昧')}
                    className={`px-4 py-2.5 ${theme.primaryBg} ${theme.primaryHoverBg} text-white text-xs font-semibold rounded-xl transition-colors`}
                  >
                    Xem từ mẫu: 曖昧 [ÁI MUỘI]
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: HANDWRITING DRAWING CANVAS */}
        {activeTab === 'handwriting' && (
          <HandwritingPad
            currentKanji={practiceChar}
            currentHanViet={currentFirstKanjiDetail?.hanViet || ''}
            theme={theme}
            user={activeUser}
            onSelectKanji={(k) => setPracticeChar(k)}
            onSearchKanji={handleSelectWord}
            onToast={showToast}
          />
        )}

        {/* TAB 3: FAVORITES / SỔ TAY */}
        {activeTab === 'favorites' && (
          <FavoritesView
            favorites={favorites}
            onRemoveFavorite={handleRemoveFavorite}
            onUpdateNote={handleUpdateNote}
            onSelectWord={handleSelectWord}
            onAddFavorite={handleAddCustomFavorite}
            onPracticeHandwriting={handlePracticeHandwriting}
            theme={theme}
            user={activeUser}
            onToast={showToast}
          />
        )}

        {/* TAB 4: DATA EXPLORATION, CUSTOM KANJI & FILE SAVING */}
        {activeTab === 'data' && (
          <DataExplorationView
            onSelectWord={handleSelectWord}
            onRefresh={() => {
              setSearchResult(parseKanjiQuery(query, activeUser.id));
            }}
            theme={theme}
            user={activeUser}
            onToast={showToast}
          />
        )}

        {/* TAB 5: QUIZ / WORKOUT MODE */}
        {activeTab === 'quiz' && (
          <QuizMode
            onSelectWord={handleSelectWord}
            theme={theme}
            user={activeUser}
            onToast={showToast}
          />
        )}
      </main>

      {/* Search History Drawer */}
      <SearchHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectQuery={(q) => {
          setQuery(q);
          setActiveTab('search');
        }}
        onDeleteItem={handleDeleteHistory}
        onClearAll={handleClearHistory}
      />

      {/* Theme & Multi-Account Modal */}
      <ThemeAccountModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        activeUser={activeUser}
        onUserChange={(newUser) => {
          setActiveUser(newUser);
        }}
        onToast={showToast}
      />

      {/* Handwriting Search Modal */}
      <HandwritingSearchModal
        isOpen={isHandwritingSearchOpen}
        onClose={() => setIsHandwritingSearchOpen(false)}
        onSelectCandidate={(kanji, executeImmediately) => {
          setQuery(kanji);
          setIsExternalSearchActive(true);
          if (executeImmediately) {
            setActiveTab('search');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onAppendCandidate={(kanji) => {
          setQuery((prev) => prev + kanji);
        }}
        onSyncRecognizedData={(candidate, extResult) => {
          setSharedExternalResult(extResult);
          setIsExternalSearchActive(true);
        }}
        currentSearchQuery={query}
        theme={theme}
        onToast={showToast}
      />

      {/* Footer */}
      <footer className={`mt-auto border-t ${theme.borderSubtle} bg-white/70 py-6 text-xs text-stone-500`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span>{activeUser.avatar}</span>
            <span className="font-semibold text-stone-800">KanjiViet Pastel</span>
            <span>— Tài khoản: {activeUser.displayName}</span>
          </div>
          <div className="flex items-center gap-3 text-stone-400">
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="hover:text-stone-700 flex items-center gap-1 font-medium transition-colors"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Đổi chủ đề ({theme.name})</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>Hỗ trợ vẽ tay & lưu file ngoại tuyến</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
