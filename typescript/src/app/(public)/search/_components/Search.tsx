"use client";
import React from "react";
import { useEffect, useState } from "react";
import SongCard from "@/components/cards/song";
import AlbumCard from "@/components/cards/album";
import ArtistCard from "@/components/cards/artist";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Search as SearchIcon, Album, Mic2, Users } from "lucide-react";

interface Song {
  id: string;
  name: string;
  image: { url: string }[];
  artists: { primary: { id: string; name: string; image: { url: string }[] }[] };
  album: string;
}

interface AlbumData {
  id: string;
  name: string;
  image: { url: string }[];
  album: string;
  artists: { primary: { name: string }[] };
  language: string;
  description?: string;
}

interface Artist {
  id: string;
  name: string;
  image: { url: string }[];
}

interface SearchProps {
  params: {
    id: string;
  };
}

export default function Search({ params }: SearchProps) {
  const query = params.id;
  const [artists, setArtists] = useState<Song[]>([]); // Artists data is derived from song results
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<AlbumData[]>([]);

  const getSongs = async () => {
    try {
      const get = await fetch(`http://localhost:3000/api/search/songs?query=${query}`);
      const data = await get.json();
      if (data?.data?.results) {
        setSongs(data.data.results);
        setArtists(data.data.results); // Using song results to extract artist data
      } else {
        setSongs([]);
        setArtists([]);
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
      setSongs([]);
      setArtists([]);
    }
  };

  const getAlbum = async () => {
    try {
      const get = await fetch(`http://localhost:3000/api/search/albums?query=${query}`);
      const data = await get.json();
      if (data?.data?.results) {
        setAlbums(data.data.results);
      } else {
        setAlbums([]);
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
      setAlbums([]);
    }
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
            Showing results for "{decodeURIComponent(query)}"
          </motion.p>
        </div>
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
          <div className="flex items-center gap-3">
            <Mic2 className="w-4 h-4 text-primary" /> <h2 className="text-lg font-medium">Songs</h2>
          </div>
          <ScrollArea className="rounded-xl pb-4">
            <motion.div className="flex gap-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              {songs.length > 0 ? (
                songs.map((song, index) => (
                  <motion.div key={song.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                    <SongCard id={song.id} image={song.image[2]?.url} artist={song.artists.primary[0]?.name || "unknown"} title={song.name} />
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
              {albums.length > 0 ? (
                albums.map((album, index) => (
                  <motion.div key={album.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                    <AlbumCard
                      lang={album.language}
                      desc={album.description || null}
                      id={`album/${album.id}`}
                      image={album.image[2]?.url}
                      title={album.name}
                      artist={album.artists.primary[0]?.name || "unknown"}
                    />
                  </motion.div>
                ))
              ) : (
                <AnimatePresence>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                      <AlbumCard />
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
                {[...new Set(artists.map(a => a.artists.primary[0]?.id))].map((id, index) => {
                  const artist = artists.find(a => a.artists.primary[0]?.id === id)?.artists.primary[0];
                  if (!artist) return null; // Handle cases where artist might be undefined
                  return (
                    <motion.div key={id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                      <ArtistCard
                        id={id}
                        image={
                          artist.image?.[2]?.url ||
                          `https://az-avatar.vercel.app/api/avatar/?bgColor=0f0f0f0&fontSize=60&text=${
                            artist.name?.split("")[0]?.toUpperCase() || "U"
                          }`
                        }
                        name={artist.name || "unknown"}
                      />
                    </motion.div>
                  );
                })}
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
