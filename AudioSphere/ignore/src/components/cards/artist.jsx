"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PlayIcon } from "lucide-react";

export default function ArtistCard({ image, name, id }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.05 }} className="group relative h-fit w-[280px] p-3">
      <Link href={"/search/" + `${encodeURI(name.toLowerCase().split(" ").join("+"))}`}>
        <div className="relative aspect-square w-full">
          <div className="overflow-hidden rounded-2xl bg-card/40 backdrop-blur-sm">
            <motion.div className="w-full h-full" whileHover={{ scale: 1.15 }} transition={{ duration: 0.4 }}>
              <img src={image} alt={name} className="h-full w-full object-cover transition-all duration-300" />
            </motion.div>
          </div>

          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}>
            <div className="absolute bottom-3 left-3">
              <motion.div className="bg-primary/90 p-2 rounded-full" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <PlayIcon className="w-4 h-4 text-primary-foreground" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div className="mt-3 text-center px-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="font-medium text-sm truncate group-hover:text-primary transition-colors">{name}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Artist</p>
        </motion.div>
      </Link>
    </motion.div>
  );
}
