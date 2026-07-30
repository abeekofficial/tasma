"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

export function AIDemo() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setResult(null);
    
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      setResult(`Generated UI for: "${prompt}"`);
    }, 1500);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 max-w-5xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Built for the AI era
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Experience the power of intelligent generation right in your workflow.
          </p>
        </div>

        <div className="bg-background/50 backdrop-blur-xl border rounded-2xl p-4 md:p-8 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent pointer-events-none" />
          
          <form onSubmit={handleGenerate} className="relative max-w-2xl mx-auto mb-8 z-20">
            <div className="relative flex items-center">
              <div className="absolute left-4 text-muted-foreground">
                <Sparkles className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the UI you want to build..."
                className="w-full pl-12 pr-16 py-4 rounded-xl bg-background border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
              />
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 transition-all hover:bg-primary/90"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>

          <div className="min-h-[300px] border rounded-xl bg-muted/30 flex items-center justify-center p-6 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-4 text-muted-foreground"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                    <Sparkles className="w-8 h-8 animate-pulse text-primary relative z-10" />
                  </div>
                  <p>Synthesizing your request...</p>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <div className="bg-background border rounded-lg p-8 shadow-sm text-center w-full max-w-md">
                    <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-xl mb-2">Success!</h3>
                    <p className="text-muted-foreground">{result}</p>
                    <div className="mt-6 flex gap-3 justify-center">
                      <div className="h-8 w-24 bg-muted rounded animate-pulse" />
                      <div className="h-8 w-24 bg-primary/20 rounded animate-pulse" />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-muted-foreground text-center"
                >
                  <p>Your generated UI will appear here.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
