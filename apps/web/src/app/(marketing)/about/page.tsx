"use client";

import { motion } from "framer-motion";
import { Code2, Target, Lightbulb, Users, Shield, Zap } from "lucide-react";

export default function AboutPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const values = [
    { icon: Lightbulb, title: "Innovation", description: "Pushing the boundaries of what's possible." },
    { icon: Users, title: "Collaboration", description: "Building together, growing together." },
    { icon: Shield, title: "Integrity", description: "Doing the right thing, always." },
    { icon: Zap, title: "Excellence", description: "Delivering the highest quality in everything." }
  ];

  const timeline = [
    { year: "2022", title: "Inception", description: "The idea was born out of a simple need." },
    { year: "2023", title: "Seed Funding", description: "Raised our first round to build the MVP." },
    { year: "2024", title: "Public Launch", description: "Opened our doors to the world." },
    { year: "2025", title: "Global Expansion", description: "Scaling our infrastructure globally." },
    { year: "2026", title: "The Future", description: "Continuing to innovate and lead." }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 pt-24 pb-16 px-6 sm:px-12 lg:px-24 selection:bg-zinc-200 dark:selection:bg-zinc-800">
      <div className="max-w-5xl mx-auto space-y-32">
        {/* Header */}
        <motion.section 
          className="text-center space-y-6"
          initial="initial"
          animate="animate"
          variants={fadeIn}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            We are building the foundation for the next generation of digital experiences. Fast, secure, and beautiful by default.
          </p>
        </motion.section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-12">
          <motion.div 
            className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Target className="w-10 h-10 text-zinc-900 dark:text-white mb-6" />
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              To democratize access to enterprise-grade software infrastructure, empowering developers and creators to build without limits.
            </p>
          </motion.div>
          <motion.div 
            className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Lightbulb className="w-10 h-10 text-zinc-900 dark:text-white mb-6" />
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A digital ecosystem where performance and design are not mutually exclusive, and where every great idea has the tools to succeed.
            </p>
          </motion.div>
        </section>

        {/* Core Values */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Values</h2>
            <p className="text-zinc-600 dark:text-zinc-400">The principles that guide our everyday decisions.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <motion.div 
                key={value.title}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <value.icon className="w-8 h-8 mb-4 text-zinc-700 dark:text-zinc-300" />
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-zinc-600 dark:text-zinc-400">How we got here.</p>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800 md:-translate-x-1/2" />
            <div className="space-y-12">
              {timeline.map((item, idx) => (
                <motion.div 
                  key={item.year}
                  className={`relative flex items-center gap-8 md:gap-0 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-zinc-900 dark:bg-white md:-translate-x-1.5 ring-4 ring-white dark:ring-zinc-950" />
                  <div className={`pl-12 md:pl-0 w-full md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 text-left'}`}>
                    <span className="text-sm font-mono text-zinc-500">{item.year}</span>
                    <h3 className="text-xl font-bold mt-1 mb-2">{item.title}</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="text-center space-y-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-4">
            <Code2 className="w-6 h-6" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Built with Modern Tech</h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            We leverage the best tools available to ensure reliability, performance, and developer experience. React, Next.js, Tailwind CSS, TypeScript, and more.
          </p>
        </section>
      </div>
    </div>
  );
}
