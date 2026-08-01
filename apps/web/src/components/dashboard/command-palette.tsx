"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FolderPlus, Upload, Home, BarChart2, Settings, LayoutPanelLeft, ListVideo, Layers, Zap, SearchCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEditorStore } from "@/stores/editor-store";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const togglePanel = useEditorStore(state => state.togglePanel);
  const zoomToFit = useEditorStore(state => state.zoomToFit);
  const toggleSnap = useEditorStore(state => state.toggleSnap);
  const toggleMagneticTimeline = useEditorStore(state => state.toggleMagneticTimeline);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <AnimatePresence>
      {open && (
        <Command.Dialog
          open={open}
          onOpenChange={setOpen}
          label="Global Command Menu"
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh]"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 shadow-2xl backdrop-blur-xl ring-1 ring-white/10"
          >
            <Command.Input
              placeholder="Type a command or search..."
              className="w-full border-b border-white/10 bg-transparent px-5 py-4 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
            <Command.List className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-700">
              <Command.Empty className="py-6 text-center text-sm text-zinc-500">
                No results found.
              </Command.Empty>

              <Command.Group heading="Editor Actions" className="px-2 py-1.5 text-xs font-medium text-zinc-400">
                <Command.Item
                  onSelect={() => runCommand(() => zoomToFit())}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-200 aria-selected:bg-indigo-500/20 aria-selected:text-indigo-300 transition-colors"
                >
                  <SearchCode className="h-4 w-4" />
                  Zoom Timeline to Fit
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => toggleSnap())}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-200 aria-selected:bg-indigo-500/20 aria-selected:text-indigo-300 transition-colors"
                >
                  <Zap className="h-4 w-4" />
                  Toggle Snapping
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => toggleMagneticTimeline())}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-200 aria-selected:bg-indigo-500/20 aria-selected:text-indigo-300 transition-colors"
                >
                  <Zap className="h-4 w-4" />
                  Toggle Magnetic Timeline
                </Command.Item>
              </Command.Group>

              <Command.Group heading="Panels & Layout" className="px-2 py-1.5 text-xs font-medium text-zinc-400">
                <Command.Item
                  onSelect={() => runCommand(() => togglePanel('sidebar'))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-200 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                >
                  <LayoutPanelLeft className="h-4 w-4" />
                  Toggle Sidebar
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => togglePanel('timeline'))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-200 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                >
                  <ListVideo className="h-4 w-4" />
                  Toggle Timeline
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => togglePanel('inspector'))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-200 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Toggle Inspector
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => togglePanel('layers'))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-200 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                >
                  <Layers className="h-4 w-4" />
                  Toggle Layers Panel
                </Command.Item>
              </Command.Group>

              <Command.Group heading="Quick Navigation" className="px-2 py-1.5 text-xs font-medium text-zinc-400">
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/projects/new"))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-200 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                >
                  <FolderPlus className="h-4 w-4" />
                  Create Project
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/upload"))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-200 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Upload Media
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => router.push("/dashboard"))}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-200 aria-selected:bg-white/10 aria-selected:text-white transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Command.Item>
              </Command.Group>
            </Command.List>
          </motion.div>
        </Command.Dialog>
      )}
    </AnimatePresence>
  );
}
