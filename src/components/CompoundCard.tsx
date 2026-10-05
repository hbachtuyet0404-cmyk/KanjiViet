import React, { useState } from 'react';
import { Volume2, Copy, Check, Bookmark, BookmarkCheck, Share2, PenTool } from 'lucide-react';
import { CompoundWord, FontSizeSetting, KanjiFontStyle, SearchResult } from '../types/kanji';
import { formatBreakdownForCopy, speakJapanese } from '../utils/kanjiDatabase';
import { FONT_SIZE_CLASSES, KANJI_FONT_CLASSES, ThemeConfig } from '../utils/themeManager';

interface CompoundCardProps {
  result: SearchResult;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onCopySuccess: (msg: string) => void;
  theme: ThemeConfig;
  fontSize: FontSizeSetting;
  kanjiFont: KanjiFontStyle;
  onPracticeHandwriting?: (kanji: string) => void;
}

export const CompoundCard: React.FC<CompoundCardProps> = ({
  result,
  isFavorite,
  onToggleFavorite,
  onCopySuccess,
  theme,
  fontSize,
  kanjiFont,
  onPracticeHandwriting,
}) => {
  const [copiedType, setCopiedType] = useState<'hv' | 'full' | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const { matchedCompound, compoundHanViet, kanjiList, query } = result;
  const word = matchedCompound?.word || query;
  const reading = matchedCompound?.reading || '';
  const meaning = matchedCompound?.meaning || '';
  const nuance = matchedCompound?.nuance || '';
  const example = matchedCompound?.exampleSentence;
  const jlpt = matchedCompound?.jlpt;
  const category = matchedCompound?.category;

  const fontClasses = FONT_SIZE_CLASSES[fontSize];
  const kanjiFontClass = KANJI_FONT_CLASSES[kanjiFont];

  const handleCopyHanViet = async () => {
    const textToCopy = compoundHanViet || matchedCompound?.hanViet || '';
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedType('hv');
      onCopySuccess(`Đã sao chép âm Hán Việt: "${textToCopy}"`);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyFull = async () => {
    const fullText = formatBreakdownForCopy(result);
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedType('full');
      onCopySuccess('Đã sao chép toàn bộ phân tích chiết tự vào bộ nhớ tạm!');
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      // fallback
    }
  };

  const handleAudio = () => {
    setIsPlayingAudio(true);
    speakJapanese(word);
    setTimeout(() => setIsPlayingAudio(false), 1200);
  };

  return (
    <div className={`bg-white rounded-2xl border ${theme.borderSubtle} shadow-sm overflow-hidden transition-all duration-200`}>
      {/* Top Banner: Category & JLPT level - unboxed metadata */}
      <div className={`px-6 py-3.5 ${theme.bgSubtle} border-b ${theme.borderSubtle} flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500`}>
        <div className="flex items-center gap-2">
          {category && (
            <>
              <span className="font-semibold text-stone-700">{category}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
            </>
          )}
          {jlpt && (
            <>
              <span className={`font-bold ${theme.badgeText} ${theme.badgeBg} px-2 py-0.5 rounded border ${theme.badgeBorder}`}>
                {jlpt}
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
            </>
          )}
          <span>{kanjiList.length} chữ Hán cấu thành</span>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          {onPracticeHandwriting && (
            <button
              onClick={() => onPracticeHandwriting(kanjiList[0]?.kanji || word[0] || '漢')}
              title="Luyện viết tay chữ này trên bảng vẽ"
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder}`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Tập viết tay</span>
            </button>
          )}

          <button
            onClick={onToggleFavorite}
            title={isFavorite ? 'Đã lưu trong sổ tay' : 'Lưu vào sổ tay'}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              isFavorite
                ? `${theme.badgeBg} ${theme.badgeText} border ${theme.badgeBorder} font-semibold`
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-transparent'
            }`}
          >
            {isFavorite ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Đã lưu sổ tay</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>Lưu từ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Word & Pronunciation */}
          <div className="space-y-3">
            {/* Furigana Reading */}
            {reading && (
              <div className="text-sm font-medium text-stone-500 tracking-wide">
                {reading} {matchedCompound?.romaji && <span className="text-stone-400">({matchedCompound.romaji})</span>}
              </div>
            )}

            {/* Kanji Word Display */}
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className={`${fontClasses.kanjiTitle} ${kanjiFontClass} text-stone-950 tracking-wider`}>
                {word}
              </h1>

              {/* Japanese Native Pronunciation Speaker */}
              <button
                onClick={handleAudio}
                title="Nghe phát âm chuẩn tiếng Nhật"
                className={`p-2.5 rounded-full transition-all border ${
                  isPlayingAudio
                    ? `${theme.primaryBg} text-white scale-105 shadow-xs`
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200 active:scale-95'
                }`}
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Sino-Vietnamese Banner (Âm Hán Việt) */}
            <div className="pt-1 flex items-baseline gap-2.5 flex-wrap">
              <span className={`text-xs uppercase tracking-wider font-bold ${theme.badgeText} ${theme.badgeBg} px-2 py-0.5 rounded border ${theme.badgeBorder}`}>
                Âm Hán Việt
              </span>
              <span className={`${fontClasses.hanViet} font-bold tracking-tight text-stone-900 font-sans-ui`}>
                {compoundHanViet || matchedCompound?.hanViet || 'Chưa xác định'}
              </span>
            </div>
          </div>

          {/* Quick Copy Action Panel */}
          <div className="flex sm:flex-row lg:flex-col gap-2 shrink-0 pt-2 lg:pt-0">
            <button
              onClick={handleCopyHanViet}
              className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 rounded-lg transition-colors flex items-center justify-center gap-2 border border-stone-200 shadow-2xs whitespace-nowrap"
            >
              {copiedType === 'hv' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Đã chép Hán Việt!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-500" />
                  <span>Sao chép Hán Việt</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyFull}
              className={`px-3.5 py-2 text-xs font-semibold ${theme.badgeText} ${theme.badgeBg} hover:opacity-90 rounded-lg transition-colors flex items-center justify-center gap-2 border ${theme.badgeBorder} shadow-2xs whitespace-nowrap`}
            >
              {copiedType === 'full' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Đã chép chiết tự!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Sao chép cho Ghi chú / Anki</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Meaning & Academic Nuance */}
        <div className={`mt-6 pt-5 border-t ${theme.borderSubtle} space-y-3`}>
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Nghĩa tiếng Việt
            </span>
            <p className={`${fontClasses.body} text-stone-800 font-medium leading-relaxed`}>
              {meaning || 'Chưa có mô tả chi tiết cho từ này.'}
            </p>
          </div>

          {/* Academic Nuance for Japanese Studies students */}
          {nuance && (
            <div className={`p-4 ${theme.bgSubtle} border ${theme.borderSubtle} rounded-xl text-stone-800 text-xs md:text-sm leading-relaxed`}>
              <span className={`font-bold ${theme.primaryText} block mb-1`}>
                Gốc từ & Chiết tự Hán Việt:
              </span>
              <p className="text-stone-700">{nuance}</p>
            </div>
          )}

          {/* Example Sentence */}
          {example && (
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/70 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-stone-700">Ví dụ văn cảnh thực tế</span>
                <button
                  onClick={() => speakJapanese(example.ja)}
                  className="hover:text-stone-900 flex items-center gap-1 font-medium transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Nghe câu mẫu</span>
                </button>
              </div>
              <p className="text-base font-kanji text-stone-900 leading-relaxed font-medium">
                {example.ja}
              </p>
              <p className="text-xs text-stone-500 italic">
                {example.reading}
              </p>
              <p className="text-sm text-stone-700 pt-0.5">
                → {example.vi}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
