import "./globals.css";
import type { Metadata } from "next";
import AppProvider from "./providers";
export const metadata: Metadata = { title: "Gemini Chat", description: "A chat application using Gemini models" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
