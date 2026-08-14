"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BilingualText from "./BilingualText";
import { UI } from "@/lib/i18n";
import LanguageSelect from "./LanguageSelect";

const links = [
  { href: "/logs", ...UI.nav.logs },
  { href: "/timeline", ...UI.nav.timeline },
  { href: "/about", ...UI.nav.about },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="site-nav" aria-label="主要導覽 / Main navigation">
      <div className="site-nav-inner">
        <Link href="/" className="brand" aria-label="回到宋言的工房首頁 / Return to Sungyan Workshop home">
          <img className="brand-mark" src="/favicon-mascot.png" alt="" aria-hidden="true" />
          <BilingualText value={UI.brand} />
        </Link>
        <div className="nav-links">
          {links.map((link) => {
            const isCurrent = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                aria-current={isCurrent ? "page" : undefined}
              >
                <BilingualText value={link} />
              </Link>
            );
          })}
        </div>
        <LanguageSelect />
      </div>
    </nav>
  );
}
