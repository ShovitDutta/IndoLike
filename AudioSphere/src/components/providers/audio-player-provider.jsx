"use client";
import { AudioPlayerContext } from "@/hooks/use-context";
import { useContext, useEffect, useState } from "react";

export default function AudioPlayerProvider({ children }) {
  const [music, setMusic] = useState(null);
  const [current, setCurrent] = useState(null);
  
  useEffect(() => {
    if (localStorage.getItem("last-played")) {
      setMusic(localStorage.getItem("last-played"));
    }
  }, []);
  
  return (
    <AudioPlayerContext.Provider value={{ music, setMusic, current, setCurrent }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export const useAudioPlayer = () => useContext(AudioPlayerContext);