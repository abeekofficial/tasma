"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

// Dummy data
const featuredPost = {
  title: "Announcing Tasma 2.0: The Future of AI Video Subtitling",
  excerpt: "Today we are thrilled to announce the next major version of Tasma. With our new advanced AI models, subtitling is now 10x faster and more accurate than ever before. Experience real-time translation in over 50 languages.",
  category: "Product News",
  date: "July 12, 2026",
  readTime: "5 min read",
  author: {
    name: "Alex Reed",
    avatar: "https://i.pravatar.cc/150?u=alex",
  },
  slug: "announcing-tasma-2",
};

const posts = [
  {
    title: "How to Optimize Your Video Content for Global Audiences",
    excerpt: "Reaching a global audience requires more than just good content. Learn how strategic subtitling and localization can increase your view count by up to 300%.",
    category: "Guides",
    date: "June 28, 2026",
    readTime: "8 min read",
    author: {
      name: "Sarah Jenkins",
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    slug: "optimize-video-content-global",
  },
  {
    title: "The Evolution of Speech-to-Text Technology",
    excerpt: "Take a deep dive into the neural networks powering modern speech recognition and how they've drastically reduced word error rates over the past decade.",
    category: "Engineering",
    date: "June 15, 2026",
    readTime: "12 min read",
    author: {
      name: "Dr. Chen Wei",
      avatar: "https://i.pravatar.cc/150?u=chen",
    },
    slug: "evolution-speech-to-text",
  },
  {
    title: "Why Accessibility is Crucial for Modern SaaS",
    excerpt: "Accessibility isn't just a legal requirement; it's a fundamental part of building a great user experience. Here's why every SaaS company needs to prioritize it.",
    category: "Opinion",
    date: "May 30, 2026",
    readTime: "6 min read",
    author: {
      name: "Elena Rodriguez",
      avatar: "https://i.pravatar.cc/150?u=elena",
    },
    slug: "accessibility-crucial-modern-saas",
  },
  {
    title: "Case Study: How Voxel Media Scaled Production with Tasma",
    excerpt: "Discover how a leading digital media agency cut their post-production time in half by integrating our automated subtitling API into their workflow.",
    category: "Customer Stories",
    date: "May 14, 2026",
    readTime: "4 min read",
    author: {
      name: "Marcus Johnson",
      avatar: "https://i.pravatar.cc/150?u=marcus",
    },
    slug: "case-study-voxel-media",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6"
          >
            Insights & Updates
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 dark:text-zinc-400"
          >
            The latest news, engineering deeply technical guides, and stories about building the future of video accessibility.
          </motion.p>
        </div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-24"
        >
          <Link href={`/blog/${featuredPost.slug}`} className="group block">
            <div className="relative rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-[4/3] md:aspect-auto bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden">
                   {/* Abstract Featured Image Placeholder */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-600 opacity-80" />
                   <div className="absolute inset-0 backdrop-blur-[100px]" />
                   <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-400 blur-[120px] rounded-full mix-blend-overlay opacity-50 animate-pulse" />
                </div>
                
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-sm font-medium mb-6">
                    <span className="px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                      {featuredPost.category}
                    </span>
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {featuredPost.readTime}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl lg:text-4xl font-semibold mb-6 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-zinc-600 dark:text-zinc-400 text-lg mb-8 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto relative z-10">
                    <div className="flex items-center gap-3">
                      <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="text-sm font-medium">{featuredPost.author.name}</p>
                        <p className="text-xs text-zinc-500">{featuredPost.date}</p>
                      </div>
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Recent Posts Grid */}
        <div className="mb-12 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Latest Posts</h3>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-24"
        >
          {posts.map((post) => (
            <motion.div key={post.slug} variants={itemVariants}>
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <div className="h-full p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col">
                  
                  <div className="flex items-center gap-3 text-xs font-medium mb-6">
                    <span className="text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span className="text-zinc-500">{post.readTime}</span>
                  </div>
                  
                  <h4 className="text-xl font-semibold mb-4 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h4>
                  
                  <p className="text-zinc-600 dark:text-zinc-400 mb-8 flex-grow">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                    <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{post.author.name}</span>
                      <span className="text-xs text-zinc-500">{post.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-8 md:p-16 bg-zinc-900 dark:bg-zinc-900 relative overflow-hidden border border-zinc-800"
        >
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
            <div className="w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full" />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-3xl font-semibold text-white mb-4">Subscribe to our newsletter</h3>
            <p className="text-zinc-400 mb-8 text-lg">
              Get the latest product updates, engineering insights, and industry news delivered straight to your inbox once a month. No spam, ever.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="you@company.com" 
                className="flex-grow px-5 py-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                required
              />
              <button 
                type="submit"
                className="px-6 py-4 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
