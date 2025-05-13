"use client";

import { useEffect, useState } from "react";
import SongCard from "@/components/cards/song";
import AlbumCard from "@/components/cards/album";
import ArtistCard from "@/components/cards/artist";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Search as SearchIcon, Album, Mic2, Users } from "lucide-react";

interface Image {
  url: string;
  quality: string;
}

interface Artist {
  id?: string;
  name: string;
  image?: Image[];
}

interface Song {
  id: string;
  image: Image[];
  album?: { id: string; name: string };
  name: string;
  artists: {
    primary: Artist[];
  };
}

interface Album {
  id: string;
  language?: string;
  image: Image[];
  album?: string;
  name: string;
  artists: {
    primary: Artist[];
  };
  description?: string | null;
}

interface SearchProps {
  params: {
    id: string;
  };
}

export default function Search({ params }: SearchProps) {
  const query = params.id;
  const [artists, setArtists] = useState<Song[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    const getSongs = async (): Promise<void> => {
      try {
        const get = await fetch(`http://localhost:3000/api/search/songs?query=${query}`);
        if (!get.ok) {
          console.error(`Failed to fetch songs for query "${query}": ${get.status}`);
          return;
        }
        const data: { data: { results: Song[] } } = await get.json();
        setSongs(data.data.results);
        setArtists(data.data.results);
      } catch (error) {
        console.error(`Error fetching songs for query "${query}":`, error);
      }
    };

    const getAlbum = async (): Promise<void> => {
      try {
        const get = await fetch(`http://localhost:3000/api/search/albums?query=${query}`);
        if (!get.ok) {
          console.error(`Failed to fetch albums for query "${query}": ${get.status}`);
          return;
        }
        const data: { data: { results: Album[] } } = await get.json();
        setAlbums(data.data.results);
      } catch (error) {
        console.error(`Error fetching albums for query "${query}":`, error);
      }
    };

    getSongs();
    getAlbum();
  }, [query]); // Now only 'query' (derived from params.id) is needed in dependencies

  const uniqueArtists = Array.from(new Set(artists.map(song => song.artists.primary[0]?.id)))
    .map(artistId => artists.find(song => song.artists.primary[0]?.id === artistId)?.artists.primary[0])
    .filter((artist): artist is Artist => artist !== undefined);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
        <div className="flex flex-col gap-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <SearchIcon className="w-5 h-5 text-primary" /> <h1 className="text-2xl font-semibold tracking-tight">Search Results</h1>
          </motion.div>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-sm text-muted-foreground/80">
            Showing results for &quot;{decodeURI(query)}&quot;
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
            {uniqueArtists.length > 0 ? (
              <motion.div className="flex gap-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                {uniqueArtists.map((artist, index) => (
                  <motion.div key={artist.id || artist.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                    <ArtistCard
                      id={artist.id}
                      image={artist.image?.[2]?.url || `https://az-avatar.vercel.app/api/avatar/?bgColor=0f0f0f&fontSize=60&text=${artist.name.split("")[0]?.toUpperCase() || "U"}`}
                      name={artist.name || "unknown"}
                    />
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
