"use client";

import { createContext, useContext } from "react";

// Define types for the context values
export interface MusicContextType {
  music: string | null;
  setMusic: (id: string | null) => void;
  current: number | null;
  setCurrent: (time: number | null) => void;
}

export interface NextContextType {
  nextData: any; // TODO: Define a more specific type for nextData
  setNextData: (data: any) => void; // Added setNextData
}

export const NextContext = createContext<NextContextType | null>(null);
export const MusicContext = createContext<MusicContextType | null>(null);

// Optional: Create custom hooks for easier consumption (similar to useMusic in original project)
export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (context === null) {
    throw new Error("useMusicContext must be used within a MusicProvider");
  }
  return context;
};

export const useNextContext = () => {
  const context = useContext(NextContext);
  if (context === null) {
    throw new Error("useNextContext must be used within a NextProvider");
  }
  return context;
};
