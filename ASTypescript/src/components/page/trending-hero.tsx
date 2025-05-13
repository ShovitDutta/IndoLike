"use client";

import { HeartIcon } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { useMusic } from "@/components/music-provider"; // Assuming this path is correct and hook is typed
import { motion, AnimatePresence } from "framer-motion";

// Define the type for a trending song object based on usage
interface TrendingSong {
  id: string;
  image: { url: string; quality?: string }[]; // Assuming image has url and optional quality
  name: string;
  artists: {
    primary: { id?: string; name: string }[]; // Primary artists with id and name
    // Include other artist types if present
  };
  playCount?: number; // Play count seems optional
  // Add other song properties if they exist and are used
}

interface FetchTrendingResponse {
  data?: {
    results?: TrendingSong[]; // API returns an array of trending songs under 'data.results'
    // Include other properties if the trending API response has them
  };
  // Include other potential top-level properties in the API response
}

export default function TrendingHero() {
  const [trendingSongs, setTrendingSongs] = useState<TrendingSong[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Assuming useMusic hook returns a structure including setMusic typed as Dispatch<SetStateAction<string | null>>
  const { setMusic } = useMusic() as { setMusic: Dispatch<SetStateAction<string | null>> };

  // Move getTrendingSongs inside useEffect to satisfy exhaustive-deps
  useEffect(() => {
    const getTrendingSongs = async (): Promise<void> => {
      try {
        const get = await fetch(`http://localhost:3000/api/search/songs?query=trending`);
        if (!get.ok) {
          console.error(`Failed to fetch trending songs: ${get.status}`);
          setTrendingSongs([]);
          return;
        }
        const data: FetchTrendingResponse = await get.json();
        if (data.data && data.data.results) {
          setTrendingSongs(data.data.results);
        } else {
          setTrendingSongs([]);
        }
      } catch (error) {
        console.error("Error fetching trending songs:", error);
        setTrendingSongs([]); // Set empty array on error
      }
    };

    getTrendingSongs();
  }, [setTrendingSongs]); // Add setTrendingSongs to dependencies

  // Effect for automatic song rotation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (trendingSongs.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex === trendingSongs.length - 1 ? 0 : prevIndex + 1));
      }, 5000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [trendingSongs, trendingSongs.length]); // Rerun when trendingSongs array changes

  const currentSong = trendingSongs[currentIndex]; // Get the current song based on index

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden">
      <AnimatePresence initial={false}>
        {currentSong ? ( // Check if currentSong exists
          <motion.div
            key={currentSong.id} // Use song ID as key
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentSong.image?.[2]?.url || ""})` }} // Use optional chaining for image URL and provide fallback
          >
            {/* Blurred background image (optional chaining) */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${currentSong.image?.[2]?.url || ""})`, filter: "blur(2px)" }}></div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-red-800/20"></div>
            {/* Song details and controls */}
            <div className="absolute bottom-8 left-8 text-white z-10">
              <motion.p className="text-lg font-semibold" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                Trending New Hits
              </motion.p>
              <motion.h2 className="text-5xl font-bold mt-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                {currentSong.name} {/* Display song name */}
              </motion.h2>
              <motion.p className="text-xl mt-1 text-muted-foreground/80" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                {currentSong.artists.primary?.[0]?.name || "unknown artist"} {/* Display artist name with optional chaining and fallback */}
                {/* Display play count if available */}
                {currentSong.playCount ? ` • ${Math.round(currentSong.playCount / 1000)} K` : ""}
              </motion.p>
              <motion.div className="flex gap-4 mt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                {/* Listen Now button */}
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setMusic(currentSong.id)}>
                  Listen Now
                </Button>
                {/* Like button */}
                <Button variant="outline" size="icon" className="text-red-600 border-red-600 bg-transparent hover:bg-red-600/20" aria-label="Like song">
                  {" "}
                  {/* Added aria-label */}
                  <HeartIcon className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          // Optionally render a skeleton or placeholder when no song is loaded
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <p className="text-white">Loading trending songs...</p>
          </div>
        )}
      </AnimatePresence>
      {/* Navigation dots */}
      {trendingSongs.length > 1 && (
        <div className="absolute bottom-4 right-8 z-20 flex gap-2">
          {trendingSongs.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full ${currentIndex === index ? "bg-red-600" : "bg-white/50"}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to trending song ${index + 1}`} // Added aria-label
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}
