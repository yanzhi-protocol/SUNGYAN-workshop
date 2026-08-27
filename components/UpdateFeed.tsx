import type { UpdateItem } from "@/lib/updates";

type Props = {
  updates: UpdateItem[];
};

function mediaLabel(kind: UpdateItem["kind"]) {
  return kind === "video" ? "VIDEO" : "IMAGE";
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
                src={update.src}
                aria-label={update.caption}
              />
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
