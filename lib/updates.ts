import fs from "fs";
import path from "path";

const updatesDirectory = path.join(process.cwd(), "public/updates");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov"]);

export type UpdateKind = "image" | "video";

export interface UpdateItem {
  fileName: string;
  src: string;
  kind: UpdateKind;
  caption: string;
  publishedAt: number;
  dateLabel: string;
}

function extensionOf(fileName: string) {
  return path.extname(fileName).toLowerCase();
}

function parseTimestamp(stem: string) {
  const match = stem.match(
    /^(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})(?:-(\d{2}))?(?:__|--|_)(.+)$/,
  );
  if (!match) return null;

  const [, year, month, day, hour, minute, second = "00"] = match;
  const timestamp = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );

  if (!Number.isFinite(timestamp)) return null;
  return { timestamp, captionStem: match[7] };
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date(timestamp));
}

function captionFrom(stem: string, parsed: ReturnType<typeof parseTimestamp>) {
  const rawCaption = parsed?.captionStem ?? stem;
  return rawCaption
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "Untitled update";
}

function toUpdate(fileName: string): UpdateItem | null {
  const extension = extensionOf(fileName);
  const kind = IMAGE_EXTENSIONS.has(extension)
    ? "image"
    : VIDEO_EXTENSIONS.has(extension)
      ? "video"
      : null;
  if (!kind) return null;

  const stem = fileName.slice(0, -extension.length);
  const parsed = parseTimestamp(stem);
  const filePath = path.join(updatesDirectory, fileName);
  const fileStats = fs.statSync(filePath);
  const publishedAt = parsed?.timestamp ?? fileStats.mtimeMs;

  return {
    fileName,
    src: `/updates/${encodeURIComponent(fileName)}`,
    kind,
    caption: captionFrom(stem, parsed),
    publishedAt,
    dateLabel: formatDate(publishedAt),
  };
}

export function getAllUpdates(): UpdateItem[] {
  if (!fs.existsSync(updatesDirectory)) return [];

  return fs
    .readdirSync(updatesDirectory)
    .map(toUpdate)
    .filter((item): item is UpdateItem => Boolean(item))
    .sort((a, b) => {
      const videoPriority = Number(b.kind === "video") - Number(a.kind === "video");
      return videoPriority || b.publishedAt - a.publishedAt || b.fileName.localeCompare(a.fileName);
    });
}

export function getUpdateCounts(updates: UpdateItem[]) {
  return {
    total: updates.length,
    images: updates.filter((item) => item.kind === "image").length,
    videos: updates.filter((item) => item.kind === "video").length,
  };
}
