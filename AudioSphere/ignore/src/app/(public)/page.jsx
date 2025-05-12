"use client";
import { useEffect, useState } from "react";
import SongCard from "@/components/cards/song";
import AlbumCard from "@/components/cards/album";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import TrendingHero from "@/components/page/trending-hero";

export default function Page() {
  const [latest, setLatest] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [popular, setPopular] = useState([]);
  const getSongs = async (e, type) => {
    const get = await fetch(`http://localhost:3000/api/search/songs?query=${e}`);
    const data = await get.json();
    if (type === "latest") setLatest(data.data.results);
    else if (type === "popular") setPopular(data.data.results);
  };
  const getAlbum = async () => {
    const get = await fetch(`http://localhost:3000/api/search/albums?query=latest`);
    const data = await get.json();
    setAlbums(data.data.results);
  };
  useEffect(() => {
    getSongs("latest", "latest");
    getSongs("trending", "popular");
    getAlbum();
  }, []);
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-0 py-10">
      <div className="space-y-12">
        <TrendingHero /> {/* Add the TrendingHero component here */}
        <div className="container mx-auto px-4 py-8">
          {/* Add container back for other sections */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex flex-col gap-1 mb-6">
              <motion.h1 className="text-2xl font-semibold tracking-tight" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                Latest Songs
              </motion.h1>
              <motion.p className="text-sm text-muted-foreground/80" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                Discover the freshest beats and newest releases
              </motion.p>
            </div>

            <ScrollArea className="rounded-xl pb-4">
              <motion.div className="flex gap-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                {latest.length
                  ? latest.slice().map((song, index) => (
                      <motion.div key={song.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                        <SongCard image={song.image[2].url} album={song.album} title={song.name} artist={song.artists.primary[0].name} id={song.id} />
                      </motion.div>
                    ))
                  : Array.from({ length: 10 }).map((_, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                        <SongCard />
                      </motion.div>
                    ))}
              </motion.div>
              <ScrollBar orientation="horizontal" className="hidden sm:flex" />
            </ScrollArea>
          </motion.section>
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <div className="flex flex-col gap-1 mb-6">
              <motion.h1 className="text-2xl font-semibold tracking-tight" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                Latest Albums
              </motion.h1>
              <motion.p className="text-sm text-muted-foreground/80" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                Explore complete collections from your favorite artists
              </motion.p>
            </div>

            <ScrollArea className="rounded-xl pb-4">
              <motion.div className="flex gap-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
                {albums.length
                  ? albums.slice().map((album, index) => (
                      <motion.div key={album.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                        <AlbumCard lang={album.language} image={album.image[2].url} album={album.album} title={album.name} artist={album.artists.primary[0].name} id={`album/${album.id}`} />
                      </motion.div>
                    ))
                  : Array.from({ length: 10 }).map((_, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                        <AlbumCard />
                      </motion.div>
                    ))}
              </motion.div>
              <ScrollBar orientation="horizontal" className="hidden sm:flex" />
            </ScrollArea>
          </motion.section>
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
            <div className="flex flex-col gap-1 mb-6">
              <motion.h1 className="text-2xl font-semibold tracking-tight" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2 }}>
                Popular Songs
              </motion.h1>
              <motion.p className="text-sm text-muted-foreground/80" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3 }}>
                Top trending tracks loved by millions
              </motion.p>
            </div>

            <ScrollArea className="rounded-xl pb-4">
              <motion.div className="flex gap-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 }}>
                {popular.length
                  ? popular.slice().map((song, index) => (
                      <motion.div key={song.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                        <SongCard image={song.image[2].url} album={song.album} title={song.name} artist={song.artists.primary[0].name} id={song.id} />
                      </motion.div>
                    ))
                  : Array.from({ length: 10 }).map((_, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                        <SongCard />
                      </motion.div>
                    ))}
              </motion.div>
              <ScrollBar orientation="horizontal" className="hidden sm:flex" />
            </ScrollArea>
          </motion.section>
        </div>
      </div>
    </motion.main>
  );
}
