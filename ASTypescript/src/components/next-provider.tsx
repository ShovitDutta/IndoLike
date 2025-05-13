"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { NextContext } from "@/hooks/use-context"; // Assuming this path is correct

// Define the type for the data structure stored in nextData
interface NextData {
  id?: string;
  name?: string;
  artist?: string;
  album?: string;
  image?: string;
}

// Define the type for the value provided by the context provider
interface NextContextValue {
  nextData: NextData | null;
  setNextData: Dispatch<SetStateAction<NextData | null>>;
}

// Define the props for the NextProvider component
interface NextProviderProps {
  children: React.ReactNode;
}

export default function NextProvider({ children }: NextProviderProps) {
  // Use the defined type for the state, initialized to null
  const [nextData, setNextData] = useState<NextData | null>(null);

  // The value provided to the context provider, explicitly typed
  const contextValue: NextContextValue = {
    nextData,
    setNextData,
  };

  // Ensure the NextContext is created with the correct type initially in "@/hooks/use-context":
  // export const NextContext = createContext<NextContextValue | null>(null);

  return <NextContext.Provider value={contextValue}>{children}</NextContext.Provider>;
}
