"use client";
import { Badge } from "@/components/ui/badge";
import { AudioPlayerContext } from "@/hooks/use-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Album as AlbumIcon, Music, Play, Pause } from "lucide-react";
function SongCard({ title, image, artist, id, desc }) {
  const ids = useContext(AudioPlayerContext);
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
                {title.slice(0, 25)} {title.length > 25 && "..."}
              </motion.h2>
            ) : (
              <Skeleton className="w-[70%] h-4" />
            )}
            {desc && (
              <motion.p className="line-clamp-2 text-sm text-muted-foreground mt-1" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                {desc.slice(0, 60)} {desc.length > 60 && "..."}
              </motion.p>
            )}
            {artist && (
              <motion.p className="mt-2 text-sm text-muted-foreground/80" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                {artist.slice(0, 25)} {artist.length > 25 && "..."}
              </motion.p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Album({ id }) {
  const [data, setData] = useState([]);
  const getData = async () => {
    await fetch(`http://localhost:3000/api/albums?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setData(data.data);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {data.image ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
            <motion.div className="flex flex-col md:flex-row gap-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <motion.div className="relative group" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <motion.div className="relative aspect-square w-full md:w-[300px] overflow-hidden rounded-2xl bg-card/40 backdrop-blur-sm" whileHover="hover">
                  <motion.img src={data.image[2]?.url} alt={data.name} className="w-full h-full object-cover transition-transform duration-500" whileHover={{ scale: 1.1 }} />
                  <motion.div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
                <motion.div className="absolute bottom-4 left-4 right-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <Badge className="bg-primary/90 text-primary-foreground hover:bg-primary/80">
                    <AlbumIcon className="w-3 h-3 mr-1" /> {data.songCount} tracks
                  </Badge>
                </motion.div>
              </motion.div>
              <motion.div className="flex-1 space-y-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <div className="space-y-2">
                  <motion.h1 className="text-3xl font-bold tracking-tight" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    {data.name}
                  </motion.h1>
                  <motion.p className="text-muted-foreground/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    {data.description}
                  </motion.p>
                </div>
                <motion.div className="flex flex-wrap gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Music className="w-4 h-4" /> <span className="text-primary">{data.artists.primary.map(artist => artist.name).join(", ")}</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <Music className="w-4 h-4 text-primary" /> <h2 className="text-lg font-medium">Album Tracks</h2>
              </div>
              <ScrollArea className="rounded-xl pb-4">
                <motion.div className="flex gap-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                  {data.songs.map((song, index) => (
                    <motion.div key={song.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                      <SongCard image={song.image[2].url} title={song.name} artist={song.artists.primary[0].name} id={song.id} />
                    </motion.div>
                  ))}
                </motion.div>
                <ScrollBar orientation="horizontal" className="hidden sm:flex" />
              </ScrollArea>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              <Skeleton className="aspect-square w-full md:w-[300px] rounded-2xl" />
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-2/3" /> <Skeleton className="h-4 w-full" /> <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-24" /> <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-6 w-40" />
              <ScrollArea className="rounded-xl pb-4">
                <div className="flex gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                      <SongCard />
                    </motion.div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="hidden sm:flex" />
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
