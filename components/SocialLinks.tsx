const socialLinks = [
  { label: "Threads", href: "https://www.threads.com/@yanzhiprotocol" },
  { label: "X", href: "https://x.com/yanzhiprotocol" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61591256981970&locale=zh_TW" },
  { label: "Substack", href: "https://substack.com/@yanzhi" },
  { label: "GitHub", href: "https://github.com/yanzhi-protocol" },
  { label: "Instagram", href: "https://www.instagram.com/yanzhiprotocol/" },
];

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <nav className={`social-links ${className}`.trim()} aria-label="社群連結 / Social links">
      {socialLinks.map((link) => (
        <a key={link.label} className="social-link" href={link.href} target="_blank" rel="noopener noreferrer">
          <span>{link.label}</span>
          <span aria-hidden="true">↗</span>
        </a>
      ))}
    </nav>
  );
}
