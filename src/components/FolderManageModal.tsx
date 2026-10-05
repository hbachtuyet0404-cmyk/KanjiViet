import React, { useState } from 'react';
import { UserPracticeFolder } from '../types/kanji';
import { createFolder, updateFolder, deleteFolder } from '../utils/folderManager';
import { X, FolderPlus, Folder, Trash2, Edit2, Plus, Check, BookOpen } from 'lucide-react';
import { ThemeConfig } from '../utils/themeManager';

interface FolderManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  folders: UserPracticeFolder[];
  onFoldersChange: (folders: UserPracticeFolder[]) => void;
  onSelectFolderToPractice: (folderId: string) => void;
  theme: ThemeConfig;
  onToast: (msg: string) => void;
}

const AVAILABLE_ICONS = ['📁', '🌸', '💼', '🏮', '⚡', '🎯', '📚', '🍵', '🏯', '🖌️', '🔥', '✨'];

export const FolderManageModal: React.FC<FolderManageModalProps> = ({
  isOpen,
  onClose,
  userId,
  folders,
  onFoldersChange,
  onSelectFolderToPractice,
  theme,
  onToast,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderDesc, setFolderDesc] = useState('');
  const [folderIcon, setFolderIcon] = useState('📁');
  const [folderWordsInput, setFolderWordsInput] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) {
      onToast('Vui lòng nhập tên thư mục!');
      return;
    }

    // Split words by space, comma or newline
    const words = folderWordsInput
      .split(/[\s,;\n]+/)
      .map((w) => w.trim())
      .filter((w) => Boolean(w));

    const newFolder = createFolder(userId, folderName, folderIcon, folderDesc, words);
    onFoldersChange([newFolder, ...folders]);
    onToast(`Đã tạo thư mục [${newFolder.name}] với ${newFolder.words.length} từ!`);

    // Reset form
    setFolderName('');
    setFolderDesc('');
    setFolderWordsInput('');
    setFolderIcon('📁');
    setIsCreating(false);
  };

  const handleDelete = (folder: UserPracticeFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    if (folders.length <= 1) {
      onToast('Cần giữ lại ít nhất 1 thư mục luyện tập!');
      return;
    }
    const updated = deleteFolder(userId, folder.id);
    onFoldersChange(updated);
    onToast(`Đã xóa thư mục [${folder.name}]`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between ${theme.bgSubtle}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${theme.primaryBg} text-white flex items-center justify-center shadow-xs text-xl`}>
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>Quản Lý Thư Mục Luyện Tập</span>
                <span className="text-xs font-mono-numbers px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  {folders.length} thư mục
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Tạo và sắp xếp bộ từ Kanji theo chủ đề hoặc cấp độ thi riêng của bạn
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

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Create New Folder Form Button / Collapsible */}
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-3 border-2 border-dashed border-stone-300 hover:border-stone-400 hover:bg-stone-50 rounded-2xl text-xs font-bold text-stone-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4 text-rose-600" />
              <span>Tạo thư mục luyện tập mới</span>
            </button>
          ) : (
            <form onSubmit={handleCreate} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <FolderPlus className="w-4 h-4 text-rose-600" />
                  <span>Tạo thư mục mới</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Biểu tượng thư mục:</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {AVAILABLE_ICONS.map((ic) => (
                    <button
                      type="button"
                      key={ic}
                      onClick={() => setFolderIcon(ic)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg border transition-colors ${
                        folderIcon === ic
                          ? 'border-rose-500 bg-white shadow-2xs scale-105'
                          : 'border-stone-200 hover:bg-white'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Tên thư mục:</label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Ví dụ: Kanji N2 Chuyên Ngành Kinh Tế, v.v..."
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Mô tả ngắn (tùy chọn):</label>
                <input
                  type="text"
                  value={folderDesc}
                  onChange={(e) => setFolderDesc(e.target.value)}
                  placeholder="Ghi chú mục tiêu học tập..."
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              {/* Initial Words */}
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">
                  Danh sách chữ Kanji hoặc từ ghép ban đầu (cách nhau bởi dấu cách hoặc phẩy):
                </label>
                <textarea
                  value={folderWordsInput}
                  onChange={(e) => setFolderWordsInput(e.target.value)}
                  placeholder="Ví dụ: 曖昧, 経済, 持続, 可能, 企業, 貿易..."
                  rows={2}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                >
                  Lưu thư mục
                </button>
              </div>
            </form>
          )}

          {/* Folder List */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Danh Sách Thư Mục Của Bạn:
            </div>

            {folders.map((folder) => (
              <div
                key={folder.id}
                onClick={() => {
                  onSelectFolderToPractice(folder.id);
                  onClose();
                }}
                className="p-4 rounded-2xl border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/70 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-xl shrink-0 border border-stone-200">
                    {folder.icon || '📁'}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <span>{folder.name}</span>
                      <span className="text-[11px] font-mono-numbers px-2 py-0.2 rounded-full bg-stone-100 text-stone-600">
                        {folder.words.length} từ
                      </span>
                    </div>
                    {folder.description && (
                      <p className="text-xs text-stone-500 line-clamp-1">{folder.description}</p>
                    )}
                    <div className="text-[11px] text-stone-400 font-kanji truncate max-w-sm pt-0.5">
                      {folder.words.slice(0, 10).join('  ')} {folder.words.length > 10 ? '...' : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectFolderToPractice(folder.id);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors"
                  >
                    Luyện tập
                  </button>

                  <button
                    onClick={(e) => handleDelete(folder, e)}
                    className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Xóa thư mục"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
