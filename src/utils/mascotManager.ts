import { MascotAccessory, MascotId, MascotItemType, MascotStage, UserMascotState } from '../types/kanji';

export interface MascotInfo {
  id: MascotId;
  name: string;
  japaneseName: string;
  species: string;
  emoji: string;
  color: string;
  bgGradient: string;
  personality: string;
  description: string;
  stageTitles: Record<MascotStage, string>;
  stageQuotes: Record<MascotStage, string[]>;
}

export const MASCOTS: Record<MascotId, MascotInfo> = {
  neko: {
    id: 'neko',
    name: 'Mèo May Mắn',
    japaneseName: '招き猫 (Maneki Neko)',
    species: 'Mèo tam thể',
    emoji: '🐱',
    color: '#F59E0B',
    bgGradient: 'from-amber-100 to-orange-100 border-amber-200 text-amber-900',
    personality: 'Nhanh nhẹn, hóm hỉnh, mang lại tài lộc và may mắn thi cử',
    description: 'Chú mèo may mắn truyền thống xứ Phù Tang, luôn giơ tay vẫy chào và khích lệ bạn vượt qua mọi chữ Kanji khó!',
    stageTitles: {
      baby: 'Mèo Con Tập Bò',
      kid: 'Mèo Nhí Tinh Nghịch',
      teen: 'Mèo Thiếu Niên Chăm Học',
      master: 'Đại Thánh Neko Thần Tài',
    },
    stageQuotes: {
      baby: ['Meo meo~ Đang tập đọc chữ nè!', 'Senpai ơi, cố lên meo~', 'Chữ này dễ thương ghê!'],
      kid: ['Meo! Cứ mỗi 10 chữ là tớ lớn thêm đấy!', 'Học xong tớ thưởng một con cá nha!', 'Đúng một chữ nữa rồi!'],
      teen: ['Kanji cũng giống như bắt chuột vậy, phải thật tập trung!', 'Chuỗi ngày càng dài, tớ sắp thành đại sư rồi!', 'Senpai hôm nay học hăng say quá!'],
      master: ['Vạn tự quy tông! Ta sẽ ban phước may mắn cho bài thi JLPT của ngươi!', 'Khí thế ngút trời, không chữ Hán nào làm khó được ta!', 'Đỉnh cao Hán học là đây!'],
    },
  },
  usagi: {
    id: 'usagi',
    name: 'Thỏ Mặt Trăng',
    japaneseName: '月の兎 (Tsuki Usagi)',
    species: 'Thỏ ngọc tuyết trắng',
    emoji: '🐰',
    color: '#EC4899',
    bgGradient: 'from-pink-100 to-rose-100 border-pink-200 text-pink-900',
    personality: 'Chăm chỉ, dịu dàng, thông minh và khéo léo',
    description: 'Chú thỏ ngọc sống trên cung trăng, chuyên cần giã bánh giầy Mochi và ghi chép chiết tự Hán tự mỗi đêm.',
    stageTitles: {
      baby: 'Thỏ Bông Mới Nở',
      kid: 'Thỏ Nhí Hoa Anh Đào',
      teen: 'Nguyệt Thỏ Giã Bánh',
      master: 'Nguyệt Tinh Tiên Tử Usagi',
    },
    stageQuotes: {
      baby: ['Ục ục~ Tớ là thỏ trắng nè!', 'Senpai dạy tớ viết chữ đi~', 'Tai tớ dựng lên khi nghe từ mới!'],
      kid: ['Chăm chỉ như thỏ giã bánh mochi vậy!', 'Thêm một câu đúng là thêm một viên kẹo ngọt!', 'Bạn giỏi quá đi à!'],
      teen: ['Trăng tròn vành vạnh như nét chữ viên mãn của bạn!', 'Mỗi nét viết là một đóa hoa anh đào hé nở.', 'Cố thêm một chút nữa thôi senpai!'],
      master: ['Trí tuệ sáng ngời như ánh trăng rằm soi tỏ vạn ngàn Hán tự!', 'Tâm tĩnh như nguyệt, bút hạ như phi!', 'Tuyệt đỉnh công phu Hán học!'],
    },
  },
  kuma: {
    id: 'kuma',
    name: 'Gấu Trúc Dũng Cảm',
    japaneseName: '勇敢な熊 (Kumasan)',
    species: 'Gấu trúc dũng sĩ',
    emoji: '🐻',
    color: '#059669',
    bgGradient: 'from-emerald-100 to-teal-100 border-emerald-200 text-emerald-900',
    personality: 'Bền bỉ, điềm tĩnh, sức mạnh nội lực và kiên định',
    description: 'Chú gấu trúc dũng cảm từ rừng trúc ngút ngàn, học chữ như luyện võ công bí truyền.',
    stageTitles: {
      baby: 'Gấu Trúc Lon Ton',
      kid: 'Võ Sinh Rừng Trúc',
      teen: 'Hiệp Khách Trúc Lâm',
      master: 'Võ Thánh Trúc Lâm Kuma',
    },
    stageQuotes: {
      baby: ['Gừ gừ~ Tớ thích ăn lá trúc và học chữ!', 'Senpai đừng bỏ tớ nha!', 'Cố lên nào bạn ơi!'],
      kid: ['Một nét một đường, vững như kiềng ba chân!', 'Sức mạnh nằm ở sự kiên trì mỗi ngày!', 'Cứ thế mà tiến bước!'],
      teen: ['Hán tự như thế võ, nắm rõ bộ thủ là bách chiến bách thắng!', 'Chuỗi bài tập này tớ bảo vệ cho senpai!', 'Không gì lay chuyển được ý chí!'],
      master: ['Khí phách hiên ngang như rừng trúc ngàn năm! Chúc mừng tân đại sư!', 'Vạn quyển kinh thư đều thông thuộc!', 'Uy vũ vô song!'],
    },
  },
  shiba: {
    id: 'shiba',
    name: 'Cún Shiba Trung Thành',
    japaneseName: '柴犬 (Shiba Inu)',
    species: 'Cún Shiba Nhật',
    emoji: '🐶',
    color: '#D97706',
    bgGradient: 'from-yellow-100 to-amber-100 border-yellow-200 text-yellow-900',
    personality: 'Trung thành vô điều kiện, hăng hái, luôn tràn đầy năng lượng tích cực',
    description: 'Quốc khuyển Nhật Bản với nụ cười tỏa nắng, luôn đồng hành cạnh bạn mọi lúc mọi nơi.',
    stageTitles: {
      baby: 'Cún Con Má Phúng',
      kid: 'Shiba Vui Vẻ',
      teen: 'Shiba Lãng Khách',
      master: 'Thần Khuyển Hộ Mệnh Shiba',
    },
    stageQuotes: {
      baby: ['Gâu gâu! Tớ ngoe nguẩy đuôi mừng senpai nè!', 'Học vui quá gâu!', 'Tớ thích chữ này!'],
      kid: ['Gâu! Hôm nay lại luyện 10 chữ nữa hả? Quá đã!', 'Tớ sẽ chạy vòng quanh cổ vũ cho cậu!', 'Tung hoa ăn mừng!'],
      teen: ['Dù bão giông hay chữ khó, Shiba tớ luôn kề vai sát cánh!', 'Chuỗi này mà đứt là uổng lắm đó nha, tiến lên!', 'Cố lên chiến hữu!'],
      master: ['Lòng trung kiên và nghị lực bền bỉ đã tạo nên một kỳ tích!', 'Bảo vệ thành quả học tập của bạn suốt đời!', 'Gâu vạn tuế!'],
    },
  },
  kitsune: {
    id: 'kitsune',
    name: 'Cáo Hồ Ly Tinh Anh',
    japaneseName: '九尾の狐 (Kitsune)',
    species: 'Hồ ly tiên giới',
    emoji: '🦊',
    color: '#7C3AED',
    bgGradient: 'from-purple-100 to-indigo-100 border-purple-200 text-purple-900',
    personality: 'Huyền bí, thông tuệ, sắc sảo và am hiểu điển cố điển tích',
    description: 'Linh hồ cổ xưa thấu hiểu huyền cơ trong từng bộ thủ chữ Hán, biến hóa khôn lường.',
    stageTitles: {
      baby: 'Tiểu Hồ Ly 1 Đuôi',
      kid: 'Tam Vĩ Linh Hồ',
      teen: 'Lục Vĩ Thần Thú',
      master: 'Cửu Vĩ Thiên Hồ Trí Tuệ',
    },
    stageQuotes: {
      baby: ['Khì khì~ Bí mật chữ Hán nằm ở bộ thủ đấy!', 'Mắt tớ tinh lắm, nhìn ra ngay!', 'Lạ ghê nha!'],
      kid: ['Đuôi tớ xòe ra vì bạn làm đúng rồi kìa!', 'Trí tuệ là thứ vũ khí sắc bén nhất!', 'Học một biết mười!'],
      teen: ['Âm Hán Việt là chiếc chìa khóa vạn năng mở mọi cánh cửa bí thuật!', 'Nội công thâm hậu, chữ khó cũng phải cúi đầu!', 'Xuất sắc lắm senpai!'],
      master: ['Cửu vĩ tỏa sáng rạng ngời! Cả kho tàng ngôn ngữ đã nằm trọn trong bàn tay bạn!', 'Thấu suốt càn khôn!', 'Thiên hạ vô song!'],
    },
  },
};

export const ALL_ACCESSORIES: MascotAccessory[] = [
  // Headwear
  {
    id: 'hachimaki',
    name: 'Băng đô võ sĩ Hachimaki',
    category: 'headwear',
    icon: '🥋',
    requiredStreak: 3,
    description: 'Băng đô ý chí "Tất Thắng" (必勝) tiếp thêm quyết tâm học tập',
  },
  {
    id: 'beret',
    name: 'Mũ thám tử Beret',
    category: 'headwear',
    icon: '🧢',
    requiredStreak: 5,
    description: 'Chiếc mũ phong cách cổ điển dành cho chuyên gia bóc tách Hán tự',
  },
  {
    id: 'kasa',
    name: 'Nón cật tre Kasa Samurai',
    category: 'headwear',
    icon: '👒',
    requiredStreak: 7,
    description: 'Nón lá truyền thống của các kiếm khách lãng du Nhật Bản',
  },
  {
    id: 'sushi_chef',
    name: 'Mũ đầu bếp Sushi',
    category: 'headwear',
    icon: '🍣',
    requiredStreak: 10,
    description: 'Mũ bếp trưởng tay nghề cao, thái chữ điêu luyện',
  },
  {
    id: 'crown',
    name: 'Vương miện Hoàng Gia Vàng',
    category: 'headwear',
    icon: '👑',
    requiredStreak: 15,
    description: 'Vương miện kim cương vàng ròng vinh danh người giữ chuỗi huyền thoại',
  },

  // Eyewear / Face
  {
    id: 'round_glasses',
    name: 'Kính tri thức tròn xoe',
    category: 'eyewear',
    icon: '👓',
    requiredStreak: 4,
    description: 'Gọng kính tròn học giả giúp nhìn rõ từng nét phẩy nét móc',
  },
  {
    id: 'sunglasses',
    name: 'Kính râm Cool Ngầu',
    category: 'eyewear',
    icon: '😎',
    requiredStreak: 6,
    description: 'Kính mát thời thượng phong thái siêu sao học đường',
  },
  {
    id: 'kitsune_mask',
    name: 'Mặt nạ hồ ly Kitsune',
    category: 'eyewear',
    icon: '🎭',
    requiredStreak: 8,
    description: 'Mặt nạ cáo lễ hội Shinto truyền thống huyền bí',
  },
  {
    id: 'monocle',
    name: 'Kính độc nhãn Quý tộc',
    category: 'eyewear',
    icon: '🧐',
    requiredStreak: 12,
    description: 'Kính một mắt của các bá tước châu Âu uyên bác',
  },

  // Outfits
  {
    id: 'red_scarf',
    name: 'Khăn quàng đỏ ấm áp',
    category: 'outfit',
    icon: '🧣',
    requiredStreak: 3,
    description: 'Khăn len dệt đỏ ấm lòng trong mùa đông băng giá',
  },
  {
    id: 'yukata',
    name: 'Áo Yukata Hoa Anh Đào',
    category: 'outfit',
    icon: '🌸',
    requiredStreak: 6,
    description: 'Trang phục truyền thống mùa hè rực rỡ sắc hoa anh đào',
  },
  {
    id: 'karate_gi',
    name: 'Võ phục Karate đai đen',
    category: 'outfit',
    icon: '🥋',
    requiredStreak: 9,
    description: 'Võ phục trắng tinh khôi đi kèm đai đen đẳng cấp thượng thừa',
  },
  {
    id: 'kimono',
    name: 'Kimono hoàng gia quý phái',
    category: 'outfit',
    icon: '👘',
    requiredStreak: 13,
    description: 'Bộ kimono gấm vàng dệt tay của giới quý tộc Kyoto',
  },
  {
    id: 'wizard_robe',
    name: 'Áo choàng pháp sư bí thuật',
    category: 'outfit',
    icon: '🪄',
    requiredStreak: 18,
    description: 'Áo choàng dạ hội đính sao lấp lánh của đại pháp sư Hán học',
  },

  // Handheld items
  {
    id: 'calligraphy_brush',
    name: 'Bút lông thư pháp thần kỳ',
    category: 'handheld',
    icon: '🖌️',
    requiredStreak: 4,
    description: 'Bút lông lông sói hảo hạng, nét vẽ như rồng bay phượng múa',
  },
  {
    id: 'sensu_fan',
    name: 'Quạt xếp Nhật Bản Sensu',
    category: 'handheld',
    icon: '🪭',
    requiredStreak: 7,
    description: 'Quạt nan tre hoa văn sóng biển Kanagawa danh tiếng',
  },
  {
    id: 'dango',
    name: 'Xiên bánh Dango 3 màu',
    category: 'handheld',
    icon: '🍡',
    requiredStreak: 10,
    description: 'Món ăn vặt ngọt ngào bổ sung năng lượng sau mỗi bài tập',
  },
  {
    id: 'wooden_sword',
    name: 'Kiếm gỗ Bokken rèn luyện',
    category: 'handheld',
    icon: '🗡️',
    requiredStreak: 14,
    description: 'Thanh kiếm gỗ dồi dào tinh thần võ sĩ đạo Samurai',
  },
  {
    id: 'scroll',
    name: 'Cuộn bí kíp Vạn Tự Thư',
    category: 'handheld',
    icon: '📜',
    requiredStreak: 20,
    description: 'Bảo vật cổ truyền ghi lại trọn bộ 2136 chữ Hán Thường dùng',
  },
];

export function getMascotStage(streak: number): MascotStage {
  if (streak >= 15) return 'master';
  if (streak >= 10) return 'teen';
  if (streak >= 6) return 'kid';
  return 'baby';
}

function getStorageKey(userId: string): string {
  return `kanjiviet_mascot_state_${userId}`;
}

export function getUserMascotState(userId: string): UserMascotState {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (raw) {
      const parsed: UserMascotState = JSON.parse(raw);
      return {
        userId,
        streak: parsed.streak || 0,
        highestStreak: parsed.highestStreak || parsed.streak || 0,
        totalCompletedSessions: parsed.totalCompletedSessions || 0,
        selectedMascotId: parsed.selectedMascotId || null,
        equippedItems: parsed.equippedItems || {},
        lastTrainedAt: parsed.lastTrainedAt || 0,
      };
    }
  } catch {
    // fallback
  }

  const initial: UserMascotState = {
    userId,
    streak: 0,
    highestStreak: 0,
    totalCompletedSessions: 0,
    selectedMascotId: null,
    equippedItems: {},
  };
  return initial;
}

export function saveUserMascotState(state: UserMascotState): void {
  try {
    localStorage.setItem(getStorageKey(state.userId), JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function recordCompletedWorkout(userId: string): {
  state: UserMascotState;
  newStreak: number;
  unlockedMascotNow: boolean;
  unlockedItems: MascotAccessory[];
  previousStage: MascotStage;
  currentStage: MascotStage;
} {
  const current = getUserMascotState(userId);
  const prevStreak = current.streak;
  const newStreak = prevStreak + 1;
  const highestStreak = Math.max(current.highestStreak, newStreak);
  const totalSessions = current.totalCompletedSessions + 1;

  const previousStage = getMascotStage(prevStreak);
  const currentStage = getMascotStage(newStreak);

  // Check if mascot is newly unlocked (just crossed streak 3)
  const unlockedMascotNow = prevStreak < 3 && newStreak >= 3;

  // Default to 'neko' if user has no mascot and hits streak 3
  let selectedMascot = current.selectedMascotId;
  if (!selectedMascot && newStreak >= 3) {
    selectedMascot = 'neko';
  }

  // Find newly unlocked accessories
  const newlyUnlocked = ALL_ACCESSORIES.filter(
    (acc) => prevStreak < acc.requiredStreak && newStreak >= acc.requiredStreak
  );

  const updated: UserMascotState = {
    ...current,
    streak: newStreak,
    highestStreak,
    totalCompletedSessions: totalSessions,
    selectedMascotId: selectedMascot,
    lastTrainedAt: Date.now(),
  };

  saveUserMascotState(updated);

  return {
    state: updated,
    newStreak,
    unlockedMascotNow,
    unlockedItems: newlyUnlocked,
    previousStage,
    currentStage,
  };
}

export function selectUserMascot(userId: string, mascotId: MascotId): UserMascotState {
  const current = getUserMascotState(userId);
  const updated: UserMascotState = {
    ...current,
    selectedMascotId: mascotId,
  };
  saveUserMascotState(updated);
  return updated;
}

export function equipAccessory(
  userId: string,
  category: MascotItemType,
  accessoryId?: string
): UserMascotState {
  const current = getUserMascotState(userId);
  const currentEquipped = { ...current.equippedItems };
  if (!accessoryId) {
    delete currentEquipped[category];
  } else {
    currentEquipped[category] = accessoryId;
  }
  const updated: UserMascotState = {
    ...current,
    equippedItems: currentEquipped,
  };
  saveUserMascotState(updated);
  return updated;
}

// Development helper to set streak directly for testing mascot stages and accessories
export function setStreakForTesting(userId: string, streak: number): UserMascotState {
  const current = getUserMascotState(userId);
  const updated: UserMascotState = {
    ...current,
    streak,
    highestStreak: Math.max(current.highestStreak, streak),
    selectedMascotId: current.selectedMascotId || (streak >= 3 ? 'neko' : null),
  };
  saveUserMascotState(updated);
  return updated;
}
