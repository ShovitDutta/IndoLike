"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Search() {
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
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} className="w-full">
      <Link href={"/search/" + query} ref={linkRef}></Link>
      <form onSubmit={handleSubmit} className="relative w-full group">
        <motion.div
          initial={false}
          animate={{
            boxShadow: query ? "0 0 20px 2px rgba(var(--primary), 0.1)" : "none",
          }}
          className="relative rounded-2xl overflow-hidden backdrop-blur-sm">
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
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute right-0 top-0 h-full flex items-center pr-4">
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
  );
}
