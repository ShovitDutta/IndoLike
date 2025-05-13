"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import Player from "@/components/cards/player";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, Share2, MenuIcon, SearchIcon } from "lucide-react";
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
      <Player />
    </main>
  );
}
