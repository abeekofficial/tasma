"use client";

import { motion } from "framer-motion";

const logos = [
  "Acme Corp",
  "Globex",
  "Soylent",
  "Initech",
  "Umbrella",
  "Stark Ind",
  "Wayne Ent",
  "Cyberdyne",
];

export function Integrations() {
  return (
    <section className="overflow-hidden border-y border-border/50 bg-background/50 py-12 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6 mb-8 text-center">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          Trusted by modern teams worldwide
        </p>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />
        
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30,
          }}
        >
          {/* Double the logos to create seamless loop */}
          {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
            <div
              key={i}
              className="mx-8 flex items-center justify-center text-xl font-bold text-muted-foreground/40 transition-colors hover:text-muted-foreground md:mx-16 md:text-2xl"
            >
              {logo}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
