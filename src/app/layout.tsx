import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hearts2Hearts Stella Simulator",
  description: "A fictional parallel-world Stella romance simulator."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
