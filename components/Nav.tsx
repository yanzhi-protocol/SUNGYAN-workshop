"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BilingualText from "./BilingualText";
import { useLanguage } from "./LanguageProvider";
import { UI } from "@/lib/i18n";

const links = [
  { href: "/logs", ...UI.nav.logs },
  { href: "/timeline", ...UI.nav.timeline },
  { href: "/about", ...UI.nav.about },
];

export default function Nav() {
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguage();

  return (
    <nav className="site-nav" aria-label="主要導覽 / Main navigation">
      <div className="site-nav-inner">
        <Link href="/" className="brand" aria-label="回到宋言的工房首頁 / Return to Sungyan Workshop home">
          <img className="brand-mark" src="/favicon-mascot.png" alt="" aria-hidden="true" />
          <BilingualText zh={UI.brand.zh} en={UI.brand.en} />
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
                <BilingualText zh={link.zh} en={link.en} />
              </Link>
            );
          })}
        </div>
        <button
          type="button"
          className="language-toggle"
          onClick={toggleLanguage}
          aria-label={language === "zh" ? "切換為英文 / Switch to English" : "切換為中文 / Switch to Chinese"}
        >
          <span className={language === "zh" ? "language-active" : ""}>中</span>
          <span aria-hidden="true">/</span>
          <span className={language === "en" ? "language-active" : ""}>EN</span>
        </button>
      </div>
    </nav>
  );
}
