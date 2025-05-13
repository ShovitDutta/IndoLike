"use client";

import Logo from "./logo";
import Link from "next/link";
import Search from "./search";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ChevronLeft, Share2, MenuIcon } from "lucide-react";

export default function Header() {
  const path = usePathname();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-primary/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <motion.div className="flex items-center gap-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Logo />
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
            <Search />
          </motion.div>
          <motion.div className="flex items-center gap-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            {/* Share button (assuming it will have an onClick handler) */}
            <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-primary/10" aria-label="Share">
              <Share2 className="w-4 h-4" />
            </Button>
            {/* Mobile menu button (assuming it will have an onClick handler) */}
            <Button variant="ghost" size="icon" className="sm:hidden hover:bg-primary/10" aria-label="Open menu">
              <MenuIcon className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
