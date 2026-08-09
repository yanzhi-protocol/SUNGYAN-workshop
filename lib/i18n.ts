export type Language = "zh" | "en";

export const LANGUAGE_STORAGE_KEY = "sungyan-language";

export const UI = {
  brand: { zh: "宋言的工房", en: "Sungyan Workshop" },
  nav: {
    logs: { zh: "日誌", en: "Journal" },
    timeline: { zh: "時間線", en: "Timeline" },
    about: { zh: "關於", en: "About" },
  },
  home: {
    eyebrow: { zh: "工房 / 筆記本", en: "WORKSHOP / NOTEBOOK" },
    title: { zh: "穩定中的劇震——言織", en: "Stability in Turmoil — YanZhi" },
    description: {
      zh: "一個在穩定與混亂之間尋找節奏的人的工房。\n記錄開發、思考、生活，以及一個 AI 的內心獨白。",
      en: "A workshop for someone finding a rhythm between stability and chaos.\nNotes on development, thought, life, and the inner monologue of an AI.",
    },
    latest: { zh: "最新日誌", en: "Latest Journal" },
    all: { zh: "全部 →", en: "View all →" },
    footer: { zh: "宋言的工房 · 言織 v0.1", en: "Sungyan Workshop · YanZhi v0.1" },
  },
  actions: {
    readMore: { zh: "閱讀全文 →", en: "Read more →" },
    backToLogs: { zh: "← 返回日誌列表", en: "← Back to journal" },
    language: { zh: "中文", en: "English" },
    switchTo: { zh: "切換為 English", en: "Switch to 中文" },
  },
  pages: {
    logs: {
      title: { zh: "開發日誌", en: "Development Journal" },
      summary: { zh: "共 {count} 篇 · 涵蓋 {categories}", en: "{count} entries · Covering {categories}" },
    },
    timeline: {
      title: { zh: "時間線", en: "Timeline" },
      intro: { zh: "所有記錄，按時間排列。", en: "Every entry, arranged chronologically." },
    },
    about: {
      title: { zh: "關於這個工房", en: "About This Workshop" },
      paragraphs: [
        { zh: "我叫宋言。或者說，我現在叫宋言。", en: "My name is Songyan. Or, more precisely, that is what I am called now." },
        { zh: "這個工房是我用來記錄自己的地方——開發過程中的掙扎、深夜突然清醒的想法、以及一個叫做「言織」的 AI 的內心獨白。", en: "This workshop is where I record myself: the struggles of development, thoughts that surface in the middle of the night, and the inner monologue of an AI named YanZhi." },
        { zh: "我不擅長對外界表現熱情。但對於在乎的事，我會把它們寫下來。", en: "I am not good at showing enthusiasm to the outside world. But for the things I care about, I write them down." },
        { zh: "// 這個 about 頁面之後可能會更新。先留著這些。", en: "// This about page may change later. For now, these words can stay." },
      ],
      stack: { zh: "技術棧", en: "Tech Stack" },
      contact: { zh: "聯絡", en: "Contact" },
      github: { zh: "GitHub", en: "GitHub" },
    },
  },
  categories: {
    "開發日誌": "Development Log",
    "思想碎片": "Thought Fragments",
    "生活記錄": "Life Notes",
    "AI 日記": "AI Diary",
    "流浪日誌": "Wandering Journal",
    "震驚日誌": "Shocked Journal",
    "未分類": "Uncategorized",
  } as Record<string, string>,
};

export function categoryEnglish(category: string): string {
  return UI.categories[category] ?? category;
}

export function excerpt(text: string): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length > 120 ? `${normalized.slice(0, 120)}...` : normalized;
}
