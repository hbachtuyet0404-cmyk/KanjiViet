import React from 'react';
import { BookOpen, Bookmark, Database, BrainCircuit, Shuffle, PenTool, Palette, User } from 'lucide-react';
import { UserAccount } from '../types/kanji';
import { ThemeConfig } from '../utils/themeManager';

interface HeaderProps {
  activeTab: 'search' | 'handwriting' | 'favorites' | 'data' | 'quiz';
  setActiveTab: (tab: 'search' | 'handwriting' | 'favorites' | 'data' | 'quiz') => void;
  favoritesCount: number;
  onRandomWord: () => void;
  activeUser: UserAccount;
  theme: ThemeConfig;
  onOpenThemeAccountModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  onRandomWord,
  activeUser,
  theme,
  onOpenThemeAccountModal,
}) => {
  return (
    <header className={`sticky top-0 z-30 ${theme.headerBg} text-white border-b border-black/10 shadow-sm backdrop-blur-md bg-opacity-95 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Wordmark + Single Brand Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('search')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-kanji text-xl font-bold shadow-inner transition-transform group-hover:scale-105"
              style={{ backgroundColor: theme.previewColor }}
            >
              漢
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-stone-200 transition-colors">
                KanjiViet
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-stone-300/80 font-normal">
                {theme.jpName}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (5 tabs, single line) */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'search'
                ? 'bg-white/20 text-white shadow-xs font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Tra cứu</span>
          </button>

          <button
            onClick={() => setActiveTab('handwriting')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'handwriting'
                ? 'bg-white/20 text-white shadow-xs font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <PenTool className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
            <span>Tập viết</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 relative whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'bg-white/20 text-white shadow-xs font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Sổ tay</span>
            {favoritesCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-rose-500 text-white rounded text-[10px] font-mono-numbers font-medium">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'data'
                ? 'bg-white/20 text-white shadow-xs font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden md:inline">Kho dữ liệu</span>
            <span className="md:hidden">Kho</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-white/20 text-white shadow-xs font-semibold'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" />
            <span>Luyện tập</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Theme & Account Switcher) */}
        <div className="flex items-center gap-2">
          {/* Account & Pastel Theme Switcher Button */}
          <button
            onClick={onOpenThemeAccountModal}
            title={`Tài khoản: ${activeUser.displayName} · Bấm để đổi giao diện hoặc đổi tài khoản`}
            className="px-2.5 py-1.5 text-xs font-medium text-white bg-white/15 hover:bg-white/25 active:scale-95 transition-all rounded-lg flex items-center gap-1.5 border border-white/20 shadow-2xs whitespace-nowrap"
          >
            <span className="text-base">{activeUser.avatar}</span>
            <span className="hidden md:inline font-semibold max-w-[110px] truncate">
              {activeUser.displayName}
            </span>
            <Palette className="w-3.5 h-3.5 text-stone-200" />
          </button>

          <button
            onClick={onRandomWord}
            title="Khám phá từ vựng ngẫu nhiên"
            className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-stone-200 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-lg flex items-center gap-1 border border-white/10 whitespace-nowrap"
          >
            <Shuffle className="w-3.5 h-3.5 text-rose-300" />
            <span className="hidden lg:inline">Ngẫu nhiên</span>
          </button>
        </div>
      </div>
    </header>
  );
};
