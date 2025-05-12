"use client";

import { Home, Search, Music, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function MobileMenu() {
  const menuItems = [
    { icon: <Home className="w-5 h-5" />, href: "/", label: "Home" },
    { icon: <Search className="w-5 h-5" />, href: "/search/latest", label: "Search" },
    { icon: <Music className="w-5 h-5" />, href: "/library", label: "Library" },
    { icon: <User className="w-5 h-5" />, href: "/profile", label: "Profile" },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="fixed z-50 bottom-0 left-0 right-0 flex items-center justify-center px-4 pb-6">
      <motion.div className="flex bg-black/40 backdrop-blur-lg justify-between w-full max-w-md gap-3 items-center p-3 rounded-2xl border border-primary/20 shadow-xl shadow-primary/10">
        {menuItems.map((item, index) => (
          <motion.div key={item.href} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link className="flex flex-col items-center justify-center gap-1 text-foreground/70 hover:text-primary transition-colors" href={item.href}>
              <div className="p-2 rounded-xl bg-primary/10 backdrop-blur-sm">{item.icon}</div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
