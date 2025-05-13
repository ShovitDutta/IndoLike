"use client";
import { createContext, type Context } from "react";
type NextContextType = unknown | null;
type MusicContextType = unknown | null;
export const NextContext: Context<NextContextType> = createContext<NextContextType>(null);
export const MusicContext: Context<MusicContextType> = createContext<MusicContextType>(null);
