"use client";
import { DataContext } from "@/hooks/AudioContext";
import { useContext, useEffect, useState } from "react";
export default function DataProvider({ children }) {
  const [music, setMusic] = useState(null);
  const [current, setCurrent] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("last-played")) {
      setMusic(localStorage.getItem("last-played"));
    }
  }, []);
  return <DataContext.Provider value={{ music, setMusic, current, setCurrent }}>{children}</DataContext.Provider>;
}
export const useMusic = () => useContext(DataContext);
