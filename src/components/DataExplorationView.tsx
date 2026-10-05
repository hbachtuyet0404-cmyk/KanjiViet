import React, { useState } from 'react';
import {
  Database,
  Plus,
  Upload,
  Download,
  Search,
  BookOpen,
  Trash2,
  ArrowRight,
  Check,
  FileSpreadsheet,
  Printer,
  FileText,
  PenTool,
} from 'lucide-react';
import { CompoundWord, KanjiDetail, UserAccount } from '../types/kanji';
import {
  getAllCompounds,
  saveCustomCompound,
  deleteCustomCompound,
  saveCustomKanji,
  exportPersonalDatabase,
  importPersonalDatabase,
  exportStudySheetHTML,
} from '../utils/kanjiDatabase';
import { ThemeConfig } from '../utils/themeManager';

interface DataExplorationViewProps {
  onSelectWord: (word: string) => void;
  onRefresh: () => void;
  theme: ThemeConfig;
  user: UserAccount;
  onToast: (msg: string) => void;
}

export const DataExplorationView: React.FC<DataExplorationViewProps> = ({
  onSelectWord,
  onRefresh,
  theme,
  user,
  onToast,
}) => {
  const [compounds, setCompounds] = useState<CompoundWord[]>(() => getAllCompounds(user.id));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedJlpt, setSelectedJlpt] = useState<string>('all');
  const [addMode, setAddMode] = useState<'none' | 'compound' | 'singleKanji'>('none');

  // Form states for compound word
  const [formData, setFormData] = useState({
    word: '',
    reading: '',
    romaji: '',
    hanViet: '',
    meaning: '',
    category: 'Dịch thuật & Báo chí',
    jlpt: 'N2' as 'N1' | 'N2' | 'N3' | 'N4' | 'N5',
    nuance: '',
    exampleJa: '',
    exampleVi: '',
  });

  // Form states for single Kanji
  const [singleKanjiData, setSingleKanjiData] = useState({
    kanji: '',
    hanViet: '',
    meaning: '',
    on: '',
    kun: '',
    radical: 'Bộ thủ',
    strokeCount: 8,
    jlpt: 'N3' as 'N1' | 'N2' | 'N3' | 'N4' | 'N5',
    mnemonic: '',
  });

  const categories = [
    'all',
    'Dịch thuật & Báo chí',
    'Kinh tế & Thương mại',
    'Xã hội & Đời sống',
    'Xã hội & Pháp luật',
    'Yojijukugo',
  ];

  const handleFilter = () => {
    return compounds.filter((item) => {
      const matchSearch =
        item.word.includes(searchTerm) ||
        item.hanViet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchJlpt = selectedJlpt === 'all' || item.jlpt === selectedJlpt;
      return matchSearch && matchCat && matchJlpt;
    });
  };

  const handleAddCompoundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.word.trim() || !formData.hanViet.trim() || !formData.meaning.trim()) {
      alert('Vui lòng điền đầy đủ Chữ Kanji, Âm Hán Việt và Ý nghĩa!');
      return;
    }

    const newCompound: CompoundWord = {
      word: formData.word.trim(),
      reading: formData.reading.trim(),
      romaji: formData.romaji.trim(),
      hanViet: formData.hanViet.trim().toUpperCase(),
      meaning: formData.meaning.trim(),
      category: formData.category,
      jlpt: formData.jlpt,
      nuance: formData.nuance.trim(),
      isCustom: true,
      exampleSentence: formData.exampleJa.trim()
        ? {
            ja: formData.exampleJa.trim(),
            reading: '',
            vi: formData.exampleVi.trim(),
          }
        : undefined,
    };

    saveCustomCompound(newCompound, user.id);
    const updated = getAllCompounds(user.id);
    setCompounds(updated);
    setAddMode('none');
    onToast(`Đã thêm thành công từ [${newCompound.word}] vào tài khoản ${user.displayName}!`);
    onRefresh();

    setFormData({
      word: '',
      reading: '',
      romaji: '',
      hanViet: '',
      meaning: '',
      category: 'Dịch thuật & Báo chí',
      jlpt: 'N2',
      nuance: '',
      exampleJa: '',
      exampleVi: '',
    });
  };

  const handleAddSingleKanjiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleKanjiData.kanji.trim() || !singleKanjiData.hanViet.trim() || !singleKanjiData.meaning.trim()) {
      alert('Vui lòng nhập Chữ Hán, Âm Hán Việt và Ý nghĩa!');
      return;
    }

    const newKanji: KanjiDetail = {
      kanji: singleKanjiData.kanji.trim().slice(-1),
      hanViet: singleKanjiData.hanViet.trim().toUpperCase(),
      meaning: singleKanjiData.meaning.trim(),
      on: singleKanjiData.on ? singleKanjiData.on.split(',').map((s) => s.trim()) : [],
      kun: singleKanjiData.kun ? singleKanjiData.kun.split(',').map((s) => s.trim()) : [],
      radical: singleKanjiData.radical.trim() || 'Bộ thủ',
      strokeCount: Number(singleKanjiData.strokeCount) || 1,
      jlpt: singleKanjiData.jlpt,
      mnemonic: singleKanjiData.mnemonic.trim(),
      isCustom: true,
    };

    saveCustomKanji(newKanji, user.id);
    setAddMode('none');
    onToast(`Đã lưu chữ Hán [${newKanji.kanji}] - ${newKanji.hanViet} vào tài khoản!`);
    onRefresh();

    setSingleKanjiData({
      kanji: '',
      hanViet: '',
      meaning: '',
      on: '',
      kun: '',
      radical: 'Bộ thủ',
      strokeCount: 8,
      jlpt: 'N3',
      mnemonic: '',
    });
  };

  const handleDelete = (word: string) => {
    if (confirm(`Bạn có chắc muốn xóa từ "${word}" khỏi tài khoản của bạn?`)) {
      deleteCustomCompound(word, user.id);
      const updated = getAllCompounds(user.id);
      setCompounds(updated);
      onRefresh();
      onToast(`Đã xóa từ ${word}`);
    }
  };

  const handleExportJSON = () => {
    const jsonStr = exportPersonalDatabase(user.id);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kanjiviet_backup_${user.username}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('Đã xuất file JSON thành công!');
  };

  const handleExportCSV = () => {
    const list = handleFilter();
    let csv = '\uFEFFTừ Kanji,Cách đọc,Âm Hán Việt,Ý nghĩa,Cấp độ,Chủ đề\n';
    list.forEach((item) => {
      csv += `"${item.word}","${item.reading || ''}","${item.hanViet}","${item.meaning.replace(/"/g, '""')}","${item.jlpt}","${item.category}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kanjiviet_vocab_sheet_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onToast(`Đã xuất ${list.length} từ ra file Excel/CSV!`);
  };

  const handlePrintHTML = () => {
    const list = handleFilter();
    exportStudySheetHTML(list, `Bộ Hán tự học tập - ${user.displayName}`);
    onToast('Đang mở trang in tài liệu Hán tự...');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importPersonalDatabase(content, user.id);
      if (res.success) {
        onToast(res.message);
        setCompounds(getAllCompounds(user.id));
        onRefresh();
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredItems = handleFilter();

  return (
    <div className="space-y-6">
      {/* Title & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
            <Database className="w-6 h-6 text-rose-700" />
            <span>Khai thác & Lưu File Hán Tự</span>
            <span className="text-sm font-mono-numbers font-normal text-stone-500">
              ({compounds.length} từ)
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Tài khoản: <strong className="text-stone-800">{user.displayName}</strong>. Dữ liệu từ vựng thêm mới sẽ được lưu riêng cho tài khoản này.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setAddMode('compound')}
            className={`px-3 py-1.5 ${theme.primaryBg} ${theme.primaryHoverBg} text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm từ ghép</span>
          </button>

          <button
            onClick={() => setAddMode('singleKanji')}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm chữ Hán đơn</span>
          </button>

          {/* Export File dropdown / buttons */}
          <button
            onClick={handlePrintHTML}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-stone-200"
            title="In bảng từ vựng hoặc lưu thành file PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Lưu PDF / In</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-stone-200"
            title="Xuất file bảng tính Excel/CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Xuất CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-stone-200"
            title="Sao lưu toàn bộ file JSON cho tài khoản này"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Lưu file JSON</span>
          </button>

          <label className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-stone-200 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Nạp file JSON</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={`${theme.bgSubtle} p-4 rounded-xl border ${theme.borderSubtle} space-y-3`}>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Lọc theo Kanji, Hán Việt hoặc nghĩa..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* JLPT Filter */}
          <div className="flex items-center gap-1 p-0.5 bg-stone-200/70 rounded-lg shrink-0">
            {['all', 'N1', 'N2', 'N3', 'N4', 'N5'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedJlpt(lvl)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedJlpt === lvl
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {lvl === 'all' ? 'Tất cả JLPT' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Categories segmented filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          <span className="text-stone-500 font-medium whitespace-nowrap shrink-0 mr-1">
            Chủ đề:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap font-medium ${
                selectedCategory === cat
                  ? `${theme.primaryBg} text-white`
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat === 'all' ? 'Tất cả chuyên ngành' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Word Cards Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.word}
            className={`bg-white rounded-xl border ${theme.borderSubtle} p-4 hover:shadow-2xs transition-all flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-2xl font-kanji font-bold text-stone-900">
                    {item.word}
                  </h3>
                  {item.reading && (
                    <p className="text-xs text-stone-400 font-medium">{item.reading}</p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <span className={`text-xs font-bold ${theme.badgeText} ${theme.badgeBg} px-2 py-0.5 rounded border ${theme.badgeBorder}`}>
                    {item.jlpt}
                  </span>
                  {item.isCustom && (
                    <button
                      onClick={() => handleDelete(item.word)}
                      title="Xóa từ tùy chỉnh này khỏi tài khoản"
                      className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-2 text-sm font-bold text-stone-800">
                {item.hanViet}
              </div>

              <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                {item.meaning}
              </p>

              <div className="mt-2 text-[11px] text-stone-500">
                Chủ đề: <span className="font-semibold text-stone-700">{item.category}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">
                {item.isCustom ? `Tạo bởi ${user.displayName}` : 'Dữ liệu mẫu'}
              </span>

              <button
                onClick={() => onSelectWord(item.word)}
                className={`text-xs font-semibold ${theme.primaryText} hover:opacity-80 flex items-center gap-1 group`}
              >
                <span>Chi tiết & Phân tích</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Compound Word */}
      {addMode === 'compound' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              Thêm từ ghép Kanji mới vào tài khoản ({user.displayName})
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Nhập từ ngữ để hệ thống tự động bóc tách âm Hán Việt và lưu trữ phục vụ tra cứu sau này.
            </p>

            <form onSubmit={handleAddCompoundSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Chữ Kanji <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.word}
                    onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                    placeholder="VD: 経済学"
                    className="w-full p-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Cách đọc Hiragana
                  </label>
                  <input
                    type="text"
                    value={formData.reading}
                    onChange={(e) => setFormData({ ...formData, reading: e.target.value })}
                    placeholder="VD: けいざいがく"
                    className="w-full p-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Âm Hán Việt <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.hanViet}
                    onChange={(e) => setFormData({ ...formData, hanViet: e.target.value })}
                    placeholder="VD: KINH TẾ HỌC"
                    className="w-full p-2 border border-stone-300 rounded-lg text-sm uppercase focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Cấp độ JLPT
                  </label>
                  <select
                    value={formData.jlpt}
                    onChange={(e) => setFormData({ ...formData, jlpt: e.target.value as any })}
                    className="w-full p-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="N1">N1</option>
                    <option value="N2">N2</option>
                    <option value="N3">N3</option>
                    <option value="N4">N4</option>
                    <option value="N5">N5</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Chuyên ngành / Chủ đề
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="Dịch thuật & Báo chí">Dịch thuật & Báo chí</option>
                  <option value="Kinh tế & Thương mại">Kinh tế & Thương mại</option>
                  <option value="Xã hội & Đời sống">Xã hội & Đời sống</option>
                  <option value="Xã hội & Pháp luật">Xã hội & Pháp luật</option>
                  <option value="Yojijukugo">Yojijukugo (Thành ngữ 4 chữ)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Ý nghĩa cốt lõi <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.meaning}
                  onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                  placeholder="VD: Ngành kinh tế học"
                  className="w-full p-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Ghi chú chiết tự / Mẹo ghi nhớ
                </label>
                <textarea
                  value={formData.nuance}
                  onChange={(e) => setFormData({ ...formData, nuance: e.target.value })}
                  placeholder="Gốc từ: Kinh bang tế thế..."
                  rows={2}
                  className="w-full p-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setAddMode('none')}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 rounded-lg font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${theme.primaryBg} ${theme.primaryHoverBg} text-white rounded-lg font-semibold shadow-xs`}
                >
                  Lưu vào dữ liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Single Kanji */}
      {addMode === 'singleKanji' && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              Thêm chữ Hán đơn (Single Kanji) vào kho dữ liệu
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Lưu trữ chi tiết bộ thủ, số nét, âm Hán Việt và chiết tự cho 1 ký tự cụ thể.
            </p>

            <form onSubmit={handleAddSingleKanjiSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Chữ Hán <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={singleKanjiData.kanji}
                    onChange={(e) => setSingleKanjiData({ ...singleKanjiData, kanji: e.target.value })}
                    placeholder="VD: 鬱"
                    className="w-full p-2 border border-stone-300 rounded-lg text-lg font-kanji font-bold text-center focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Âm Hán Việt <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={singleKanjiData.hanViet}
                    onChange={(e) => setSingleKanjiData({ ...singleKanjiData, hanViet: e.target.value })}
                    placeholder="VD: ÚC"
                    className="w-full p-2 border border-stone-300 rounded-lg text-sm uppercase focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Số nét
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={64}
                    value={singleKanjiData.strokeCount}
                    onChange={(e) => setSingleKanjiData({ ...singleKanjiData, strokeCount: Number(e.target.value) })}
                    className="w-full p-2 border border-stone-300 rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Bộ thủ
                  </label>
                  <input
                    type="text"
                    value={singleKanjiData.radical}
                    onChange={(e) => setSingleKanjiData({ ...singleKanjiData, radical: e.target.value })}
                    placeholder="VD: 鬯 (Sưởng)"
                    className="w-full p-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Cấp độ JLPT
                  </label>
                  <select
                    value={singleKanjiData.jlpt}
                    onChange={(e) => setSingleKanjiData({ ...singleKanjiData, jlpt: e.target.value as any })}
                    className="w-full p-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="N1">N1</option>
                    <option value="N2">N2</option>
                    <option value="N3">N3</option>
                    <option value="N4">N4</option>
                    <option value="N5">N5</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Âm On (Katakana, cách nhau dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={singleKanjiData.on}
                    onChange={(e) => setSingleKanjiData({ ...singleKanjiData, on: e.target.value })}
                    placeholder="VD: ウツ"
                    className="w-full p-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Âm Kun (Hiragana, cách nhau dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={singleKanjiData.kun}
                    onChange={(e) => setSingleKanjiData({ ...singleKanjiData, kun: e.target.value })}
                    placeholder="VD: ふさ.ぐ"
                    className="w-full p-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nghĩa cốt lõi <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={singleKanjiData.meaning}
                  onChange={(e) => setSingleKanjiData({ ...singleKanjiData, meaning: e.target.value })}
                  placeholder="VD: U uất, buồn bực dồn nén, cây cối rậm rạp"
                  className="w-full p-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Chiết tự / Mẹo ghi nhớ cấu tạo chữ
                </label>
                <textarea
                  value={singleKanjiData.mnemonic}
                  onChange={(e) => setSingleKanjiData({ ...singleKanjiData, mnemonic: e.target.value })}
                  placeholder="Cây cối rậm rạp xen lẫn bình rượu quý tạo nên nỗi buồn kín đáo..."
                  rows={2}
                  className="w-full p-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setAddMode('none')}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 rounded-lg font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  Lưu chữ Hán
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
