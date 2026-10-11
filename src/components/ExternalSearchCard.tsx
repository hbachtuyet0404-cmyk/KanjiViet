import React, { useState } from 'react';
import {
  Globe,
  Sparkles,
  Search,
  Volume2,
  Copy,
  Check,
  Bookmark,
  Plus,
  PenTool,
  BookOpen,
  ArrowRight,
  Loader2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Layers,
  FileText,
} from 'lucide-react';
import { ExternalSearchResult, KanjiDetail } from '../types/kanji';
import { ThemeConfig } from '../utils/themeManager';
import { speakJapanese, saveCustomCompound, saveCustomKanji, toggleFavorite } from '../utils/kanjiDatabase';

interface ExternalSearchCardProps {
  initialQuery?: string;
  sharedResult?: ExternalSearchResult | null;
  onResultChange?: (res: ExternalSearchResult | null) => void;
  theme: ThemeConfig;
  userId: string;
  onSelectWord: (word: string) => void;
  onToast: (msg: string) => void;
  onAddedToLocalData?: () => void;
}

const EXTERNAL_SAMPLE_WORDS = [
  { word: '人工知能', hint: 'Trí tuệ nhân tạo (AI)' },
  { word: '持続可能性', hint: 'Tính bền vững (Sustainability)' },
  { word: '温故知新', hint: 'Ôn Cố Tri Tân (Học cái cũ biết cái mới)' },
  { word: '諸行無常', hint: 'Vạn vật đổi dời (Phật giáo/Triết học)' },
  { word: '気象庁', hint: 'Cục Khí tượng Nhật Bản' },
  { word: '過労死', hint: 'Chết vì làm việc quá sức' },
  { word: '超電導', hint: 'Hiện tượng siêu dẫn (Vật lý)' },
  { word: '一意専心', hint: 'Toàn tâm toàn ý, tập trung cao độ' },
];

export const ExternalSearchCard: React.FC<ExternalSearchCardProps> = ({
  initialQuery = '',
  sharedResult = null,
  onResultChange,
  theme,
  userId,
  onSelectWord,
  onToast,
  onAddedToLocalData,
}) => {
  const [extQuery, setExtQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExternalSearchResult | null>(sharedResult);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSavedLocally, setIsSavedLocally] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Sync with sharedResult from handwriting recognition or parent
  React.useEffect(() => {
    if (sharedResult) {
      setResult(sharedResult);
      setExtQuery(sharedResult.word);
      setError(null);
    }
  }, [sharedResult]);

  React.useEffect(() => {
    if (initialQuery && initialQuery !== extQuery && !sharedResult) {
      setExtQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleExternalSearch = async (termToSearch?: string) => {
    const term = (termToSearch || extQuery).trim();
    if (!term) {
      onToast('Vui lòng nhập từ hoặc chữ Kanji để tra cứu bên ngoài!');
      return;
    }

    setLoading(true);
    setError(null);
    setIsSavedLocally(false);
    setIsFavorited(false);

    try {
      const res = await fetch('/api/external-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: term }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
        onResultChange?.(json.data);
        onToast(`Đã tra cứu thành công từ mới bên ngoài: [${json.data.word}]!`);
      } else {
        setError(json.error || 'Không tìm thấy dữ liệu phân tích cho từ này.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Không thể kết nối đến hệ thống tra cứu mở rộng lúc này. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAnalysis = () => {
    if (!result) return;
    const text = `【${result.word}】(${result.reading || result.romaji})
Âm Hán Việt: ${result.hanViet}
Ý nghĩa: ${result.meaning}
${result.detailedMeaning ? `Giải thích chi tiết: ${result.detailedMeaning}\n` : ''}
Các chữ Hán cấu thành:
${result.kanjiList.map((k) => `• ${k.kanji} [${k.hanViet}]: ${k.meaning}`).join('\n')}
${result.originNotes ? `\nNguồn gốc & Chiết tự: ${result.originNotes}` : ''}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onToast('Đã sao chép phân tích Hán Việt chi tiết!');
  };

  const handleSaveToPersonalData = () => {
    if (!result) return;

    // Save compound word
    saveCustomCompound(
      {
        word: result.word,
        reading: result.reading,
        romaji: result.romaji,
        hanViet: result.hanViet,
        meaning: result.meaning,
        jlpt: (result.jlpt as any) || 'N1',
        category: result.category || 'Từ tra cứu bên ngoài',
        nuance: result.detailedMeaning,
        exampleSentence: result.exampleSentences?.[0]
          ? {
              ja: result.exampleSentences[0].japanese,
              reading: result.exampleSentences[0].furigana || '',
              vi: result.exampleSentences[0].vietnamese,
            }
          : undefined,
      },
      userId
    );

    // Save all constituent kanji
    if (result.kanjiList && result.kanjiList.length > 0) {
      result.kanjiList.forEach((k) => {
        saveCustomKanji(k, userId);
      });
    }

    setIsSavedLocally(true);
    onToast(`Đã lưu [${result.word}] và ${result.kanjiList.length} chữ Hán vào kho từ cá nhân của bạn!`);
    onAddedToLocalData?.();
  };

  const handleToggleFavorite = () => {
    if (!result) return;
    const { isSaved } = toggleFavorite(
      {
        word: result.word,
        reading: result.reading,
        hanViet: result.hanViet,
        meaning: result.meaning,
        jlpt: result.jlpt,
        note: `Nguồn gốc Hán tự: ${result.originNotes || ''}`,
      },
      userId
    );
    setIsFavorited(isSaved);
    onToast(isSaved ? `Đã lưu [${result.word}] vào Sổ tay yêu thích!` : `Đã bỏ lưu [${result.word}]`);
  };

  return (
    <div className={`bg-white rounded-2xl border ${theme.borderSubtle} shadow-sm overflow-hidden space-y-0`}>
      {/* Top Banner */}
      <div className={`p-4 sm:p-5 ${theme.bgSubtle} border-b border-stone-200/80`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${theme.primaryBg} text-white flex items-center justify-center shadow-xs shrink-0`}>
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>Tra cứu từ mới bên ngoài (Từ điển trực tuyến & AI)</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Mở rộng toàn diện
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Tìm kiếm bất kỳ từ mới tiếng Nhật nào vượt ra ngoài từ điển có sẵn — phân tích chiết tự Hán Việt, cách đọc, bộ thủ và ví dụ.
              </p>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={extQuery}
              onChange={(e) => setExtQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleExternalSearch()}
              placeholder="Nhập bất kỳ từ tiếng Nhật, từ ghép Kanji mới, hoặc câu văn (vd: 持続可能性, 人工知能, 温故知新...)"
              className="w-full pl-4 pr-10 py-3 bg-white border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-xs"
            />
            {extQuery && (
              <button
                onClick={() => setExtQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700"
              >
                ×
              </button>
            )}
          </div>

          <button
            onClick={() => handleExternalSearch()}
            disabled={loading || !extQuery.trim()}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold text-white flex items-center gap-2 shadow-xs transition-all ${theme.primaryBg} ${theme.primaryHoverBg} disabled:opacity-40 shrink-0`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Đang tra cứu...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Tra từ mới</span>
              </>
            )}
          </button>
        </div>

        {/* Fast sample pills */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-stone-500 font-medium whitespace-nowrap shrink-0">
            Từ gợi ý mở rộng:
          </span>
          {EXTERNAL_SAMPLE_WORDS.map((item) => (
            <button
              key={item.word}
              onClick={() => {
                setExtQuery(item.word);
                handleExternalSearch(item.word);
              }}
              className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 rounded-lg transition-colors border border-stone-200/80 font-medium whitespace-nowrap text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <span className="font-kanji font-bold text-stone-900">{item.word}</span>
              <span className="text-[10px] text-stone-400">({item.hint})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-700 mx-auto flex items-center justify-center animate-spin">
            <Loader2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-stone-800">
            Đang phân tích cấu trúc Hán tự và tra cứu từ mới bên ngoài...
          </h4>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Hệ thống đang bóc tách từng chữ Kanji, tra cứu âm Hán Việt chuẩn, nghĩa học thuật và trích xuất câu ví dụ thực tế.
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-6 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <p className="text-sm font-semibold text-stone-800">{error}</p>
          <button
            onClick={() => handleExternalSearch()}
            className="text-xs text-rose-700 hover:underline font-medium"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Result Display Section */}
      {result && !loading && (
        <div className="p-5 sm:p-7 space-y-6 animate-fade-in">
          {/* Header of Word Result */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-200">
            <div className="space-y-1">
              {/* Furigana / Reading */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-stone-500 font-medium">
                  {result.reading} {result.romaji ? `· [${result.romaji}]` : ''}
                </span>
                {result.jlpt && (
                  <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[11px] font-bold rounded">
                    JLPT {result.jlpt}
                  </span>
                )}
                {result.category && (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold rounded">
                    {result.category}
                  </span>
                )}
              </div>

              {/* Japanese Word + Big Sino-Vietnamese */}
              <div className="flex flex-wrap items-baseline gap-3 pt-1">
                <h2 className="text-3xl sm:text-4xl font-kanji font-bold text-stone-900 tracking-wide">
                  {result.word}
                </h2>
                <span className="text-xl sm:text-2xl font-black text-rose-700 tracking-wider">
                  [{result.hanViet}]
                </span>
              </div>

              {/* Meaning */}
              <p className="text-base text-stone-800 font-medium pt-1">
                {result.meaning}
              </p>
              {result.detailedMeaning && (
                <p className="text-xs text-stone-600 leading-relaxed max-w-3xl pt-1">
                  {result.detailedMeaning}
                </p>
              )}
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap md:flex-col items-stretch gap-2 shrink-0">
              <button
                onClick={() => speakJapanese(result.word)}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-stone-200 shadow-2xs"
                title="Phát âm từ vựng"
              >
                <Volume2 className="w-4 h-4 text-stone-600" />
                <span>Phát âm</span>
              </button>

              <button
                onClick={handleCopyAnalysis}
                className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-stone-200 shadow-2xs"
                title="Sao chép toàn bộ phân tích"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
              </button>

              <button
                onClick={handleToggleFavorite}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 border shadow-2xs ${
                  isFavorited
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{isFavorited ? 'Đã lưu sổ tay' : 'Lưu sổ tay'}</span>
              </button>

              <button
                onClick={handleSaveToPersonalData}
                disabled={isSavedLocally}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                  isSavedLocally
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : `${theme.primaryBg} ${theme.primaryHoverBg} text-white`
                }`}
                title="Thêm từ này và các chữ Kanji cấu thành vào kho dữ liệu cá nhân"
              >
                {isSavedLocally ? <Check className="w-4 h-4 text-emerald-600" /> : <Plus className="w-4 h-4" />}
                <span>{isSavedLocally ? 'Đã có trong kho từ' : 'Thêm vào kho từ'}</span>
              </button>
            </div>
          </div>

          {/* Constituent Kanji Character Breakdown Grid */}
          {result.kanjiList && result.kanjiList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">
                  <Layers className={`w-4 h-4 ${theme.primaryText}`} />
                  <span>Bóc tách từng chữ Hán cấu thành ({result.kanjiList.length} chữ)</span>
                </h4>
                <span className="text-xs text-stone-400">Bấm để luyện viết hoặc xem chi tiết</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.kanjiList.map((k) => (
                  <div
                    key={k.kanji}
                    className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5 hover:border-stone-300 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-kanji font-bold text-stone-900 leading-none">
                          {k.kanji}
                        </span>
                        <div>
                          <span className="text-sm font-bold text-rose-700 block">
                            [{k.hanViet}]
                          </span>
                          <span className="text-[11px] text-stone-500">
                            {k.strokeCount ? `${k.strokeCount} nét` : ''} {k.radical ? `· Bộ: ${k.radical}` : ''}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectWord(k.kanji)}
                        className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-stone-200"
                        title={`Tra cứu chi tiết chữ [${k.kanji}]`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-700 font-medium line-clamp-2">
                      {k.meaning}
                    </p>

                    {/* Readings */}
                    <div className="pt-1 text-[11px] space-y-1 text-stone-600 border-t border-stone-200/60">
                      {k.on && k.on.length > 0 && (
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-semibold text-stone-400 uppercase text-[9px]">On:</span>
                          <span className="font-mono-numbers text-stone-700">{k.on.join(', ')}</span>
                        </div>
                      )}
                      {k.kun && k.kun.length > 0 && (
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-semibold text-stone-400 uppercase text-[9px]">Kun:</span>
                          <span className="text-stone-700">{k.kun.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {k.mnemonic && (
                      <p className="text-[11px] text-stone-500 italic bg-white/70 p-2 rounded-lg border border-stone-200/60 leading-relaxed">
                        💡 {k.mnemonic}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Origin & Etymology Notes */}
          {result.originNotes && (
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/70 space-y-1 text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-700" />
                <span>Nguồn gốc & Chiết tự Hán Việt:</span>
              </span>
              <p className="text-stone-700 leading-relaxed">{result.originNotes}</p>
            </div>
          )}

          {/* Example Sentences */}
          {result.exampleSentences && result.exampleSentences.length > 0 && (
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-stone-500" />
                <span>Ví dụ ngữ cảnh thực tế:</span>
              </h4>
              <div className="space-y-2">
                {result.exampleSentences.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-kanji text-sm font-semibold text-stone-900">
                        {ex.japanese}
                      </p>
                      <button
                        onClick={() => speakJapanese(ex.japanese)}
                        className="text-stone-400 hover:text-stone-700 shrink-0"
                        title="Nghe câu"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {ex.furigana && <p className="text-[11px] text-stone-500">{ex.furigana}</p>}
                    <p className="text-stone-700 font-medium pt-0.5">{ex.vietnamese}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
