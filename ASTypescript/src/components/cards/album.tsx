"use client";

import Link from "next/link";
import { Badge } from "../ui/badge";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";

// Define the type for the props of the AlbumCard component
interface AlbumCardProps {
  title?: string;
  image?: string;
  artist?: string;
  id?: string; // Assuming id is always a string when present
  desc?: string | null; // Description can be a string, null, or undefined
  lang?: string; // Language can be a string or undefined
}

export default function AlbumCard({ title, image, artist, id, desc, lang }: AlbumCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="group relative h-fit w-[280px] p-3">
      <div className="relative overflow-hidden rounded-xl bg-card/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-card/60">
        <div className="aspect-square overflow-hidden rounded-lg">
          {/* Render image or skeleton based on image prop */}
          {image ? (
            <Link href={`/${id}`}>
              {" "}
              {/* Ensure id is present if linking */}
              <div className="relative">
                <img src={image} alt={title} className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105" />
                <motion.div initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="rounded-full bg-primary p-3">
                    <Play className="h-6 w-6 fill-primary-foreground" />
                  </motion.div>
                </motion.div>
              </div>
            </Link>
          ) : (
            <Skeleton className="aspect-square w-full" />
          )}
        </div>
        <div className="p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {/* Render title or skeleton based on title prop */}
            {title ? (
              <Link href={`/${id}`}>
                {" "}
                {/* Ensure id is present if linking */}
                <h2 className="line-clamp-1 font-semibold tracking-tight hover:text-primary transition-colors">{title}</h2>
              </Link>
            ) : (
              <Skeleton className="w-[70%] h-4" />
            )}
            {/* Render description if present and not null */}
            {desc && <p className="line-clamp-2 text-sm text-muted-foreground mt-1">{desc}</p>}
            {/* Render artist and optional language badge based on artist prop */}
            {artist ? (
              <div className="mt-2 space-y-1">
                <p className="text-sm text-muted-foreground">{artist}</p>
                {/* Render language badge if present */}
                {lang && (
                  <Badge variant="outline" className="font-normal bg-primary/10 text-primary hover:bg-primary/20">
                    {lang}
                  </Badge>
                )}
              </div>
            ) : (
              <Skeleton className="w-20 h-3 mt-2" />
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
