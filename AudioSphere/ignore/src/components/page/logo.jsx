"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Logo() {
  return (
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
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </motion.div>
    </Link>
  );
}
