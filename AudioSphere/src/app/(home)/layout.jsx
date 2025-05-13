"use client";
import Link from "next/link";
import { useRef, useState, useEffect, useContext } from "react";
import { Input } from "@/components/ui/input";
import { AudioPlayerContext } from "@/hooks/use-context";
import { useAudioPlayer } from "@/components/providers/audio-player-provider";
import { Play, Pause, Repeat, Repeat1, X, Volume2, Volume1, VolumeX, ExternalLink, ChevronLeft, Share2, MenuIcon, SearchIcon } from "lucide-react";
import { IoPause } from "react-icons/io5";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
export default function RootLayout({ children }) {
  const path = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const linkRef = useRef();
  const inpRef = useRef();
  const handleSubmit = e => {
    e.preventDefault();
    if (!query) {
      router.push("/");
      return;
    }
    linkRef.current.click();
    inpRef.current.blur();
    setQuery("");
  };
  return (
    <main>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-primary/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <motion.div className="flex items-center gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Link href="/" className="select-none">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                  <motion.h1 className="text-2xl font-bold relative z-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    Audio
                    <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 0.7, x: 0 }} transition={{ delay: 0.2, duration: 0.3 }} className="font-medium text-primary">
                      Sphere
                    </motion.span>
                  </motion.h1>
                  <motion.div
                    className="absolute inset-0 blur-2xl bg-primary/20 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                  />
                </motion.div>
              </Link>
              {path !== "/" && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                  <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 hover:bg-primary/10" asChild>
                    <Link href="/">
                      <ChevronLeft className="w-4 h-4" /> <span>Back</span>
                    </Link>
                  </Button>
                </motion.div>
              )}
            </motion.div>
            <motion.div className="flex-1 max-w-xl px-4" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} className="w-full">
                <Link href={"/search/" + query} ref={linkRef}></Link>
                <form onSubmit={handleSubmit} className="relative w-full group">
                  <motion.div initial={false} animate={{ boxShadow: query ? "0 0 20px 2px rgba(var(--primary), 0.1)" : "none" }} className="relative rounded-2xl overflow-hidden backdrop-blur-sm">
                    <Input
                      ref={inpRef}
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      autoComplete="off"
                      type="search"
                      className="w-full h-10 pl-12 pr-4 bg-black/20 border border-primary/10 placeholder-muted-foreground/50 rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                      name="query"
                      placeholder="Search your favorite music..."
                    />
                    <motion.div className="absolute left-0 top-0 h-full flex items-center pl-4" initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                      <SearchIcon className="w-4 h-4 text-muted-foreground" />
                    </motion.div>
                    <AnimatePresence>
                      {query && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute right-0 top-0 h-full flex items-center pr-4">
                          <Button type="submit" size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-primary/10">
                            <motion.div initial={{ rotate: -90 }} animate={{ rotate: 0 }} transition={{ duration: 0.2 }}>
                              <SearchIcon className="w-3 h-3 text-primary" />
                            </motion.div>
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
            <motion.div className="flex items-center gap-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-primary/10">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="sm:hidden hover:bg-primary/10">
                <MenuIcon className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>
      {children}{" "}
      <footer className="py-5 backdrop-blur-3xl mt-8 px-6 md:px-20 lg:px-32">
        <div>
          <h1 className="text-xl font-bold">
            Audio<span className="text-primary">Sphere</span>
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Made with ♥ by
          <a className="underline text-primary hover:text-primary" href="https://github.com/ShovitDutta">
            Shovit Dutta
          </a>
        </p>
      </footer>{" "}
      <PlayerComponent />
    </main>
  );
}

// Player Component
function PlayerComponent() {
  const audioRef = useRef(null);
  const [data, setData] = useState([]);
  const [volume, setVolume] = useState(1);
  const values = useContext(AudioPlayerContext);
  const [duration, setDuration] = useState(0);
  const [audioURL, setAudioURL] = useState("");
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const controlVariants = { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, tap: { scale: 0.95 }, hover: { scale: 1.05 } };
  
  const getSong = async () => {
    const get = await fetch(`/api/songs?id=${values.music}`);
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
  
  const { current, setCurrent } = useAudioPlayer();
  
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
      audioRef.current.addEventListener("volumechange", handleVolumeChange);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
          audioRef.current.removeEventListener("volumechange", handleVolumeChange);
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
                    onClick={() => handleVolumeChange([volume === 0 ? 1 : 0])}>
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
                  disabled={!values.music}>
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
                      audioRef.current.currentTime = 0;
                      audioRef.current.src = null;
                    }
                    setAudioURL(null);
                    setData([]);
                    setPlaying(false);
                  }}
                  className="p-2 rounded-xl hover:bg-primary/10 transition-colors"
                  disabled={!values.music}>
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
