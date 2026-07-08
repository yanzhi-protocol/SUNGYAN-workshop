"use client";
import { useEffect, useState } from "react";

const TITLE = "穩定中的劇震——言織";

export default function TypewriterTitle() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= TITLE.length) return;
    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1);
    }, 80);
    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <h1
      style={{
        fontSize: "clamp(24px, 5vw, 36px)",
        fontWeight: 700,
        letterSpacing: "-0.5px",
        lineHeight: 1.3,
        marginBottom: "0.25rem",
        display: "flex",
        alignItems: "baseline",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}
    >
      <span>
        {TITLE.split("").map((char, i) => (
          <span
            key={i}
            className={`typewriter-char${i < visibleCount ? " visible" : ""}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {char}
          </span>
        ))}
      </span>
      <span
        style={{
          color: "#B0A89E",
          fontSize: "11px",
          fontWeight: 400,
          letterSpacing: 0,
          whiteSpace: "nowrap",
        }}
      >
        {"// TODO: 這個標題之後可能改成『言織 v0.1 開發記錄』，先留著"}
      </span>
    </h1>
  );
}
