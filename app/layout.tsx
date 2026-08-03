import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "宋言的工房",
  description: "穩定中的劇震——言織 v0.1 開發記錄",
  verification: {
    google: "9u6m0cfnM_8Ecuf0Ar-dzc5QxNDA7RQZbdW_jJvY498",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <head>
        <meta name="google-site-verification" content="9u6m0cfnM_8Ecuf0Ar-dzc5QxNDA7RQZbdW_jJvY498" />
      </head>
      <body>{children}</body>
    </html>
  );
}
