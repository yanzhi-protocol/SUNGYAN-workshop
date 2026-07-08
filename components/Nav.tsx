"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "首頁" },
  { href: "/logs", label: "日誌" },
  { href: "/timeline", label: "時間線" },
  { href: "/about", label: "關於" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "1rem 0",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            fontWeight: 700,
            fontSize: "15px",
            color: "var(--text)",
            textDecoration: "none",
            marginRight: "auto",
          }}
        >
          宋言的工房
        </Link>
        {links.slice(1).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="breath-link"
            style={{
              fontSize: "14px",
              opacity: pathname === link.href ? 1 : 0.6,
              borderBottom:
                pathname === link.href ? "1px solid var(--text)" : "none",
              paddingBottom: "2px",
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
