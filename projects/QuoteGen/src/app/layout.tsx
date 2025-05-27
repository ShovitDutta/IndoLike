import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Quote Gen", description: "AI Reasoning Quote Generator" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
