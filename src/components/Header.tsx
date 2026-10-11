import React from 'react';
import { BookOpen, Bookmark, Database, BrainCircuit, Shuffle, PenTool, Palette, User } from 'lucide-react';
import { UserAccount } from '../types/kanji';
import { ThemeConfig } from '../utils/themeManager';

interface HeaderProps {
  activeTab: 'search' | 'favorites' | 'data' | 'quiz';
  setActiveTab: (tab: 'search' | 'favorites' | 'data' | 'quiz') => void;
  favoritesCount: number;
  onRandomWord: () => void;
  activeUser: UserAccount;
  theme: ThemeConfig;
  onOpenThemeAccountModal: (tab?: 'theme' | 'google') => void;
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

        {/* Zone 2: Navigation Links */}
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

        {/* Zone 3: Primary Actions (Google Account & Theme) */}
        <div className="flex items-center gap-2">
          {activeUser.isGoogleUser ? (
            /* Logged in with Google */
            <button
              onClick={() => onOpenThemeAccountModal('google')}
              title={`Tài khoản Google: ${activeUser.displayName} (${activeUser.email})`}
              className="px-2.5 py-1.5 text-xs font-medium text-white bg-white/15 hover:bg-white/25 active:scale-95 transition-all rounded-xl flex items-center gap-2 border border-white/20 shadow-2xs whitespace-nowrap"
            >
              {activeUser.photoUrl ? (
                <img
                  src={activeUser.photoUrl}
                  alt=""
                  className="w-5 h-5 rounded-full object-cover border border-white/40"
                />
              ) : (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px]">
                  {activeUser.displayName[0]?.toUpperCase() || 'G'}
                </span>
              )}
              <span className="hidden sm:inline font-bold max-w-[110px] truncate">
                {activeUser.displayName}
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-2xs">
                Google
              </span>
            </button>
          ) : (
            /* Not logged in: Prominent Google Login button */
            <button
              onClick={() => onOpenThemeAccountModal('google')}
              className="px-3 py-1.5 text-xs font-bold text-stone-900 bg-white hover:bg-stone-50 active:scale-95 transition-all rounded-xl flex items-center gap-1.5 shadow-sm border border-stone-200"
              title="Đăng nhập bằng tài khoản Google của bạn"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Đăng nhập</span>
            </button>
          )}

          {/* Theme Switcher Button */}
          <button
            onClick={() => onOpenThemeAccountModal('theme')}
            title={`Giao diện: ${theme.name} · Bấm để đổi màu Pastel & Cỡ chữ`}
            className="p-2 text-white bg-white/15 hover:bg-white/25 active:scale-95 transition-all rounded-xl border border-white/20 shadow-2xs"
          >
            <Palette className="w-3.5 h-3.5 text-stone-100" />
          </button>

          <button
            onClick={onRandomWord}
            title="Khám phá từ vựng ngẫu nhiên"
            className="p-2 text-stone-200 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-xl border border-white/10"
          >
            <Shuffle className="w-3.5 h-3.5 text-rose-300" />
          </button>
        </div>
      </div>
    </header>
  );
};
