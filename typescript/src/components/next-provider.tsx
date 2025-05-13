"use client";

import { useState } from "react";
import { NextContext, NextContextType } from "@/hooks/use-context";
import React from "react";

export default function NextProvider({ children }: { children: React.ReactNode }) {
  const [nextData, setNextData] = useState<any>(null); // TODO: Define a more specific type for nextData

  const contextValue: NextContextType = {
    nextData,
    setNextData,
  };

  return <NextContext.Provider value={contextValue}>{children}</NextContext.Provider>;
}