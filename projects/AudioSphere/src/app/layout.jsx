import "./globals.css";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
import MusicProvider from "@/components/providers/music-provider";
export const metadata = { title: "AudioSphere", description: "Open-Source music streamer." };
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0"></div>
          <div className="relative z-10">
            <NextTopLoader
              color="hsl(var(--primary))"
              initialPosition={0.08}
              crawlSpeed={200}
              height={2}
              crawl={true}
              easing="ease"
              speed={200}
              zIndex={1600}
              showSpinner={false}
              showAtBottom={false}
              shadow="0 0 10px hsl(var(--primary)),0 0 15px hsl(var(--primary))"
            />
            <MusicProvider>{children}</MusicProvider>
            <Toaster
              position="top-center"
              visibleToasts={1}
              toastOptions={{ style: { background: "hsl(var(--card))", color: "hsl(var(--card-foreground))", border: "1px solid hsl(var(--primary))" } }}
            />
          </div>
        </div>
      </body>
    </html>
  );
}
