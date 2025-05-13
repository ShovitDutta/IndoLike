"use client";

import { Skeleton } from "../ui/skeleton";
import { Play, Pause } from "lucide-react";
import { MusicContext } from "@/hooks/use-context"; // Assuming this path and type are correct
import { useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { motion } from "framer-motion"; // Keep motion import

// Assuming MusicContextValue is defined in "@/hooks/use-context" as:
interface MusicContextValue {
  music: string | null; // Stores the ID of the currently playing song
  setMusic: Dispatch<SetStateAction<string | null>>; // Function to set the music ID
  current: number | null; // Stores the current playback time
  setCurrent: Dispatch<SetStateAction<number | null>>; // Function to set the current playback time
}

// Define the type for the props of the SongCard component
interface SongCardProps {
  title?: string;
  image?: string;
  artist?: string;
  id: string; // Assuming id is always a string and is required
  desc?: string; // Description is an optional string
}

export default function SongCard({ title, image, artist, id, desc }: SongCardProps) {
  // Get context value, handling potential null if provider is missing
  const ids = useContext<MusicContextValue | null>(MusicContext);

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const setLastPlayed = (): void => {
    // Clear existing local storage items related to playback if necessary
    // localStorage.clear(); // This clears *all* local storage, be cautious
    localStorage.setItem("last-played", id); // Store the ID of the last played song
    // Optionally clear current time in local storage if starting a new song
    localStorage.removeItem("current-time"); // Assuming you might store current time
  };

  // Effect to update isPlaying state based on the current music context ID
  useEffect(() => {
    setIsPlaying(ids?.music === id); // Check if context music ID matches this song's ID
  }, [ids?.music, id]); // Rerun when the context music ID or this song's ID changes

  // Function to handle playing/pausing when the card's play button or title is clicked
  const handlePlayPauseClick = (): void => {
    if (ids?.setMusic) {
      if (isPlaying) {
        // If this song is currently playing, pause it (or handle pause action via context/global player)
        // The global player component should ideally handle the actual pause logic based on the 'playing' state it manages.
        // Here, we might just need to signal to the context or global player that this song is being interacted with.
        // A simple approach is to set music to null to stop playback via the global player's useEffect.
        ids.setMusic(null);
      } else {
        // If this song is not playing, set it as the current music in the context
        ids.setMusic(id);
        // Reset current time in context when starting a new song
        if (ids?.setCurrent) {
          ids.setCurrent(0);
        }
      }
      setLastPlayed(); // Update last played in local storage
    } else {
      console.warn("Music context or setMusic is not available.");
      // Optionally show a toast or handle the case where context is not available
    }
  };

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
          {/* Render image or skeleton based on image prop */}
          {image ? (
            <div className="relative">
              {/* Use motion.img with conditional animation */}
              <motion.img src={image} alt={title || "Song image"} className="h-full w-full object-cover" animate={{ scale: isHovered ? 1.1 : 1 }} transition={{ duration: 0.3 }} />
              {/* Gradient overlay */}
              <motion.div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" initial={{ opacity: 0 }} animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.3 }} />
              {/* Play/Pause button overlay */}
              <motion.button
                className="absolute inset-0 flex items-center justify-center"
                onClick={handlePlayPauseClick} // Use the combined click handler
                aria-label={isPlaying ? "Pause song" : "Play song"} // Add aria-label
              >
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
            {/* Render title or skeleton */}
            {title ? (
              <motion.h2
                className="line-clamp-1 font-semibold tracking-tight hover:text-primary transition-colors cursor-pointer"
                onClick={handlePlayPauseClick} // Also use the click handler for the title
                aria-label={`Play ${title}`} // Add aria-label
                whileHover={{ x: 5 }}>
                {/* Use optional chaining for title slicing */}
                {title?.slice(0, 25)} {title && title.length > 25 && "..."}
              </motion.h2>
            ) : (
              <Skeleton className="w-[70%] h-4" />
            )}
            {/* Render description if present */}
            {desc && (
              <motion.p className="line-clamp-2 text-sm text-muted-foreground mt-1" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                {/* Use optional chaining for desc slicing */}
                {desc?.slice(0, 60)} {desc && desc.length > 60 && "..."}
              </motion.p>
            )}
            {/* Render artist if present */}
            {artist && (
              <motion.p className="mt-2 text-sm text-muted-foreground/80" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                {/* Use optional chaining for artist slicing */}
                {artist?.slice(0, 25)} {artist && artist.length > 25 && "..."}
              </motion.p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
