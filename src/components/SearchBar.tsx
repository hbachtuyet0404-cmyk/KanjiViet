import React, { useRef } from 'react';
import { Search, X, Clipboard, History, ArrowRight, PenTool, Globe, Sparkles } from 'lucide-react';
import { ThemeConfig } from '../utils/themeManager';

interface SearchBarProps {
  query: string;
  setQuery: (val: string) => void;
  onClear: () => void;
  onSelectSample: (word: string) => void;
  onToggleHistory: () => void;
  historyCount: number;
  onOpenHandwritingSearch: () => void;
  onToggleExternalSearch?: () => void;
  isExternalSearchActive?: boolean;
  theme?: ThemeConfig;
}

const SAMPLE_SEARCHES = [
  { word: '経済学', hv: 'KINH TẾ HỌC', jlpt: 'N3' },
  { word: '曖昧', hv: 'ÁI MUỘI', jlpt: 'N1' },
  { word: '躊躇', hv: 'TRÙ TRỪ', jlpt: 'N1' },
  { word: '臨機応変', hv: 'LÂM CƠ ỨNG BIẾN', jlpt: 'N1' },
  { word: '試行錯誤', hv: 'THÍ HÀNH THÁC NGỘ', jlpt: 'N1' },
  { word: '持続可能', hv: 'TRÌ TỤC KHẢ NĂNG', jlpt: 'N1' },
  { word: '一期一会', hv: 'NHẤT KỲ NHẤT HỘI', jlpt: 'N1' },
  { word: '責任感', hv: 'TRÁCH NHIỆM CẢM', jlpt: 'N3' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  onClear,
  onSelectSample,
  onToggleHistory,
  historyCount,
  onOpenHandwritingSearch,
  onToggleExternalSearch,
  isExternalSearchActive,
  theme,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setQuery(text.trim());
        inputRef.current?.focus();
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Search Input Box */}
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <div className="relative group flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
            <Search className="w-5 h-5 text-stone-400 group-focus-within:text-rose-600 transition-colors" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nhập từ Kanji, câu tiếng Nhật, âm Hán Việt (vd: kinh te), hoặc Romaji..."
            className="w-full pl-12 pr-28 py-3.5 bg-white border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-rose-600/20 focus:border-rose-600 transition-all shadow-xs"
          />

          {/* Action icons on right inside input */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
            {query ? (
              <button
                onClick={onClear}
                title="Xóa trắng"
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md hover:bg-stone-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePaste}
                title="Dán từ bộ nhớ tạm"
                className="px-2 py-1 text-xs text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors flex items-center gap-1 font-medium"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dán</span>
              </button>
            )}

            <div className="h-5 w-px bg-stone-200" />

            <button
              onClick={onToggleHistory}
              title="Lịch sử tra cứu"
              className="p-1.5 text-stone-500 hover:text-stone-800 rounded-md hover:bg-stone-100 transition-colors relative"
            >
              <History className="w-4 h-4" />
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-600 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Feature Buttons: Handwriting Search & External Search */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Handwriting Search Button */}
          <button
            onClick={onOpenHandwritingSearch}
            className={`px-3.5 py-3 sm:py-3.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-white text-stone-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:border-rose-300 transition-all group flex-1 sm:flex-initial`}
            title="Vẽ tay để nhận diện & tìm kiếm chữ Kanji"
          >
            <PenTool className="w-4 h-4 text-rose-700 group-hover:scale-110 transition-transform" />
            <span className="whitespace-nowrap">Vẽ tay tìm Kanji</span>
          </button>

          {/* External Search Toggle Button */}
          {onToggleExternalSearch && (
            <button
              onClick={onToggleExternalSearch}
              className={`px-3.5 py-3 sm:py-3.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-initial shadow-2xs ${
                isExternalSearchActive
                  ? 'bg-rose-50 text-rose-800 border-rose-300 ring-2 ring-rose-200'
                  : 'bg-stone-50 hover:bg-white text-stone-800 border-stone-200 hover:border-emerald-300'
              }`}
              title="Tra cứu từ mới bên ngoài (Từ điển trực tuyến & AI)"
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span className="whitespace-nowrap">
                {isExternalSearchActive ? 'Đang mở Tra từ mới' : 'Tra từ mới bên ngoài'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Instant Suggestions / Sample Words */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="text-stone-600 font-medium whitespace-nowrap shrink-0">
          Gợi ý tra nhanh:
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {SAMPLE_SEARCHES.map((item) => (
            <button
              key={item.word}
              onClick={() => onSelectSample(item.word)}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200/80 active:bg-stone-200 text-stone-700 hover:text-stone-900 rounded-md transition-all font-medium flex items-center gap-1.5 whitespace-nowrap"
            >
              <span className="font-kanji font-bold text-stone-900">{item.word}</span>
              <span className="text-[11px] text-stone-600">[{item.hv}]</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
