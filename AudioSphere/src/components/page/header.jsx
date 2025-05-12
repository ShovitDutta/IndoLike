"use client";
import Logo from "./logo";
import { Button } from "../ui/button";
import Search from "./search";
import { ChevronLeft, Share2, MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

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
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </Link>
                </Button>
              </motion.div>
            )}
          </motion.div>

          <motion.div className="flex-1 max-w-xl px-4" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Search />
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
  );
}
