import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  PenTool,
  RotateCcw,
  Trash2,
  Download,
  Bookmark,
  Eye,
  EyeOff,
  Palette,
  Check,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowRight,
  Search,
  Plus,
  Volume2,
  Lightbulb,
  HelpCircle,
  X,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { SavedHandwriting, UserAccount } from '../types/kanji';
import {
  getUserHandwriting,
  saveUserHandwriting,
  deleteUserHandwriting,
  getUserPracticeQueue,
  addToUserPracticeQueue,
  removeFromUserPracticeQueue,
} from '../utils/accountManager';
import { ThemeConfig } from '../utils/themeManager';
import { JOYO_HAN_VIET_MAP } from '../data/joyoHanVietMap';
import { CURATED_KANJI } from '../data/curatedKanji';
import { speakJapanese } from '../utils/kanjiDatabase';

interface HandwritingPadProps {
  currentKanji: string;
  currentHanViet: string;
  theme: ThemeConfig;
  user: UserAccount;
  onSelectKanji: (k: string) => void;
  onSearchKanji?: (k: string) => void;
  onToast: (msg: string) => void;
}

interface EvaluationResult {
  status: 'idle' | 'correct' | 'wrong';
  accuracy: number;
  coverage: number;
  feedback: string;
  wrongParts?: string[];
  aiEvaluated?: boolean;
  score?: number;
}

function getKanjiInfo(kanji: string) {
  const curated = CURATED_KANJI[kanji];
  const joyo = (JOYO_HAN_VIET_MAP as Record<string, any>)[kanji];
  return {
    kanji,
    hanViet: curated?.hanViet || joyo?.hv || 'HÁN TỰ',
    meaning: curated?.meaning || joyo?.m || 'Ký tự chữ Hán tiếng Nhật',
    on: curated?.on || joyo?.on || [],
    kun: curated?.kun || joyo?.kun || [],
    radical: curated?.radical || joyo?.radical || 'Bộ thủ',
    strokeCount: curated?.strokeCount || joyo?.strokes || 10,
  };
}

export const HandwritingPad: React.FC<HandwritingPadProps> = ({
  currentKanji,
  currentHanViet,
  theme,
  user,
  onSelectKanji,
  onSearchKanji,
  onToast,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrongOverlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokesHistory, setStrokesHistory] = useState<ImageData[]>([]);
  const [showGhost, setShowGhost] = useState(true);
  const [gridType, setGridType] = useState<'mizi' | 'tianzi' | 'none'>('mizi');
  const [brushWidth, setBrushWidth] = useState<number>(8);
  const [inkColor, setInkColor] = useState<string>('#1C1917'); // Sumi ink
  const [savedDrawings, setSavedDrawings] = useState<SavedHandwriting[]>([]);
  const [activePracticeChar, setActivePracticeChar] = useState(currentKanji || '漢');
  const [practiceQueue, setPracticeQueue] = useState<string[]>([]);
  const [newKanjiInput, setNewKanjiInput] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Evaluation & Wrong-part highlighting state
  const [evalResult, setEvalResult] = useState<EvaluationResult>({
    status: 'idle',
    accuracy: 0,
    coverage: 0,
    feedback: '',
  });
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);
  const [showRedOverlay, setShowRedOverlay] = useState(true);

  // Load user practice queue and saved drawings
  useEffect(() => {
    setSavedDrawings(getUserHandwriting(user.id));
    const queue = getUserPracticeQueue(user.id);
    setPracticeQueue(queue);
    if (currentKanji) {
      setActivePracticeChar(currentKanji);
      if (!queue.includes(currentKanji)) {
        const updated = addToUserPracticeQueue(user.id, [currentKanji]);
        setPracticeQueue(updated);
      }
    } else if (queue.length > 0) {
      setActivePracticeChar(queue[0]);
    }
  }, [user.id, currentKanji]);

  // Canvas setup
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const overlay = wrongOverlayCanvasRef.current;
    if (!canvas || !overlay) return;

    const ctx = canvas.getContext('2d');
    const overlayCtx = overlay.getContext('2d');
    if (!ctx || !overlayCtx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    overlay.width = rect.width * dpr;
    overlay.height = rect.height * dpr;
    overlayCtx.scale(dpr, dpr);

    ctx.clearRect(0, 0, rect.width, rect.height);
    overlayCtx.clearRect(0, 0, rect.width, rect.height);

    const initialBlank = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokesHistory([initialBlank]);
  }, []);

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => window.removeEventListener('resize', setupCanvas);
  }, [setupCanvas]);

  // Clear wrong overlay whenever switching character or clearing
  const clearWrongOverlay = () => {
    const overlay = wrongOverlayCanvasRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, overlay.width, overlay.height);
  };

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

    // Clear previous wrong evaluation highlights on new stroke
    if (evalResult.status !== 'idle') {
      setEvalResult({ status: 'idle', accuracy: 0, coverage: 0, feedback: '' });
      clearWrongOverlay();
    }

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = inkColor;
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
    setStrokesHistory((prev) => [...prev.slice(-25), currentFrame]);
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
    setEvalResult({ status: 'idle', accuracy: 0, coverage: 0, feedback: '' });
    clearWrongOverlay();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const blank = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokesHistory([blank]);
    setEvalResult({ status: 'idle', accuracy: 0, coverage: 0, feedback: '' });
    clearWrongOverlay();
  };

  // Add custom kanji to practice queue
  const handleAddKanjiToQueue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newKanjiInput.trim();
    if (!clean) return;

    // Extract all kanji from input (can be multiple or a word like 曖昧, 臨機応変)
    const matches = clean.match(/[\u4e00-\u9faf\u3400-\u4dbf]/g);
    if (!matches || matches.length === 0) {
      onToast('Vui lòng nhập ký tự chữ Hán (Kanji) hợp lệ!');
      return;
    }

    const updated = addToUserPracticeQueue(user.id, matches);
    setPracticeQueue(updated);
    setActivePracticeChar(matches[0]);
    onSelectKanji(matches[0]);
    setNewKanjiInput('');
    setIsAddModalOpen(false);
    handleClear();
    onToast(`Đã thêm ${matches.length} chữ Kanji vào danh sách luyện viết của bạn!`);
  };

  const handleRemoveFromQueue = (charToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (practiceQueue.length <= 1) {
      onToast('Cần giữ ít nhất 1 chữ trong danh sách luyện tập.');
      return;
    }
    const updated = removeFromUserPracticeQueue(user.id, charToRemove);
    setPracticeQueue(updated);
    if (activePracticeChar === charToRemove) {
      const next = updated[0];
      setActivePracticeChar(next);
      onSelectKanji(next);
      handleClear();
    }
    onToast(`Đã xóa chữ [${charToRemove}] khỏi danh sách luyện tập`);
  };

  const handleSelectPracticeChar = (char: string) => {
    setActivePracticeChar(char);
    onSelectKanji(char);
    handleClear();
  };

  // -------------------------------------------------------------
  // CORE EVALUATION ENGINE:
  // "nếu đúng thì tích đúng, sai thì tô đỏ phần sai"
  // Compares user drawing with target template character outline
  // -------------------------------------------------------------
  const handleCheckHandwriting = () => {
    const canvas = canvasRef.current;
    const overlay = wrongOverlayCanvasRef.current;
    if (!canvas || !overlay || strokesHistory.length <= 1) {
      onToast('Vui lòng vẽ nét chữ lên bảng trước khi bấm kiểm tra!');
      return;
    }

    const width = canvas.width;
    const height = canvas.height;
    const userCtx = canvas.getContext('2d');
    const overlayCtx = overlay.getContext('2d');
    if (!userCtx || !overlayCtx) return;

    // 1. Create an offscreen reference template canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Render the target template character exactly centered
    tempCtx.clearRect(0, 0, width, height);
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    const fontSize = Math.floor(width * 0.65);
    tempCtx.font = `bold ${fontSize}px "Noto Serif JP", serif`;
    tempCtx.fillStyle = '#000000';
    tempCtx.fillText(activePracticeChar, width / 2, height / 2);

    // Get pixel buffers
    const userImgData = userCtx.getImageData(0, 0, width, height);
    const userPixels = userImgData.data;

    const tempImgData = tempCtx.getImageData(0, 0, width, height);
    const tempPixels = tempImgData.data;

    // 2. Build template mask with safe margin dilation (stroke tolerance zone)
    // Dilate by radius of tolerance (~16px)
    const tolerance = Math.max(12, Math.floor(width * 0.035));
    const isTemplatePixel = new Uint8Array(width * height);
    const dilatedMask = new Uint8Array(width * height);

    let templatePixelCount = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        if (tempPixels[idx + 3] > 60) {
          isTemplatePixel[y * width + x] = 1;
          templatePixelCount++;
        }
      }
    }

    // Dilate template for human handwriting margin
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (isTemplatePixel[y * width + x]) {
          const yMin = Math.max(0, y - tolerance);
          const yMax = Math.min(height - 1, y + tolerance);
          const xMin = Math.max(0, x - tolerance);
          const xMax = Math.min(width - 1, x + tolerance);
          for (let dy = yMin; dy <= yMax; dy++) {
            for (let dx = xMin; dx <= xMax; dx++) {
              dilatedMask[dy * width + dx] = 1;
            }
          }
        }
      }
    }

    // 3. Compare user drawn pixels against dilated mask
    overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
    const overlayImgData = overlayCtx.createImageData(width, height);
    const overlayPixels = overlayImgData.data;

    let userDrawnCount = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let coveredTemplatePixels = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pIndex = y * width + x;
        const idx = pIndex * 4;
        const userAlpha = userPixels[idx + 3];

        if (userAlpha > 50) {
          userDrawnCount++;
          if (dilatedMask[pIndex] === 1) {
            correctCount++;
          } else {
            // WRONG / STRAY PIXEL! Highlight in bright glowing RED
            wrongCount++;
            overlayPixels[idx] = 239;     // R
            overlayPixels[idx + 1] = 68;  // G
            overlayPixels[idx + 2] = 68;  // B
            overlayPixels[idx + 3] = 230; // Alpha
          }
        }

        if (isTemplatePixel[pIndex] && userAlpha > 50) {
          coveredTemplatePixels++;
        }
      }
    }

    // Put red highlights on wrong overlay
    overlayCtx.putImageData(overlayImgData, 0, 0);

    const accuracy = userDrawnCount > 0 ? Math.round((correctCount / userDrawnCount) * 100) : 0;
    const coverage = templatePixelCount > 0 ? Math.round((coveredTemplatePixels / templatePixelCount) * 100) : 0;

    // Evaluate: Is it correct?
    // User is correct if high accuracy (few stray marks outside) and decent coverage of strokes
    const isCorrect = accuracy >= 74 && coverage >= 38;

    if (isCorrect) {
      // Clear red overlay if correct!
      clearWrongOverlay();
      setEvalResult({
        status: 'correct',
        accuracy,
        coverage,
        feedback: `Tuyệt vời! Bạn đã viết ĐÚNG cấu trúc chữ [${activePracticeChar}]. Nét chữ nằm trọn trong khung chuẩn với độ chuẩn xác ${accuracy}%!`,
        score: accuracy,
      });
      onToast(`✓ ĐÚNG CHUẨN! Chữ [${activePracticeChar}] đạt độ chính xác ${accuracy}%!`);
    } else {
      // Highlight wrong parts in RED
      setEvalResult({
        status: 'wrong',
        accuracy,
        coverage,
        feedback: `Phát hiện nét vẽ CHƯA ĐÚNG hoặc bị lệch! Các phần sai/lệch ra ngoài khung chữ mẫu đã được TÔ ĐỎ trên bảng. Hãy quan sát và điều chỉnh lại.`,
        wrongParts: [
          `Độ chuẩn xác: ${accuracy}% (Khoảng ${100 - accuracy}% nét bị lệch khỏi khung chữ mẫu)`,
          `Độ đầy đủ nét: ${coverage}% so với toàn bộ chữ [${activePracticeChar}]`,
          `Các nét tô màu ĐỎ là phần bị vẽ chệch hoặc thừa nét.`,
        ],
        score: accuracy,
      });
      onToast(`✕ Chưa chuẩn: Đã TÔ ĐỎ các nét bị sai/lệch của chữ [${activePracticeChar}]!`);
    }
  };

  // AI Master Handwriting Evaluation
  const handleAiDeepEvaluation = async () => {
    const canvas = canvasRef.current;
    if (!canvas || strokesHistory.length <= 1) {
      onToast('Vui lòng vẽ chữ trước khi yêu cầu AI chấm điểm!');
      return;
    }

    setIsAiEvaluating(true);
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
      const targetInfo = getKanjiInfo(activePracticeChar);

      const res = await fetch('/api/evaluate-handwriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: dataUrl,
          targetKanji: activePracticeChar,
          targetHanViet: targetInfo.hanViet,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const { isCorrect, score, feedback, wrongParts, advice } = json.data;

        if (isCorrect) {
          clearWrongOverlay();
          setEvalResult({
            status: 'correct',
            accuracy: score || 90,
            coverage: 85,
            feedback: feedback || `AI xác nhận nét chữ [${activePracticeChar}] chuẩn xác và đúng cấu trúc!`,
            aiEvaluated: true,
            score: score || 90,
          });
          onToast(`✓ AI Chấm điểm: ĐÚNG CHUẨN (${score}/100 điểm)!`);
        } else {
          // Trigger local red highlight overlay as well
          handleCheckHandwriting();
          setEvalResult((prev) => ({
            status: 'wrong',
            accuracy: score || prev.accuracy,
            coverage: prev.coverage,
            feedback: feedback || 'Nét vẽ chưa chuẩn xác, một số nét bị méo hoặc thừa/thiếu.',
            wrongParts: wrongParts && wrongParts.length > 0 ? wrongParts : prev.wrongParts,
            aiEvaluated: true,
            score: score || prev.accuracy,
          }));
          onToast(`✕ AI Chấm điểm: ${score}/100 - Đã tô đỏ các phần chưa đúng!`);
        }
      } else {
        handleCheckHandwriting();
      }
    } catch (err: any) {
      handleCheckHandwriting();
    } finally {
      setIsAiEvaluating(false);
    }
  };

  const handleSaveToAccount = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const targetInfo = getKanjiInfo(activePracticeChar);
    const updated = saveUserHandwriting(
      user.id,
      activePracticeChar,
      targetInfo.hanViet,
      dataUrl
    );
    setSavedDrawings(updated);
    onToast(`Đã lưu nét chữ [${activePracticeChar}] vào sổ tay viết của ${user.displayName}!`);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const expCtx = exportCanvas.getContext('2d');
    if (!expCtx) return;

    expCtx.fillStyle = '#FAF7F2';
    expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    expCtx.drawImage(canvas, 0, 0);

    const a = document.createElement('a');
    a.href = exportCanvas.toDataURL('image/png');
    a.download = `kanjiviet_${activePracticeChar}_${Date.now()}.png`;
    a.click();
  };

  const currentInfo = getKanjiInfo(activePracticeChar);

  const colors = [
    { label: 'Mực đen Sumi', val: '#1C1917' },
    { label: 'Chu sa đỏ', val: '#B91C1C' },
    { label: 'Lam chàm', val: '#1E3A8A' },
    { label: 'Trà Matcha', val: '#15803D' },
    { label: 'Tím oải hương', val: '#6D28D9' },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Target Kanji Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
            <PenTool className="w-6 h-6 text-rose-700" />
            <span>Luyện Viết Chữ Hán & Chấm Nét Thông Minh</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Thêm bất kỳ chữ Kanji nào bạn muốn luyện. Hệ thống sẽ chấm nét tự động: <strong>tích đúng</strong> khi vẽ chuẩn, và <strong>tô đỏ các nét sai/lệch</strong> để bạn chỉnh sửa.
          </p>
        </div>

        {/* Selected target Kanji pill & Audio */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Đang luyện chữ:</span>
          <div className="px-3.5 py-1.5 bg-stone-100 rounded-xl flex items-center gap-2.5 border border-stone-200 shadow-2xs">
            <span className="text-3xl font-kanji font-bold text-stone-900 leading-none">
              {activePracticeChar}
            </span>
            <div>
              <span className="text-xs font-bold text-rose-700 block">
                [{currentInfo.hanViet}]
              </span>
              <span className="text-[10px] text-stone-500">
                {currentInfo.strokeCount} nét · Bộ: {currentInfo.radical}
              </span>
            </div>
            <button
              onClick={() => speakJapanese(activePracticeChar)}
              className="p-1 text-stone-400 hover:text-stone-800"
              title="Phát âm chữ này"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* FEATURE 1: USER CAN ADD & SELECT ANY KANJI TO PRACTICE */}
      <div className={`p-4 rounded-2xl border ${theme.borderSubtle} bg-white shadow-2xs space-y-3`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className={`w-4 h-4 ${theme.primaryText}`} />
              <span>Danh sách chữ Hán bạn đang luyện tập ({practiceQueue.length}):</span>
            </span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-2xs flex items-center gap-1.5 transition-all ${theme.primaryBg} ${theme.primaryHoverBg}`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm chữ muốn luyện (+)</span>
          </button>
        </div>

        {/* Queue of Practice Kanji Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {practiceQueue.map((char) => {
            const info = getKanjiInfo(char);
            const isActive = activePracticeChar === char;
            return (
              <div
                key={char}
                onClick={() => handleSelectPracticeChar(char)}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 shrink-0 group ${
                  isActive
                    ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200 shadow-2xs'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                }`}
              >
                <span className="text-xl font-kanji font-bold text-stone-900 leading-none">
                  {char}
                </span>
                <div className="text-left">
                  <span className={`text-[11px] font-bold block leading-none ${isActive ? 'text-rose-700' : 'text-stone-700'}`}>
                    [{info.hanViet}]
                  </span>
                  <span className="text-[9px] text-stone-400">
                    {info.strokeCount} nét
                  </span>
                </div>
                {practiceQueue.length > 1 && (
                  <button
                    onClick={(e) => handleRemoveFromQueue(char, e)}
                    className="text-stone-300 hover:text-rose-600 p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Xóa chữ này khỏi danh sách"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* STAGE: CANVAS & EVALUATION RESULTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Canvas Stage with Tian Zi Ge / Mi Zi Ge & Wrong Red Overlay */}
        <div className="lg:col-span-7 flex flex-col items-center space-y-4">
          <div className="relative w-full max-w-[420px] aspect-square rounded-2xl bg-[#FFFDF9] border-2 border-stone-300 shadow-md overflow-hidden select-none touch-none">
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

            {/* Ghost Character Template */}
            {showGhost && activePracticeChar && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <span className="text-[250px] font-kanji font-bold text-stone-200/50 leading-none">
                  {activePracticeChar}
                </span>
              </div>
            )}

            {/* Main Drawing Canvas */}
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

            {/* FEATURE 2: WRONG PARTS RED HIGHLIGHT OVERLAY (TÔ ĐỎ PHẦN SAI) */}
            <canvas
              ref={wrongOverlayCanvasRef}
              className={`absolute inset-0 w-full h-full pointer-events-none z-20 transition-opacity duration-300 ${
                showRedOverlay ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Stamp / Badge Overlay on Canvas when evaluated */}
            {evalResult.status === 'correct' && (
              <div className="absolute top-4 right-4 z-30 bg-emerald-500 text-white px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-bold animate-bounce-subtle">
                <CheckCircle2 className="w-4 h-4" />
                <span>CHÍNH XÁC ({evalResult.score || evalResult.accuracy}%)</span>
              </div>
            )}

            {evalResult.status === 'wrong' && (
              <div className="absolute top-4 right-4 z-30 bg-red-600 text-white px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-bold animate-pulse">
                <XCircle className="w-4 h-4" />
                <span>ĐÃ TÔ ĐỎ NÉT SAI</span>
              </div>
            )}
          </div>

          {/* Canvas Actions Toolbar */}
          <div className="flex flex-wrap items-center justify-center gap-2 w-full max-w-[420px]">
            {/* CHECK STROKES BUTTON */}
            <button
              onClick={handleCheckHandwriting}
              disabled={strokesHistory.length <= 1}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              title="Kiểm tra nét viết: Đúng thì tích xanh, sai thì tô đỏ phần sai"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kiểm tra nét viết</span>
            </button>

            {/* AI DEEP EVALUATE BUTTON */}
            <button
              onClick={handleAiDeepEvaluation}
              disabled={isAiEvaluating || strokesHistory.length <= 1}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all flex items-center gap-1.5 ${theme.primaryBg} ${theme.primaryHoverBg} disabled:opacity-40`}
              title="Nhờ AI chấm điểm và chỉ ra nét sai chi tiết"
            >
              {isAiEvaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>AI Chấm điểm</span>
            </button>

            <button
              onClick={handleUndo}
              disabled={strokesHistory.length <= 1}
              className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 border border-stone-200"
              title="Hoàn tác nét"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Hoàn tác</span>
            </button>

            <button
              onClick={handleClear}
              className="px-3 py-2.5 bg-stone-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 border border-stone-200"
              title="Xóa trắng bảng vẽ"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa</span>
            </button>

            <button
              onClick={handleSaveToAccount}
              className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 border border-stone-200"
              title="Lưu nét chữ này vào bộ sưu tập"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Lưu</span>
            </button>
          </div>
        </div>

        {/* RIGHT: EVALUATION FEEDBACK, KANJI MEANING & CONTROLS */}
        <div className="lg:col-span-5 space-y-4">
          {/* EVALUATION STATUS CARD */}
          {evalResult.status !== 'idle' ? (
            <div
              className={`p-4 rounded-2xl border-2 transition-all ${
                evalResult.status === 'correct'
                  ? 'bg-emerald-50/80 border-emerald-300'
                  : 'bg-red-50/90 border-red-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {evalResult.status === 'correct' ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                      <X className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        evalResult.status === 'correct' ? 'text-emerald-900' : 'text-red-900'
                      }`}
                    >
                      {evalResult.status === 'correct'
                        ? '✓ TÍCH ĐÚNG: Nét chữ chuẩn xác!'
                        : '✕ SAI NÉT: Đã tô đỏ các phần bị lệch/sai!'}
                    </h4>
                    <span className="text-[11px] font-semibold text-stone-500">
                      Điểm chuẩn xác: {evalResult.score || evalResult.accuracy}/100
                    </span>
                  </div>
                </div>

                {evalResult.status === 'wrong' && (
                  <button
                    onClick={() => setShowRedOverlay(!showRedOverlay)}
                    className="text-[11px] px-2 py-1 bg-white text-red-700 border border-red-200 rounded-md font-medium"
                  >
                    {showRedOverlay ? 'Ẩn tô đỏ' : 'Hiện tô đỏ'}
                  </button>
                )}
              </div>

              <p className="text-xs text-stone-700 mt-2.5 leading-relaxed">
                {evalResult.feedback}
              </p>

              {/* Wrong parts itemized list */}
              {evalResult.wrongParts && evalResult.wrongParts.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-red-200/80 space-y-1">
                  <span className="text-[11px] font-bold text-red-800 block">
                    Chi tiết điểm sai cần sửa:
                  </span>
                  {evalResult.wrongParts.map((wp, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-red-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      <span>{wp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Idle Instruction Box */
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-stone-800">
                <HelpCircle className="w-4 h-4 text-rose-700" />
                <span>Hướng dẫn kiểm tra nét chữ:</span>
              </div>
              <p className="leading-relaxed">
                Hãy đặt bút và viết theo nét chữ mẫu <strong>[{activePracticeChar}]</strong>. Sau khi vẽ xong, bấm nút <strong>&quot;Kiểm tra nét viết&quot;</strong> để hệ thống chấm điểm:
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 text-[11px]">
                  <strong>✓ Nếu đúng:</strong> Hiện tích xanh và lời khen ngợi.
                </div>
                <div className="p-2 bg-red-50 rounded-lg border border-red-200 text-red-800 text-[11px]">
                  <strong>✕ Nếu sai:</strong> Tô màu ĐỎ các nét lệch/thừa.
                </div>
              </div>
            </div>
          )}

          {/* TARGET KANJI DETAILS CARD */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-2xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Thông tin Hán tự đang luyện:
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <h3 className="text-2xl font-kanji font-bold text-stone-900">
                    {currentInfo.kanji}
                  </h3>
                  <span className="text-lg font-black text-rose-700">
                    [{currentInfo.hanViet}]
                  </span>
                </div>
              </div>

              {onSearchKanji && (
                <button
                  onClick={() => onSearchKanji(activePracticeChar)}
                  className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-stone-200"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Tra từ điển</span>
                </button>
              )}
            </div>

            <p className="text-xs text-stone-700 font-medium">
              {currentInfo.meaning}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-stone-100 text-stone-600">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Onyomi:</span>
                <span className="font-mono-numbers text-stone-800">
                  {currentInfo.on.length > 0 ? currentInfo.on.join(', ') : '—'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Kunyomi:</span>
                <span className="text-stone-800">
                  {currentInfo.kun.length > 0 ? currentInfo.kun.join(', ') : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* CONTROLS: GHOST TRACE, GRID, INK & BRUSH */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 shadow-2xs">
            {/* Ghost Template Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">Chữ mẫu mờ:</span>
              <button
                onClick={() => setShowGhost(!showGhost)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border ${
                  showGhost
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : 'bg-stone-100 text-stone-600 border-stone-200'
                }`}
              >
                {showGhost ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{showGhost ? 'Đang bật nét mẫu' : 'Đã tắt nét mẫu'}</span>
              </button>
            </div>

            {/* Grid Guidelines */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700">Kiểu ô lưới:</span>
              <div className="flex items-center gap-1">
                {[
                  { id: 'mizi', label: 'Ô Mễ (米)' },
                  { id: 'tianzi', label: 'Ô Điền (十)' },
                  { id: 'none', label: 'Trơn' },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGridType(g.id as any)}
                    className={`py-1 px-2 text-xs font-medium rounded-md transition-colors border ${
                      gridType === g.id
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border-stone-200'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-stone-700">Màu mực:</span>
              <div className="flex items-center gap-1.5">
                {colors.map((c) => (
                  <button
                    key={c.val}
                    onClick={() => setInkColor(c.val)}
                    title={c.label}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      inkColor === c.val ? 'scale-115 ring-2 ring-stone-900 shadow-xs' : 'opacity-80'
                    }`}
                    style={{ backgroundColor: c.val, borderColor: '#fff' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: THÊM CHỮ MUỐN LUYỆN */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-rose-700" />
                <span>Thêm chữ Hán muốn luyện viết</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddKanjiToQueue} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Nhập chữ Kanji đơn lẻ hoặc từ ghép / câu văn:
                </label>
                <input
                  type="text"
                  value={newKanjiInput}
                  onChange={(e) => setNewKanjiInput(e.target.value)}
                  placeholder="Ví dụ: 曖昧, 臨機応変, 経済, 桜, 愛..."
                  autoFocus
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-kanji text-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                />
                <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                  💡 Bạn có thể dán cả từ vựng hoặc đoạn văn, hệ thống sẽ tự động tách từng chữ Kanji và thêm vào danh sách luyện tập của bạn.
                </p>
              </div>

              {/* Fast Suggested Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-stone-500 uppercase">
                  Gợi ý thêm nhanh:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['曖昧', '躊躇', '臨機応変', '持続可能', '一期一会', '責任感'].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setNewKanjiInput(w)}
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-xs font-kanji font-semibold"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!newKanjiInput.trim()}
                  className={`px-5 py-2 ${theme.primaryBg} ${theme.primaryHoverBg} text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-40`}
                >
                  Thêm vào danh sách
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
