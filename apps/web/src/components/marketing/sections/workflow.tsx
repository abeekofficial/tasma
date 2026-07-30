"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Ideate & Script",
    description: "Start with a prompt or script. Our AI suggests visuals, structures the narrative, and generates a base storyboard instantly.",
  },
  {
    num: "02",
    title: "Edit & Refine",
    description: "Jump into the timeline. Make precise cuts, adjust pacing, and apply effects with our intuitive, browser-native editor.",
  },
  {
    num: "03",
    title: "Render & Export",
    description: "Hit export and let our cloud GPUs handle the heavy lifting. Get your 4K video ready for distribution in minutes, not hours.",
  },
];

export function Workflow() {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-center">
          <div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              From Idea to Export, <br />
              <span className="bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                in Record Time.
              </span>
            </h2>
            <p className="mb-12 text-lg text-muted-foreground">
              We've streamlined the entire video production process so you can focus on creativity, not technical hurdles.
            </p>

            <div className="space-y-12">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  className="relative pl-12"
                >
                  <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {step.num}
                  </div>
                  {i !== steps.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-[-40px] w-px bg-border" />
                  )}
                  <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-border bg-card/50 shadow-2xl backdrop-blur-xl lg:h-[600px]"
          >
            {/* Abstract UI representation */}
            <div className="absolute inset-0 flex flex-col p-4">
              <div className="mb-4 flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 rounded-lg bg-background/50 border border-border/50" />
              <div className="mt-4 h-32 rounded-lg bg-background/50 border border-border/50 flex gap-2 p-2">
                <div className="h-full w-1/4 rounded bg-primary/20" />
                <div className="h-full w-1/2 rounded bg-primary/40" />
                <div className="h-full w-1/4 rounded bg-primary/20" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
