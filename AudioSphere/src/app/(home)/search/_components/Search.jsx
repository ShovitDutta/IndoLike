"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AudioPlayerContext } from "@/hooks/use-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, PlayIcon, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useContext } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Search as SearchIcon, Album, Mic2, Users } from "lucide-react";
// Song Card Component
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

// Album Card Component
function AlbumCard({ title, image, artist, id, desc, lang }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="group relative h-fit w-[280px] p-3">
      <div className="relative overflow-hidden rounded-xl bg-card/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-card/60">
        <div className="aspect-square overflow-hidden rounded-lg">
          {image ? (
            <Link href={`/album/${id}`}>
              <div className="relative">
                <img src={image} alt={title} className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105" />
                <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="rounded-full bg-primary p-3">
                    <Play className="h-6 w-6 fill-primary-foreground" />
                  </motion.div>
                </motion.div>
              </div>
            </Link>
          ) : (
            <Skeleton className="aspect-square w-full" />
          )}
        </div>
        <div className="p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {title ? (
              <Link href={`/album/${id}`}>
                <h2 className="line-clamp-1 font-semibold tracking-tight hover:text-primary transition-colors">{title}</h2>
              </Link>
            ) : (
              <Skeleton className="w-[70%] h-4" />
            )}
            {desc && <p className="line-clamp-2 text-sm text-muted-foreground mt-1">{desc}</p>}
            {artist ? (
              <div className="mt-2 space-y-1">
                <p className="text-sm text-muted-foreground">{artist}</p>
                {lang && (
                  <Badge variant="outline" className="font-normal bg-primary/10 text-primary hover:bg-primary/20">
                    {lang}
                  </Badge>
                )}
              </div>
            ) : (
              <Skeleton className="w-20 h-3 mt-2" />
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Artist Card Component
function ArtistCard({ image, name, id }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.05 }} className="group relative h-fit w-[280px] p-3">
      <Link href={"/search/" + `${encodeURI(name.toLowerCase().split(" ").join("+"))}`}>
        <div className="relative aspect-square w-full">
          <div className="overflow-hidden rounded-2xl bg-card/40 backdrop-blur-sm">
            <motion.div className="w-full h-full" whileHover={{ scale: 1.15 }} transition={{ duration: 0.4 }}>
              <img src={image} alt={name} className="h-full w-full object-cover transition-all duration-300" />
            </motion.div>
          </div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}>
            <div className="absolute bottom-3 left-3">
              <motion.div className="bg-primary/90 p-2 rounded-full" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <PlayIcon className="w-4 h-4 text-primary-foreground" />
              </motion.div>
            </div>
          </motion.div>
        </div>
        <motion.div className="mt-3 text-center px-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="font-medium text-sm truncate group-hover:text-primary transition-colors">{name}</h2> <p className="text-xs text-muted-foreground mt-0.5">Artist</p>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function Search({ params }) {
  const query = params.id;
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const getSongs = async () => {
    const get = await fetch(`http://localhost:3000/api/search/songs?query=${query}`);
    const data = await get.json();
    setSongs(data.data.results);
    setArtists(data.data.results);
  };
  const getAlbum = async () => {
    const get = await fetch(`http://localhost:3000/api/search/albums?query=${query}`);
    const data = await get.json();
    setAlbums(data.data.results);
  };
  useEffect(() => {
    getSongs();
    getAlbum();
  }, [params.id]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
        <div className="flex flex-col gap-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <SearchIcon className="w-5 h-5 text-primary" /> <h1 className="text-2xl font-semibold tracking-tight">Search Results</h1>
          </motion.div>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-sm text-muted-foreground/80">
            Showing results for "{decodeURI(query)}"
          </motion.p>
        </div>
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
          <div className="flex items-center gap-3">
            <Mic2 className="w-4 h-4 text-primary" /> <h2 className="text-lg font-medium">Songs</h2>
          </div>
          <ScrollArea className="rounded-xl pb-4">
            <motion.div className="flex gap-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              {songs.length ? (
                songs.map((song, index) => (
                  <motion.div key={song.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                    <SongCard id={song.id} image={song.image[2].url} artist={song.artists.primary[0]?.name || "unknown"} title={song.name} />
                  </motion.div>
                ))
              ) : (
                <AnimatePresence>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                      <SongCard />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
            <ScrollBar orientation="horizontal" className="hidden sm:flex" />
          </ScrollArea>
        </motion.section>
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-6">
          <div className="flex items-center gap-3">
            <Album className="w-4 h-4 text-primary" /> <h2 className="text-lg font-medium">Albums</h2>
          </div>
          <ScrollArea className="rounded-xl pb-4">
            <motion.div className="flex gap-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              {albums.length ? (
                albums.map((album, index) => (
                  <motion.div key={album.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="group relative h-fit w-[280px] p-3">
                      <div className="relative overflow-hidden rounded-xl bg-card/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-card/60">
                        <div className="aspect-square overflow-hidden rounded-lg">
                          {album.image[2].url ? (
                            <Link href={`/album/${album.id}`}>
                              <div className="relative">
                                <img src={album.image[2].url} alt={album.name} className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105" />
                                <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity">
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="rounded-full bg-primary p-3">
                                    <Play className="h-6 w-6 fill-primary-foreground" />
                                  </motion.div>
                                </motion.div>
                              </div>
                            </Link>
                          ) : (
                            <Skeleton className="aspect-square w-full" />
                          )}
                        </div>
                        <div className="p-4">
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                            {album.name ? (
                              <Link href={`/album/${album.id}`}>
                                <h2 className="line-clamp-1 font-semibold tracking-tight hover:text-primary transition-colors">{album.name}</h2>
                              </Link>
                            ) : (
                              <Skeleton className="w-[70%] h-4" />
                            )}
                            {album.description && <p className="line-clamp-2 text-sm text-muted-foreground mt-1">{album.description}</p>}
                            {album.artists.primary[0]?.name ? (
                              <div className="mt-2 space-y-1">
                                <p className="text-sm text-muted-foreground">{album.artists.primary[0]?.name}</p>
                                {album.language && (
                                  <Badge variant="outline" className="font-normal bg-primary/10 text-primary hover:bg-primary/20">
                                    {album.language}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <Skeleton className="w-20 h-3 mt-2" />
                            )}
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))
              ) : (
                <AnimatePresence>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} whileHover={{ y: -5 }}>
                        <div className="relative overflow-hidden rounded-xl bg-card/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-card/60">
                          <div className="aspect-square overflow-hidden rounded-lg">
                            <Skeleton className="aspect-square w-full" />
                          </div>
                          <div className="p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                              <Skeleton className="w-[70%] h-4" />
                              <Skeleton className="w-20 h-3 mt-2" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
            <ScrollBar orientation="horizontal" className="hidden sm:flex" />
          </ScrollArea>
        </motion.section>
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="space-y-6">
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-primary" /> <h2 className="text-lg font-medium">Artists</h2>
          </div>
          <ScrollArea className="rounded-xl pb-4">
            {artists.length > 0 ? (
              <motion.div className="flex gap-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                {[...new Set(artists.map(a => a.artists.primary[0]?.id))].map((id, index) => (
                  <motion.div key={id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }} className="group relative h-fit w-[280px] p-3">
                    <Link
                      href={
                        "/search/" +
                        `${encodeURI(
                          artists
                            .find(a => a.artists.primary[0]?.id === id)
                            .artists?.primary[0]?.name.toLowerCase()
                            .split(" ")
                            .join("+"),
                        )}`
                      }>
                      <div className="relative aspect-square w-full">
                        <div className="overflow-hidden rounded-2xl bg-card/40 backdrop-blur-sm">
                          <motion.div className="w-full h-full" whileHover={{ scale: 1.15 }} transition={{ duration: 0.4 }}>
                            <img
                              src={
                                artists.find(a => a.artists.primary[0]?.id === id).artists.primary[0]?.image[2]?.url ||
                                `https://az-avatar.vercel.app/api/avatar/?bgColor=0f0f0f0&fontSize=60&text=${
                                  artists
                                    .find(a => a.artists.primary[0]?.id === id)
                                    .artists.primary[0]?.name.split("")[0]
                                    .toUpperCase() || "U"
                                }`
                              }
                              alt={artists.find(a => a.artists.primary[0]?.id === id).artists?.primary[0]?.name || "unknown"}
                              className="h-full w-full object-cover transition-all duration-300"
                            />
                          </motion.div>
                        </div>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}>
                          <div className="absolute bottom-3 left-3">
                            <motion.div className="bg-primary/90 p-2 rounded-full" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                              <PlayIcon className="w-4 h-4 text-primary-foreground" />
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                      <motion.div className="mt-3 text-center px-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <h2 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                          {artists.find(a => a.artists.primary[0]?.id === id).artists?.primary[0]?.name || "unknown"}
                        </h2>{" "}
                        <p className="text-xs text-muted-foreground mt-0.5">Artist</p>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div className="flex gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="flex flex-col items-center gap-2">
                    <Skeleton className="h-[120px] w-[120px] rounded-2xl" /> <Skeleton className="h-4 w-20" />
                  </motion.div>
                ))}
              </motion.div>
            )}
            <ScrollBar orientation="horizontal" className="hidden sm:flex" />
          </ScrollArea>
        </motion.section>
      </motion.div>
    </motion.div>
  );
}
