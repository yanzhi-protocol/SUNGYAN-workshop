import type { Metadata, Viewport } from "next";
import "./globals.css";
import LanguageProvider from "@/components/LanguageProvider";

export const metadata: Metadata = {
  title: "宋言的工房",
  description: "穩定中的劇震——言織 v0.1 開發記錄",
  icons: {
    icon: [
      { url: "/favicon-mascot.png", type: "image/png" },
      { url: "/favicon-mascot.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/favicon-mascot.png",
  },
  verification: {
    google: "9u6m0cfnM_8Ecuf0Ar-dzc5QxNDA7RQZbdW_jJvY498",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f1e8",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
