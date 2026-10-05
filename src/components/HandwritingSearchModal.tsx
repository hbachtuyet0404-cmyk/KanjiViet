import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  X,
  RotateCcw,
  Trash2,
  Sparkles,
  Search,
  Plus,
  PenTool,
  Check,
  ChevronRight,
  Info,
  Loader2,
  Volume2,
  BookOpen,
  ArrowRight,
  Layers,
  Lightbulb,
  Globe,
} from 'lucide-react';
import { ExternalSearchResult, HandwritingCandidate, KanjiCompoundExample } from '../types/kanji';
import { ThemeConfig } from '../utils/themeManager';
import { JOYO_HAN_VIET_MAP } from '../data/joyoHanVietMap';
import { CURATED_KANJI } from '../data/curatedKanji';
import { CURATED_COMPOUNDS } from '../data/curatedCompounds';
import { speakJapanese } from '../utils/kanjiDatabase';
import { convertCandidateToExternalResult } from '../utils/syncDataHelper';

interface HandwritingSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCandidate: (kanji: string, executeSearchImmediately?: boolean) => void;
  onAppendCandidate: (kanji: string) => void;
  onSyncRecognizedData?: (candidate: HandwritingCandidate, externalResult: ExternalSearchResult) => void;
  currentSearchQuery: string;
  theme: ThemeConfig;
  onToast: (msg: string) => void;
}

// Find example compounds containing this kanji
function getKanjiExamples(kanjiChar: string): KanjiCompoundExample[] {
  const detail = CURATED_KANJI[kanjiChar];
  if (detail?.compounds && detail.compounds.length > 0) {
    return detail.compounds;
  }
  const fromCompounds = CURATED_COMPOUNDS.filter((c) => c.word.includes(kanjiChar)).slice(0, 4);
  if (fromCompounds.length > 0) {
    return fromCompounds.map((c) => ({
      word: c.word,
      reading: c.reading,
      hanViet: c.hanViet,
      meaning: c.meaning,
    }));
  }
  return [];
}

// Build initial rich candidate data
function buildCandidate(kanji: string, confidence: 'high' | 'medium' | 'low' = 'high'): HandwritingCandidate {
  const curated = CURATED_KANJI[kanji];
  const joyo = (JOYO_HAN_VIET_MAP as Record<string, any>)[kanji];
  const examples = getKanjiExamples(kanji);

  return {
    kanji,
    hanViet: curated?.hanViet || joyo?.hv || 'HÁN TỰ',
    meaning: curated?.meaning || joyo?.m || 'Ký tự chữ Hán tiếng Nhật',
    on: curated?.on || joyo?.on || [],
    kun: curated?.kun || joyo?.kun || [],
    radical: curated?.radical || joyo?.radical || 'Bộ thủ',
    strokeCount: curated?.strokeCount || joyo?.strokes || 10,
    confidence,
    compounds: examples,
    exampleSentence: curated?.mnemonic
      ? {
          japanese: `${kanji}を使った語彙を学ぶ。`,
          furigana: `${kanji}をつかった ごいをおなぶ。`,
          vietnamese: curated.mnemonic,
        }
      : undefined,
  };
}

const DEFAULT_POPULAR_CANDIDATES: HandwritingCandidate[] = [
  buildCandidate('曖', 'high'),
  buildCandidate('経', 'medium'),
  buildCandidate('済', 'medium'),
  buildCandidate('学', 'medium'),
  buildCandidate('国', 'medium'),
  buildCandidate('語', 'medium'),
];

export const HandwritingSearchModal: React.FC<HandwritingSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCandidate,
  onAppendCandidate,
  onSyncRecognizedData,
  currentSearchQuery,
  theme,
  onToast,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokesHistory, setStrokesHistory] = useState<ImageData[]>([]);
  const [strokeCount, setStrokeCount] = useState(0);
  const [gridType, setGridType] = useState<'mizi' | 'tianzi' | 'none'>('mizi');
  const [candidates, setCandidates] = useState<HandwritingCandidate[]>(DEFAULT_POPULAR_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState<HandwritingCandidate>(DEFAULT_POPULAR_CANDIDATES[0]);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [penColor, setPenColor] = useState('#1C1917');
  const [brushWidth, setBrushWidth] = useState(7);
  const [recentInserted, setRecentInserted] = useState<string[]>([]);
  const recognizeTimerRef = useRef<any>(null);

  // Setup canvas
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    const initialBlank = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokesHistory([initialBlank]);
    setStrokeCount(0);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(setupCanvas, 60);
    }
  }, [isOpen, setupCanvas]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (recognizeTimerRef.current) clearTimeout(recognizeTimerRef.current);
    };
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else if ('clientX' in e) {
      return {
        x: (e as React.MouseEvent).clientX - rect.left,
        y: (e as React.MouseEvent).clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (recognizeTimerRef.current) {
      clearTimeout(recognizeTimerRef.current);
    }

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineWidth = brushWidth;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.closePath();
    const currentFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokesHistory((prev) => [...prev.slice(-30), currentFrame]);
    const newCount = strokeCount + 1;
    setStrokeCount(newCount);

    // 1. Instant 0ms prediction based on stroke count & local dictionary
    updateInstantCandidates(newCount);

    // 2. Trigger auto-recognition by AI right after drawing pauses (650ms debounce)
    if (recognizeTimerRef.current) clearTimeout(recognizeTimerRef.current);
    recognizeTimerRef.current = setTimeout(() => {
      triggerAIRecognition();
    }, 650);
  };

  // Instant local prediction based on stroke count
  const updateInstantCandidates = (currentStrokes: number) => {
    const matched: HandwritingCandidate[] = [];
    for (const [char, info] of Object.entries(JOYO_HAN_VIET_MAP)) {
      if (Math.abs((info.strokes || 0) - currentStrokes) <= 1) {
        matched.push(buildCandidate(char, (info.strokes || 0) === currentStrokes ? 'high' : 'medium'));
      }
      if (matched.length >= 6) break;
    }

    if (matched.length > 0) {
      setCandidates(matched);
      setSelectedCandidate(matched[0]);
      const ext = convertCandidateToExternalResult(matched[0]);
      onSyncRecognizedData?.(matched[0], ext);
    }
  };

  const handleUndo = () => {
    if (strokesHistory.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...strokesHistory];
    newHistory.pop();
    const previousState = newHistory[newHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setStrokesHistory(newHistory);
    const newCount = Math.max(0, strokeCount - 1);
    setStrokeCount(newCount);

    if (newCount > 0) {
      updateInstantCandidates(newCount);
      if (recognizeTimerRef.current) clearTimeout(recognizeTimerRef.current);
      recognizeTimerRef.current = setTimeout(() => {
        triggerAIRecognition();
      }, 700);
    }
  };

  const handleClear = () => {
    if (recognizeTimerRef.current) clearTimeout(recognizeTimerRef.current);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const blank = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokesHistory([blank]);
    setStrokeCount(0);
    setCandidates(DEFAULT_POPULAR_CANDIDATES);
    setSelectedCandidate(DEFAULT_POPULAR_CANDIDATES[0]);
  };

  // AI Recognition from canvas
  const triggerAIRecognition = async () => {
    const canvas = canvasRef.current;
    if (!canvas || strokesHistory.length <= 1) return;

    setIsRecognizing(true);
    try {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const expCtx = exportCanvas.getContext('2d');
      if (expCtx) {
        expCtx.fillStyle = '#FFFFFF';
        expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        expCtx.drawImage(canvas, 0, 0);
      }

      const dataUrl = exportCanvas.toDataURL('image/png');
      const res = await fetch('/api/recognize-kanji', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: dataUrl }),
      });

      const json = await res.json();
      if (json.success && json.data?.candidates && json.data.candidates.length > 0) {
        const enriched: HandwritingCandidate[] = json.data.candidates.map((c: any) => {
          const local = buildCandidate(c.kanji, c.confidence || 'high');
          return {
            kanji: c.kanji,
            hanViet: c.hanViet || local.hanViet,
            meaning: c.meaning || local.meaning,
            on: c.on && c.on.length > 0 ? c.on : local.on,
            kun: c.kun && c.kun.length > 0 ? c.kun : local.kun,
            radical: c.radical || local.radical,
            strokeCount: c.strokeCount || local.strokeCount,
            confidence: c.confidence || 'high',
            compounds: c.compounds && c.compounds.length > 0 ? c.compounds : local.compounds,
            exampleSentence: c.exampleSentence || local.exampleSentence,
          };
        });

        setCandidates(enriched);
        setSelectedCandidate(enriched[0]);
        const ext = convertCandidateToExternalResult(enriched[0]);
        onSyncRecognizedData?.(enriched[0], ext);
        onToast(`AI vừa nhận diện: Chữ [${enriched[0].kanji} - ${enriched[0].hanViet}] (${enriched[0].meaning})!`);
      }
    } catch (err: any) {
      console.warn('AI recognition failed, using local candidate predictor');
    } finally {
      setIsRecognizing(false);
    }
  };

  const handleSelectWord = (kanji: string) => {
    onSelectCandidate(kanji, true);
    onClose();
  };

  const handleAppendWord = (kanji: string) => {
    onAppendCandidate(kanji);
    setRecentInserted((prev) => [...prev, kanji]);
    onToast(`Đã thêm chữ [${kanji}] vào ô tìm kiếm! Bạn có thể vẽ chữ tiếp theo để ghép từ.`);
    handleClear();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-4xl w-full overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between ${theme.bgSubtle}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${theme.primaryBg} text-white flex items-center justify-center shadow-xs`}>
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>Vẽ tay tra cứu chữ Hán (Nhận diện chữ & nghĩa tức thì)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  AI Auto-Recognition
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Vừa vẽ xong là AI nhận diện ra chữ, âm Hán Việt, nghĩa cốt lõi, từ ghép ví dụ và gợi ý ngay
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Query & Status Sub-header */}
        <div className="px-5 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-500">Ô tìm kiếm:</span>
            <span className="font-kanji font-bold text-stone-900 text-sm bg-white px-2.5 py-0.5 rounded-md border border-stone-200">
              {currentSearchQuery || '(Trống)'}
            </span>
            {recentInserted.length > 0 && (
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Đã thêm: {recentInserted.join(' ')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-stone-500">
            {isRecognizing ? (
              <span className="flex items-center gap-1.5 text-rose-700 font-semibold animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AI đang nhận diện...</span>
              </span>
            ) : (
              <span>Số nét: <strong className="text-stone-800">{strokeCount}</strong> nét</span>
            )}
          </div>
        </div>

        {/* Main Body: 2-column layout on desktop (Left: Canvas, Right: Live Recognized Card & Examples) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: The Drawing Canvas Stage */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-3">
            <div className="relative w-full max-w-[300px] aspect-square rounded-2xl bg-[#FFFDF9] border-2 border-stone-300 shadow-inner overflow-hidden touch-none select-none">
              {/* Guidelines */}
              {gridType !== 'none' && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none stroke-rose-200/70"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="50%" y1="0" x2="50%" y2="100%" strokeDasharray="4,4" strokeWidth="1.5" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" strokeDasharray="4,4" strokeWidth="1.5" />
                  {gridType === 'mizi' && (
                    <>
                      <line x1="0" y1="0" x2="100%" y2="100%" strokeDasharray="3,3" strokeWidth="1" />
                      <line x1="100%" y1="0" x2="0" y2="100%" strokeDasharray="3,3" strokeWidth="1" />
                    </>
                  )}
                  <rect x="8%" y="8%" width="84%" height="84%" fill="none" stroke="#F3D5DD" strokeWidth="1" strokeDasharray="2,2" />
                </svg>
              )}

              {strokesHistory.length <= 1 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-stone-300 space-y-1">
                  <span className="font-kanji text-5xl opacity-40">筆</span>
                  <span className="text-[11px] text-stone-400 font-medium">Vẽ chữ Kanji tại đây</span>
                  <span className="text-[10px] text-stone-400">Vẽ xong AI tự động ra kết quả</span>
                </div>
              )}

              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="absolute inset-0 w-full h-full cursor-crosshair z-10"
              />
            </div>

            {/* Quick Canvas Buttons */}
            <div className="flex items-center gap-2 w-full max-w-[300px]">
              <button
                onClick={handleUndo}
                disabled={strokesHistory.length <= 1}
                className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1 border border-stone-200"
                title="Hoàn tác nét vừa viết"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Hoàn tác</span>
              </button>

              <button
                onClick={handleClear}
                className="flex-1 py-2 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1 border border-stone-200"
                title="Xóa vẽ lại chữ khác"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa bảng</span>
              </button>

              <button
                onClick={triggerAIRecognition}
                disabled={isRecognizing || strokesHistory.length <= 1}
                className={`flex-1 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1 shadow-xs transition-all ${theme.primaryBg} ${theme.primaryHoverBg} disabled:opacity-40`}
                title="Yêu cầu AI nhận diện lại"
              >
                {isRecognizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Nhận diện</span>
              </button>
            </div>

            {/* Grid selector */}
            <div className="flex items-center justify-between gap-1 w-full max-w-[300px] text-[11px] text-stone-500">
              <span>Kiểu lưới:</span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'mizi', label: 'Ô Mễ (米)' },
                  { id: 'tianzi', label: 'Ô Điền (十)' },
                  { id: 'none', label: 'Trơn' },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGridType(g.id as any)}
                    className={`px-2 py-0.5 rounded border transition-colors ${
                      gridType === g.id
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border-stone-200'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE RECOGNIZED RESULT & EXAMPLES CARD */}
          <div className="lg:col-span-7 space-y-4">
            {/* Top Recognized Hero Card */}
            <div className={`p-5 rounded-2xl border-2 ${theme.borderSubtle} bg-white shadow-sm space-y-4 relative overflow-hidden`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  {/* Huge Kanji Glyph */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#FFFDF9] border-2 border-stone-300 flex items-center justify-center shadow-xs shrink-0 relative group">
                    <span className="text-5xl sm:text-6xl font-kanji font-bold text-stone-900 leading-none">
                      {selectedCandidate.kanji}
                    </span>
                    <button
                      onClick={() => speakJapanese(selectedCandidate.kanji)}
                      className="absolute bottom-1 right-1 p-1 bg-white/90 hover:bg-white rounded text-stone-500 hover:text-stone-900 shadow-2xs"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Readings & Meaning */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-rose-700 tracking-wide">
                        [{selectedCandidate.hanViet}]
                      </span>
                      {selectedCandidate.strokeCount && (
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-[11px] font-semibold rounded">
                          {selectedCandidate.strokeCount} nét
                        </span>
                      )}
                      {selectedCandidate.radical && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold rounded">
                          Bộ: {selectedCandidate.radical}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-stone-800 leading-snug">
                      {selectedCandidate.meaning}
                    </h4>

                    {/* On / Kun */}
                    <div className="pt-1 text-xs space-y-0.5 text-stone-600">
                      {selectedCandidate.on && selectedCandidate.on.length > 0 && (
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-stone-400 text-[10px] uppercase">Onyomi:</span>
                          <span className="font-mono-numbers font-medium text-stone-800">
                            {selectedCandidate.on.join(', ')}
                          </span>
                        </div>
                      )}
                      {selectedCandidate.kun && selectedCandidate.kun.length > 0 && (
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-stone-400 text-[10px] uppercase">Kunyomi:</span>
                          <span className="font-medium text-stone-800">
                            {selectedCandidate.kun.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => handleSelectWord(selectedCandidate.kanji)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center justify-center gap-1.5 transition-all ${theme.primaryBg} ${theme.primaryHoverBg}`}
                    title="Tra cứu toàn diện chữ này trong từ điển"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Tra cứu ngay</span>
                  </button>

                  <button
                    onClick={() => handleAppendWord(selectedCandidate.kanji)}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-stone-200 transition-colors"
                    title="Thêm chữ này vào sau ô tìm kiếm để vẽ tiếp chữ khác"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Chèn vào ô (+)</span>
                  </button>

                  <button
                    onClick={() => {
                      const ext = convertCandidateToExternalResult(selectedCandidate);
                      onSyncRecognizedData?.(selectedCandidate, ext);
                      onSelectCandidate(selectedCandidate.kanji, false);
                      onClose();
                    }}
                    className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    title="Mở bảng tra cứu mở rộng bên ngoài với dữ liệu đầy đủ của chữ này"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Tra mở rộng AI</span>
                  </button>
                </div>
              </div>

              {/* Concrete Example Compounds (Ví dụ từ ghép phổ biến chứa chữ này) */}
              <div className="pt-3 border-t border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Layers className={`w-3.5 h-3.5 ${theme.primaryText}`} />
                  <span>Ví dụ các từ ghép phổ biến chứa chữ [{selectedCandidate.kanji}]:</span>
                </span>

                {selectedCandidate.compounds && selectedCandidate.compounds.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCandidate.compounds.map((cp) => (
                      <button
                        key={cp.word}
                        onClick={() => handleSelectWord(cp.word)}
                        className="p-2.5 bg-stone-50 hover:bg-stone-100/90 rounded-xl border border-stone-200 text-left transition-colors flex items-center justify-between group"
                        title={`Bấm để tra cứu từ [${cp.word}]`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-kanji font-bold text-sm text-stone-900 group-hover:text-rose-700">
                              {cp.word}
                            </span>
                            {cp.reading && (
                              <span className="text-[11px] text-stone-400">({cp.reading})</span>
                            )}
                            <span className="text-[11px] font-bold text-rose-700">
                              [{cp.hanViet}]
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-600 truncate mt-0.5 max-w-[170px]">
                            {cp.meaning}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-rose-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-400 italic">
                    Chữ Hán đơn lập. Bấm &quot;Tra cứu ngay&quot; để tìm kiếm tất cả các từ ghép liên quan trên toàn bộ từ điển.
                  </p>
                )}
              </div>

              {/* Example sentence / Mnemonic hint */}
              {selectedCandidate.exampleSentence && (
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 text-xs space-y-1">
                  <div className="flex items-center justify-between text-amber-900 font-semibold text-[11px]">
                    <span className="flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      <span>Câu ví dụ / Mẹo ghi nhớ:</span>
                    </span>
                    <button
                      onClick={() => speakJapanese(selectedCandidate.exampleSentence!.japanese)}
                      className="text-amber-700 hover:text-amber-900"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="font-kanji text-stone-900 font-medium text-xs">
                    {selectedCandidate.exampleSentence.japanese}
                  </p>
                  <p className="text-stone-600">{selectedCandidate.exampleSentence.vietnamese}</p>
                </div>
              )}
            </div>

            {/* Other Recognized Candidates (Gợi ý các chữ tương tự) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Gợi ý các chữ Kanji tương tự (Bấm để xem nghĩa & ví dụ):</span>
                </span>
                <span className="text-[11px] text-stone-400">
                  {candidates.length} chữ tiềm năng
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {candidates.map((c) => {
                  const isSelected = selectedCandidate.kanji === c.kanji;
                  return (
                    <button
                      key={c.kanji}
                      onClick={() => {
                        setSelectedCandidate(c);
                        const ext = convertCandidateToExternalResult(c);
                        onSyncRecognizedData?.(c, ext);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200 shadow-2xs'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-2xl font-kanji font-bold text-stone-900 leading-none">
                          {c.kanji}
                        </span>
                        <div className="truncate">
                          <span className="text-xs font-bold text-rose-700 block truncate">
                            [{c.hanViet}]
                          </span>
                          <span className="text-[10px] text-stone-500 truncate block">
                            {c.meaning}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-500">
            <Info className="w-4 h-4 text-stone-400 shrink-0" />
            <span>AI sẽ tự nhận diện sau khi bạn ngừng bút 0.6 giây, hoặc bấm nút &quot;Nhận diện&quot;.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold rounded-xl transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={() => handleSelectWord(selectedCandidate.kanji)}
              className={`flex-1 sm:flex-none px-5 py-2 ${theme.primaryBg} ${theme.primaryHoverBg} text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs`}
            >
              <Search className="w-4 h-4" />
              <span>Tra cứu ngay chữ [{selectedCandidate.kanji} - {selectedCandidate.hanViet}]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
