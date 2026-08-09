"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/logs", label: "日誌" },
  { href: "/timeline", label: "時間線" },
  { href: "/about", label: "關於" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="site-nav" aria-label="主要導覽">
      <div className="site-nav-inner">
        <Link href="/" className="brand" aria-label="回到宋言的工房首頁">
          <img className="brand-mark" src="/favicon-mascot.png" alt="" aria-hidden="true" />
          <span>宋言的工房</span>
        </Link>
        {links.map((link) => {
          const isCurrent = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              aria-current={isCurrent ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
