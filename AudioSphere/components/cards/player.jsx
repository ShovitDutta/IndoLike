"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { ExternalLink, Link2Icon, Pause, PauseCircle, Play, Repeat, Repeat1, X, Volume2, Volume1, VolumeX } from "lucide-react";
import { Slider } from "../ui/slider";
import Link from "next/link";
import { MusicContext } from "@/hooks/use-context";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { IoPause } from "react-icons/io5";
import { useMusic } from "../music-provider";
import { motion, AnimatePresence } from "framer-motion";

export default function Player() {
  const [data, setData] = useState([]);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioURL, setAudioURL] = useState("");
  const [isLooping, setIsLooping] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [volume, setVolume] = useState(1); // Add volume state
  const values = useContext(MusicContext);

  const controlVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    tap: { scale: 0.95 },
    hover: { scale: 1.05 },
  };

  const getSong = async () => {
    const get = await fetch(`/api/songs/${values.music}`);
    const data = await get.json();
    setData(data.data[0]);
    if (data?.data[0]?.downloadUrl[2]?.url) {
      setAudioURL(data?.data[0]?.downloadUrl[2]?.url);
    } else if (data?.data[0]?.downloadUrl[1]?.url) {
      setAudioURL(data?.data[0]?.downloadUrl[1]?.url);
    } else {
      setAudioURL(data?.data[0]?.downloadUrl[0]?.url);
    }
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const togglePlayPause = () => {
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleSeek = e => {
    const seekTime = e[0];
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const loopSong = () => {
    audioRef.current.loop = !audioRef.current.loop;
    setIsLooping(!isLooping);
  };

  const { current, setCurrent } = useMusic();

  const handleVolumeChange = value => {
    const newVolume = value[0];
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  useEffect(() => {
    if (values.music) {
      getSong();
      if (current) {
        audioRef.current.currentTime = parseFloat(current + 1);
      }
      setPlaying((localStorage.getItem("p") == "true" && true) || (!localStorage.getItem("p") && true));
      const handleTimeUpdate = () => {
        try {
          setCurrentTime(audioRef.current.currentTime);
          setDuration(audioRef.current.duration);
          setCurrent(audioRef.current.currentTime);
        } catch (e) {
          setPlaying(false);
        }
      };
      const handleVolumeChange = () => {
        if (audioRef.current) {
          setVolume(audioRef.current.volume);
        }
      };
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("volumechange", handleVolumeChange); // Add volumechange listener
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
          audioRef.current.removeEventListener("volumechange", handleVolumeChange); // Remove volumechange listener
        }
      };
    }
  }, [values.music]);

  const getVolumeIcon = () => {
    if (volume === 0) {
      return <VolumeX className="h-4 w-4" />;
    } else if (volume < 0.5) {
      return <Volume1 className="h-4 w-4" />;
    } else {
      return <Volume2 className="h-4 w-4" />;
    }
  };

  return (
    <main>
      <audio autoPlay={playing} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onLoadedData={() => setDuration(audioRef.current.duration)} src={audioURL} ref={audioRef} />
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
                {data?.image ? (
                  <motion.div whileHover={{ scale: 1.05 }} className="relative rounded-xl overflow-hidden shadow-lg shadow-primary/10">
                    <img src={data?.image[1]?.url} alt={data?.name} className="h-16 w-16 object-cover" />
                    <motion.div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} />
                  </motion.div>
                ) : (
                  <Skeleton className="h-16 w-16 rounded-xl" />
                )}

                <div className="flex-1 min-w-0">
                  {!data?.name ? (
                    <Skeleton className="h-5 w-32" />
                  ) : (
                    <Link href={`/${values.music}`}>
                      <motion.div className="flex items-center gap-2 group" whileHover={{ x: 5 }}>
                        <h2 className="text-base font-medium truncate group-hover:text-primary transition-colors">{data?.name}</h2>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    </Link>
                  )}

                  {!data?.artists?.primary[0]?.name ? (
                    <Skeleton className="h-4 w-24 mt-1.5" />
                  ) : (
                    <motion.p className="text-sm text-muted-foreground/80 truncate mt-1" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      {data?.artists?.primary[0]?.name}
                    </motion.p>
                  )}

                  <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>/</span>
                    <span>{formatTime(duration)}</span>
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
                    onClick={() => handleVolumeChange([volume === 0 ? 1 : 0])} // Toggle mute
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
                  />
                </div>

                <motion.button
                  variants={controlVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={loopSong}
                  className={`p-2 rounded-xl ${!isLooping ? "hover:bg-primary/10" : "bg-primary/20"} transition-colors`}>
                  {!isLooping ? <Repeat className="h-4 w-4" /> : <Repeat1 className="h-4 w-4 text-primary" />}
                </motion.button>

                <motion.button
                  variants={controlVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={togglePlayPause}
                  className="p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  disabled={!values.music} // Disable play/pause if no music is loaded
                >
                  {playing ? <IoPause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </motion.button>

                <motion.button
                  variants={controlVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => {
                    values.setMusic(null);
                    setCurrent(0);
                    localStorage.clear();
                    if (audioRef.current) {
                      // Add check before accessing audioRef.current
                      audioRef.current.currentTime = 0;
                      audioRef.current.src = null;
                    }
                    setAudioURL(null);
                    setData([]); // Clear song data
                    setPlaying(false); // Stop playing
                  }}
                  className="p-2 rounded-xl hover:bg-primary/10 transition-colors"
                  disabled={!values.music} // Disable close if no music is loaded
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </motion.div>
            </div>
          </div>
          <div className="w-full mb-4">
            {!duration || !values.music ? (
              <Skeleton className="h-2 w-full" />
            ) : (
              <div className="px-0.5 pt-0.5">
                <Slider
                  thumbClassName="h-4 w-4 bg-primary border-2 border-primary-foreground"
                  trackClassName="h-2 bg-primary/30 group-hover:bg-primary/50 transition-all duration-300"
                  onValueChange={handleSeek}
                  value={[currentTime]}
                  max={duration}
                  className="w-full group"
                />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
