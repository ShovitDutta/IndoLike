"use client";

import { MusicContext } from "@/hooks/use-context"; // Assuming the type of MusicContext is defined here
import { useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";

// Define the type for the value provided by the context provider
interface MusicContextValue {
  music: string | null;
  setMusic: Dispatch<SetStateAction<string | null>>;
  current: number | null;
  setCurrent: Dispatch<SetStateAction<number | null>>;
}

// Define the props for the MusicProvider component
interface MusicProviderProps {
  children: React.ReactNode;
}

export default function MusicProvider({ children }: MusicProviderProps) {
  const [music, setMusic] = useState<string | null>(null);
  const [current, setCurrent] = useState<number | null>(null);

  useEffect(() => {
    const lastPlayed = localStorage.getItem("last-played");
    if (lastPlayed !== null) {
      // Check for null explicitly
      setMusic(lastPlayed);
    }
  }, []); // Empty dependency array means this effect runs once on mount

  const contextValue: MusicContextValue = {
    music,
    setMusic,
    current,
    setCurrent,
  };

  // Assuming MusicContext was created in "@/hooks/use-context" like this:
  // export const MusicContext = createContext<MusicContextValue | null>(null);

  return <MusicContext.Provider value={contextValue}>{children}</MusicContext.Provider>;
}

// Define the return type of the useMusic hook
// Assuming the provider guarantees a non-null context value when this hook is used
export const useMusic = (): MusicContextValue => useContext(MusicContext) as MusicContextValue;
