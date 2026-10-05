import { FontSizeSetting, KanjiFontStyle, PastelThemeId, ThemeSettings } from '../types/kanji';

export interface ThemeConfig {
  id: PastelThemeId;
  name: string;
  jpName: string;
  description: string;
  previewColor: string;
  previewSecondary: string;
  bgCanvas: string;
  bgSurface: string;
  bgSubtle: string;
  borderSubtle: string;
  primaryBg: string;
  primaryHoverBg: string;
  primaryText: string;
  primaryBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  headerBg: string;
  kanjiBoxBg: string;
}

export const THEME_CONFIGS: Record<PastelThemeId, ThemeConfig> = {
  sakura: {
    id: 'sakura',
    name: 'Hoa Anh Đào',
    jpName: '桜 (Sakura)',
    description: 'Sắc hồng phấn pastel dịu nhẹ, thanh nhã như những cánh hoa anh đào nở sớm.',
    previewColor: '#F472B6',
    previewSecondary: '#FCE7F3',
    bgCanvas: 'bg-[#FFF5F7]',
    bgSurface: 'bg-white',
    bgSubtle: 'bg-[#FDF0F3]',
    borderSubtle: 'border-[#F8D5DE]',
    primaryBg: 'bg-[#E15B7C]',
    primaryHoverBg: 'hover:bg-[#C94767]',
    primaryText: 'text-[#E15B7C]',
    primaryBorder: 'border-[#E15B7C]',
    badgeBg: 'bg-[#FEEBF0]',
    badgeText: 'text-[#B82B51]',
    badgeBorder: 'border-[#F8CCD7]',
    headerBg: 'bg-[#3B252C]',
    kanjiBoxBg: 'bg-[#FFF8FA]',
  },
  matcha: {
    id: 'matcha',
    name: 'Trà Xanh Matcha',
    jpName: '抹茶 (Matcha)',
    description: 'Sắc xanh ngọc bích pastel mát dịu, tạo cảm giác an tĩnh và giảm mỏi mắt khi đọc lâu.',
    previewColor: '#10B981',
    previewSecondary: '#D1FAE5',
    bgCanvas: 'bg-[#F4F9F5]',
    bgSurface: 'bg-white',
    bgSubtle: 'bg-[#EBF4ED]',
    borderSubtle: 'border-[#D0E5D5]',
    primaryBg: 'bg-[#3E8055]',
    primaryHoverBg: 'hover:bg-[#2F6843]',
    primaryText: 'text-[#3E8055]',
    primaryBorder: 'border-[#3E8055]',
    badgeBg: 'bg-[#E5F3E8]',
    badgeText: 'text-[#1F5C34]',
    badgeBorder: 'border-[#C2E3C9]',
    headerBg: 'bg-[#1C2C21]',
    kanjiBoxBg: 'bg-[#F8FCF9]',
  },
  hydrangea: {
    id: 'hydrangea',
    name: 'Cẩm Tú Cầu',
    jpName: '紫陽花 (Ajisai)',
    description: 'Sắc tím oải hương kết hợp ánh lam ngọc mộng mơ, mang âm hưởng thanh tao mùa mưa Nhật Bản.',
    previewColor: '#818CF8',
    previewSecondary: '#E0E7FF',
    bgCanvas: 'bg-[#F6F7FD]',
    bgSurface: 'bg-white',
    bgSubtle: 'bg-[#EEF0FA]',
    borderSubtle: 'border-[#D7DBF3]',
    primaryBg: 'bg-[#5B63D6]',
    primaryHoverBg: 'hover:bg-[#4850C2]',
    primaryText: 'text-[#5B63D6]',
    primaryBorder: 'border-[#5B63D6]',
    badgeBg: 'bg-[#EDEFFF]',
    badgeText: 'text-[#3D45AC]',
    badgeBorder: 'border-[#CED3FA]',
    headerBg: 'bg-[#20233D]',
    kanjiBoxBg: 'bg-[#FAFBFD]',
  },
  sorbet: {
    id: 'sorbet',
    name: 'Kem Mơ & Trà Sữa',
    jpName: '杏子 (Anzu Milk)',
    description: 'Tông màu cam đào sorbet ấm áp, ngọt ngào và kích thích sự tập trung sáng tạo.',
    previewColor: '#FB923C',
    previewSecondary: '#FFEDD5',
    bgCanvas: 'bg-[#FFF9F4]',
    bgSurface: 'bg-white',
    bgSubtle: 'bg-[#FFF1E6]',
    borderSubtle: 'border-[#FDDCC7]',
    primaryBg: 'bg-[#D96B3E]',
    primaryHoverBg: 'hover:bg-[#BF562B]',
    primaryText: 'text-[#D96B3E]',
    primaryBorder: 'border-[#D96B3E]',
    badgeBg: 'bg-[#FFEFE3]',
    badgeText: 'text-[#AD461C]',
    badgeBorder: 'border-[#FDD4BB]',
    headerBg: 'bg-[#38261E]',
    kanjiBoxBg: 'bg-[#FFFBF8]',
  },
  sumi: {
    id: 'sumi',
    name: 'Giấy Washi & Mực Sumi',
    jpName: '和紙 & 墨 (Washi)',
    description: 'Giấy xuyến Nhật Bản mộc mạc kết hợp mực xám tro tao nhã của nghệ thuật thư pháp truyền thống.',
    previewColor: '#78716C',
    previewSecondary: '#E7E5E4',
    bgCanvas: 'bg-[#FAF8F5]',
    bgSurface: 'bg-white',
    bgSubtle: 'bg-[#F2EFEA]',
    borderSubtle: 'border-[#E4DFD6]',
    primaryBg: 'bg-[#675A51]',
    primaryHoverBg: 'hover:bg-[#52463F]',
    primaryText: 'text-[#675A51]',
    primaryBorder: 'border-[#675A51]',
    badgeBg: 'bg-[#EFEBE4]',
    badgeText: 'text-[#443831]',
    badgeBorder: 'border-[#DDD6CA]',
    headerBg: 'bg-[#272320]',
    kanjiBoxBg: 'bg-[#FCFBF9]',
  },
  minimal: {
    id: 'minimal',
    name: 'Bầu Trời Thu',
    jpName: '秋空 (Akizora)',
    description: 'Gam xanh thiên thanh pastel êm dịu, hiện đại, thích hợp cho việc học nghiên cứu chuyên sâu.',
    previewColor: '#38BDF8',
    previewSecondary: '#E0F2FE',
    bgCanvas: 'bg-[#F6FAFD]',
    bgSurface: 'bg-white',
    bgSubtle: 'bg-[#EDF5FA]',
    borderSubtle: 'border-[#D2E6F2]',
    primaryBg: 'bg-[#257EA6]',
    primaryHoverBg: 'hover:bg-[#1A6588]',
    primaryText: 'text-[#257EA6]',
    primaryBorder: 'border-[#257EA6]',
    badgeBg: 'bg-[#E4F3FA]',
    badgeText: 'text-[#125372]',
    badgeBorder: 'border-[#C2E3F4]',
    headerBg: 'bg-[#182B36]',
    kanjiBoxBg: 'bg-[#F9FCFE]',
  },
};

export const FONT_SIZE_CLASSES: Record<FontSizeSetting, { body: string; kanjiTitle: string; hanViet: string }> = {
  compact: {
    body: 'text-xs md:text-sm',
    kanjiTitle: 'text-3xl md:text-4xl',
    hanViet: 'text-xl md:text-2xl',
  },
  normal: {
    body: 'text-sm md:text-base',
    kanjiTitle: 'text-4xl md:text-5xl',
    hanViet: 'text-2xl md:text-3xl',
  },
  comfortable: {
    body: 'text-base md:text-lg',
    kanjiTitle: 'text-5xl md:text-6xl',
    hanViet: 'text-3xl md:text-4xl',
  },
  spacious: {
    body: 'text-lg md:text-xl',
    kanjiTitle: 'text-6xl md:text-7xl',
    hanViet: 'text-4xl md:text-5xl',
  },
};

export const KANJI_FONT_CLASSES: Record<KanjiFontStyle, string> = {
  serif: 'font-kanji',
  sans: 'font-sans font-bold',
  brush: 'font-kanji font-bold italic tracking-widest',
};
