"use client";

import { motion } from "framer-motion";
import { 
  Video, 
  Wand2, 
  Mic, 
  Layers, 
  Sparkles, 
  Zap,
  Play,
  Scissors,
  Music,
  Share2
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const features = [
  {
    icon: <Wand2 className="w-6 h-6 text-indigo-500" />,
    title: "AI Video Studio",
    description: "Transform text into stunning videos in seconds with our advanced AI generation engine."
  },
  {
    icon: <Scissors className="w-6 h-6 text-pink-500" />,
    title: "Smart Timeline Editor",
    description: "Intuitive drag-and-drop interface with AI-assisted trimming, transitions, and effects."
  },
  {
    icon: <Mic className="w-6 h-6 text-blue-500" />,
    title: "Neural Voice Cloning",
    description: "Generate hyper-realistic voiceovers in 50+ languages or clone your own voice."
  },
  {
    icon: <Music className="w-6 h-6 text-green-500" />,
    title: "Auto-Scoring",
    description: "AI automatically selects and syncs background music to match the emotional tone of your video."
  },
  {
    icon: <Layers className="w-6 h-6 text-purple-500" />,
    title: "Dynamic B-Roll",
    description: "Instantly fetch contextually relevant stock footage and B-roll to enhance your narrative."
  },
  {
    icon: <Share2 className="w-6 h-6 text-orange-500" />,
    title: "One-Click Publish",
    description: "Export directly to YouTube, TikTok, and Instagram in optimal formats and resolutions."
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden pt-24 pb-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 mb-24 max-w-6xl">
        <motion.div 
          className="text-center max-w-3xl mx-auto space-y-6"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Next-Gen Creation</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Everything you need to create <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-400">impossible videos.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400">
            A complete studio in your browser. From raw ideas to published masterpieces, all powered by breakthrough AI.
          </p>
        </motion.div>
      </section>

      {/* Interactive Workflow Diagram */}
      <section className="container mx-auto px-4 md:px-6 mb-32 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How it works</h2>
          <p className="text-slate-600 dark:text-slate-400">The most streamlined creation process ever built.</p>
        </div>

        <motion.div 
          className="relative grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Connecting lines for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-indigo-500/20 -translate-y-1/2 z-0" />

          {[
            { step: "01", title: "Write", desc: "Type your script or prompt", icon: <Wand2 className="w-8 h-8" /> },
            { step: "02", title: "Generate", desc: "AI creates the base video", icon: <Zap className="w-8 h-8" /> },
            { step: "03", title: "Refine", desc: "Edit on the smart timeline", icon: <Video className="w-8 h-8" /> }
          ].map((item, i) => (
            <motion.div 
              key={i}
              variants={fadeIn}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-900 shadow-xl dark:shadow-none border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-indigo-500 transition-all duration-300">
                <div className="text-indigo-500 dark:text-indigo-400">
                  {item.icon}
                </div>
              </div>
              <div className="text-sm font-mono text-indigo-500 mb-2">STEP {item.step}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="container mx-auto px-4 md:px-6 max-w-6xl">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              variants={fadeIn}
              className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-colors overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 md:px-6 mt-32 max-w-4xl text-center">
        <div className="p-12 rounded-3xl bg-gradient-to-b from-slate-900 to-black border border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-50" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to create?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto text-lg">
              Join thousands of creators who are already using our platform to produce stunning videos.
            </p>
            <button className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-slate-200 transition-colors inline-flex items-center gap-2">
              <Play className="w-5 h-5 fill-current" />
              Start creating for free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
