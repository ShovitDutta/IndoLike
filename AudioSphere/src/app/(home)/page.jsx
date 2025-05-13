"use client";
import { motion } from "framer-motion";
import { HeartIcon } from "lucide-react";
import { useEffect, useState } from "react";
import SongCard from "@/components/cards/song";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import AlbumCard from "@/components/cards/album";
import { useMusic } from "@/components/providers/music-provider";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Page() {
  const [latest, setLatest] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [popular, setPopular] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setMusic } = useMusic();

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

  const getTrendingSongs = async () => {
    const get = await fetch(`http://localhost:3000/api/search/songs?query=trending`);
    const data = await get.json();
    if (data.data && data.data.results) {
      setTrendingSongs(data.data.results);
    }
  };

  useEffect(() => {
    getSongs("latest", "latest");
    getSongs("trending", "popular");
    getAlbum();
    getTrendingSongs(); // Fetch trending songs
  }, []);

  useEffect(() => {
    if (trendingSongs.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex === trendingSongs.length - 1 ? 0 : prevIndex + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [trendingSongs]);

  const currentSong = trendingSongs[currentIndex];

  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-0 py-10">
      <div className="space-y-12">
        {/* Trending Hero Section */}
        <div className="relative w-full h-[600px] rounded-xl overflow-hidden">
          <AnimatePresence initial={false}>
            {currentSong && (
              <motion.div
                key={currentSong.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${currentSong.image[2].url})` }}>
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${currentSong.image[2].url})`, filter: "blur(2px)" }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-red-800/20"></div>
                <div className="absolute bottom-8 left-8 text-white z-10">
                  <motion.p className="text-lg font-semibold" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    Trending New Hits
                  </motion.p>
                  <motion.h2 className="text-5xl font-bold mt-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    {currentSong.name}
                  </motion.h2>
                  <motion.p className="text-xl mt-1 text-muted-foreground/80" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    {currentSong.artists.primary[0].name} {currentSong.playCount ? ` • ${Math.round(currentSong.playCount / 1000)} K` : ""}
                  </motion.p>
                  <motion.div className="flex gap-4 mt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setMusic(currentSong.id)}>
                      Listen Now
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-600 border-red-600 bg-transparent hover:bg-red-600/20">
                      <HeartIcon className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {trendingSongs.length > 1 && (
            <div className="absolute bottom-4 right-8 z-20 flex gap-2">
              {trendingSongs.map((_, index) => (
                <button key={index} className={`w-2.5 h-2.5 rounded-full ${currentIndex === index ? "bg-red-600" : "bg-white/50"}`} onClick={() => setCurrentIndex(index)}></button>
              ))}
            </div>
          )}
        </div>
        {/* End Trending Hero Section */}

        <div className="container mx-auto px-4 py-8">
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
