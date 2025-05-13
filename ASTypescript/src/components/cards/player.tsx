"use client";

import Link from "next/link";
import { Slider } from "../ui/slider";
import { motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";
import { IoPause } from "react-icons/io5";
// import { useMusic } from "../music-provider"; // Remove redundant import
import { MusicContext } from "@/hooks/use-context"; // Assuming this path and type are correct
import { useContext, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { ExternalLink, Play, Repeat, Repeat1, X, Volume2, Volume1, VolumeX } from "lucide-react";

// Define the type for the song data in the global player
interface GlobalPlayerSongData {
  id: string; // Song ID is used for linking
  image: { url: string; quality?: string }[]; // Array of images
  name: string;
  artists: {
    primary: { id?: string; name: string }[]; // Primary artists
    // Include other artist types if present
  };
  downloadUrl: { url: string; quality?: string }[]; // Array of download URLs
  // Add other song properties if used
}

interface FetchSongResponse {
  data?: GlobalPlayerSongData[]; // API returns an array with the song at index 0
  // Include other potential top-level properties in the API response
}

// Assuming MusicContextValue is defined in "@/hooks/use-context" as:
interface MusicContextValue {
  music: string | null; // Stores the ID of the currently playing song
  setMusic: Dispatch<SetStateAction<string | null>>; // Function to set the music ID
  current: number | null; // Stores the current playback time
  setCurrent: Dispatch<SetStateAction<number | null>>; // Function to set the current playback time
}

export default function Player() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [data, setData] = useState<GlobalPlayerSongData | null>(null); // State for the single song data
  const [volume, setVolume] = useState<number>(1); // Initialize volume state (0 to 1)
  // Use the typed context value directly
  const values = useContext<MusicContextValue | null>(MusicContext); // Context can be null if provider is not rendered
  const [duration, setDuration] = useState<number>(0);
  const [audioURL, setAudioURL] = useState<string>("");
  const [playing, setPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  const controlVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    tap: { scale: 0.95 },
    hover: { scale: 1.05 },
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const togglePlayPause = (): void => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        localStorage.setItem("p", "false"); // Persist playback state
      } else {
        audioRef.current.play().catch(error => {
          console.error("Failed to play audio:", error);
          // Handle play error
        });
        localStorage.setItem("p", "true"); // Persist playback state
      }
      setPlaying(!playing);
    }
  };

  const handleSeek = (e: number[]): void => {
    if (audioRef.current && e.length > 0) {
      const seekTime = e[0];
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
      // Optionally update context's current time immediately on seek
      if (values?.setCurrent) {
        values.setCurrent(seekTime);
      }
    }
  };

  const loopSong = (): void => {
    if (audioRef.current) {
      audioRef.current.loop = !audioRef.current.loop;
      setIsLooping(!isLooping);
    }
  };

  const handleVolumeChange = (value: number[]): void => {
    if (audioRef.current && value.length > 0) {
      const newVolume = value[0];
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) {
      return <VolumeX className="h-4 w-4" />;
    } else if (volume < 0.5) {
      return <Volume1 className="h-4 w-4" />;
    } else {
      return <Volume2 className="h-4 w-4" />;
    }
  };

  // Effect to load the song and set up event listeners when values.music (song ID) changes
  useEffect(() => {
    const getSong = async (songId: string): Promise<void> => {
      try {
        const get = await fetch(`/api/songs?id=${songId}`);
        if (!get.ok) {
          console.error(`Failed to fetch song with ID "${songId}": ${get.status}`);
          setData(null);
          setAudioURL("");
          return;
        }
        const result: FetchSongResponse = await get.json();
        const song = result?.data?.[0];

        if (song) {
          setData(song);
          // Prioritize higher quality download URLs
          if (song.downloadUrl?.[2]?.url) setAudioURL(song.downloadUrl[2].url);
          else if (song.downloadUrl?.[1]?.url) setAudioURL(song.downloadUrl[1].url);
          else if (song.downloadUrl?.[0]?.url) setAudioURL(song.downloadUrl[0].url);
          else setAudioURL("");
        } else {
          setData(null);
          setAudioURL("");
        }
      } catch (error) {
        console.error(`Error fetching song with ID "${songId}":`, error);
        setData(null);
        setAudioURL("");
      }
    };

    if (values?.music) {
      // Only fetch if a song ID is available in context
      getSong(values.music);

      // Set initial playback state and time
      const storedPlaying = localStorage.getItem("p");
      // Determine initial playing state: true if stored is "true" or if nothing is stored (default to play)
      const initialPlaying = storedPlaying === "true" || storedPlaying === null;
      setPlaying(initialPlaying);

      // Set initial current time if available from context
      // Ensure audioRef.current is available before trying to set currentTime
      if (audioRef.current && values.current !== null) {
        audioRef.current.currentTime = values.current;
        setCurrentTime(values.current); // Sync local state
      } else {
        setCurrentTime(0); // Reset local time if no current time in context
      }

      const handleTimeUpdate = (): void => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
          setDuration(audioRef.current.duration);
          // Update music context's current time
          if (values?.setCurrent) {
            values.setCurrent(audioRef.current.currentTime);
          }
        }
      };

      const handleVolumeChange = (): void => {
        if (audioRef.current) {
          setVolume(audioRef.current.volume);
        }
      };

      const handleLoadedMetadata = (): void => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
          // Set initial time after metadata is loaded if current time is available from context
          if (values?.current !== null) {
            audioRef.current.currentTime = values.current;
            setCurrentTime(values.current); // Sync local state
          } else {
            setCurrentTime(0); // Reset local time if no current time in context
          }
          // Attempt to play if initialPlaying is true after metadata loads
          if (initialPlaying) {
            audioRef.current.play().catch(error => {
              console.error("Failed to autoplay after metadata:", error);
              setPlaying(false); // Update state
            });
          }
        }
      };

      // Add event listeners only after audioRef.current is available
      if (audioRef.current) {
        audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.addEventListener("volumechange", handleVolumeChange);
        audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);

        // Handle the 'ended' event for playback completion if needed globally
        // audioRef.current.addEventListener('ended', handleSongEnd); // Define handleSongEnd if necessary
      }

      return () => {
        // Clean up event listeners
        if (audioRef.current) {
          audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
          audioRef.current.removeEventListener("volumechange", handleVolumeChange);
          audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
          // audioRef.current.removeEventListener('ended', handleSongEnd); // Clean up if added
        }
      };
    } else {
      // If no song is selected, reset states
      setData(null);
      setAudioURL("");
      setPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src"); // Clear the audio source
      }
      if (values?.setCurrent) {
        values.setCurrent(0); // Reset current time in context
      }
      localStorage.removeItem("last-played"); // Clear local storage
      localStorage.setItem("p", "false"); // Set playback state to false
    }
  }, [values?.music, values?.current, values?.setCurrent]); // Dependencies: music ID and context setters/current time

  // Effect to control playback based on 'playing' state and audioURL
  useEffect(() => {
    if (audioRef.current) {
      if (playing && audioURL) {
        audioRef.current.play().catch(error => {
          console.error("Failed to control playback (play):", error);
          setPlaying(false); // Update state if play fails
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing, audioURL]); // Rerun when playing state or audioURL changes

  // Render nothing if no song is currently selected in the context
  if (!values?.music || !data) {
    return null; // Or render a minimal placeholder if desired
  }

  return (
    <main>
      {/* Add onEnded and onLoadedMetadata listeners directly */}
      <audio
        autoPlay={playing}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
            // Sync local current time with context or 0 if not available
            setCurrentTime(values?.current !== null ? values.current : 0);
            // Attempt to set audio position from context if available after metadata loads
            if (audioRef.current && values?.current !== null) {
              audioRef.current.currentTime = values.current;
            }
          }
        }}
        onTimeUpdate={() => {
          // Keep inline for simplicity, but useEffect listener is more robust
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            if (values?.setCurrent) {
              values.setCurrent(audioRef.current.currentTime);
            }
          }
        }}
        onEnded={() => {
          setPlaying(false); // Stop playing
          setIsLooping(false); // Stop looping
          // Handle song end logic here if needed globally (e.g., play next song)
          // This might involve dispatching an action to the context or triggering a function.
        }}
        src={audioURL || undefined} // Ensure src is string or undefined
        ref={audioRef}
      />
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-16 md:pb-4">
        <motion.div
          className="w-full max-w-2xl bg-black/80 backdrop-blur-lg border-2 border-primary/50 rounded-xl shadow-xl shadow-black overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}>
          <div className="p-4 pt-2">
            <div className="flex items-center justify-between gap-4">
              <motion.div className="flex items-center gap-4 flex-1 min-w-0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                {/* Render image or skeleton */}
                {data?.image ? (
                  <motion.div whileHover={{ scale: 1.05 }} className="relative rounded-xl overflow-hidden shadow-lg shadow-primary/10">
                    {/* Use optional chaining for image access */}
                    <img src={data.image?.[1]?.url || data.image?.[0]?.url} alt={data?.name || "Song image"} className="h-16 w-16 object-cover" /> {/* Added alt text */}
                    <motion.div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} />
                  </motion.div>
                ) : (
                  <Skeleton className="h-16 w-16 rounded-xl" />
                )}
                <div className="flex-1 min-w-0">
                  {/* Render song name or skeleton */}
                  {!data?.name ? (
                    <Skeleton className="h-5 w-32" />
                  ) : (
                    <Link href={`/${data.id}`}>
                      {" "}
                      {/* Use data.id for linking */}
                      <motion.div className="flex items-center gap-2 group" whileHover={{ x: 5 }}>
                        <h2 className="text-base font-medium truncate group-hover:text-primary transition-colors">{data.name}</h2>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    </Link>
                  )}
                  {/* Render artist name or skeleton */}
                  {!data?.artists?.primary?.[0]?.name ? (
                    <Skeleton className="h-4 w-24 mt-1.5" />
                  ) : (
                    <motion.p className="text-sm text-muted-foreground/80 truncate mt-1" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      {data.artists.primary[0].name}
                    </motion.p>
                  )}
                  {/* Display current time and duration */}
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span> <span>/</span> <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </motion.div>
              <motion.div className="flex items-center gap-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <motion.button
                    variants={controlVariants}
                    whileHover="hover"
                    whileTap="tap"
                    className="p-2 rounded-xl hover:bg-primary/10 transition-colors"
                    onClick={() => handleVolumeChange([volume === 0 ? 1 : 0])} // Toggle mute/unmute
                    aria-label={volume === 0 ? "Unmute volume" : "Mute volume"} // Add aria-label
                  >
                    {getVolumeIcon()}
                  </motion.button>
                  <Slider
                    thumbClassName="h-3 w-3 bg-primary border-2 border-primary-foreground"
                    trackClassName="h-1.5 bg-primary/30 group-hover:bg-primary/50 transition-all duration-300"
                    onValueChange={handleVolumeChange}
                    value={[volume]}
                    max={1}
                    step={0.01}
                    className="w-20 group"
                    aria-label="Volume slider" // Add aria-label
                  />
                </div>
                <motion.button
                  variants={controlVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={loopSong}
                  className={`p-2 rounded-xl ${isLooping ? "bg-primary/20" : "hover:bg-primary/10"} transition-colors`} // Conditional background for loop state
                  aria-label={isLooping ? "Disable looping" : "Enable looping"} // Add aria-label
                >
                  {!isLooping ? <Repeat className="h-4 w-4" /> : <Repeat1 className="h-4 w-4 text-primary" />}
                </motion.button>
                <motion.button
                  variants={controlVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={togglePlayPause}
                  className="p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  disabled={!values?.music} // Disable if no song ID in context
                  aria-label={playing ? "Pause" : "Play"} // Add aria-label
                >
                  {playing ? <IoPause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </motion.button>
                {/* Close Player Button */}
                <motion.button
                  variants={controlVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => {
                    if (values?.setMusic) {
                      values.setMusic(null); // Set music ID to null in context to close player
                    }
                    if (values?.setCurrent) {
                      values.setCurrent(0); // Reset current time in context
                    }
                    localStorage.clear(); // Clear local storage
                    if (audioRef.current) {
                      audioRef.current.currentTime = 0;
                      audioRef.current.pause(); // Pause before clearing src
                      audioRef.current.removeAttribute("src"); // Clear the audio source
                    }
                    setAudioURL("");
                    setData(null);
                    setPlaying(false);
                    setDuration(0);
                    setCurrentTime(0);
                    setIsLooping(false);
                  }}
                  className="p-2 rounded-xl hover:bg-primary/10 transition-colors"
                  disabled={!values?.music} // Disable if no song ID in context
                  aria-label="Close player" // Add aria-label
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </motion.div>
            </div>
          </div>
          {/* Progress Slider */}
          <div className="w-full mb-4">
            {/* Render slider or skeleton based on duration and music ID */}
            {!duration || duration === 0 || !values?.music ? ( // Check duration is valid and music ID exists
              <Skeleton className="h-2 w-full" />
            ) : (
              <div className="px-0.5 pt-0.5">
                <Slider
                  thumbClassName="h-4 w-4 bg-primary border-2 border-primary-foreground"
                  trackClassName="h-2 bg-primary/30 group-hover:bg-primary/50 transition-all duration-300"
                  onValueChange={handleSeek}
                  value={[currentTime]}
                  max={duration}
                  step={1} // Use step 1 for seconds
                  className="w-full group"
                  aria-label="Progress slider" // Add aria-label
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
