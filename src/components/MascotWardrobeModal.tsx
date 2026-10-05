import React, { useState } from 'react';
import {
  MascotAccessory,
  MascotId,
  MascotItemType,
  UserMascotState,
} from '../types/kanji';
import {
  ALL_ACCESSORIES,
  equipAccessory,
  getMascotStage,
  MASCOTS,
  selectUserMascot,
  setStreakForTesting,
} from '../utils/mascotManager';
import { MascotAvatar } from './MascotAvatar';
import {
  X,
  Crown,
  Sparkles,
  Lock,
  Check,
  Flame,
  HelpCircle,
  Shirt,
  Glasses,
  Smile,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { ThemeConfig } from '../utils/themeManager';

interface MascotWardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mascotState: UserMascotState;
  onUpdateState: (newState: UserMascotState) => void;
  theme: ThemeConfig;
  onToast: (msg: string) => void;
}

export const MascotWardrobeModal: React.FC<MascotWardrobeModalProps> = ({
  isOpen,
  onClose,
  mascotState,
  onUpdateState,
  theme,
  onToast,
}) => {
  const [activeCategory, setActiveCategory] = useState<MascotItemType>('headwear');
  const streak = mascotState.streak;
  const currentMascotId = mascotState.selectedMascotId || 'neko';
  const mascotInfo = MASCOTS[currentMascotId];
  const currentStage = getMascotStage(streak);

  if (!isOpen) return null;

  const categories: { id: MascotItemType; label: string; icon: string }[] = [
    { id: 'headwear', label: 'Mũ & Băng đô', icon: '🥋' },
    { id: 'eyewear', label: 'Kính & Mặt nạ', icon: '👓' },
    { id: 'outfit', label: 'Trang phục', icon: '👘' },
    { id: 'handheld', label: 'Vật phẩm cầm tay', icon: '🖌️' },
  ];

  const itemsInCategory = ALL_ACCESSORIES.filter((a) => a.category === activeCategory);

  const handleSelectMascot = (mId: MascotId) => {
    const updated = selectUserMascot(mascotState.userId, mId);
    onUpdateState(updated);
    onToast(`Đã chọn linh vật đồng hành: ${MASCOTS[mId].name} ${MASCOTS[mId].emoji}!`);
  };

  const handleToggleItem = (item: MascotAccessory) => {
    const isUnlocked = streak >= item.requiredStreak;
    if (!isUnlocked) {
      onToast(`Cần đạt chuỗi ${item.requiredStreak} để mở khóa [${item.name}]! (Hiện tại: chuỗi ${streak})`);
      return;
    }

    const currentlyEquipped = mascotState.equippedItems[item.category];
    const isEquipped = currentlyEquipped === item.id;

    const updated = equipAccessory(
      mascotState.userId,
      item.category,
      isEquipped ? undefined : item.id
    );
    onUpdateState(updated);
    onToast(isEquipped ? `Đã tháo [${item.name}]` : `Đã trang bị [${item.name}]!`);
  };

  // Next stage milestone
  const nextMilestones = [
    { target: 6, title: 'Thiếu nhi (Cấp 2)' },
    { target: 10, title: 'Trưởng thành (Cấp 3)' },
    { target: 15, title: 'Đại Tông Sư (Cấp 4)' },
  ];
  const nextStageGoal = nextMilestones.find((m) => m.target > streak);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between ${theme.bgSubtle}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${theme.primaryBg} text-white flex items-center justify-center shadow-xs text-xl`}>
              {mascotInfo.emoji}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>Tủ Đồ & Tiến Hóa Linh Vật</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                  <span>Chuỗi {streak}</span>
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Chuỗi càng lớn, linh vật lớn theo thời gian và mở khóa thêm nhiều trang phục, phụ kiện
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

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Mascot Selector Bar */}
          <div>
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
              Chọn Linh Vật Đồng Hành (Mở khóa từ chuỗi 3):
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {(Object.keys(MASCOTS) as MascotId[]).map((mId) => {
                const info = MASCOTS[mId];
                const isSelected = currentMascotId === mId;
                const isUnlocked = streak >= 3;

                return (
                  <button
                    key={mId}
                    disabled={!isUnlocked}
                    onClick={() => handleSelectMascot(mId)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 relative ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-400/40 shadow-xs'
                        : isUnlocked
                        ? 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                        : 'border-stone-200 bg-stone-100/60 opacity-60'
                    }`}
                  >
                    <span className="text-3xl filter drop-shadow-xs">{info.emoji}</span>
                    <span className="text-xs font-bold text-stone-800 truncate w-full">
                      {info.name}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                    {!isUnlocked && (
                      <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                        <Lock className="w-3 h-3" /> Cần chuỗi 3
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center Stage & Evolution Card */}
          <div className="bg-gradient-to-br from-stone-50 to-orange-50/40 border border-stone-200 rounded-3xl p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Mascot Visual Display */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
              <MascotAvatar
                mascotId={currentMascotId}
                streak={streak}
                equippedItems={mascotState.equippedItems}
                size="lg"
                showSpeech={true}
              />
              <p className="text-xs text-stone-500 mt-3 max-w-[220px]">
                {mascotInfo.personality}
              </p>
            </div>

            {/* Growth & Stage Details */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    Cấp độ hiện tại: {mascotInfo.stageTitles[currentStage]}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-stone-900">
                  {mascotInfo.japaneseName}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {mascotInfo.description}
                </p>
              </div>

              {/* Evolution Milestones */}
              <div className="bg-white rounded-2xl p-3.5 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-700">Tiến trình trưởng thành:</span>
                  <span className="font-mono-numbers font-semibold text-rose-700">
                    Chuỗi {streak} / {nextStageGoal ? nextStageGoal.target : 'MAX'}
                  </span>
                </div>

                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (streak / 15) * 100)}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                  <span>🐣 Sơ sinh (3-5)</span>
                  <span>🌱 Thiếu nhi (6-9)</span>
                  <span>🎒 Trưởng thành (10-14)</span>
                  <span>👑 Đại sư (15+)</span>
                </div>
              </div>

              {nextStageGoal && (
                <div className="text-xs text-stone-600 bg-amber-50 border border-amber-200/60 p-2.5 rounded-xl flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Hoàn thành thêm <strong>{nextStageGoal.target - streak}</strong> bài tập 10 chữ nữa để tiến hóa lên <strong>{nextStageGoal.title}</strong>!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Accessories & Costumes Wardrobe */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <Shirt className="w-4 h-4 text-stone-600" />
                <span>Trang Phục & Phụ Kiện</span>
              </h4>
              <span className="text-xs text-stone-500">
                Đã mở khóa:{' '}
                <strong className="text-stone-800 font-mono-numbers">
                  {ALL_ACCESSORIES.filter((a) => streak >= a.requiredStreak).length} / {ALL_ACCESSORIES.length}
                </strong>
              </span>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 border ${
                    activeCategory === cat.id
                      ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {itemsInCategory.map((item) => {
                const isUnlocked = streak >= item.requiredStreak;
                const isEquipped = mascotState.equippedItems[item.category] === item.id;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      isEquipped
                        ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500 shadow-xs'
                        : isUnlocked
                        ? 'border-stone-200 bg-white hover:border-stone-300'
                        : 'border-stone-200 bg-stone-50 opacity-70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center text-2xl shrink-0 border border-stone-200">
                        {item.icon}
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                          <span>{item.name}</span>
                          {isEquipped && (
                            <span className="text-[10px] text-emerald-700 font-semibold px-1.5 py-0.2 rounded bg-emerald-100">
                              Đang mặc
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 leading-tight">
                          {item.description}
                        </p>
                        {!isUnlocked && (
                          <div className="text-[10px] font-semibold text-rose-700 flex items-center gap-1 pt-1">
                            <Lock className="w-3 h-3" />
                            <span>Mở khóa ở chuỗi {item.requiredStreak}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleItem(item)}
                      disabled={!isUnlocked}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                        isEquipped
                          ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          : isUnlocked
                          ? 'bg-stone-900 text-white hover:bg-stone-800 shadow-2xs'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      {isEquipped ? 'Tháo ra' : isUnlocked ? 'Mặc vào' : 'Khóa'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Streak Testing Controls (Phím tắt thử nghiệm chuỗi) */}
          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
            <span className="font-semibold text-stone-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Thử nghiệm nhanh mốc chuỗi:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[0, 3, 6, 10, 15, 20].map((testVal) => (
                <button
                  key={testVal}
                  onClick={() => {
                    const updated = setStreakForTesting(mascotState.userId, testVal);
                    onUpdateState(updated);
                    onToast(`Đã chuyển chuỗi sang ${testVal}!`);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-semibold font-mono-numbers transition-colors ${
                    streak === testVal
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                  }`}
                >
                  Chuỗi {testVal}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
          >
            Đóng tủ đồ
          </button>
        </div>
      </div>
    </div>
  );
};
