"use client";

import { motion } from "framer-motion";

// Dummy data
const changelogData = [
  {
    version: "v2.1.0",
    date: "July 28, 2026",
    title: "AI Subtitles 2.0 & Custom Vocabulary",
    description: "We've completely overhauled our transcription engine. It now supports custom vocabulary, allowing you to train the AI on industry-specific terms, acronyms, and proper nouns unique to your business.",
    changes: [
      { type: "Feature", text: "Introduced Custom Vocabulary API for enterprise customers." },
      { type: "Feature", text: "Added support for 12 new regional dialects in Spanish and Arabic." },
      { type: "Improvement", text: "Reduced transcription latency by 40% for files over 1GB." },
      { type: "Fix", text: "Resolved an issue where timestamps could drift slightly in 120fps video files." }
    ]
  },
  {
    version: "v2.0.4",
    date: "July 10, 2026",
    title: "SRT & VTT Export Enhancements",
    description: "Exporting your subtitles just got more flexible. We've added extensive styling options that carry over directly into your VTT exports, making it easier to maintain brand consistency in web players.",
    changes: [
      { type: "Feature", text: "Visual style editor for VTT exports (colors, fonts, background opacity)." },
      { type: "Improvement", text: "Bulk export functionality added to the dashboard." },
      { type: "Fix", text: "Fixed character encoding issues in Korean SRT exports." }
    ]
  },
  {
    version: "v2.0.0",
    date: "June 15, 2026",
    title: "The Next Generation of Tasma",
    description: "A monumental update to the Tasma platform. We've rewritten our core rendering pipeline from the ground up to support real-time 4K rendering directly in the browser.",
    changes: [
      { type: "Feature", text: "Real-time 4K preview engine using WebGL." },
      { type: "Feature", text: "New 'Magic Translate' feature: automatically translate and dub audio." },
      { type: "Feature", text: "Completely redesigned user interface built for speed and focus." },
      { type: "Improvement", text: "Upgraded all internal AI models to our proprietary T-Series architecture." }
    ]
  },
  {
    version: "v1.8.2",
    date: "May 22, 2026",
    title: "Workspace Collaboration & Roles",
    description: "Working with a team? You can now invite members to your workspace with granular permission controls.",
    changes: [
      { type: "Feature", text: "Role-based access control (Admin, Editor, Viewer)." },
      { type: "Feature", text: "Time-synced comments on video timelines." },
      { type: "Improvement", text: "Audit logs available for enterprise workspaces." }
    ]
  }
];

const getTagColor = (type: string) => {
  switch (type) {
    case "Feature":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
    case "Improvement":
      return "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20";
    case "Fix":
      return "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20";
    default:
      return "bg-zinc-100 text-zinc-800 dark:bg-zinc-500/10 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/20";
  }
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-50 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6"
          >
            Changelog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            New updates, features, and improvements to the Tasma platform.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-4 md:ml-0 md:pl-8 space-y-24">
          {changelogData.map((release, index) => (
            <motion.div 
              key={release.version}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute -left-5 md:-left-[41px] top-1.5 w-10 h-10 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-black" />
              </div>

              <div className="pl-6 md:pl-0">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                  <h2 className="text-2xl font-semibold">{release.title}</h2>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md text-sm font-mono bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
                      {release.version}
                    </span>
                    <span className="text-zinc-500 text-sm">
                      {release.date}
                    </span>
                  </div>
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-8 leading-relaxed">
                  {release.description}
                </p>

                <ul className="space-y-4">
                  {release.changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-4 text-zinc-700 dark:text-zinc-300">
                      <span className={`mt-0.5 px-2.5 py-0.5 rounded text-xs font-medium border ${getTagColor(change.type)}`}>
                        {change.type}
                      </span>
                      <span className="flex-1 leading-relaxed">{change.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
