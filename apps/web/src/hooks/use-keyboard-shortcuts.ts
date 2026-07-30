'use client';

import { useEffect } from 'react';
import { useEditorStore } from '@/stores/editor-store';

export function useKeyboardShortcuts() {
  const store = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      // Save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        store.markSaved();
        // Here you would typically also call an API to save
        return;
      }

      // Undo
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        store.undo();
        return;
      }

      // Redo
      if ((e.ctrlKey && e.shiftKey && e.key === 'z') || (e.ctrlKey && e.key === 'y')) {
        e.preventDefault();
        store.redo();
        return;
      }

      // Delete/Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        store.removeSelectedClips();
        return;
      }

      // Toggle Play/Pause
      if (e.key === ' ') {
        e.preventDefault();
        store.togglePlayPause();
        return;
      }

      // Select All
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        if (store.selectedTrackId) {
          store.selectAllClipsInTrack(store.selectedTrackId);
        }
        return;
      }

      // Copy
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        store.copyClips();
        return;
      }

      // Paste
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        store.pasteClips();
        return;
      }

      // Duplicate
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        if (store.selectedClipIds.length > 0) {
          store.duplicateClips(store.selectedClipIds);
        }
        return;
      }

      // Nudge left/right
      if (e.key === '[') {
        e.preventDefault();
        const selectedClips = store.getSelectedClips();
        if (selectedClips.length > 0) {
          // just doing first clip for now as example or loop through all
          selectedClips.forEach(clip => {
             store.updateClip(clip.id, { startTime: Math.max(0, clip.startTime - (1 / store.fps)), endTime: Math.max(clip.duration, clip.endTime - (1 / store.fps)) });
          });
        }
        return;
      }

      if (e.key === ']') {
        e.preventDefault();
        const selectedClips = store.getSelectedClips();
        if (selectedClips.length > 0) {
          selectedClips.forEach(clip => {
             store.updateClip(clip.id, { startTime: clip.startTime + (1 / store.fps), endTime: clip.endTime + (1 / store.fps) });
          });
        }
        return;
      }

      // Zoom In/Out
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        store.zoomIn();
        return;
      }

      if (e.key === '-') {
        e.preventDefault();
        store.zoomOut();
        return;
      }

      // Seek
      if (e.key === 'Home') {
        e.preventDefault();
        store.seek(0);
        return;
      }

      if (e.key === 'End') {
        e.preventDefault();
        store.seek(store.duration);
        return;
      }

      // Step Frame
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        store.stepFrame(-1);
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        store.stepFrame(1);
        return;
      }

      // Escape (Clear Selection)
      if (e.key === 'Escape') {
        e.preventDefault();
        store.clearSelection();
        return;
      }

      // Toggle Snap
      if (e.key === 's') {
        e.preventDefault();
        store.toggleSnap();
        return;
      }

      // Add Marker
      if (e.key === 'm') {
        e.preventDefault();
        store.addMarker({
          time: store.currentTime,
          label: 'Marker',
          color: '#3b82f6',
        });
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [store]);
}
