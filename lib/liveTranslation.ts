import type { Language } from "./i18n";

export type TranslationProgress = {
  stage: "checking" | "downloading" | "translating" | "ready" | "fallback" | "error";
  loaded?: number;
  total?: number;
};

type NativeTranslator = {
  translate(input: string): Promise<string>;
  destroy?: () => void;
};

type NativeTranslatorApi = {
  availability(options: { sourceLanguage: string; targetLanguage: string }): Promise<string>;
  create(options: {
    sourceLanguage: string;
    targetLanguage: string;
    monitor?: (monitor: EventTarget) => void;
  }): Promise<NativeTranslator>;
};

const BCP47_CODES: Record<Language, string> = {
  zh: "zh-Hant",
  en: "en",
  ja: "ja",
  ko: "ko",
  es: "es",
  fr: "fr",
  de: "de",
  pt: "pt",
  ar: "ar",
  hi: "hi",
  it: "it",
};

const resultCache = new Map<string, string>();
const translatorCache = new Map<string, Promise<NativeTranslator | null>>();

function browserTranslator(): NativeTranslatorApi | null {
  if (typeof window === "undefined") return null;
  return ((globalThis as typeof globalThis & { Translator?: NativeTranslatorApi }).Translator) ?? null;
}

export function supportsNativeTranslation(): boolean {
  return browserTranslator() !== null;
}

function cacheKey(text: string, target: Language): string {
  let hash = 5381;
  for (let index = 0; index < text.length; index += 1) hash = (hash * 33) ^ text.charCodeAt(index);
  return `sungyan-translation:${target}:${hash >>> 0}`;
}

function readPersistentCache(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writePersistentCache(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be disabled or full; the in-memory result remains valid.
  }
}

async function getNativeTranslator(target: Language, onProgress?: (progress: TranslationProgress) => void) {
  const api = browserTranslator();
  if (!api || target === "zh") return null;
  const key = `zh-Hant>${target}`;
  const cached = translatorCache.get(key);
  if (cached) return cached;

  const created = (async () => {
    try {
      onProgress?.({ stage: "checking" });
      const availability = await api.availability({ sourceLanguage: BCP47_CODES.zh, targetLanguage: BCP47_CODES[target] });
      if (availability === "unavailable") {
        translatorCache.delete(key);
        return null;
      }
      onProgress?.({ stage: availability === "downloadable" ? "downloading" : "translating" });
      return await api.create({
        sourceLanguage: BCP47_CODES.zh,
        targetLanguage: BCP47_CODES[target],
        monitor: (monitor) => {
          monitor.addEventListener("downloadprogress", (event) => {
            const progressEvent = event as Event & { loaded?: number; total?: number };
            onProgress?.({ stage: "downloading", loaded: progressEvent.loaded, total: progressEvent.total });
          });
        },
      });
    } catch {
      translatorCache.delete(key);
      return null;
    }
  })();
  translatorCache.set(key, created);
  return created;
}

export async function translateText(text: string, target: Language, onProgress?: (progress: TranslationProgress) => void): Promise<string | null> {
  if (!text.trim() || target === "zh") return text;
  const key = cacheKey(text, target);
  const memory = resultCache.get(key);
  if (memory) return memory;
  const persisted = readPersistentCache(key);
  if (persisted) {
    resultCache.set(key, persisted);
    return persisted;
  }

  try {
    const native = await getNativeTranslator(target, onProgress);
    if (!native) {
      onProgress?.({ stage: "fallback" });
      return null;
    }
    onProgress?.({ stage: "translating" });
    const result = await native.translate(text);
    resultCache.set(key, result);
    writePersistentCache(key, result);
    onProgress?.({ stage: "ready" });
    return result;
  } catch {
    onProgress?.({ stage: "error" });
    return null;
  }
}

function protectedMarkdownParts(text: string) {
  const protectedParts: string[] = [];
  const masked = text.replace(/```[\s\S]*?```|`[^`\n]+`|https?:\/\/[^\s)]+/g, (match) => {
    const token = `__SUNGYAN_MARK_${protectedParts.length}__`;
    protectedParts.push(match);
    return token;
  });
  return { masked, protectedParts };
}

function restoreMarkdownParts(text: string, protectedParts: string[]) {
  return text.replace(/__SUNGYAN_MARK_(\d+)__/g, (_, index: string) => protectedParts[Number(index)] ?? "");
}

export async function translateMarkdown(text: string, target: Language, onProgress?: (progress: TranslationProgress) => void): Promise<string | null> {
  if (target === "zh" || !text.trim()) return text;
  if (!supportsNativeTranslation()) return null;
  const blocks = text.split(/(\n\s*\n)/g);
  const translatedBlocks: string[] = [];
  let failed = false;
  for (const block of blocks) {
    if (!block.trim() || /^\s*$/.test(block)) {
      translatedBlocks.push(block);
      continue;
    }
    const { masked, protectedParts } = protectedMarkdownParts(block);
    const translated = await translateText(masked, target, onProgress);
    if (!translated) failed = true;
    translatedBlocks.push(translated ? restoreMarkdownParts(translated, protectedParts) : block);
  }
  return failed ? null : translatedBlocks.join("");
}
