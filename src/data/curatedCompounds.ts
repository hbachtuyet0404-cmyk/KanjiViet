import { CompoundWord } from '../types/kanji';

export const CURATED_COMPOUNDS: CompoundWord[] = [
  // 1. Dịch thuật & Báo chí (Translation & Journalism)
  {
    word: '曖昧',
    reading: 'あいまい',
    romaji: 'aimai',
    hanViet: 'ÁI MUỘI',
    meaning: 'Mơ hồ, mập mờ, không rõ ràng',
    jlpt: 'N1',
    category: 'Dịch thuật & Báo chí',
    nuance: 'Cốt lõi là ÁI (mờ tối) + MUỘI (chưa tỏ tường), miêu tả thái độ hoặc cách diễn đạt cố ý lấp lửng, phổ biến trong văn hóa giao tiếp gián tiếp của người Nhật.',
    exampleSentence: {
      ja: '政治家の曖昧な返答に国民の不満が高まっている。',
      reading: 'せいじかのあいまいなへんとうにこくみんのふまんがたかまっている。',
      vi: 'Sự bất mãn của người dân đang dâng cao trước câu trả lời mập mờ của chính trị gia.'
    }
  },
  {
    word: '躊躇',
    reading: 'ちゅうちょ',
    romaji: 'chuucho',
    hanViet: 'TRÙ TRỪ',
    meaning: 'Do dự, ngập ngừng, chần chừ không dứt khoát',
    jlpt: 'N1',
    category: 'Dịch thuật & Báo chí',
    nuance: 'Hai chữ đều có bộ Túc (chân): TRÙ (bước chân ngập ngừng) + TRỪ (dừng bước xem xét), diễn tả trạng thái tâm lý dùng dằng trước khi đưa ra quyết định.',
    exampleSentence: {
      ja: '重大な局面において躊躇している暇はない。',
      reading: 'じゅうだいなきょくめんにおいてちゅうちょしているひまはない。',
      vi: 'Trong thời khắc trọng đại, không có thời gian để do dự ngập ngừng.'
    }
  },
  {
    word: '矛盾',
    reading: 'むじゅん',
    romaji: 'mujun',
    hanViet: 'MÂU THUẪN',
    meaning: 'Mâu thuẫn, trái ngược nhau, bất nhất',
    jlpt: 'N1',
    category: 'Dịch thuật & Báo chí',
    nuance: 'Điển tích thời Chiến Quốc: ngọn giáo (MÂU) có thể đâm thủng mọi thứ và chiếc khiên (THUẪN) có thể đỡ mọi ngọn giáo. Dùng khi lời nói hoặc hành động tiền hậu bất nhất.',
    exampleSentence: {
      ja: '彼の証言には明らかな矛盾が含まれている。',
      reading: 'かれのしょうげんにはあきらかなむじゅんがふくまれている。',
      vi: 'Trong lời khai của anh ta chứa đựng mâu thuẫn rõ ràng.'
    }
  },
  {
    word: '臨機応変',
    reading: 'りんきおうへん',
    romaji: 'rinkiouhen',
    hanViet: 'LÂM CƠ ỨNG BIẾN',
    meaning: 'Tùy cơ ứng biến, linh hoạt xử lý theo hoàn cảnh',
    jlpt: 'N1',
    category: 'Yojijukugo',
    nuance: 'LÂM (tiếp cận) + CƠ (thời cơ) + ỨNG (đáp lại) + BIẾN (biến chuyển). Khả năng thích ứng nhanh nhạy mà không cứng nhắc theo quy tắc.',
    exampleSentence: {
      ja: '突発的な事態にも臨機応変に対応することが求められる。',
      reading: 'とっぱつてきなじたいにもりんきおうへんにたいおうすることがもとめられる。',
      vi: 'Người ta đòi hỏi phải tùy cơ ứng biến xử lý ngay cả với những tình huống đột xuất.'
    }
  },
  {
    word: '試行錯誤',
    reading: 'しこうさくご',
    romaji: 'shikousakugo',
    hanViet: 'THÍ HÀNH THÁC NGỘ',
    meaning: 'Thử nghiệm và sửa sai, vừa làm vừa rút kinh nghiệm (Trial and error)',
    jlpt: 'N1',
    category: 'Yojijukugo',
    nuance: 'THÍ HÀNH (làm thử) + THÁC NGỘ (gặp sai sót và sửa đổi). Quá trình kiên trì tìm tòi lời giải thông qua việc rút ra bài học từ lỗi lầm.',
    exampleSentence: {
      ja: '新薬の開発は何年もの試行錯誤の末に成功した。',
      reading: 'しんやくのかいはつはなんねんものしこうさくごのすえにせいこうした。',
      vi: 'Việc nghiên cứu phát triển loại thuốc mới đã thành công sau nhiều năm thử nghiệm và sửa sai.'
    }
  },
  {
    word: '抽象的',
    reading: 'ちゅうしょうてき',
    romaji: 'chuushouteki',
    hanViet: 'TRỪU TƯỢNG ĐÍCH',
    meaning: 'Mang tính trừu tượng, khái quát, không cụ thể',
    jlpt: 'N2',
    category: 'Dịch thuật & Báo chí',
    nuance: 'TRỪU (rút ra phần cốt lõi) + TƯỢNG (hình ảnh) + ĐÍCH (mang tính chất). Chỉ những khái niệm thuộc về tư duy lý thuyết chứ không nắm bắt trực tiếp bằng giác quan.',
    exampleSentence: {
      ja: '抽象的な概念を分かりやすい言葉で説明する。',
      reading: 'ちゅうしょうてきながいねんをわかりやすいことばでせつめいする。',
      vi: 'Giải thích những khái niệm mang tính trừu tượng bằng ngôn từ dễ hiểu.'
    }
  },
  {
    word: '具体的',
    reading: 'ぐたいてき',
    romaji: 'gutaiteki',
    hanViet: 'CỤ THỂ ĐÍCH',
    meaning: 'Mang tính cụ thể, rõ ràng, thực tế',
    jlpt: 'N3',
    category: 'Dịch thuật & Báo chí',
    nuance: 'CỤ (dụng cụ, sẵn có) + THỂ (hình dáng thân thể) + ĐÍCH. Trái nghĩa trực tiếp với 抽象的 (Trừu tượng đích).',
    exampleSentence: {
      ja: '改善に向けた具体的な提案をお願いします。',
      reading: 'かいぜんにむけたぐたいてきなていあんをおねがいします。',
      vi: 'Xin vui lòng đưa ra đề xuất mang tính cụ thể hướng tới việc cải thiện.'
    }
  },
  {
    word: '構造改革',
    reading: 'こうぞうかいかく',
    romaji: 'kouzoukaikaku',
    hanViet: 'CẤU TẠO CẢI CÁCH',
    meaning: 'Cải cách cơ cấu, đổi mới cấu trúc hệ thống',
    jlpt: 'N1',
    category: 'Kinh tế & Thương mại',
    nuance: 'CẤU TẠO (bộ khung, tổ chức) + CẢI CÁCH (đổi mới tận gốc rễ). Thuật ngữ kinh tế - chính trị nổi tiếng trong các văn bản nghị luận thời kỳ Heisei.',
    exampleSentence: {
      ja: '持続的な経済成長のために構造改革が不可欠である。',
      reading: 'じぞくてきなけいざいせいちょうのためにこうぞうかいかくがふかけつである。',
      vi: 'Cải cách cơ cấu là điều không thể thiếu cho sự tăng trưởng kinh tế bền vững.'
    }
  },

  // 2. Kinh tế & Thương mại (Economics & Business)
  {
    word: '経済学',
    reading: 'けいざいがく',
    romaji: 'keizaigaku',
    hanViet: 'KINH TẾ HỌC',
    meaning: 'Ngành kinh tế học, môn kinh tế',
    jlpt: 'N3',
    category: 'Kinh tế & Thương mại',
    nuance: 'Xuất phát từ thành ngữ "Kinh bang tế thế" (trị nước giúp đời), Hán Việt KINH (quản lý đường lối) + TẾ (cứu giúp dân chúng) + HỌC.',
    exampleSentence: {
      ja: '大学で国際経済学を専攻しています。',
      reading: 'だいがくでこくさいけいざいがくをせんこうしています。',
      vi: 'Tôi đang học chuyên ngành kinh tế học quốc tế tại trường đại học.'
    }
  },
  {
    word: '貿易収支',
    reading: 'ぼうえきしゅうし',
    romaji: 'bouekishuushi',
    hanViet: 'MẬU DỊCH THU CHI',
    meaning: 'Cán cân thương mại, xuất nhập khẩu thu chi',
    jlpt: 'N1',
    category: 'Kinh tế & Thương mại',
    nuance: 'MẬU DỊCH (buôn bán với nước ngoài) + THU CHI (khoản thu vào và chi trả ra). Chỉ sự chênh lệch giữa kim ngạch xuất khẩu và nhập khẩu.',
    exampleSentence: {
      ja: '円安の影響で貿易収支の赤字が拡大した。',
      reading: 'えんやすのえいきょうでぼうえきしゅうしのあかじがかくだいした。',
      vi: 'Do ảnh hưởng của việc đồng Yên giảm giá, thâm hụt cán cân thương mại đã nới rộng.'
    }
  },
  {
    word: '持続可能',
    reading: 'じぞくかのう',
    romaji: 'jizokukanou',
    hanViet: 'TRÌ TỤC KHẢ NĂNG',
    meaning: 'Có thể duy trì lâu dài, bền vững (Sustainable)',
    jlpt: 'N1',
    category: 'Kinh tế & Thương mại',
    nuance: 'TRÌ TỤC (giữ gìn liên tục không gián đoạn) + KHẢ NĂNG (có thể thực hiện). Dùng trong cụm từ phát triển bền vững SDGs.',
    exampleSentence: {
      ja: '持続可能な社会の実現を目指して環境対策に取り組む。',
      reading: 'じぞくかのうなしゃかいのじつげんをめざしてかんきょうたいさくにとりくむ。',
      vi: 'Nỗ lực thực hiện các biện pháp môi trường nhằm hướng tới một xã hội phát triển bền vững.'
    }
  },
  {
    word: '資本主義',
    reading: 'しほんしゅぎ',
    romaji: 'shihonshugi',
    hanViet: 'TƯ BẢN CHỦ NGHĨA',
    meaning: 'Chủ nghĩa tư bản',
    jlpt: 'N2',
    category: 'Kinh tế & Thương mại',
    nuance: 'TƯ BẢN (của cải tích lũy làm nguồn vốn) + CHỦ NGHĨA (hệ tư tưởng, học thuyết tôn làm cốt lõi).',
    exampleSentence: {
      ja: '現代の資本主義社会における格差問題が議論されている。',
      reading: 'げんだいのしほんしゅぎしゃかいにおけるかくさもんだいがぎろんされている。',
      vi: 'Vấn đề phân hóa giàu nghèo trong xã hội chủ nghĩa tư bản hiện đại đang được tranh luận sôi nổi.'
    }
  },
  {
    word: '経営戦略',
    reading: 'けいえいせんりゃく',
    romaji: 'keieisenryaku',
    hanViet: 'KINH DOANH CHIẾN LƯỢC',
    meaning: 'Chiến lược kinh doanh, định hướng quản trị doanh nghiệp',
    jlpt: 'N2',
    category: 'Kinh tế & Thương mại',
    nuance: 'KINH DOANH (điều hành quản lý xí nghiệp) + CHIẾN LƯỢC (kế sách tác chiến lâu dài).',
    exampleSentence: {
      ja: '海外市場への進出は我が社の重要な経営戦略だ。',
      reading: 'かいがいしじょうへのしんしゅつはわがしゃのじゅうようなけいえいせんりゃくだ。',
      vi: 'Tiến ra thị trường nước ngoài là chiến lược kinh doanh trọng yếu của công ty chúng tôi.'
    }
  },

  // 3. Xã hội, Giáo dục & Đời sống (Society & Education)
  {
    word: '責任感',
    reading: 'せきにんかん',
    romaji: 'sekininkan',
    hanViet: 'TRÁCH NHIỆM CẢM',
    meaning: 'Tinh thần trách nhiệm, ý thức trách nhiệm',
    jlpt: 'N3',
    category: 'Xã hội & Đời sống',
    nuance: 'TRÁCH (khiển trách, gánh việc) + NHIỆM (bổn phận được giao) + CẢM (ý thức nội tâm). Phẩm chất được người Nhật đánh giá rất cao trong tuyển dụng.',
    exampleSentence: {
      ja: '彼は強い責任感を持って最後まで仕事をやり遂げた。',
      reading: 'かれはつよいせきにんかんをもってさいごまでしごとをやりとげた。',
      vi: 'Anh ấy với tinh thần trách nhiệm mạnh mẽ đã hoàn thành công việc đến cùng.'
    }
  },
  {
    word: '環境保護',
    reading: 'かんきょうほご',
    romaji: 'kankyouhogo',
    hanViet: 'HOÀN CẢNH BẢO HỘ',
    meaning: 'Bảo vệ môi trường tự nhiên',
    jlpt: 'N2',
    category: 'Xã hội & Đời sống',
    nuance: 'HOÀN CẢNH (không gian xung quanh ta) + BẢO HỘ (gìn giữ che chở khỏi nguy hại).',
    exampleSentence: {
      ja: '地域住民が一丸となって環境保護活動に参加している。',
      reading: 'ちいきじゅうみんがいちがんとなってかんきょうほごかつどうにさんかしている。',
      vi: 'Cư dân địa phương đồng lòng tham gia vào các hoạt động bảo vệ môi trường.'
    }
  },
  {
    word: '異文化理解',
    reading: 'いぶんかりかい',
    romaji: 'ibunkarikai',
    hanViet: 'DỊ VĂN HÓA LÝ GIẢI',
    meaning: 'Thấu hiểu sự khác biệt đa văn hóa',
    jlpt: 'N2',
    category: 'Dịch thuật & Báo chí',
    nuance: 'DỊ (khác biệt) + VĂN HÓA + LÝ GIẢI (hiểu thấu lý lẽ). Khái niệm trung tâm trong các môn Nhật Bản học và Dịch thuật đối chiếu.',
    exampleSentence: {
      ja: '留学を通じて異文化理解の大切さを身をもって学んだ。',
      reading: 'りゅうがくをつうじていぶんかりかいのたいせつさをみをもってまなんだ。',
      vi: 'Thông qua việc du học, tôi đã đích thân thấu hiểu tầm quan trọng của việc hiểu biết đa văn hóa.'
    }
  },
  {
    word: '一期一会',
    reading: 'いちごいちえ',
    romaji: 'ichigoichie',
    hanViet: 'NHẤT KỲ NHẤT HỘI',
    meaning: 'Đời người chỉ gặp một lần, trân trọng từng cơ duyên gặp gỡ',
    jlpt: 'N1',
    category: 'Yojijukugo',
    nuance: 'Triết lý Trà đạo: NHẤT KỲ (một đời kiếp người) + NHẤT HỘI (một lần gặp mặt). Nhắc nhở hãy đón tiếp người khác bằng cả tấm lòng chân thành vì có thể không bao giờ gặp lại.',
    exampleSentence: {
      ja: '旅先での出会いはまさに一期一会だ。',
      reading: 'たびさきでのであいはまさにいちごいちえだ。',
      vi: 'Những cuộc tao ngộ trong chuyến đi đúng thật là nhất kỳ nhất hội, duyên chỉ gặp một lần trong đời.'
    }
  },
  {
    word: '一石二鳥',
    reading: 'いっせきにちょう',
    romaji: 'issekinichou',
    hanViet: 'NHẤT THẠCH NHỊ ĐIỂU',
    meaning: 'Một mũi tên trúng hai đích, ném một hòn đá trúng hai con chim',
    jlpt: 'N3',
    category: 'Yojijukugo',
    nuance: 'NHẤT THẠCH (một viên đá) hạ gục NHỊ ĐIỂU (hai con chim). Một hành động mang lại hai mối lợi cùng lúc.',
    exampleSentence: {
      ja: '自転車通勤は運動にもなり節約にもなって一石二鳥だ。',
      reading: 'じてんしゃつうきんはうんどうにもなりせつやくにもなっていっせきにちょうだ。',
      vi: 'Đi làm bằng xe đạp vừa rèn luyện sức khỏe vừa tiết kiệm chi phí, thật là một công đôi việc.'
    }
  },
  {
    word: '準備',
    reading: 'じゅんび',
    romaji: 'junbi',
    hanViet: 'CHUẨN BỊ',
    meaning: 'Chuẩn bị, sắp xếp trước',
    jlpt: 'N4',
    category: 'Xã hội & Đời sống',
    nuance: 'CHUẨN (chuẩn mực, đo lường) + BỊ (trang bị đầy đủ sẵn sàng).',
    exampleSentence: {
      ja: '明日のプレゼンテーションの準備を念入りに行う。',
      reading: 'あすのぷれぜんてーしょんのじゅんびをねんいりにおこなう。',
      vi: 'Chuẩn bị thật chu đáo cho bài thuyết trình ngày mai.'
    }
  },
  {
    word: '日本語',
    reading: 'にほんご',
    romaji: 'nihongo',
    hanViet: 'NHẬT BẢN NGỮ',
    meaning: 'Tiếng Nhật',
    jlpt: 'N5',
    category: 'Xã hội & Đời sống',
    nuance: 'NHẬT (Mặt trời) + BẢN (Gốc rễ) -> Đất nước mặt trời mọc + NGỮ (Ngôn ngữ).',
    exampleSentence: {
      ja: '毎日日本語の漢字と文法を熱心に勉強しています。',
      reading: 'まいにちにほんごのかんじとぶんぽうをねっしんにべんきょうしています。',
      vi: 'Hàng ngày tôi đều chăm chỉ học chữ Hán và ngữ pháp tiếng Nhật.'
    }
  },
  {
    word: '専門',
    reading: 'せんもん',
    romaji: 'senmon',
    hanViet: 'CHUYÊN MÔN',
    meaning: 'Chuyên ngành, lĩnh vực chuyên sâu',
    jlpt: 'N3',
    category: 'Xã hội & Đời sống',
    nuance: 'CHUYÊN (tập trung duy nhất) + MÔN (cánh cửa, ngành học).',
    exampleSentence: {
      ja: '私の大学での専門は日本文学と対照言語学です。',
      reading: 'わたしのだいがくでのせんもんはにほんぶんがくとたいしょうげんごがくです。',
      vi: 'Chuyên ngành của tôi ở đại học là văn học Nhật Bản và ngôn ngữ học đối chiếu.'
    }
  },
  {
    word: '国際交流',
    reading: 'こくさいこうりゅう',
    romaji: 'kokusaikouryuu',
    hanViet: 'QUỐC TẾ GIAO LƯU',
    meaning: 'Giao lưu quốc tế, hợp tác giao lưu giữa các nước',
    jlpt: 'N3',
    category: 'Dịch thuật & Báo chí',
    nuance: 'QUỐC TẾ (giữa các quốc gia) + GIAO LƯU (dòng chảy hòa vào nhau).',
    exampleSentence: {
      ja: '文化祭は留学生との国際交流の絶好の機会だ。',
      reading: 'ぶんかさいはりゅうがくせいとのこくさいこうりゅうのぜっこうのきかいだ。',
      vi: 'Lễ hội văn hóa là cơ hội tuyệt vời để giao lưu quốc tế với các du học sinh.'
    }
  },
  {
    word: '民主主義',
    reading: 'みんしゅしゅぎ',
    romaji: 'minshushugi',
    hanViet: 'DÂN CHỦ CHỦ NGHĨA',
    meaning: 'Chủ nghĩa dân chủ, nền dân chủ',
    jlpt: 'N2',
    category: 'Xã hội & Pháp luật',
    nuance: 'DÂN CHỦ (người dân làm chủ đất nước) + CHỦ NGHĨA (hệ thống tư tưởng).',
    exampleSentence: {
      ja: '民主主義の基本原則は言論の自由と法の下の平等である。',
      reading: 'みんしゅしゅぎのきほんげんそくはげんろんのじゆうとほうのもとのびょうどうである。',
      vi: 'Nguyên tắc cơ bản của chủ nghĩa dân chủ là tự do ngôn luận và bình đẳng trước pháp luật.'
    }
  }
];
