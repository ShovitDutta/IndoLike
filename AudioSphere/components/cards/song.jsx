"use client";

import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useContext, useEffect, useState } from "react";
import { MusicContext } from "@/hooks/use-context";
import { Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SongCard({ title, image, artist, id, desc }) {
  const ids = useContext(MusicContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const setLastPlayed = () => {
    localStorage.clear();
    localStorage.setItem("last-played", id);
  };

  useEffect(() => {
    setIsPlaying(ids.music === id);
  }, [ids.music, id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative h-fit w-[280px] p-3"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}>
      <motion.div
        className="relative overflow-hidden rounded-xl bg-card/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-card/60"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}>
        <div className="aspect-square overflow-hidden rounded-lg">
          {image ? (
            <div className="relative">
              <motion.img src={image} alt={title} className="h-full w-full object-cover" animate={{ scale: isHovered ? 1.1 : 1 }} transition={{ duration: 0.3 }} />
              <motion.div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" initial={{ opacity: 0 }} animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.3 }} />
              <motion.button
                className="absolute inset-0 flex items-center justify-center"
                onClick={() => {
                  ids.setMusic(id);
                  setLastPlayed();
                }}
                whileHover="hover">
                <motion.div
                  className={`rounded-full p-3 ${isPlaying ? "bg-primary" : "bg-primary/90"} shadow-xl`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}>
                  {isPlaying ? <Pause className="h-6 w-6 text-primary-foreground" /> : <Play className="h-6 w-6 text-primary-foreground" />}
                </motion.div>
              </motion.button>
            </div>
          ) : (
            <Skeleton className="aspect-square w-full" />
          )}
        </div>

        <div className="p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {title ? (
              <motion.h2
                className="line-clamp-1 font-semibold tracking-tight hover:text-primary transition-colors cursor-pointer"
                onClick={() => {
                  ids.setMusic(id);
                  setLastPlayed();
                }}
                whileHover={{ x: 5 }}>
                {title.slice(0, 25)}
                {title.length > 25 && "..."}
              </motion.h2>
            ) : (
              <Skeleton className="w-[70%] h-4" />
            )}

            {desc && (
              <motion.p className="line-clamp-2 text-sm text-muted-foreground mt-1" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                {desc.slice(0, 60)}
                {desc.length > 60 && "..."}
              </motion.p>
            )}

            {artist && (
              <motion.p className="mt-2 text-sm text-muted-foreground/80" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                {artist.slice(0, 25)}
                {artist.length > 25 && "..."}
              </motion.p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
