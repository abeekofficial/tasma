'use client';

import React, { ReactNode } from 'react';
import { useEditorStore, type Track, type Clip, type SidebarTab, type InspectorTab, type TrackType, type ClipType, type Marker } from '@/stores/editor-store';

export type { Track, Clip, SidebarTab, InspectorTab, TrackType, ClipType, Marker };

export function EditorProvider({ children, projectId }: { children: ReactNode; projectId?: string }) {
  const setProjectMeta = useEditorStore(state => state.setProjectMeta);
  
  React.useEffect(() => {
    if (projectId) {
      setProjectMeta({ projectId, projectName: 'Untitled Project' });
    }
  }, [projectId, setProjectMeta]);

  return React.createElement(React.Fragment, null, children);
}

export function useEditor() {
  return useEditorStore();
}

export function usePlayback() {
  return useEditorStore(state => ({
    isPlaying: state.isPlaying,
    currentTime: state.currentTime,
    duration: state.duration,
    fps: state.fps,
    volume: state.volume,
    isMuted: state.isMuted,
    play: state.play,
    pause: state.pause,
    stop: state.stop,
    togglePlayPause: state.togglePlayPause,
    seek: state.seek,
    stepFrame: state.stepFrame,
    setVolume: state.setVolume,
    toggleMute: state.toggleMute,
  }));
}

export function useTracks() {
  return useEditorStore(state => ({
    tracks: state.tracks,
    addTrack: state.addTrack,
    removeTrack: state.removeTrack,
    updateTrack: state.updateTrack,
    reorderTracks: state.reorderTracks,
    toggleTrackLock: state.toggleTrackLock,
    toggleTrackVisibility: state.toggleTrackVisibility,
    toggleTrackMute: state.toggleTrackMute,
    toggleTrackSolo: state.toggleTrackSolo,
  }));
}

export function useSelection() {
  return useEditorStore(state => ({
    selectedTrackId: state.selectedTrackId,
    selectedClipIds: state.selectedClipIds,
    selectTrack: state.selectTrack,
    selectClips: state.selectClips,
    clearSelection: state.clearSelection,
    getSelectedClips: state.getSelectedClips,
  }));
}

export function usePanels() {
  return useEditorStore(state => ({
    panels: state.panels,
    activeSidebarTab: state.activeSidebarTab,
    activeInspectorTab: state.activeInspectorTab,
    togglePanel: state.togglePanel,
    resizePanel: state.resizePanel,
    setSidebarTab: state.setSidebarTab,
    setInspectorTab: state.setInspectorTab,
  }));
}
