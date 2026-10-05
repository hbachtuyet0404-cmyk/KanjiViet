import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Flame,
  Folder,
  FolderPlus,
  Layers,
  Lock,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Shirt,
  Sparkles,
  Volume2,
  XCircle,
  Zap,
  ArrowRight,
  Bookmark,
  Check,
} from 'lucide-react';
import {
  CompoundWord,
  FavoriteEntry,
  MascotAccessory,
  MascotId,
  QuizQuestion,
  UserAccount,
  UserMascotState,
  UserPracticeFolder,
} from '../types/kanji';
import {
  getAllCompounds,
  getFavorites,
  speakJapanese,
} from '../utils/kanjiDatabase';
import { CURATED_KANJI } from '../data/curatedKanji';
import { JOYO_HAN_VIET_MAP } from '../data/joyoHanVietMap';
import {
  ALL_ACCESSORIES,
  getMascotStage,
  getUserMascotState,
  MASCOTS,
  recordCompletedWorkout,
  selectUserMascot,
} from '../utils/mascotManager';
import { MascotAvatar } from './MascotAvatar';
import { MascotWardrobeModal } from './MascotWardrobeModal';
import { ThemeConfig } from '../utils/themeManager';

interface QuizModeProps {
  onSelectWord: (word: string) => void;
  theme: ThemeConfig;
  user: UserAccount;
  onToast: (msg: string) => void;
}

type WorkoutSource = 'saved' | 'system';

interface WorkoutWordItem {
  word: string;
  reading: string;
  hanViet: string;
  meaning: string;
  jlpt?: string;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  onSelectWord,
  theme,
  user,
  onToast,
}) => {
  // State for workout flow: 'setup' | 'playing' | 'completed'
  const [workoutState, setWorkoutState] = useState<'setup' | 'playing' | 'completed'>('setup');
  const [selectedSource, setSelectedSource] = useState<WorkoutSource>('system');
  const [systemLevel, setSystemLevel] = useState<'all' | 'n5_n4' | 'n3' | 'n2_n1'>('all');

  // Mascot state
  const [mascotState, setMascotState] = useState<UserMascotState>(() => getUserMascotState(user.id));
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [isMascotUnlockModalOpen, setIsMascotUnlockModalOpen] = useState(false);

  // Active workout questions
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [workoutWords, setWorkoutWords] = useState<WorkoutWordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [mascotReaction, setMascotReaction] = useState<string>('');
  const [isMascotCelebrating, setIsMascotCelebrating] = useState(false);

  // Completion summary data
  const [summaryData, setSummaryData] = useState<{
    newStreak: number;
    unlockedMascotNow: boolean;
    unlockedItems: MascotAccessory[];
    stageChanged: boolean;
  }>({
    newStreak: 0,
    unlockedMascotNow: false,
    unlockedItems: [],
    stageChanged: false,
  });

  // Load user mascot data
  useEffect(() => {
    const ms = getUserMascotState(user.id);
    setMascotState(ms);
  }, [user.id]);

  const favorites = useMemo(() => getFavorites(user.id), [user.id, workoutState]);

  // Helper to resolve word details from database
  const resolveWordInfo = (rawWord: string): WorkoutWordItem => {
    const clean = rawWord.trim();
    const all = getAllCompounds(user.id);
    const matched = all.find((c) => c.word === clean);
    if (matched) {
      return {
        word: matched.word,
        reading: matched.reading,
        hanViet: matched.hanViet,
        meaning: matched.meaning,
        jlpt: matched.jlpt,
      };
    }

    // Try single Kanji lookup
    if (clean.length === 1) {
      const curated = CURATED_KANJI[clean];
      const joyo = (JOYO_HAN_VIET_MAP as Record<string, any>)[clean];
      if (curated || joyo) {
        return {
          word: clean,
          reading: curated?.on?.[0] || curated?.kun?.[0] || joyo?.on?.[0] || '',
          hanViet: curated?.hanViet || joyo?.hv || 'HÁN TỰ',
          meaning: curated?.meaning || joyo?.m || 'Chữ Hán tiếng Nhật',
          jlpt: curated?.jlpt || 'N3',
        };
      }
    }

    // Fallback synthesize
    return {
      word: clean,
      reading: '—',
      hanViet: 'HÁN TỰ TẬP LUYỆN',
      meaning: 'Từ vựng trong danh sách tự chọn',
      jlpt: 'N3',
    };
  };

  // -------------------------------------------------------------
  // BUILD EXACTLY 10 WORDS FOR THE WORKOUT
  // "1 bài tập tự luyện tập gồm 10 chữ"
  // -------------------------------------------------------------
  const generate10Words = (): WorkoutWordItem[] => {
    let sourceWords: WorkoutWordItem[] = [];
    const allSystemCompounds = getAllCompounds(user.id);

    if (selectedSource === 'saved') {
      if (favorites.length > 0) {
        sourceWords = favorites.map((f) => ({
          word: f.word,
          reading: f.reading,
          hanViet: f.hanViet,
          meaning: f.meaning,
          jlpt: f.jlpt,
        }));
      }
    } else {
      // System random
      let pool = allSystemCompounds;
      if (systemLevel === 'n5_n4') {
        pool = allSystemCompounds.filter((c) => c.jlpt === 'N5' || c.jlpt === 'N4');
      } else if (systemLevel === 'n3') {
        pool = allSystemCompounds.filter((c) => c.jlpt === 'N3');
      } else if (systemLevel === 'n2_n1') {
        pool = allSystemCompounds.filter((c) => c.jlpt === 'N2' || c.jlpt === 'N1');
      }

      if (pool.length < 10) pool = allSystemCompounds;

      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      sourceWords = shuffled.map((c) => ({
        word: c.word,
        reading: c.reading,
        hanViet: c.hanViet,
        meaning: c.meaning,
        jlpt: c.jlpt,
      }));
    }

    // Ensure we have exactly 10 words (pad with diverse system words if user collection has fewer)
    let final10: WorkoutWordItem[] = [];
    if (sourceWords.length >= 10) {
      final10 = [...sourceWords].sort(() => 0.5 - Math.random()).slice(0, 10);
    } else {
      final10 = [...sourceWords];
      const additional = [...allSystemCompounds]
        .sort(() => 0.5 - Math.random())
        .filter((c) => !final10.some((item) => item.word === c.word));

      while (final10.length < 10 && additional.length > 0) {
        const next = additional.pop()!;
        final10.push({
          word: next.word,
          reading: next.reading,
          hanViet: next.hanViet,
          meaning: next.meaning,
          jlpt: next.jlpt,
        });
      }
    }

    return final10;
  };

  const handleStartWorkout = () => {
    const words10 = generate10Words();
    if (words10.length === 0) {
      onToast('Không có đủ từ vựng để bắt đầu bài tập.');
      return;
    }

    const allCompounds = getAllCompounds(user.id);

    // Build 10 interactive questions
    const generated: QuizQuestion[] = words10.map((item, idx) => {
      const isHanVietQuestion = idx % 2 === 0;

      if (isHanVietQuestion) {
        const wrongAnswers = allCompounds
          .filter((c) => c.hanViet !== item.hanViet)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((c) => c.hanViet);

        // Fallbacks if not enough
        while (wrongAnswers.length < 3) {
          wrongAnswers.push(`ÂM HÁN ${wrongAnswers.length + 1}`);
        }

        const options = [item.hanViet, ...wrongAnswers].sort(() => 0.5 - Math.random());

        return {
          id: `q_${idx}_${item.word}`,
          type: 'kanji-to-hanviet',
          prompt: item.word,
          subPrompt: `Cách đọc: ${item.reading || '—'} · JLPT: ${item.jlpt || 'N3'}`,
          correctAnswer: item.hanViet,
          options,
          explanation: `Từ [${item.word}] có âm Hán Việt chính xác là [${item.hanViet}]. Ý nghĩa: ${item.meaning}.`,
          relatedData: {
            word: item.word,
            reading: item.reading,
            hanViet: item.hanViet,
            meaning: item.meaning,
          },
        };
      } else {
        const wrongAnswers = allCompounds
          .filter((c) => c.meaning !== item.meaning)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((c) => c.meaning);

        while (wrongAnswers.length < 3) {
          wrongAnswers.push(`Ý nghĩa dự phòng ${wrongAnswers.length + 1}`);
        }

        const options = [item.meaning, ...wrongAnswers].sort(() => 0.5 - Math.random());

        return {
          id: `q_${idx}_${item.word}`,
          type: 'compound-meaning',
          prompt: item.word,
          subPrompt: `Âm Hán Việt: [${item.hanViet}] · Cấp độ: ${item.jlpt || 'N3'}`,
          correctAnswer: item.meaning,
          options,
          explanation: `Dựa vào gốc Hán Việt [${item.hanViet}], ta có thể suy đoán nghĩa chính xác là: "${item.meaning}".`,
          relatedData: {
            word: item.word,
            reading: item.reading,
            hanViet: item.hanViet,
            meaning: item.meaning,
          },
        };
      }
    });

    setWorkoutWords(words10);
    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setMascotReaction('');
    setIsMascotCelebrating(false);
    setWorkoutState('playing');
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    const isCorrect = opt === currentQ.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setIsMascotCelebrating(true);
      const mascot = MASCOTS[mascotState.selectedMascotId || 'neko'];
      const stage = getMascotStage(mascotState.streak);
      const quotes = mascot.stageQuotes[stage] || ['Đúng rồi!', 'Giỏi quá!'];
      setMascotReaction(quotes[Math.floor(Math.random() * quotes.length)]);
    } else {
      setIsMascotCelebrating(false);
      setMascotReaction('Không sao cả, nhìn kỹ giải thích chiết tự nhé!');
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsMascotCelebrating(false);
      setMascotReaction('');
    } else {
      // -------------------------------------------------------------
      // WORKOUT COMPLETED!
      // "hoàn thành được 10 chữ 1 lần là được chuỗi 1"
      // -------------------------------------------------------------
      const result = recordCompletedWorkout(user.id);
      setMascotState(result.state);
      setSummaryData({
        newStreak: result.newStreak,
        unlockedMascotNow: result.unlockedMascotNow,
        unlockedItems: result.unlockedItems,
        stageChanged: result.previousStage !== result.currentStage,
      });

      if (result.unlockedMascotNow) {
        setIsMascotUnlockModalOpen(true);
      }

      setWorkoutState('completed');
    }
  };

  const currentQ = questions[currentIndex];
  const mascotId = mascotState.selectedMascotId || 'neko';
  const mascot = MASCOTS[mascotId];
  const stage = getMascotStage(mascotState.streak);

  // -------------------------------------------------------------
  // VIEW 1: SETUP & SOURCE PICKER
  // -------------------------------------------------------------
  if (workoutState === 'setup') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* TOP MASCOT BANNER */}
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border-2 border-stone-200/80 rounded-3xl p-5 sm:p-6 backdrop-blur-xs shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            {/* Left: Mascot & Stage Info */}
            <div className="flex items-center gap-4 text-center sm:text-left">
              {mascotState.streak >= 3 ? (
                <MascotAvatar
                  mascotId={mascotState.selectedMascotId}
                  streak={mascotState.streak}
                  equippedItems={mascotState.equippedItems}
                  size="md"
                  showSpeech={true}
                  speechText={`Chuỗi ${mascotState.streak} rồi senpai!`}
                  onClick={() => setIsWardrobeOpen(true)}
                />
              ) : (
                <div className="w-20 h-20 rounded-3xl bg-stone-100 border-2 border-dashed border-stone-300 flex flex-col items-center justify-center text-stone-400 shrink-0 relative">
                  <span className="text-3xl filter grayscale opacity-40">🐱</span>
                  <span className="text-[10px] font-bold text-stone-500 flex items-center gap-0.5 mt-1">
                    <Lock className="w-2.5 h-2.5" /> Chuỗi {mascotState.streak}/3
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
                    {mascotState.streak >= 3 ? (
                      <>
                        <span>Linh vật: {mascot.name}</span>
                        <span>{mascot.emoji}</span>
                      </>
                    ) : (
                      <span>Khóa Linh Vật Đồng Hành</span>
                    )}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-200 text-xs font-bold font-mono-numbers flex items-center gap-1 shadow-2xs">
                    <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-600" />
                    <span>Chuỗi: {mascotState.streak}</span>
                  </span>
                </div>

                <p className="text-xs text-stone-600 max-w-md">
                  {mascotState.streak >= 3 ? (
                    <span>
                      Cấp độ: <strong>{mascot.stageTitles[stage]}</strong>. Hoàn thành mỗi bài tập 10 chữ để tăng chuỗi, giúp thú cưng lớn lên và mở khóa thêm trang phục!
                    </span>
                  ) : (
                    <span>
                      Hoàn thành 1 bài 10 chữ = +1 Chuỗi. <strong>Đạt chuỗi 3</strong> sẽ mở khóa ngay 1 linh vật (Mèo 🐱, Thỏ 🐰, Gấu 🐻, Cún 🐶, Cáo 🦊)! Còn <strong>{Math.max(1, 3 - mascotState.streak)}</strong> bài tập nữa!
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsWardrobeOpen(true)}
                className="px-4 py-2.5 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold rounded-2xl border border-stone-200 shadow-2xs transition-all flex items-center gap-1.5"
              >
                <Shirt className="w-4 h-4 text-rose-600" />
                <span>Tủ đồ & Linh vật</span>
              </button>
            </div>
          </div>
        </div>

        {/* WORKOUT SOURCE SELECTION CARDS */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>Chọn Nguồn Bài Tập Luyện Tập (10 Chữ / Lần)</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  10 Chữ = +1 Chuỗi
                </span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Chọn nguồn từ vựng bạn muốn ôn tập hôm nay: Thư mục tự tạo, Phần chữ đã lưu, hoặc Bài ngẫu nhiên từ hệ thống
              </p>
            </div>
          </div>

          {/* 2 Large Source Option Cards (Removed User Folders as requested) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SOURCE 1: SAVED WORDS / FAVORITES */}
            <div
              onClick={() => setSelectedSource('saved')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                selectedSource === 'saved'
                  ? 'border-rose-500 bg-rose-50/40 shadow-xs ring-2 ring-rose-400/20'
                  : 'border-stone-200 bg-stone-50/50 hover:border-stone-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl shadow-2xs">
                    ⭐
                  </div>
                  {selectedSource === 'saved' && (
                    <span className="w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-stone-900">
                  1. Phần chữ đã lưu (Sổ tay)
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Luyện tập các chữ Hán và từ ghép bạn đã lưu trong sổ tay cá nhân
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <div className="p-2.5 bg-white rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                  <span className="text-stone-600">Số chữ trong sổ tay:</span>
                  <span className="font-bold text-stone-900 font-mono-numbers">
                    {favorites.length} từ
                  </span>
                </div>
              </div>
            </div>

            {/* SOURCE 2: SYSTEM RANDOM WORKOUT */}
            <div
              onClick={() => setSelectedSource('system')}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                selectedSource === 'system'
                  ? 'border-rose-500 bg-rose-50/40 shadow-xs ring-2 ring-rose-400/20'
                  : 'border-stone-200 bg-stone-50/50 hover:border-stone-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl shadow-2xs">
                    🎲
                  </div>
                  {selectedSource === 'system' && (
                    <span className="w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px]">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-stone-900">
                  2. Bài ngẫu nhiên của hệ thống
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Hệ thống tự động sinh 1 bộ đề ngẫu nhiên gồm 10 chữ chất lượng cao
                </p>
              </div>

              {/* Sub-selector for JLPT */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <span className="text-xs font-semibold text-stone-700 block">Cấp độ JLPT:</span>
                <select
                  value={systemLevel}
                  onChange={(e) => {
                    setSystemLevel(e.target.value as any);
                    setSelectedSource('system');
                  }}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="all">Toàn diện N5 → N1 (Đa dạng)</option>
                  <option value="n5_n4">N5 - N4 (Nhập môn & Căn bản)</option>
                  <option value="n3">N3 (Trọng tâm Trung cấp)</option>
                  <option value="n2_n1">N2 - N1 (Nâng cao & Báo chí)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Start Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-500">
              Mỗi bài tập gồm chính xác <strong>10 chữ</strong>. Hoàn thành trọn vẹn cả 10 chữ để nhận <strong>+1 Chuỗi</strong> và mở khóa phụ kiện!
            </div>

            <button
              onClick={handleStartWorkout}
              className={`w-full sm:w-auto px-8 py-3.5 ${theme.primaryBg} ${theme.primaryHoverBg} text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02]`}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt đầu bài luyện tập 10 chữ</span>
            </button>
          </div>
        </div>

        {/* Wardrobe modal */}
        <MascotWardrobeModal
          isOpen={isWardrobeOpen}
          onClose={() => setIsWardrobeOpen(false)}
          mascotState={mascotState}
          onUpdateState={setMascotState}
          theme={theme}
          onToast={onToast}
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ACTIVE WORKOUT PLAYING (10 QUESTIONS)
  // -------------------------------------------------------------
  if (workoutState === 'playing' && currentQ) {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Progress & Mascot Cheering Bar */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <span>Chữ số {currentIndex + 1} / {questions.length}</span>
                <span className="text-[10px] px-2 py-0.2 bg-stone-100 rounded text-stone-500 font-mono-numbers">
                  {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                </span>
              </span>

              <div className="flex items-center gap-2 font-mono-numbers">
                <span className="text-emerald-700 font-bold">
                  Đúng: {score}
                </span>
                <span className="text-orange-600 font-bold flex items-center gap-0.5">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" />
                  <span>Chuỗi: {mascotState.streak}</span>
                </span>
              </div>
            </div>

            {/* Visual Step Progress Bar */}
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300 rounded-full"
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Compact Cheering Mascot */}
          {mascotState.streak >= 3 && (
            <div className="shrink-0 flex items-center gap-2 pl-2 border-l border-stone-200">
              <MascotAvatar
                mascotId={mascotState.selectedMascotId}
                streak={mascotState.streak}
                equippedItems={mascotState.equippedItems}
                size="sm"
                isCelebrating={isMascotCelebrating}
              />
            </div>
          )}
        </div>

        {/* Mascot Reaction Bubble if answered */}
        {isAnswered && mascotReaction && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 font-semibold flex items-center gap-2 animate-fade-in shadow-2xs">
            <span className="text-lg">{mascot.emoji}</span>
            <span>{mascot.name}: &quot;{mascotReaction}&quot;</span>
          </div>
        )}

        {/* Question Card */}
        <div className={`bg-white rounded-3xl border ${theme.borderSubtle} p-6 sm:p-8 text-center space-y-4 shadow-sm`}>
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            {currentQ.type === 'kanji-to-hanviet'
              ? 'Hãy chọn âm Hán Việt chính xác của từ sau:'
              : 'Hãy chọn ý nghĩa cốt lõi của từ sau:'}
          </div>

          {/* Kanji Prompt */}
          <div className="py-2 space-y-1">
            <div className="text-5xl sm:text-6xl font-kanji font-bold text-stone-950 tracking-wider">
              {currentQ.prompt}
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              {currentQ.subPrompt && (
                <p className="text-xs font-medium text-stone-500">
                  {currentQ.subPrompt}
                </p>
              )}
              <button
                onClick={() => speakJapanese(currentQ.prompt)}
                className="p-1 hover:bg-stone-100 rounded-md text-stone-400 hover:text-stone-700"
                title="Nghe phát âm"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let btnStyle = 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500 shadow-2xs';
                } else if (isSelected) {
                  btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-bold ring-2 ring-rose-500';
                } else {
                  btnStyle = 'border-stone-200 bg-stone-50/50 text-stone-400 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border text-sm transition-all flex items-center justify-between gap-2 text-left ${btnStyle}`}
                >
                  <span className="leading-snug">{opt}</span>
                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next question button */}
          {isAnswered && (
            <div className={`mt-6 pt-5 border-t ${theme.borderSubtle} text-left space-y-3 animate-fade-in`}>
              <div className={`p-4 ${theme.bgSubtle} rounded-2xl border ${theme.borderSubtle} text-xs text-stone-700 leading-relaxed`}>
                <span className={`font-bold ${theme.primaryText} block mb-0.5`}>
                  Giải thích chiết tự & Âm Hán Việt:
                </span>
                <p>{currentQ.explanation}</p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => onSelectWord(currentQ.relatedData.word)}
                  className={`text-xs font-semibold ${theme.primaryText} hover:opacity-80 flex items-center gap-1`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Tra cứu bóc tách toàn diện</span>
                </button>

                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <span>
                    {currentIndex + 1 === questions.length ? 'Hoàn thành bài tập' : 'Câu tiếp theo'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 3: WORKOUT COMPLETED SUMMARY (10/10 COMPLETED)
  // -------------------------------------------------------------
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Celebration Card */}
      <div className={`bg-white rounded-3xl border ${theme.borderSubtle} p-6 sm:p-8 text-center space-y-6 shadow-sm relative overflow-hidden`}>
        {/* Background confetti aura */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl -z-10" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-200/40 rounded-full blur-2xl -z-10" />

        {/* Mascot Avatar Celebrating */}
        <div className="flex justify-center">
          <MascotAvatar
            mascotId={mascotState.selectedMascotId}
            streak={summaryData.newStreak}
            equippedItems={mascotState.equippedItems}
            size="lg"
            showSpeech={true}
            speechText="Tuyệt vời! Hoàn thành 10 chữ rồi!"
            isCelebrating={true}
            onClick={() => setIsWardrobeOpen(true)}
          />
        </div>

        <div>
          <h2 className="text-2xl font-black text-stone-900">
            Hoàn Thành Bài Luyện Tập 10 Chữ!
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Bạn đã xuất sắc vượt qua trọn vẹn 10 chữ Kanji trong phiên tự học này
          </p>
        </div>

        {/* Score & Streak Award Card */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="text-[11px] font-bold text-stone-500 uppercase">Điểm số:</span>
            <div className="text-2xl font-black text-stone-900 font-mono-numbers mt-0.5">
              {score} / 10
            </div>
            <span className="text-[10px] text-stone-500">
              Đạt {Math.round((score / 10) * 100)}% chính xác
            </span>
          </div>

          <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
            <span className="text-[11px] font-bold text-amber-800 uppercase flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-600" />
              <span>Chuỗi Mới:</span>
            </span>
            <div className="text-2xl font-black text-orange-700 font-mono-numbers mt-0.5">
              +1 → Chuỗi {summaryData.newStreak}
            </div>
            <span className="text-[10px] text-amber-800 font-semibold">
              Đã ghi nhận chuỗi!
            </span>
          </div>
        </div>

        {/* UNLOCKED MASCOT ANNOUNCEMENT IF STREAK >= 3 */}
        {summaryData.unlockedMascotNow && (
          <div className="p-4 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 rounded-2xl border-2 border-rose-300 text-left space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-black text-sm">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>CHÚC MỪNG: BẠN ĐÃ ĐẠT CHUỖI 3 & MỞ KHÓA LINH VẬT ĐỒNG HÀNH!</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              Bạn có thể chọn 1 trong 5 linh vật: <strong>Mèo May Mắn 🐱</strong>, <strong>Thỏ Mặt Trăng 🐰</strong>, <strong>Gấu Trúc Dũng Cảm 🐻</strong>, <strong>Cún Shiba 🐶</strong>, hoặc <strong>Cáo Hồ Ly 🦊</strong> để đồng hành mỗi ngày!
            </p>
            <button
              onClick={() => setIsWardrobeOpen(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Chọn linh vật & Vào tủ đồ ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* NEW ACCESSORIES UNLOCKED */}
        {summaryData.unlockedItems.length > 0 && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-left space-y-2">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Vừa mở khóa thêm {summaryData.unlockedItems.length} trang phục mới!</span>
            </span>
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {summaryData.unlockedItems.map((item) => (
                <span
                  key={item.id}
                  className="px-2.5 py-1 bg-white border border-emerald-300 rounded-xl text-xs font-semibold text-stone-800 flex items-center gap-1 shadow-2xs"
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 10 Words Review List */}
        <div className="text-left space-y-2.5 pt-2 border-t border-stone-200">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Danh sách 10 chữ vừa luyện tập:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {workoutWords.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectWord(item.word)}
                className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 transition-colors flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="font-kanji text-xl font-bold text-stone-900 group-hover:text-rose-600 shrink-0">
                    {item.word}
                  </span>
                  <div className="truncate text-xs">
                    <span className="font-bold text-stone-800">[{item.hanViet}]</span>
                    <p className="text-stone-500 text-[11px] truncate">{item.meaning}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleStartWorkout}
            className={`w-full sm:w-auto px-6 py-3 ${theme.primaryBg} ${theme.primaryHoverBg} text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Luyện tiếp bài 10 chữ mới</span>
          </button>

          <button
            onClick={() => setWorkoutState('setup')}
            className="w-full sm:w-auto px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-xl border border-stone-200 transition-colors"
          >
            Đổi nguồn / Thư mục khác
          </button>

          <button
            onClick={() => setIsWardrobeOpen(true)}
            className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs rounded-xl border border-stone-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Shirt className="w-4 h-4 text-rose-600" />
            <span>Tủ đồ linh vật</span>
          </button>
        </div>
      </div>

      {/* Wardrobe Modal */}
      <MascotWardrobeModal
        isOpen={isWardrobeOpen}
        onClose={() => setIsWardrobeOpen(false)}
        mascotState={mascotState}
        onUpdateState={setMascotState}
        theme={theme}
        onToast={onToast}
      />
    </div>
  );
};
