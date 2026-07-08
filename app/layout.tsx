import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "宋言的工房",
  description: "穩定中的劇震——言織 v0.1 開發記錄",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
