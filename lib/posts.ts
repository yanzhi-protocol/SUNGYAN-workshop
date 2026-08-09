import fs from "fs";
import path from "path";
import matter from "gray-matter";

const logsDirectory = path.join(process.cwd(), "content/logs");
const translationsPath = path.join(process.cwd(), "content/translations.json");

type TranslationRecord = {
  title_en: string;
  category_en: string;
  tags_en: string[];
  content_en: string;
  slug: string;
  date: string;
};

function loadTranslations(): Record<string, TranslationRecord> {
  if (!fs.existsSync(translationsPath)) return {};
  const records = JSON.parse(fs.readFileSync(translationsPath, "utf8")) as TranslationRecord[];
  return Object.fromEntries(records.map((record) => [record.slug, record]));
}

const translations = loadTranslations();

export interface PostMeta {
  slug: string;
  date: string;
  title: string;
  title_en: string;
  category: string;
  category_en: string;
  tags: string[];
  tags_en: string[];
  ai_diary: boolean;
  excerpt?: string;
  excerpt_en?: string;
  commit?: string;
}

export interface Post extends PostMeta {
  content: string;
  content_en: string;
}

function excerptFrom(content: string): string {
  const normalized = content.replace(/\s+/g, " ").trim();
  return normalized.length > 120 ? `${normalized.slice(0, 120)}...` : normalized;
}

function readPost(fileName: string): Post {
  const slug = fileName.replace(/\.md$/, "");
  const fullPath = path.join(logsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const translation = translations[slug];

  return {
    slug,
    date: data.date ?? "",
    title: data.title ?? slug,
    title_en: translation?.title_en ?? data.title ?? slug,
    category: data.category ?? "未分類",
    category_en: translation?.category_en ?? data.category ?? "Uncategorized",
    tags: data.tags ?? [],
    tags_en: translation?.tags_en ?? data.tags ?? [],
    ai_diary: data.ai_diary ?? false,
    excerpt: excerptFrom(content),
    excerpt_en: translation ? excerptFrom(translation.content_en) : undefined,
    content,
    content_en: translation?.content_en ?? content,
    commit: data.commit ?? undefined,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(logsDirectory)) return [];
  return fs.readdirSync(logsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(readPost)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const fileName = `${slug}.md`;
  if (!fs.existsSync(path.join(logsDirectory, fileName))) return null;
  return readPost(fileName);
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  return Array.from(new Set(posts.map((post) => post.category)));
}
