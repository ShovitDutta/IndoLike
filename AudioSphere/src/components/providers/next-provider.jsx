"use client";
import { useState, useContext } from "react";
import { PlayQueueContext } from "@/hooks/use-context";

export default function PlayQueueProvider({ children }) {
  const [nextData, setNextData] = useState(null);
  
  return (
    <PlayQueueContext.Provider value={{ nextData, setNextData }}>
      {children}
    </PlayQueueContext.Provider>
  );
}

export const usePlayQueue = () => useContext(PlayQueueContext);
