import { KanjiDetail } from '../types/kanji';

export const CURATED_KANJI: Record<string, KanjiDetail> = {
  '曖': {
    kanji: '曖',
    hanViet: 'ÁI',
    meaning: 'Tối tăm, mờ mịt, không rõ ràng',
    on: ['アイ'],
    kun: ['くら.い'],
    radical: '日 (Nhật - mặt trời)',
    radicalMeaning: 'Liên quan đến ánh sáng và thời gian',
    strokeCount: 17,
    jlpt: 'N1',
    mnemonic: 'Chiết tự: Gồm bộ Nhật (日 - mặt trời) + Ái (愛 - tình cảm, vướng bận). Mặt trời bị che lấp bởi sự vướng bận dây tơ, khiến cảnh vật trở nên lờ mờ, bất phân minh.',
    compounds: [
      { word: '曖昧', reading: 'あいまい', hanViet: 'ÁI MUỘI', meaning: 'Mơ hồ, mập mờ, không rõ ràng' },
      { word: '曖昧模糊', reading: 'あいまいもこ', hanViet: 'ÁI MUỘI MÔ HỒ', meaning: 'Mơ hồ mù mịt, hoàn toàn không sáng tỏ' }
    ]
  },
  '昧': {
    kanji: '昧',
    hanViet: 'MUỘI',
    meaning: 'Mờ mịt, tăm tối, ngu muội, chưa hiểu rõ',
    on: ['マイ', 'バイ'],
    kun: ['くら.い'],
    radical: '日 (Nhật - mặt trời)',
    radicalMeaning: 'Liên quan đến ánh sáng, thời gian',
    strokeCount: 9,
    jlpt: 'N1',
    mnemonic: 'Chiết tự: Gồm bộ Nhật (日 - mặt trời) + Vị (未 - chưa tới). Mặt trời chưa lên tới đỉnh thì trời vẫn còn tranh tối tranh sáng, còn u muội.',
    compounds: [
      { word: '曖昧', reading: 'あいまい', hanViet: 'ÁI MUỘI', meaning: 'Mơ hồ, mập mờ' },
      { word: '三昧', reading: 'ざんまい', hanViet: 'TAM MUỘI', meaning: 'Đắm mình say mê vào một việc (tiếng Phạn Samadhi)' },
      { word: '愚昧', reading: 'ぐまい', hanViet: 'NGU MUỘI', meaning: 'Ngu muội, dại khờ' }
    ]
  },
  '経': {
    kanji: '経',
    hanViet: 'KINH',
    meaning: 'Trải qua, quản lý, kinh tế, kinh tuyến, đạo đức thường hằng',
    on: ['ケイ', 'キョウ'],
    kun: ['へ.る', 'た.つ'],
    radical: '糹 (Mịch - sợi tơ lụa)',
    radicalMeaning: 'Liên quan đến vải vóc, sợi chỉ, sự kết nối',
    strokeCount: 11,
    jlpt: 'N3',
    mnemonic: 'Chiết tự: Bộ Mịch (糹 - sợi chỉ dọc khung cửi) + Thánh (thực ra là phần chỉ âm Kính/Kinh). Sợi chỉ dệt dọc qua năm tháng thể hiện sự trải qua, nguyên lý điều hành kinh sách.',
    compounds: [
      { word: '経済', reading: 'けいざい', hanViet: 'KINH TẾ', meaning: 'Kinh tế (Kinh bang tế thế)' },
      { word: '経営', reading: 'けいえい', hanViet: 'KINH DOANH', meaning: 'Kinh doanh, quản trị' },
      { word: '経験', reading: 'けいけん', hanViet: 'KINH NGHIỆM', meaning: 'Kinh nghiệm đã trải qua' },
      { word: '経由', reading: 'けいゆ', hanViet: 'KINH DO', meaning: 'Đi qua, quá cảnh' }
    ]
  },
  '済': {
    kanji: '済',
    hanViet: 'TẾ',
    meaning: 'Cứu tế, giúp đỡ, xong xuôi, hoàn thành, chi trả',
    on: ['サイ', 'セイ'],
    kun: ['す.む', 'す.ます'],
    radical: '氵 (Thủy - nước)',
    radicalMeaning: 'Liên quan đến chất lỏng, sông suối, rửa sạch',
    strokeCount: 11,
    jlpt: 'N3',
    mnemonic: 'Chiết tự: Bộ Thủy (氵 - dòng nước) + Tề (斉 - bằng phẳng, tề chỉnh). Khơi thông dòng nước cứu tế dân chúng, làm cho việc khó khăn được êm xuôi trọn vẹn.',
    compounds: [
      { word: '経済', reading: 'けいざい', hanViet: 'KINH TẾ', meaning: 'Kinh tế' },
      { word: '返済', reading: 'へんさい', hanViet: 'PHẢN TẾ', meaning: 'Hoàn trả nợ nần' },
      { word: '救済', reading: 'きゅうさい', hanViet: 'CỨU TẾ', meaning: 'Cứu tế, giải cứu' }
    ]
  },
  '学': {
    kanji: '学',
    hanViet: 'HỌC',
    meaning: 'Học tập, tiếp thu tri thức, ngành học',
    on: ['ガク'],
    kun: ['まな.ぶ'],
    radical: '子 (Tử - đứa trẻ con)',
    radicalMeaning: 'Liên quan đến con người, thế hệ sau',
    strokeCount: 8,
    jlpt: 'N5',
    mnemonic: 'Chiết tự: Mái nhà trường có hai bàn tay nâng đỡ ánh sáng tri thức che chở cho đứa trẻ (子) bên dưới học tập.',
    compounds: [
      { word: '学生', reading: 'がくせい', hanViet: 'HỌC SINH', meaning: 'Học sinh, sinh viên' },
      { word: '学問', reading: 'がくもん', hanViet: 'HỌC VẤN', meaning: 'Học vấn, tri thức' },
      { word: '大学', reading: 'だいがく', hanViet: 'ĐẠI HỌC', meaning: 'Trường đại học' }
    ]
  },
  '臨': {
    kanji: '臨',
    hanViet: 'LÂM',
    meaning: 'Đến nơi, giáp mặt, lâm thời, giám sát từ trên xuống',
    on: ['リン'],
    kun: ['のぞ.む'],
    radical: '臣 (Thần - bề tôi, mắt quan lại)',
    radicalMeaning: 'Liên quan đến quan lại, mắt cúi nhìn',
    strokeCount: 18,
    jlpt: 'N1',
    mnemonic: 'Chiết tự: Vị thần (臣) cúi người nhìn xuống mảnh đất (thổ) có người dân đang làm việc để thị sát thực tế tại hiện trường.',
    compounds: [
      { word: '臨機応変', reading: 'りんきおうへん', hanViet: 'LÂM CƠ ỨNG BIẾN', meaning: 'Tùy cơ ứng biến' },
      { word: '臨時', reading: 'りんじ', hanViet: 'LÂM THỜI', meaning: 'Tạm thời, lâm thời' },
      { word: '臨床', reading: 'りんしょう', hanViet: 'LÂM SÀNG', meaning: 'Lâm sàng (y học đối diện giường bệnh)' }
    ]
  },
  '機': {
    kanji: '機',
    hanViet: 'CƠ',
    meaning: 'Máy móc, cơ hội, then chốt, cơ cấu',
    on: ['キ'],
    kun: ['はた'],
    radical: '木 (Mộc - cây gỗ)',
    radicalMeaning: 'Liên quan đến cây cối, gỗ, công cụ mộc',
    strokeCount: 16,
    jlpt: 'N3',
    mnemonic: 'Chiết tự: Bộ Mộc (木 - khung gỗ) + Kỷ (幾 - manh mối tinh vi). Cỗ máy khung cửi dệt vải bằng gỗ hoạt động dựa trên các then chốt cơ mật.',
    compounds: [
      { word: '機会', reading: 'きかい', hanViet: 'CƠ HỘI', meaning: 'Cơ hội thuận lợi' },
      { word: '機械', reading: 'きかい', hanViet: 'CƠ GIỚI', meaning: 'Máy móc kỹ thuật' },
      { word: '機能', reading: 'きのう', hanViet: 'CƠ NĂNG', meaning: 'Chức năng' },
      { word: '危機', reading: 'きき', hanViet: 'NGUY CƠ', meaning: 'Khủng hoảng, nguy hiểm' }
    ]
  },
  '応': {
    kanji: '応',
    hanViet: 'ỨNG',
    meaning: 'Đáp lại, tương ứng, ứng phó, tán đồng',
    on: ['オウ', 'ヨウ'],
    kun: ['こた.える'],
    radical: '心 (Tâm - trái tim)',
    radicalMeaning: 'Liên quan đến tình cảm, suy nghĩ nội tâm',
    strokeCount: 7,
    jlpt: 'N3',
    mnemonic: 'Chiết tự: Dưới mái nhà (nghiễm), con chim ưng đáp tiếng gọi tận đáy lòng (Tâm) bay về.',
    compounds: [
      { word: '応答', reading: 'おうとう', hanViet: 'ỨNG ĐÁP', meaning: 'Trả lời, hồi đáp' },
      { word: '応用', reading: 'おうよう', hanViet: 'ỨNG DỤNG', meaning: 'Ứng dụng vào thực tiễn' },
      { word: '対応', reading: 'たいおう', hanViet: 'ĐỐI ỨNG', meaning: 'Xử lý, ứng đối' }
    ]
  },
  '変': {
    kanji: '変',
    hanViet: 'BIẾN',
    meaning: 'Biến đổi, thay đổi, sự cố lạ thường',
    on: ['ヘン'],
    kun: ['か.わる', 'か.える'],
    radical: '夂 (Phách - bước chân đi sau)',
    radicalMeaning: 'Chuyển động, bước chân thay đổi hướng',
    strokeCount: 9,
    jlpt: 'N3',
    mnemonic: 'Chiết tự: Lời nói (ngôn lược) kết hợp với bước chân (phách), chuyển hướng đi tạo thành sự biến thiên thay đổi.',
    compounds: [
      { word: '変化', reading: 'へんか', hanViet: 'BIẾN HÓA', meaning: 'Sự biến đổi' },
      { word: '大変', reading: 'たいへん', hanViet: 'ĐẠI BIẾN', meaning: 'Vất vả, sự kiện lớn' },
      { word: '変更', reading: 'へんこう', hanViet: 'BIẾN CANH', meaning: 'Thay đổi sửa đổi' }
    ]
  },
  '矛': {
    kanji: '矛',
    hanViet: 'MÂU',
    meaning: 'Mũi mâu, ngọn giáo dài dùng để đâm',
    on: ['ム', 'ボウ'],
    kun: ['ほこ'],
    radical: '矛 (Mâu - cây mâu)',
    radicalMeaning: 'Vũ khí có mũi nhọn dài',
    strokeCount: 5,
    jlpt: 'N1',
    mnemonic: 'Tượng hình: Vẽ cây giáo dài có cán gỗ uốn lượn và mũi mác sắc bén cắm vào thân.',
    compounds: [
      { word: '矛盾', reading: 'むじゅん', hanViet: 'MÂU THUẪN', meaning: 'Mâu thuẫn, xung đột trái ngược' },
      { word: '矛先', reading: 'ほこさき', hanViet: 'MÂU TIÊN', meaning: 'Mũi giáo, hướng công kích' }
    ]
  },
  '盾': {
    kanji: '盾',
    hanViet: 'THUẪN',
    meaning: 'Cái khiên, tấm mộc che chắn vũ khí',
    on: ['ジュン'],
    kun: ['たて'],
    radical: '目 (Mục - con mắt)',
    radicalMeaning: 'Liên quan đến thị giác, nhìn nhận',
    strokeCount: 9,
    jlpt: 'N1',
    mnemonic: 'Chiết tự: Hình tấm mộc có khoét một khe hẹp ở phía trên vừa tầm mắt (Mục) của người lính nhìn ra ngoài phòng thủ.',
    compounds: [
      { word: '矛盾', reading: 'むじゅん', hanViet: 'MÂU THUẪN', meaning: 'Mâu thuẫn' },
      { word: '後盾', reading: 'うしろだて', hanViet: 'HẬU THUẪN', meaning: 'Chỗ dựa lưng, người chống lưng hậu thuẫn' }
    ]
  },
  '構': {
    kanji: '構',
    hanViet: 'CẤU',
    meaning: 'Cấu tạo, dàn dựng, khung sườn, bận tâm',
    on: ['コウ'],
    kun: ['かま.える', 'かま.う'],
    radical: '木 (Mộc - cây gỗ)',
    radicalMeaning: 'Liên quan đến gỗ, xây dựng kết cấu',
    strokeCount: 14,
    jlpt: 'N2',
    mnemonic: 'Chiết tự: Bộ Mộc (木 - gỗ) + Câu (冓 - hai đống rơm/thanh gỗ đan xen chéo vào nhau). Khung gỗ đan xen nhau tạo nên kết cấu vững chãi.',
    compounds: [
      { word: '構造', reading: 'こうぞう', hanViet: 'CẤU TẠO', meaning: 'Cấu trúc, cơ cấu' },
      { word: '構成', reading: 'こうせい', hanViet: 'CẤU THÀNH', meaning: 'Cấu thành, tổ chức' },
      { word: '機構', reading: 'きこう', hanViet: 'CƠ CẤU', meaning: 'Cơ quan tổ chức, bộ máy' }
    ]
  },
  '造': {
    kanji: '造',
    hanViet: 'TẠO',
    meaning: 'Tạo ra, chế tác, đi đến đích',
    on: ['ゾウ'],
    kun: ['つく.る'],
    radical: '辶 (Sước - bước đi xa)',
    radicalMeaning: 'Hành động chuyển động, tiến bước',
    strokeCount: 10,
    jlpt: 'N3',
    mnemonic: 'Chiết tự: Cáo (告 - tuyên cáo, lên tiếng) + Sước (辶 - tiến bước). Lên tiếng tuyên bố rồi bắt tay vào hành động chế tạo ra sản phẩm.',
    compounds: [
      { word: '創造', reading: 'そうぞう', hanViet: 'SÁNG TẠO', meaning: 'Sáng tạo cái mới' },
      { word: '製造', reading: 'せいぞう', hanViet: 'CHẾ TẠO', meaning: 'Sản xuất chế tạo' },
      { word: '造船', reading: 'ぞうせん', hanViet: 'TẠO THUYỀN', meaning: 'Đóng tàu bè' }
    ]
  },
  '改': {
    kanji: '改',
    hanViet: 'CẢI',
    meaning: 'Sửa đổi, đổi mới, cải cách, xem xét lại',
    on: ['カイ'],
    kun: ['あらた.める', 'あらた.まる'],
    radical: '攵 (Phách - đánh khẽ)',
    radicalMeaning: 'Hành động rèn giũa, uốn nắn',
    strokeCount: 7,
    jlpt: 'N3',
    mnemonic: 'Chiết tự: Kỷ (己 - bản thân mình) + Phách (攵 - cây roi). Tự cầm roi rèn giũa lỗi lầm của bản thân để trở nên tốt đẹp hơn.',
    compounds: [
      { word: '改革', reading: 'かいかく', hanViet: 'CẢI CÁCH', meaning: 'Cải cách triệt để' },
      { word: '改善', reading: 'かいぜん', hanViet: 'CẢI THIỆN', meaning: 'Cải thiện từng bước (Kaizen)' },
      { word: '改正', reading: 'かいせい', hanViet: 'CẢI CHÍNH', meaning: 'Sửa đổi luật lệ cho đúng' }
    ]
  },
  '革': {
    kanji: '革',
    hanViet: 'CÁCH',
    meaning: 'Da thú đã cạo lông, cách mạng, đổi mới tận gốc',
    on: ['カク'],
    kun: ['かわ'],
    radical: '革 (Cách - da thuộc)',
    radicalMeaning: 'Liên quan đến da thú, đồ da',
    strokeCount: 9,
    jlpt: 'N2',
    mnemonic: 'Tượng hình: Bộ da thú sau khi được cạo lông, căng ra phơi và thuộc lại biến tính chất thành một vật liệu hoàn toàn mới.',
    compounds: [
      { word: '革命', reading: 'かくめい', hanViet: 'CÁCH MỆNH', meaning: 'Cách mạng' },
      { word: '革新', reading: 'かくしん', hanViet: 'CÁCH TÂN', meaning: 'Đổi mới sáng tạo' },
      { word: '皮革', reading: 'ひかく', hanViet: 'BÌ CÁCH', meaning: 'Da thuộc' }
    ]
  },
  '貿': {
    kanji: '貿',
    hanViet: 'MẬU',
    meaning: 'Buôn bán, trao đổi, mậu dịch',
    on: ['ボウ'],
    kun: [],
    radical: '貝 (Bối - vỏ sò tiền tài)',
    radicalMeaning: 'Liên quan đến tiền bạc, của cải, mua bán',
    strokeCount: 12,
    jlpt: 'N3',
    mnemonic: 'Chiết tự: Mão (卯 - cánh cửa mở) + Bối (貝 - tiền vỏ sò). Mở cửa kho tiền bạc để trao đổi buôn bán hàng hóa qua lại.',
    compounds: [
      { word: '貿易', reading: 'ぼうえき', hanViet: 'MẬU DỊCH', meaning: 'Ngoại thương, xuất nhập khẩu' },
      { word: '貿易風', reading: 'ぼうえきふう', hanViet: 'MẬU DỊCH PHONG', meaning: 'Gió tín phong hỗ trợ thuyền buôn' }
    ]
  },
  '易': {
    kanji: '易',
    hanViet: 'DỊCH / DỊ',
    meaning: 'Dễ dàng (âm DỊ), thay đổi / giao dịch (âm DỊCH)',
    on: ['エキ', 'イ'],
    kun: ['やさ.しい'],
    radical: '日 (Nhật - mặt trời)',
    radicalMeaning: 'Mặt trời, ánh sáng',
    strokeCount: 8,
    jlpt: 'N3',
    mnemonic: 'Tượng hình: Con thằn lằn dễ dàng đổi màu da dưới ánh nắng mặt trời, biểu thị sự thay đổi hoặc sự dung dị, dễ thích nghi.',
    compounds: [
      { word: '貿易', reading: 'ぼうえき', hanViet: 'MẬU DỊCH', meaning: 'Mậu dịch, buôn bán' },
      { word: '容易', reading: 'ようい', hanViet: 'DUNG DỊ', meaning: 'Đơn giản, dễ dàng' },
      { word: '難易度', reading: 'なんいど', hanViet: 'NAN DỊ ĐỘ', meaning: 'Độ khó dễ' }
    ]
  },
  '持': {
    kanji: '持',
    hanViet: 'TRÌ',
    meaning: 'Cầm giữ, duy trì, nắm giữ trong tay, kiên trì',
    on: ['ジ'],
    kun: ['も.つ'],
    radical: '扌 (Thủ - bàn tay)',
    radicalMeaning: 'Liên quan đến hành động của bàn tay',
    strokeCount: 9,
    jlpt: 'N4',
    mnemonic: 'Chiết tự: Bàn tay (扌) giữ gìn những quy củ nghiêm cẩn của ngôi chùa (Tự - 寺) không để mai một.',
    compounds: [
      { word: '維持', reading: 'いじ', hanViet: 'DUY TRÌ', meaning: 'Duy trì trạng thái' },
      { word: '持続', reading: 'じぞく', hanViet: 'TRÌ TỤC', meaning: 'Kéo dài liên tục' },
      { word: '気持ち', reading: 'きもち', hanViet: 'KHÍ TRÌ', meaning: 'Tâm trạng, cảm giác' }
    ]
  },
  '続': {
    kanji: '続',
    hanViet: 'TỤC',
    meaning: 'Nối tiếp, liên tục, tiếp diễn không ngừng',
    on: ['ゾク'],
    kun: ['つづ.く', 'つづ.ける'],
    radical: '糸 (Mịch - sợi tơ)',
    radicalMeaning: 'Liên quan đến sợi chỉ, sự liên kết',
    strokeCount: 13,
    jlpt: 'N3',
    mnemonic: 'Chiết tự: Bộ Mịch (糸 - sợi chỉ) + Mại (売 - bán, trao ra). Nối dài từng sợi chỉ này sang sợi chỉ khác không đứt đoạn.',
    compounds: [
      { word: '継続', reading: 'けいぞく', hanViet: 'KẾ TỤC', meaning: 'Tiếp tục duy trì' },
      { word: '連続', reading: 'れんぞく', hanViet: 'LIÊN TỤC', meaning: 'Liên tục, chuỗi kế tiếp' },
      { word: '手続き', reading: 'てつづき', hanViet: 'THỦ TỤC', meaning: 'Thủ tục giấy tờ' }
    ]
  },
  '責': {
    kanji: '責',
    hanViet: 'TRÁCH',
    meaning: 'Trách nhiệm, gánh vác, khiển trách',
    on: ['セキ'],
    kun: ['せ.める'],
    radical: '貝 (Bối - tiền bạc)',
    radicalMeaning: 'Của cải, trách nhiệm nợ nần',
    strokeCount: 11,
    jlpt: 'N3',
    mnemonic: 'Chiết tự: Trên là sinh trưởng mầm cây, dưới là tiền bạc (Bối). Đã vay tiền bạc của người ta thì có trách nhiệm phải hoàn trả, nếu không sẽ bị khiển trách.',
    compounds: [
      { word: '責任', reading: 'せきにん', hanViet: 'TRÁCH NHIỆM', meaning: 'Trách nhiệm' },
      { word: '引責', reading: 'いんせき', hanViet: 'DẪN TRÁCH', meaning: 'Nhận trách nhiệm về mình' },
      { word: '責務', reading: 'せきむ', hanViet: 'TRÁCH VỤ', meaning: 'Bổn phận nghĩa vụ' }
    ]
  },
  '任': {
    kanji: '任',
    hanViet: 'NHIỆM',
    meaning: 'Gánh vác, bổ nhiệm, phó thác, trách nhiệm',
    on: ['ニン'],
    kun: ['まか.せる', 'まか.す'],
    radical: '亻 (Nhân - con người)',
    radicalMeaning: 'Liên quan đến hành vi con người',
    strokeCount: 6,
    jlpt: 'N3',
    mnemonic: 'Chiết tự: Con người (亻) gánh vác một vật nặng trên vai (Nhâm - 壬), tin tưởng giao phó trọng trách.',
    compounds: [
      { word: '任務', reading: 'にんむ', hanViet: 'NHIỆM VỤ', meaning: 'Nhiệm vụ được giao' },
      { word: '主任', reading: 'しゅにん', hanViet: 'CHỦ NHIỆM', meaning: 'Chủ nhiệm, người đứng đầu phụ trách' },
      { word: '辞任', reading: 'じにん', hanViet: 'TỪ NHIỆM', meaning: 'Từ chức' }
    ]
  },
  '感': {
    kanji: '感',
    hanViet: 'CẢM',
    meaning: 'Cảm giác, cảm xúc, cảm động, biết ơn',
    on: ['カン'],
    kun: ['かん.じる'],
    radical: '心 (Tâm - trái tim)',
    radicalMeaning: 'Suy nghĩ, tình cảm, cảm xúc',
    strokeCount: 13,
    jlpt: 'N3',
    mnemonic: 'Chiết tự: Hàm (咸 - tất cả đồng thanh) + Tâm (心 - đáy lòng). Mọi biến cố bên ngoài đều tác động và rung động đến trái tim.',
    compounds: [
      { word: '感情', reading: 'かんじょう', hanViet: 'CẢM TÌNH', meaning: 'Tình cảm, cảm xúc' },
      { word: '感謝', reading: 'かんしゃ', hanViet: 'CẢM TẠ', meaning: 'Lòng biết ơn' },
      { word: '感銘', reading: 'かんめい', hanViet: 'CẢM MINH', meaning: 'Khắc sâu cảm kích' }
    ]
  }
};
