import React from 'react';
import {
  MascotAccessory,
  MascotId,
  MascotStage,
  UserMascotState,
} from '../types/kanji';
import { ALL_ACCESSORIES, getMascotStage, MASCOTS } from '../utils/mascotManager';
import { Sparkles, Trophy, Crown, Flame } from 'lucide-react';

interface MascotAvatarProps {
  mascotId?: MascotId | null;
  streak: number;
  equippedItems?: UserMascotState['equippedItems'];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeech?: boolean;
  speechText?: string;
  isCelebrating?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MascotAvatar: React.FC<MascotAvatarProps> = ({
  mascotId = 'neko',
  streak,
  equippedItems = {},
  size = 'md',
  showSpeech = false,
  speechText,
  isCelebrating = false,
  onClick,
  className = '',
}) => {
  const currentId = mascotId || 'neko';
  const mascot = MASCOTS[currentId];
  const stage = getMascotStage(streak);

  // Find equipped accessory objects
  const headwearItem = ALL_ACCESSORIES.find((a) => a.id === equippedItems.headwear);
  const eyewearItem = ALL_ACCESSORIES.find((a) => a.id === equippedItems.eyewear);
  const outfitItem = ALL_ACCESSORIES.find((a) => a.id === equippedItems.outfit);
  const handheldItem = ALL_ACCESSORIES.find((a) => a.id === equippedItems.handheld);

  // Stage details
  const stageBadges: Record<MascotStage, { text: string; bg: string; icon: string }> = {
    baby: { text: 'Sơ sinh (Cấp 1)', bg: 'bg-amber-100 text-amber-800 border-amber-200', icon: '🍼' },
    kid: { text: 'Thiếu nhi (Cấp 2)', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: '🌱' },
    teen: { text: 'Trưởng thành (Cấp 3)', bg: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🎒' },
    master: { text: 'Đại Tông Sư (Cấp 4)', bg: 'bg-purple-100 text-purple-900 border-purple-200 font-bold', icon: '👑' },
  };

  // Dimensions based on size and stage growth ("chuỗi càng lớn thì các con đó lớn theo thời gian")
  const sizeMap = {
    sm: {
      wrapper: 'w-16 h-16',
      emoji: stage === 'baby' ? 'text-3xl' : stage === 'kid' ? 'text-3xl' : stage === 'teen' ? 'text-4xl' : 'text-4xl',
      badge: 'text-[9px] px-1.5 py-0.2',
    },
    md: {
      wrapper: 'w-24 h-24',
      emoji: stage === 'baby' ? 'text-4xl' : stage === 'kid' ? 'text-5xl' : stage === 'teen' ? 'text-6xl' : 'text-6xl',
      badge: 'text-[10px] px-2 py-0.5',
    },
    lg: {
      wrapper: 'w-32 h-32',
      emoji: stage === 'baby' ? 'text-5xl scale-90' : stage === 'kid' ? 'text-6xl' : stage === 'teen' ? 'text-7xl' : 'text-7xl',
      badge: 'text-xs px-2.5 py-0.5',
    },
    xl: {
      wrapper: 'w-40 h-40',
      emoji: stage === 'baby' ? 'text-6xl scale-90' : stage === 'kid' ? 'text-7xl' : stage === 'teen' ? 'text-8xl' : 'text-8xl',
      badge: 'text-xs px-3 py-1',
    },
  };

  const currentSize = sizeMap[size];

  // Default quote if not custom speechText
  const currentQuote =
    speechText ||
    (mascot.stageQuotes[stage]
      ? mascot.stageQuotes[stage][Math.floor(Math.random() * mascot.stageQuotes[stage].length)]
      : 'Cùng học Hán tự nào!');

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Speech Bubble */}
      {showSpeech && (
        <div className="absolute -top-12 z-20 whitespace-nowrap bg-white text-stone-800 text-xs font-semibold px-3 py-1.5 rounded-2xl shadow-md border border-stone-200 animate-bounce">
          <span>{currentQuote}</span>
          <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-stone-200 rotate-45" />
        </div>
      )}

      {/* Main Avatar Stage Container */}
      <div
        className={`relative ${currentSize.wrapper} rounded-3xl bg-gradient-to-br ${mascot.bgGradient} flex items-center justify-center shadow-md border-2 transition-all duration-300 ${
          isCelebrating ? 'animate-bounce scale-110' : ''
        } ${stage === 'master' ? 'ring-4 ring-amber-300/80 shadow-amber-200' : ''}`}
      >
        {/* Master Aura Sparkles */}
        {stage === 'master' && (
          <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 rounded-3xl opacity-30 blur-xs -z-10 animate-pulse" />
        )}

        {/* Headwear Slot (Top Center) */}
        {headwearItem && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 text-xl sm:text-2xl filter drop-shadow">
            {headwearItem.icon}
          </div>
        )}

        {/* Eyewear Slot (Middle Face) */}
        {eyewearItem && (
          <div className="absolute top-[32%] left-1/2 -translate-x-1/2 z-20 text-lg sm:text-xl filter drop-shadow">
            {eyewearItem.icon}
          </div>
        )}

        {/* Handheld Slot (Right/Bottom) */}
        {handheldItem && (
          <div className="absolute -bottom-1 -right-2 z-20 text-lg sm:text-xl filter drop-shadow animate-pulse">
            {handheldItem.icon}
          </div>
        )}

        {/* Outfit Slot (Chest/Collar) */}
        {outfitItem && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 text-base sm:text-lg filter drop-shadow">
            {outfitItem.icon}
          </div>
        )}

        {/* Mascot Face / Body Emoji */}
        <span
          className={`${currentSize.emoji} filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105`}
          role="img"
          aria-label={mascot.name}
        >
          {mascot.emoji}
        </span>

        {/* Baby pacifier or Master crown overlay if no custom headwear */}
        {stage === 'baby' && !headwearItem && (
          <div className="absolute -top-1 -right-1 text-sm bg-white/90 rounded-full p-0.5 shadow-2xs">
            🍼
          </div>
        )}
        {stage === 'master' && !headwearItem && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-base filter drop-shadow">
            👑
          </div>
        )}
      </div>

      {/* Stage Badge & Name */}
      <div className="mt-2 text-center space-y-0.5">
        <div className="text-xs font-bold text-stone-900 flex items-center justify-center gap-1">
          <span>{mascot.name}</span>
          {stage === 'master' && <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />}
        </div>

        <div
          className={`inline-flex items-center gap-1 rounded-full border font-medium ${stageBadges[stage].bg} ${currentSize.badge}`}
        >
          <span>{stageBadges[stage].icon}</span>
          <span>{mascot.stageTitles[stage]}</span>
        </div>
      </div>
    </div>
  );
};
