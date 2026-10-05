import { ExternalSearchResult, HandwritingCandidate } from '../types/kanji';

export function convertCandidateToExternalResult(candidate: HandwritingCandidate): ExternalSearchResult {
  const onReading = candidate.on && candidate.on.length > 0 ? candidate.on[0] : '';
  const kunReading = candidate.kun && candidate.kun.length > 0 ? candidate.kun[0] : '';
  const displayReading = kunReading ? kunReading.replace(/\..*$/, '') : (onReading || candidate.kanji);

  return {
    word: candidate.kanji,
    reading: displayReading,
    romaji: '',
    hanViet: candidate.hanViet.toUpperCase(),
    meaning: candidate.meaning,
    detailedMeaning: `Ký tự chữ Hán [${candidate.kanji}] mang âm Hán Việt là [${candidate.hanViet}]. Ý nghĩa cốt lõi: ${candidate.meaning}. Thuộc bộ thủ ${candidate.radical || 'cơ bản'} (${candidate.strokeCount || 1} nét).`,
    jlpt: (candidate as any).jlpt || 'N3',
    category: candidate.radical ? `Bộ thủ: ${candidate.radical}` : 'Chữ Hán tra cứu',
    kanjiList: [
      {
        kanji: candidate.kanji,
        hanViet: candidate.hanViet,
        meaning: candidate.meaning,
        on: candidate.on || [],
        kun: candidate.kun || [],
        radical: candidate.radical || '',
        strokeCount: candidate.strokeCount || 1,
        jlpt: (candidate as any).jlpt || 'N3',
        mnemonic: `Chữ Hán [${candidate.kanji}], âm Hán Việt [${candidate.hanViet}] biểu thị ý niệm: ${candidate.meaning}.`,
        compounds: candidate.compounds || [],
      },
    ],
    exampleSentences: candidate.exampleSentence
      ? [
          {
            japanese: candidate.exampleSentence.japanese,
            furigana: candidate.exampleSentence.furigana,
            vietnamese: candidate.exampleSentence.vietnamese,
          },
        ]
      : candidate.compounds && candidate.compounds.length > 0
      ? candidate.compounds.slice(0, 3).map((cp) => ({
          japanese: `${cp.word}を学ぶ。`,
          furigana: `${cp.reading}をまなぶ。`,
          vietnamese: `Học từ ghép: ${cp.word} [${cp.hanViet}] nghĩa là "${cp.meaning}"`,
        }))
      : [
          {
            japanese: `${candidate.kanji}の書き方を練習する。`,
            furigana: `${candidate.kanji}のかきかたをれんしゅうする。`,
            vietnamese: `Luyện viết và phân tích ý nghĩa chữ Hán [${candidate.kanji}] (${candidate.hanViet}).`,
          },
        ],
    originNotes: `Dựa trên âm Hán Việt: chữ [${candidate.kanji}] mang âm [${candidate.hanViet}], biểu thị nghĩa cốt lõi: "${candidate.meaning}".`,
  };
}
