import React, { useState } from 'react';
import {
  X,
  Palette,
  User,
  Users,
  Plus,
  Check,
  Type,
  Sparkles,
  Sliders,
  Trash2,
  LogOut,
  FolderSync,
} from 'lucide-react';
import { FontSizeSetting, KanjiFontStyle, PastelThemeId, ThemeSettings, UserAccount } from '../types/kanji';
import { THEME_CONFIGS } from '../utils/themeManager';
import { createAccount, deleteAccount, getAllAccounts, updateAccountSettings } from '../utils/accountManager';

interface ThemeAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeUser: UserAccount;
  onUserChange: (user: UserAccount) => void;
  onToast: (msg: string) => void;
}

export const ThemeAccountModal: React.FC<ThemeAccountModalProps> = ({
  isOpen,
  onClose,
  activeUser,
  onUserChange,
  onToast,
}) => {
  const [modalTab, setModalTab] = useState<'theme' | 'accounts' | 'createAccount'>('theme');
  const [accounts, setAccounts] = useState<UserAccount[]>(getAllAccounts());

  // Form for creating a new account
  const [newUsername, setNewUsername] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newRole, setNewRole] = useState('Sinh viên Nhật Bản Học');
  const [newAvatar, setNewAvatar] = useState('🌸');
  const [newThemeId, setNewThemeId] = useState<PastelThemeId>('sakura');

  if (!isOpen) return null;

  const handleSelectTheme = (themeId: PastelThemeId) => {
    const updated = updateAccountSettings(activeUser.id, { themeId });
    onUserChange(updated);
    setAccounts(getAllAccounts());
    onToast(`Đã đổi sang giao diện: ${THEME_CONFIGS[themeId].name}`);
  };

  const handleSelectFontSize = (fontSize: FontSizeSetting) => {
    const updated = updateAccountSettings(activeUser.id, { fontSize });
    onUserChange(updated);
    setAccounts(getAllAccounts());
    onToast('Đã cập nhật cỡ chữ!');
  };

  const handleSelectKanjiFont = (kanjiFont: KanjiFontStyle) => {
    const updated = updateAccountSettings(activeUser.id, { kanjiFont });
    onUserChange(updated);
    setAccounts(getAllAccounts());
    onToast('Đã cập nhật kiểu chữ Kanji!');
  };

  const handleSwitchAccount = (account: UserAccount) => {
    onUserChange(account);
    setAccounts(getAllAccounts());
    onToast(`Đã chuyển sang tài khoản học viên: ${account.displayName}`);
    onClose();
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    const created = createAccount({
      username: newUsername,
      displayName: newDisplayName || newUsername,
      avatar: newAvatar,
      role: newRole,
      themeId: newThemeId,
    });

    setAccounts(getAllAccounts());
    onUserChange(created);
    onToast(`Chào mừng tài khoản mới: ${created.displayName}!`);
    setModalTab('theme');
  };

  const handleDeleteUser = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa tài khoản này? Dữ liệu riêng của tài khoản sẽ bị dọn dẹp.')) {
      const nextActive = deleteAccount(userId);
      setAccounts(getAllAccounts());
      onUserChange(nextActive);
      onToast('Đã xóa tài khoản.');
    }
  };

  const avatarPresets = ['🌸', '🍵', '🪻', '🍑', '⛩️', '📚', '🎋', '🍙', '🎏', '🎌', '🕊️', '✨'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">{activeUser.avatar}</span>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                Tùy chỉnh Giao diện & Tài khoản
              </h3>
              <p className="text-xs text-stone-500">
                Đang đăng nhập: <strong className="text-stone-800">{activeUser.displayName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-md hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 p-1 text-xs font-semibold">
          <button
            onClick={() => setModalTab('theme')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              modalTab === 'theme' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-rose-600" />
            <span>Chủ đề & Cỡ chữ</span>
          </button>

          <button
            onClick={() => setModalTab('accounts')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              modalTab === 'accounts' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Chuyển tài khoản ({accounts.length})</span>
          </button>

          <button
            onClick={() => setModalTab('createAccount')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              modalTab === 'createAccount' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tạo tài khoản mới</span>
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
                        className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
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
                          <div className="absolute top-2 right-2">
                            <Check className="w-4 h-4 text-rose-600" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Size Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                  2. Cỡ Chữ Hiển Thị:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'compact', label: 'Nhỏ gọn' },
                    { id: 'normal', label: 'Tiêu chuẩn' },
                    { id: 'comfortable', label: 'Thoải mái' },
                    { id: 'spacious', label: 'Rộng rãi' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => handleSelectFontSize(f.id as any)}
                      className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                        activeUser.themeSettings.fontSize === f.id
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border-stone-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kanji Font Style */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                  3. Kiểu Chữ Hán Tự (Kanji):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'serif', label: 'Mincho (Thư pháp)', preview: '漢字' },
                    { id: 'sans', label: 'Gothic (Hiện đại)', preview: '漢字' },
                    { id: 'brush', label: 'Brush (Nét cọ nghiêng)', preview: '漢字' },
                  ].map((kf) => (
                    <button
                      key={kf.id}
                      onClick={() => handleSelectKanjiFont(kf.id as any)}
                      className={`p-2.5 rounded-lg border text-center transition-colors flex flex-col items-center gap-1 ${
                        activeUser.themeSettings.kanjiFont === kf.id
                          ? 'bg-rose-50 border-rose-400 text-rose-900 font-semibold'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span className="text-xl font-bold font-kanji">{kf.preview}</span>
                      <span className="text-[11px] text-stone-500">{kf.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACCOUNTS LIST */}
          {modalTab === 'accounts' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-500">
                Mỗi tài khoản lưu trữ riêng biệt sổ tay từ vựng, lịch sử tra cứu, chữ viết tay và thiết lập pastel.
              </p>

              <div className="space-y-2.5">
                {accounts.map((acc) => {
                  const isActive = acc.id === activeUser.id;
                  const themeCfg = THEME_CONFIGS[acc.themeSettings?.themeId || 'sakura'];

                  return (
                    <div
                      key={acc.id}
                      onClick={() => handleSwitchAccount(acc)}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-rose-50/60 border-rose-300 ring-2 ring-rose-400/20 shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-1 bg-white rounded-lg border border-stone-200 shadow-2xs">
                          {acc.avatar}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 text-sm">
                              {acc.displayName}
                            </span>
                            {isActive && (
                              <span className="text-[10px] uppercase font-bold bg-rose-700 text-white px-1.5 py-0.2 rounded">
                                Đang dùng
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500">
                            @{acc.username} · {acc.role || 'Người học Kanji'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-stone-300"
                          style={{ backgroundColor: themeCfg?.previewColor || '#f472b6' }}
                          title={`Theme: ${themeCfg?.name}`}
                        />
                        {accounts.length > 1 && !isActive && (
                          <button
                            onClick={(e) => handleDeleteUser(acc.id, e)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded transition-colors"
                            title="Xóa tài khoản này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CREATE ACCOUNT */}
          {modalTab === 'createAccount' && (
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Chọn Avatar học viên:
                </label>
                <div className="flex flex-wrap gap-2">
                  {avatarPresets.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setNewAvatar(av)}
                      className={`text-xl p-2 rounded-lg border transition-transform ${
                        newAvatar === av ? 'scale-115 bg-rose-50 border-rose-400 shadow-xs' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Tên đăng nhập / ID <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="VD: minh_duc"
                    className="w-full p-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Tên hiển thị <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    placeholder="VD: Minh Đức (N2)"
                    className="w-full p-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Mục tiêu học tập / Vai trò
                </label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="VD: Luyện thi JLPT N2, Sinh viên Dịch thuật,..."
                  className="w-full p-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Màu sắc giao diện ban đầu
                </label>
                <select
                  value={newThemeId}
                  onChange={(e) => setNewThemeId(e.target.value as any)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  {(Object.keys(THEME_CONFIGS) as PastelThemeId[]).map((tId) => (
                    <option key={tId} value={tId}>
                      {THEME_CONFIGS[tId].name} - {THEME_CONFIGS[tId].jpName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalTab('accounts')}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 rounded-lg font-medium"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  Tạo & Đăng nhập ngay
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
