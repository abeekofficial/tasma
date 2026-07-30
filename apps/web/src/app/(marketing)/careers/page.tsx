"use client";

import { motion } from "framer-motion";
import { Briefcase, Globe, Heart, BookOpen, Coffee, Cpu, ArrowRight } from "lucide-react";

export default function CareersPage() {
  const benefits = [
    { icon: Globe, title: "Work Anywhere", description: "Fully remote positions with flexible hours across multiple time zones." },
    { icon: Heart, title: "Health & Wellness", description: "Comprehensive premium health coverage for you and your dependents." },
    { icon: BookOpen, title: "Learning Stipend", description: "Annual budget for courses, books, and professional conferences." },
    { icon: Coffee, title: "Home Office Setup", description: "Generous allowance to build your perfect ergonomic workspace." },
    { icon: Briefcase, title: "Unlimited PTO", description: "Take the time you need to recharge, with minimums enforced." },
    { icon: Cpu, title: "Latest Hardware", description: "Choose your preferred top-tier gear, replaced every three years." }
  ];

  const positions = [
    { id: 1, role: "Senior Frontend Engineer", department: "Engineering", location: "Remote - Global", type: "Full-time" },
    { id: 2, role: "AI Researcher", department: "Research", location: "Remote - US/EU", type: "Full-time" },
    { id: 3, role: "Product Designer", department: "Design", location: "San Francisco, CA / Remote", type: "Full-time" },
    { id: 4, role: "Developer Advocate", department: "Marketing", location: "Remote - Global", type: "Full-time" },
    { id: 5, role: "Systems Engineer", department: "Infrastructure", location: "Remote - Global", type: "Full-time" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 pt-24 pb-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto space-y-32">
        {/* Hero Section */}
        <motion.section 
          className="text-center max-w-4xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Build the future with us
          </h1>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            We're on a mission to redefine digital infrastructure. Join a passionate team of builders, creators, and problem solvers.
          </p>
          <div className="pt-4">
            <button className="px-8 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-transform hover:scale-105 active:scale-95">
              View Open Roles
            </button>
          </div>
        </motion.section>

        {/* Benefits Grid */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why work with us?</h2>
            <p className="text-zinc-600 dark:text-zinc-400">We invest in our people so they can do their best work.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={benefit.title}
                className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <benefit.icon className="w-8 h-8 text-zinc-700 dark:text-zinc-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Open Positions</h2>
              <p className="text-zinc-600 dark:text-zinc-400">Find your next opportunity.</p>
            </div>
            <p className="text-sm font-medium text-zinc-500">{positions.length} open roles</p>
          </div>
          
          <div className="grid gap-4">
            {positions.map((job) => (
              <motion.a
                key={job.id}
                href={`#job-${job.id}`}
                className="group flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                    {job.role}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                    <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900">{job.department}</span>
                    <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900">{job.location}</span>
                    <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900">{job.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 transform duration-300">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
