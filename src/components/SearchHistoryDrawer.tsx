import React from 'react';
import { X, Trash2, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { SearchHistoryEntry } from '../types/kanji';

interface SearchHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: SearchHistoryEntry[];
  onSelectQuery: (query: string) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const SearchHistoryDrawer: React.FC<SearchHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectQuery,
  onDeleteItem,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-stone-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-600" />
            <h3 className="font-bold text-stone-900 text-base">
              Lịch sử tra cứu ({history.length})
            </h3>
          </div>

          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={onClearAll}
                title="Xóa toàn bộ lịch sử"
                className="p-1.5 text-stone-500 hover:text-rose-600 rounded-md hover:bg-stone-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-800 rounded-md hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {history.length === 0 ? (
            <div className="py-16 text-center text-stone-400 space-y-3">
              <Clock className="w-10 h-10 mx-auto stroke-1 text-stone-300" />
              <p className="text-sm">Chưa có lịch sử tra cứu nào.</p>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                Mỗi khi bạn tra một từ Kanji hoặc âm Hán Việt, từ đó sẽ được tự động lưu vào đây.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const timeString = new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });
              const dateString = new Date(item.timestamp).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={item.id}
                  className="group p-3 bg-stone-50 hover:bg-stone-100/90 rounded-xl border border-stone-200/80 transition-all flex items-center justify-between gap-3"
                >
                  <button
                    onClick={() => {
                      onSelectQuery(item.query);
                      onClose();
                    }}
                    className="flex-1 text-left min-w-0"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-kanji font-bold text-lg text-stone-900 truncate">
                        {item.displayWord || item.query}
                      </span>
                      {item.hanViet && (
                        <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                          {item.hanViet}
                        </span>
                      )}
                    </div>

                    {item.meaning && (
                      <p className="text-xs text-stone-600 truncate mt-0.5">
                        {item.meaning}
                      </p>
                    )}

                    <div className="text-[11px] font-mono-numbers text-stone-400 mt-1">
                      {dateString} · {timeString}
                    </div>
                  </button>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        onSelectQuery(item.query);
                        onClose();
                      }}
                      className="p-1.5 text-stone-400 hover:text-stone-900 rounded-md hover:bg-white transition-colors"
                      title="Tra lại từ này"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-md hover:bg-white transition-colors"
                      title="Xóa mục này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 text-xs text-stone-500 text-center">
          Dữ liệu được lưu trữ an toàn trong trình duyệt của bạn (LocalStorage).
        </div>
      </div>
    </div>
  );
};
