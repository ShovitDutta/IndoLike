<<<<<<< HEAD
"use client";
import { NextContext } from "@/hooks/use-context";
import { useState } from "react";

export default function NextProvider({ children }) {
  const [nextData, setNextData] = useState(null);

  return <NextContext.Provider value={{ nextData, setNextData }}>{children}</NextContext.Provider>;
}
=======
"use client";
import { NextContext } from "@/hooks/use-context";
import { useState } from "react";

export default function NextProvider({ children }) {
  const [nextData, setNextData] = useState(null);

  return <NextContext.Provider value={{ nextData, setNextData }}>{children}</NextContext.Provider>;
}
>>>>>>> 8c930d8c52fe0e2eeb08f275e5a181aea5f59fce
