"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings2, Check, Video, Image as ImageIcon, Smartphone } from "lucide-react";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectDialog({ isOpen, onClose }: CreateProjectDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [projectName, setProjectName] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [resolution, setResolution] = useState("1080p");
  const [isAiProject, setIsAiProject] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("blank");

  if (!isOpen) return null;

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);
  const handleCreate = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setProjectName("");
      setAspectRatio("16:9");
      setResolution("1080p");
      setIsAiProject(false);
      setSelectedTemplate("blank");
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-white/70 shadow-2xl backdrop-blur-xl dark:bg-zinc-900/70"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Create New Project
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {step === 1 ? "Configure your project settings" : "Choose a starting template"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative min-h-[400px] p-6">
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Summer Campaign V2"
                    className="w-full rounded-lg border border-zinc-200 bg-white/50 px-4 py-2.5 text-zinc-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "16:9", icon: Video, label: "Landscape" },
                      { id: "9:16", icon: Smartphone, label: "Portrait" },
                      { id: "1:1", icon: ImageIcon, label: "Square" },
                    ].map((ratio) => (
                      <button
                        key={ratio.id}
                        onClick={() => setAspectRatio(ratio.id)}
                        className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 transition-all ${
                          aspectRatio === ratio.id
                            ? "border-blue-500 bg-blue-500/5 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                            : "border-zinc-200 bg-white/50 text-zinc-600 hover:border-zinc-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
                        }`}
                      >
                        <ratio.icon className="h-6 w-6" />
                        <span className="text-sm font-medium">{ratio.id}</span>
                        <span className="text-xs opacity-70">{ratio.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Resolution
                    </label>
                    <select
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-zinc-200 bg-white/50 px-4 py-2.5 text-zinc-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-100"
                    >
                      <option value="1080p">1080p (FHD)</option>
                      <option value="4K">4K (UHD)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      AI Capabilities
                    </label>
                    <button
                      onClick={() => setIsAiProject(!isAiProject)}
                      className={`flex w-full items-center justify-between rounded-lg border p-2.5 transition-all ${
                        isAiProject
                          ? "border-purple-500/50 bg-purple-500/5 dark:bg-purple-500/10"
                          : "border-zinc-200 bg-white/50 dark:border-zinc-800 dark:bg-zinc-950/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-md p-1.5 ${isAiProject ? "bg-purple-500 text-white" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"}`}>
                          <Settings2 className="h-4 w-4" />
                        </div>
                        <span className={`text-sm font-medium ${isAiProject ? "text-purple-700 dark:text-purple-300" : "text-zinc-700 dark:text-zinc-300"}`}>
                          Enable AI Tools
                        </span>
                      </div>
                      <div className={`h-5 w-9 rounded-full p-0.5 transition-colors ${isAiProject ? "bg-purple-500" : "bg-zinc-200 dark:bg-zinc-700"}`}>
                        <motion.div
                          layout
                          className="h-4 w-4 rounded-full bg-white shadow-sm"
                          animate={{ x: isAiProject ? 16 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[
                    { id: "blank", name: "Blank Project", desc: "Start from scratch", color: "from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900" },
                    { id: "social", name: "Social Promo", desc: "Trending", color: "from-blue-400 to-indigo-500" },
                    { id: "podcast", name: "Podcast Snippet", desc: "Featured", color: "from-emerald-400 to-teal-500" },
                    { id: "vlog", name: "Daily Vlog", desc: "YouTube", color: "from-orange-400 to-red-500" },
                    { id: "tutorial", name: "Tech Tutorial", desc: "Education", color: "from-purple-400 to-pink-500" },
                    { id: "ad", name: "Product Ad", desc: "Marketing", color: "from-amber-400 to-orange-500" },
                  ].map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`group relative flex aspect-video flex-col justify-end overflow-hidden rounded-xl border p-4 text-left transition-all ${
                        selectedTemplate === template.id
                          ? "border-blue-500 ring-2 ring-blue-500/50"
                          : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-20 transition-opacity group-hover:opacity-30`} />
                      <div className="relative z-10">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {template.name}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {template.desc}
                        </p>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="absolute right-3 top-3 rounded-full bg-blue-500 p-1 text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex gap-2">
            <div className={`h-2 w-2 rounded-full ${step === 1 ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-700"}`} />
            <div className={`h-2 w-2 rounded-full ${step === 2 ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-700"}`} />
          </div>
          <div className="flex gap-3">
            {step === 2 && (
              <button
                onClick={handleBack}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Back
              </button>
            )}
            <button
              onClick={step === 1 ? handleNext : handleCreate}
              disabled={step === 1 && !projectName.trim()}
              className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
            >
              {step === 1 ? "Next Step" : "Create Project"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
