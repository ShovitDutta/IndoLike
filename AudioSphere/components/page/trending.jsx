"use client";

import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Heart } from "lucide-react";
import { MusicContext } from "@/hooks/use-context";

const trendingSongs = [
  {
    id: "only-human",
    title: "Only Human",
    artist: "Jonas Brothers",
    image: "/images/trending/only-human.jpg",
    duration: "3:25",
    plays: "25M",
  },
  {
    id: "attention",
    title: "Attention",
    artist: "Charlie Puth",
    image: "/images/trending/attention.jpg",
    duration: "3:52",
    plays: "32M",
  },
];

export default function Trending() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const ids = useContext(MusicContext);

  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % trendingSongs.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isHovered]);

  const currentSong = trendingSongs[currentIndex];

  const handlePlay = () => {
    ids.setMusic(currentSong.id);
    localStorage.setItem("last-played", currentSong.id);
  };

  return (
    <div className="relative w-full h-[500px] bg-background">
      <motion.div className="relative w-full h-full" onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            src={currentSong.image}
            alt={currentSong.title}
            className="w-full h-full object-cover object-center"
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{ duration: 10 }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 lg:p-24">
          <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-medium text-white/80">
            Trending New Hits
          </motion.p>

          <div className="max-w-2xl">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {currentSong.title}
            </motion.h1>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 text-white/80 mb-8">
              <span>{currentSong.artist}</span>
              <span>•</span>
              <span>{currentSong.plays}</span>
            </motion.div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlay}
                className="flex items-center gap-2 px-6 py-3 bg-primary rounded-full text-white font-medium hover:bg-primary/90 transition-colors">
                <Play className="w-5 h-5" />
                Listen Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                <Heart className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>

          <div className="flex gap-2">
            {trendingSongs.map((_, index) => (
              <motion.button
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-primary" : "bg-white/30"}`}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
