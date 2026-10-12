import React, { useState, useEffect } from 'react';
import {
  X,
  Palette,
  Check,
  Type,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
  Loader2,
  Lock,
} from 'lucide-react';
import { FontSizeSetting, KanjiFontStyle, PastelThemeId, UserAccount } from '../types/kanji';
import { THEME_CONFIGS } from '../utils/themeManager';
import { convertFirebaseUserToAccount, logoutAccount, updateAccountSettings } from '../utils/accountManager';
import {
  getFriendlyAuthErrorMessage,
  loginWithGooglePopup,
  logoutFirebase,
} from '../utils/firebase';

interface ThemeAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeUser: UserAccount;
  onUserChange: (user: UserAccount) => void;
  onToast: (msg: string) => void;
  initialTab?: 'theme' | 'google';
}

export const ThemeAccountModal: React.FC<ThemeAccountModalProps> = ({
  isOpen,
  onClose,
  activeUser,
  onUserChange,
  onToast,
  initialTab = 'theme',
}) => {
  const [modalTab, setModalTab] = useState<'theme' | 'google'>(initialTab);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setModalTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleSelectTheme = (themeId: PastelThemeId) => {
    const updated = updateAccountSettings(activeUser.id, { themeId });
    onUserChange(updated);
    onToast(`Đã đổi sang giao diện: ${THEME_CONFIGS[themeId].name}`);
  };

  const handleSelectFontSize = (fontSize: FontSizeSetting) => {
    const updated = updateAccountSettings(activeUser.id, { fontSize });
    onUserChange(updated);
    onToast('Đã cập nhật cỡ chữ!');
  };

  const handleSelectKanjiFont = (kanjiFont: KanjiFontStyle) => {
    const updated = updateAccountSettings(activeUser.id, { kanjiFont });
    onUserChange(updated);
    onToast('Đã cập nhật kiểu chữ Kanji!');
  };

  /**
   * Trigger real Google Sign-In popup with Firebase Authentication Modular SDK
   */
  const handleTriggerRealGoogleLogin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const fbUser = await loginWithGooglePopup();
      const userAccount = convertFirebaseUserToAccount(fbUser);
      onUserChange(userAccount);
      onToast(`Chào mừng ${userAccount.displayName}! Đăng nhập Google thành công.`);
      setIsSubmitting(false);
      onClose();
    } catch (err: unknown) {
      setIsSubmitting(false);
      const friendlyMsg = getFriendlyAuthErrorMessage(err);
      onToast(friendlyMsg);
    }
  };

  /**
   * Sign out from Firebase Authentication
   */
  const handleGoogleLogout = async () => {
    try {
      await logoutFirebase();
      const guest = logoutAccount();
      onUserChange(guest);
      onToast('Đã đăng xuất khỏi tài khoản Google.');
    } catch (err) {
      console.error('Logout error', err);
      const guest = logoutAccount();
      onUserChange(guest);
      onToast('Đã đăng xuất.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            {activeUser.photoUrl ? (
              <img
                src={activeUser.photoUrl}
                alt="Google Avatar"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-stone-300"
              />
            ) : (
              <span className="text-2xl">{activeUser.isGoogleUser ? '🌐' : '👤'}</span>
            )}
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                {activeUser.isGoogleUser ? 'Tài Khoản Google Của Bạn' : 'Cài Đặt & Đăng Nhập'}
              </h3>
              <p className="text-xs text-stone-500">
                {activeUser.isGoogleUser ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{activeUser.email}</span>
                  </span>
                ) : (
                  <span>Khách (Chưa đăng nhập)</span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-xl hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 p-1.5 text-xs font-semibold gap-1">
          <button
            onClick={() => setModalTab('theme')}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              modalTab === 'theme' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-rose-600" />
            <span>Giao diện & Cỡ chữ</span>
          </button>

          <button
            onClick={() => setModalTab('google')}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              modalTab === 'google' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {activeUser.isGoogleUser ? 'Tài khoản Google' : 'Đăng nhập Google'}
            </span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: THEME & FONT SETTINGS */}
          {modalTab === 'theme' && (
            <div className="space-y-6">
              {/* Pastel Theme Presets */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                  1. Chọn Bảng Màu Pastel Yêu Thích:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(Object.keys(THEME_CONFIGS) as PastelThemeId[]).map((tId) => {
                    const cfg = THEME_CONFIGS[tId];
                    const isSelected = activeUser.themeSettings.themeId === tId;

                    return (
                      <button
                        key={tId}
                        onClick={() => handleSelectTheme(tId)}
                        className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? 'border-rose-600 ring-2 ring-rose-600/30 bg-rose-50/40 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                              style={{ backgroundColor: cfg.previewColor }}
                            />
                            <span className="text-xs font-bold text-stone-900 truncate">
                              {cfg.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-500 block truncate">
                            {cfg.jpName}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="absolute top-2 right-2 text-rose-600">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-stone-500" />
                  <span>2. Cỡ Chữ Hiển Thị:</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'compact', label: 'Nhỏ gọn' },
                    { id: 'normal', label: 'Chuẩn' },
                    { id: 'comfortable', label: 'Vừa vặn' },
                    { id: 'spacious', label: 'Lớn' },
                  ].map((size) => {
                    const isSelected = activeUser.themeSettings.fontSize === size.id;
                    return (
                      <button
                        key={size.id}
                        onClick={() => handleSelectFontSize(size.id as FontSizeSetting)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-rose-50 border-rose-500 text-rose-900 font-bold shadow-2xs'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {size.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Kanji Font Style */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-stone-500" />
                  <span>3. Font Chữ Kanji:</span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'serif', name: 'Mincho (Có chân)', sample: '明朝' },
                    { id: 'sans', name: 'Gothic (Không chân)', sample: 'ゴシック' },
                    { id: 'brush', name: 'Kyokasho (Mực mài)', sample: '教科書' },
                  ].map((f) => {
                    const isSelected = activeUser.themeSettings.kanjiFont === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => handleSelectKanjiFont(f.id as KanjiFontStyle)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-rose-50 border-rose-500 text-rose-900 font-bold shadow-2xs'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <div className="text-xl font-kanji mb-1">{f.sample}</div>
                        <div className="text-[11px] font-sans-ui">{f.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REAL FIREBASE GOOGLE AUTHENTICATION */}
          {modalTab === 'google' && (
            <div className="space-y-5">
              {activeUser.isGoogleUser ? (
                /* Authenticated State */
                <div className="space-y-5 animate-fade-in">
                  <div className="p-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 rounded-2xl flex items-center gap-4 shadow-2xs">
                    {activeUser.photoUrl ? (
                      <img
                        src={activeUser.photoUrl}
                        alt="Avatar"
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 shadow-xs shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold shrink-0 shadow-xs">
                        {activeUser.displayName[0]?.toUpperCase() || 'G'}
                      </div>
                    )}

                    <div className="space-y-1 truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-900 text-base truncate">
                          {activeUser.displayName}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Đã xác thực</span>
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 font-mono-numbers flex items-center gap-1 truncate">
                        <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{activeUser.email}</span>
                      </p>
                      <p className="text-[11px] text-emerald-700 font-medium">
                        Firebase Authentication · Google Provider
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-2">
                    <span className="font-bold text-stone-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Bảo mật tài khoản Google:</span>
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-stone-600">
                      <li>Tài khoản được xác thực trực tiếp bởi Google qua Firebase Auth SDK.</li>
                      <li>Toàn bộ sổ tay, lịch sử tra cứu và chuỗi nuôi linh vật lưu riêng cho UID này.</li>
                      <li>Tuyệt đối không lưu mật khẩu trên ứng dụng; session được duy trì an toàn.</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleGoogleLogout}
                    className="w-full py-3 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-300 hover:border-rose-300 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất khỏi tài khoản Google</span>
                  </button>
                </div>
              ) : (
                /* Unauthenticated: Official Google Sign-In button via Firebase */
                <div className="space-y-5 animate-fade-in">
                  <div className="text-center space-y-2 py-2">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 shadow-md flex items-center justify-center mx-auto">
                      <svg className="w-7 h-7" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    </div>

                    <h4 className="text-lg font-bold text-stone-900">
                      Đăng nhập bằng tài khoản Google
                    </h4>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                      Sử dụng tài khoản Google để đồng bộ sổ tay Hán tự, từ yêu thích và tiến độ học tập của bạn.
                    </p>
                  </div>

                  {/* Main Action: Genuine Firebase Google Popup Login */}
                  <div className="space-y-3 pt-1">
                    <button
                      onClick={handleTriggerRealGoogleLogin}
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 bg-white hover:bg-stone-50 active:scale-[0.99] text-stone-800 font-bold text-sm rounded-2xl border-2 border-stone-300 hover:border-blue-500 shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          <span>Đang kết nối Google Authentication...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                          </svg>
                          <span className="group-hover:text-blue-700 transition-colors">
                            Tiếp tục với Google
                          </span>
                        </>
                      )}
                    </button>

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] text-stone-500 flex items-start gap-2">
                      <Lock className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                      <span>
                        Cửa sổ đăng nhập chính thức của Google sẽ bật lên để bạn chọn tài khoản Google của mình. Thông tin tài khoản được lưu tự động trên ứng dụng.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
