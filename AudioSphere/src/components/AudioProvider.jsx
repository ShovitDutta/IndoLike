"use client";
import { useState } from "react";
import { AudioContext } from "@/hooks/AudioContext";
export default function AudioProvider({ children }) {
  const [nextData, setNextData] = useState(null);
  return <AudioContext.Provider value={{ nextData, setNextData }}>{children}</AudioContext.Provider>;
}
