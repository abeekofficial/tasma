"use client";

import { motion } from "framer-motion";
import { Zap, Video, Sparkles, Layers, Cpu, CloudLightning } from "lucide-react";

const features = [
  {
    title: "AI Generation",
    description: "Generate high-quality B-roll, voiceovers, and transitions instantly with advanced LLMs.",
    icon: Sparkles,
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "GPU Acceleration",
    description: "Render complex timelines in real-time leveraging cutting-edge cloud GPUs.",
    icon: Cpu,
    className: "md:col-span-1",
  },
  {
    title: "Advanced Timeline",
    description: "A professional non-linear editor built for the browser with sub-frame precision.",
    icon: Layers,
    className: "md:col-span-1",
  },
  {
    title: "Smart Trimming",
    description: "Automatically remove silences and filler words with one click.",
    icon: Zap,
    className: "md:col-span-1",
  },
  {
    title: "Video Upscaling",
    description: "Enhance low-res footage up to 4K using our proprietary neural networks.",
    icon: Video,
    className: "md:col-span-1 md:row-span-2",
  },
  {
    title: "Cloud Sync",
    description: "Collaborate seamlessly with your team. Project states are synced instantly.",
    icon: CloudLightning,
    className: "md:col-span-2",
  },
];

export function Features() {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need. <br className="hidden md:block" />
            <span className="text-muted-foreground">Nothing you don't.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-3 lg:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 ${feature.className}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative z-10 flex h-full flex-col">
                <feature.icon className="mb-6 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-xl font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-auto text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
