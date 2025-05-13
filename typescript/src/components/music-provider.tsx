"use client";

import { MusicContext, MusicContextType } from "@/hooks/use-context";
import { useContext, useEffect, useState } from "react";
import React from "react";

export default function MusicProvider({ children }: { children: React.ReactNode }) {
  const [music, setMusic] = useState<string | null>(null);
  const [current, setCurrent] = useState<number | null>(null); // Assuming current is a number (time in seconds)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const lastPlayed = localStorage.getItem("last-played");
      if (lastPlayed) {
        setMusic(lastPlayed);
      }
    }
  }, []);

  const contextValue: MusicContextType = {
    music,
    setMusic,
    current,
    setCurrent,
  };

  return <MusicContext.Provider value={contextValue}>{children}</MusicContext.Provider>;
}

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === null) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};