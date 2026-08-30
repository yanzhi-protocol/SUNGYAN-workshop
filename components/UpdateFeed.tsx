import type { UpdateItem } from "@/lib/updates";

type Props = {
  updates: UpdateItem[];
};

function mediaLabel(kind: UpdateItem["kind"]) {
  return kind === "video" ? "VIDEO" : "IMAGE";
}

function videoMimeType(fileName: string) {
  const extension = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  if (extension === ".webm") return "video/webm";
  if (extension === ".mov") return "video/quicktime";
  return "video/mp4";
}

export default function UpdateFeed({ updates }: Props) {
  return (
    <div className="updates-feed" aria-label="最新動態內容 / Latest updates feed">
      {updates.map((update, index) => (
        <article className="update-card" key={update.fileName}>
          <div className="update-card-meta">
            <span className="update-card-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="update-card-kind">{mediaLabel(update.kind)}</span>
            <time dateTime={new Date(update.publishedAt).toISOString()}>{update.dateLabel}</time>
          </div>

          <div className={`update-media update-media--${update.kind}`}>
            {update.kind === "video" ? (
              <video
                controls
                playsInline
                preload="metadata"
                poster="/favicon-mascot.png"
                aria-label={update.caption}
              >
                <source src={update.src} type={videoMimeType(update.fileName)} />
                <a href={update.src} target="_blank" rel="noreferrer">
                  Open video / 開啟影片 ↗
                </a>
              </video>
            ) : (
              <img src={update.src} alt={update.caption} loading={index > 1 ? "lazy" : "eager"} />
            )}
          </div>

          <div className="update-card-caption">
            <span className="update-caption-mark" aria-hidden="true">↳</span>
            <span>{update.caption}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
