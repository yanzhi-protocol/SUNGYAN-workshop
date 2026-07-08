import fs from "fs";
import path from "path";
import matter from "gray-matter";

const logsDirectory = path.join(process.cwd(), "content/logs");

export interface PostMeta {
  slug: string;
  date: string;
  title: string;
  category: string;
  tags: string[];
  ai_diary: boolean;
  excerpt?: string;
  commit?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(logsDirectory)) return [];
  const fileNames = fs.readdirSync(logsDirectory).filter((f) => f.endsWith(".md"));
  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(logsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const excerpt = content.slice(0, 120).replace(/\n/g, " ") + "...";
    return {
      slug,
      date: data.date ?? "",
      title: data.title ?? slug,
      category: data.category ?? "未分類",
      tags: data.tags ?? [],
      ai_diary: data.ai_diary ?? false,
      excerpt,
      commit: data.commit ?? null,
    } as PostMeta;
  });
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(logsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  return {
    slug,
    date: data.date ?? "",
    title: data.title ?? slug,
    category: data.category ?? "未分類",
    tags: data.tags ?? [],
    ai_diary: data.ai_diary ?? false,
    content,
    commit: data.commit ?? null,
  };
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const cats = Array.from(new Set(posts.map((p) => p.category)));
  return cats;
}
