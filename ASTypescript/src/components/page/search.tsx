"use client";

import Link from "next/link";
import { Input } from "../ui/input"; // Assuming this component has its own types
import { Button } from "../ui/button"; // Assuming this component has its own types
import { SetStateAction, useRef, useState, type FormEvent } from "react";
import { Search as SearchIcon } from "lucide-react"; // Renamed import to avoid conflict with component name
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; // Import useRouter

export default function Search() {
  const [query, setQuery] = useState<string>("");
  // Type the refs
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const inpRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter(); // Get router instance

  // Type the event parameter
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!query.trim()) {
      // Use trim to check for empty or whitespace query
      router.push("/");
      return;
    }

    // Safely access and click the link element
    if (linkRef.current) {
      linkRef.current.click();
    }

    // Safely access and blur the input element
    if (inpRef.current) {
      inpRef.current.blur();
    }

    // setQuery(""); // Optionally clear the query after search
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} className="w-full">
      {/* Use ref on the Link component */}
      <Link href={"/search/" + encodeURIComponent(query.trim())} ref={linkRef}></Link> {/* Use encodeURIComponent for the query */}
      <form onSubmit={handleSubmit} className="relative w-full group">
        <motion.div initial={false} animate={{ boxShadow: query.trim() ? "0 0 20px 2px rgba(var(--primary), 0.1)" : "none" }} className="relative rounded-2xl overflow-hidden backdrop-blur-sm">
          <Input
            ref={inpRef}
            value={query}
            onChange={(e: { target: { value: SetStateAction<string> } }) => setQuery(e.target.value)}
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
            {query.trim() && ( // Conditionally render button if query is not empty
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute right-0 top-0 h-full flex items-center pr-4">
                <Button type="submit" size="icon" variant="ghost" className="h-7 w-7 rounded-full hover:bg-primary/10" aria-label="Initiate search">
                  {" "}
                  {/* Added aria-label */}
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
