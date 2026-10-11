import React from 'react';
import { Volume2, PenTool, Info } from 'lucide-react';
import { KanjiDetail, KanjiFontStyle } from '../types/kanji';
import { speakJapanese } from '../utils/kanjiDatabase';
import { KANJI_FONT_CLASSES, ThemeConfig } from '../utils/themeManager';

interface KanjiGridProps {
  kanjiList: KanjiDetail[];
  onSelectWord: (word: string) => void;
  theme: ThemeConfig;
  kanjiFont: KanjiFontStyle;
}

export const KanjiGrid: React.FC<KanjiGridProps> = ({
  kanjiList,
  onSelectWord,
  theme,
  kanjiFont,
}) => {
  if (kanjiList.length === 0) {
    return null;
  }

  const kanjiFontClass = KANJI_FONT_CLASSES[kanjiFont];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-stone-900">
            Phân tích thành tố Hán tự ({kanjiList.length} chữ)
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Bóc tách từng ký tự để nắm rõ gốc Hán Việt, bộ thủ cấu thành và mẹo ghi nhớ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {kanjiList.map((item, idx) => (
          <div
            key={`${item.kanji}_${idx}`}
            className={`bg-white rounded-xl border ${theme.borderSubtle} shadow-2xs p-5 md:p-6 hover:shadow-xs transition-all flex flex-col justify-between`}
          >
            <div>
              {/* Header: Large Kanji + Sino-Vietnamese reading */}
              <div className={`flex items-start justify-between gap-4 pb-4 border-b ${theme.borderSubtle}`}>
                <div className="flex items-center gap-4">
                  {/* Kanji Glyph Box */}
                  <div className="relative group">
                    <div className={`w-18 h-18 sm:w-20 sm:h-20 rounded-xl ${theme.kanjiBoxBg} border ${theme.borderSubtle} flex items-center justify-center text-4xl sm:text-5xl ${kanjiFontClass} font-bold text-stone-900 shadow-inner group-hover:scale-102 transition-transform`}>
                      {item.kanji}
                    </div>
                    {/* Audio button for character */}
                    <button
                      onClick={() => speakJapanese(item.kanji)}
                      title={`Phát âm chữ ${item.kanji}`}
                      className="absolute -bottom-1 -right-1 p-1 bg-white hover:bg-stone-100 text-stone-600 rounded-full border border-stone-200 shadow-xs transition-transform active:scale-90"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Character Meta: Âm Hán Việt & JLPT */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-400 font-medium">
                        Ký tự #{idx + 1}
                      </span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className={`text-xs font-bold ${theme.badgeText} ${theme.badgeBg} px-1.5 py-0.2 rounded border ${theme.badgeBorder}`}>
                        {item.jlpt || 'N3'}
                      </span>
                    </div>

                    <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">
                      {item.hanViet}
                    </div>

                    <div className="text-xs text-stone-500 font-mono-numbers mt-0.5 flex items-center gap-2">
                      <span>{item.strokeCount || 1} nét</span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="truncate max-w-[140px]">{item.radical}</span>
                    </div>
                  </div>
                </div>

                {/* Top Right: Index */}
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-[11px] font-mono-numbers text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                    #{idx + 1}/{kanjiList.length}
                  </span>
                </div>
              </div>

              {/* Core Meaning */}
              <div className="mt-3.5">
                <span className="text-xs font-semibold text-stone-400 block mb-0.5 uppercase tracking-wider">
                  Nghĩa cốt lõi:
                </span>
                <p className="text-sm font-medium text-stone-800 leading-snug">
                  {item.meaning}
                </p>
              </div>

              {/* Readings: On & Kun */}
              <div className={`mt-3.5 grid grid-cols-2 gap-2 text-xs ${theme.bgSubtle} p-2.5 rounded-lg border ${theme.borderSubtle}`}>
                <div>
                  <span className="text-stone-500 font-semibold block mb-0.5">Âm Onyomi (Hán):</span>
                  <div className="font-kanji text-stone-800 font-medium">
                    {item.on && item.on.length > 0 ? item.on.join(', ') : '—'}
                  </div>
                </div>
                <div>
                  <span className="text-stone-500 font-semibold block mb-0.5">Âm Kunyomi (Thuần Nhật):</span>
                  <div className="font-kanji text-stone-800 font-medium">
                    {item.kun && item.kun.length > 0 ? item.kun.join(', ') : '—'}
                  </div>
                </div>
              </div>

              {/* Mnemonic / Chiết tự */}
              {item.mnemonic && (
                <div className={`mt-3 text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-200/70 leading-relaxed`}>
                  <span className={`font-bold ${theme.primaryText} block mb-0.5 flex items-center gap-1`}>
                    <Info className="w-3.5 h-3.5" />
                    Chiết tự & Mẹo nhớ:
                  </span>
                  <p>{item.mnemonic}</p>
                </div>
              )}
            </div>

            {/* Common Compounds using this character */}
            {item.compounds && item.compounds.length > 0 && (
              <div className={`mt-4 pt-3 border-t ${theme.borderSubtle}`}>
                <span className="text-xs font-semibold text-stone-500 block mb-1.5">
                  Từ ghép thường gặp chứa chữ này:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {item.compounds.map((cp) => (
                    <button
                      key={cp.word}
                      onClick={() => onSelectWord(cp.word)}
                      title={`Tra cứu từ ${cp.word} (${cp.meaning})`}
                      className={`px-2 py-1 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded text-xs transition-colors flex items-center gap-1 font-medium group text-stone-700`}
                    >
                      <span className="font-kanji font-bold text-stone-900">{cp.word}</span>
                      <span className={`text-[11px] font-semibold text-stone-500 group-hover:${theme.primaryText}`}>[{cp.hanViet}]</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
