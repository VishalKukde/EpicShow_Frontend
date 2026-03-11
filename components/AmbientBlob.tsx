"use client";

import { motion } from "framer-motion";

export default function AmbientBlobs() {
  const blobs = [
    {
      size: 420,
      color: "bg-indigo-300/30",
      top: "-10px",
      left: "-100px",
      duration: 22,
    },
    {
      size: 420,
      color: "bg-indigo-300/30",
      top: "15%",
      right: "-100px",
      duration: 23,
    },
    {
      size: 420,
      color: "bg-blue-300/30",
      top: "28%",
      left: "-100px",
      duration: 24,
    },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${blob.color}`}
          style={{
            width: blob.size,
            height: blob.size,
            top: blob.top,
            left: blob.left,
            right: blob.right,
          }}
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: blob.duration,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
