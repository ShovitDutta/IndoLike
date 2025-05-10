"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import { useMusic } from "@/components/music-provider";

export default function TrendingHero() {
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setMusic } = useMusic();

  const getTrendingSongs = async () => {
    const get = await fetch(`http://localhost:3000/api/search/songs?query=trending`);
    const data = await get.json();
    if (data.data && data.data.results) {
      setTrendingSongs(data.data.results);
    }
  };

  useEffect(() => {
    getTrendingSongs();
  }, []);

  useEffect(() => {
    if (trendingSongs.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex === trendingSongs.length - 1 ? 0 : prevIndex + 1));
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [trendingSongs]);

  const currentSong = trendingSongs[currentIndex];

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden">
      <AnimatePresence initial={false}>
        {currentSong && (
          <motion.div
            key={currentSong.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentSong.image[2].url})` }}>
            {/* Blurred background layer */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${currentSong.image[2].url})`, filter: "blur(2px)" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-red-800/20"></div>
            <div className="absolute bottom-8 left-8 text-white z-10">
              <motion.p className="text-lg font-semibold" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                Trending New Hits
              </motion.p>
              <motion.h2 className="text-5xl font-bold mt-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                {currentSong.name}
              </motion.h2>
              <motion.p className="text-xl mt-1 text-muted-foreground/80" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                {currentSong.artists.primary[0].name}
                {currentSong.playCount ? ` • ${Math.round(currentSong.playCount / 1000)} K` : ""}
              </motion.p>
              <motion.div className="flex gap-4 mt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setMusic(currentSong.id)}>Listen Now</Button>
                <Button variant="outline" size="icon" className="text-red-600 border-red-600 bg-transparent hover:bg-red-600/20">
                  <HeartIcon className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Navigation dots */}
      {trendingSongs.length > 1 && (
        <div className="absolute bottom-4 right-8 z-20 flex gap-2">
          {trendingSongs.map((_, index) => (
            <button key={index} className={`w-2.5 h-2.5 rounded-full ${currentIndex === index ? "bg-red-600" : "bg-white/50"}`} onClick={() => setCurrentIndex(index)}></button>
          ))}
        </div>
      )}
    </div>
  );
}
