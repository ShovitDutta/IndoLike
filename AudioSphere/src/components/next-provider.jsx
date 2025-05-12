"use client";
import { useState } from "react";
import { NextContext } from "@/hooks/use-context";
export default function NextProvider({ children }) {
  const [nextData, setNextData] = useState(null);
  return <NextContext.Provider value={{ nextData, setNextData }}>{children}</NextContext.Provider>;
}
