"use client";
import { useEffect, useState } from "react";

export default function TerminalBox() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "1.5rem",
        left: "1.5rem",
        background: "#1E1E1E",
        color: "#4ADE80",
        fontFamily: "SF Mono, Consolas, Menlo, Monaco, monospace",
        fontSize: "13px",
        lineHeight: "1.6",
        padding: "0.75rem 1rem",
        borderRadius: "8px",
        zIndex: 999,
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        transition: "opacity 500ms ease-out",
        opacity: visible ? 1 : 0,
        userSelect: "none",
      }}
    >
      <div style={{ color: "#888", marginBottom: "2px", fontSize: "11px" }}>
        bash — 80×24
      </div>
      <div>Last login: Sun Jun 29 03:12:47 on ttys001</div>
      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        <span style={{ color: "#888" }}>yanzhi@workshop</span>
        <span style={{ color: "#4ADE80" }}> ~ % </span>
        <span className="cursor-blink" style={{ background: "#4ADE80", width: "9px", height: "15px", display: "inline-block" }} />
      </div>
    </div>
  );
}
