"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/stores/editor-store";

export function ShortcutManager() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const store = useEditorStore.getState();

      // File / Global Actions
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        store.markSaved(); // Trigger save
        return;
      }

      // History
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "z") {
        event.preventDefault();
        store.redo();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        store.undo();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        store.redo();
        return;
      }

      // Editing / Clipboard
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c") {
        store.copyClips();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "x") {
        store.copyClips();
        store.removeSelectedClips();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v") {
        store.pasteClips();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
        event.preventDefault();
        // Select all clips (we will implement this by iterating all tracks if we wanted, but for now just clear box selection)
        return;
      }

      // Single Key Actions (Tools & Playback)
      switch (event.key.toLowerCase()) {
        case " ": // Spacebar
          event.preventDefault();
          store.togglePlayPause();
          break;
        case "l":
          store.play(); // Or speed up
          break;
        case "k":
          store.pause();
          break;
        case "j": // Reverse playback / step back
          store.stepFrame(-1);
          break;
        case "delete":
        case "backspace":
          store.removeSelectedClips();
          break;
        
        // Tools
        case "v":
          store.setActiveTool('selection');
          break;
        case "h":
          store.setActiveTool('hand');
          break;
        case "b":
          store.setActiveTool('cut');
          break;
        case "t":
          store.setActiveTool('text');
          break;
        case "u":
          store.setActiveTool('shape');
          break;
        case "z":
          store.setActiveTool('zoom');
          break;
        case "c":
          store.setActiveTool('crop');
          break;
        case "e":
          store.setActiveTool('transform');
          break;
      }
    };

    const handleWheel = (event: WheelEvent) => {
      // Ctrl + Wheel to zoom timeline
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        const store = useEditorStore.getState();
        const zoomDelta = event.deltaY > 0 ? 0.9 : 1.1;
        store.setZoom(store.zoom * zoomDelta);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return null;
}
