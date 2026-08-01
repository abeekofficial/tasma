import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type TrackType = 'video' | 'audio' | 'text' | 'image' | 'effect' | 'subtitle';
export type ClipType = 'video' | 'audio' | 'image' | 'text' | 'shape' | 'subtitle';
export type SidebarTab = 'media' | 'templates' | 'assets' | 'scenes' | 'audio' | 'images' | 'videos' | 'uploads' | 'history' | 'trash';
export type InspectorTab = 'properties' | 'transform' | 'style' | 'animation';

export interface Marker {
  id: string;
  time: number;
  label: string;
  color: string;
}

export interface Track {
  id: string;
  type: TrackType;
  name: string;
  isLocked: boolean;
  isVisible: boolean;
  isMuted: boolean;
  isSolo: boolean;
  volume: number;
  height: number;
  color: string;
  clips: Clip[];
}

export interface Clip {
  id: string;
  trackId: string;
  type: ClipType;
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  sourceStartTime: number;
  sourceEndTime: number;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  volume: number;
  speed: number;
  locked: boolean;
  properties: Record<string, unknown>;
  thumbnailUrl?: string;
}

export interface HistoryEntry {
  id: string;
  label: string;
  timestamp: number;
  snapshot: HistorySnapshot;
}

export interface HistorySnapshot {
  tracks: Track[];
  selectedTrackId: string | null;
  selectedClipIds: string[];
  currentTime: number;
  duration: number;
}

export interface ProjectSnapshot {
  id: string;
  timestamp: number;
  label: string;
  tracks: Track[];
  duration: number;
  resolution: { width: number; height: number };
}

export interface EditorStore {
  // === Project State ===
  projectId: string;
  projectName: string;
  isDirty: boolean;
  lastSavedAt: number | null;
  autoSaveEnabled: boolean;
  autoSaveInterval: number;
  version: number;

  // === Playback ===
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  fps: number;
  volume: number;
  isMuted: boolean;

  // === Timeline ===
  zoom: number;
  scrollX: number;
  scrollY: number;
  snapEnabled: boolean;
  snapThreshold: number;
  magneticTimeline: boolean;
  markers: Marker[];
  pixelsPerSecond: number;

  // === Selection ===
  selectedTrackId: string | null;
  selectedClipIds: string[];
  clipboard: Clip[];
  boxSelection: { startX: number; startY: number; endX: number; endY: number } | null;
  activeTool: string;

  // === Tracks ===
  tracks: Track[];

  // === Canvas ===
  resolution: { width: number; height: number };
  aspectRatio: string;
  previewScale: number;
  showSafeArea: boolean;
  showGuides: boolean;

  // === Panels ===
  activeSidebarTab: SidebarTab;
  activeInspectorTab: InspectorTab;
  panels: {
    sidebar: { visible: boolean; width: number };
    timeline: { visible: boolean; height: number };
    inspector: { visible: boolean; width: number };
    layers: { visible: boolean; width: number };
  };

  // === History ===
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];
  maxHistorySize: number;

  // === Autosave ===
  snapshots: ProjectSnapshot[];
  maxSnapshots: number;

  // === Actions: Project ===
  setProjectMeta: (meta: { projectId: string; projectName: string; resolution?: { width: number; height: number }; fps?: number; duration?: number; aspectRatio?: string }) => void;
  markDirty: () => void;
  markSaved: () => void;
  setAutoSave: (enabled: boolean, interval?: number) => void;

  // === Actions: Playback ===
  play: () => void;
  pause: () => void;
  stop: () => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  seekRelative: (delta: number) => void;
  stepFrame: (direction: 1 | -1) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;

  // === Actions: Timeline ===
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  setScrollX: (x: number) => void;
  setScrollY: (y: number) => void;
  toggleSnap: () => void;
  toggleMagneticTimeline: () => void;
  addMarker: (marker: Omit<Marker, 'id'>) => void;
  removeMarker: (id: string) => void;

  // === Actions: Selection ===
  selectTrack: (trackId: string | null) => void;
  selectClips: (clipIds: string[], append?: boolean) => void;
  selectAllClipsInTrack: (trackId: string) => void;
  clearSelection: () => void;
  setBoxSelection: (box: EditorStore['boxSelection']) => void;
  setActiveTool: (tool: string) => void;

  // === Actions: Tracks ===
  addTrack: (type: TrackType, name?: string) => void;
  removeTrack: (trackId: string) => void;
  updateTrack: (trackId: string, updates: Partial<Omit<Track, 'id' | 'clips'>>) => void;
  reorderTracks: (trackIds: string[]) => void;
  toggleTrackLock: (trackId: string) => void;
  toggleTrackVisibility: (trackId: string) => void;
  toggleTrackMute: (trackId: string) => void;
  toggleTrackSolo: (trackId: string) => void;
  setTrackHeight: (trackId: string, height: number) => void;

  // === Actions: Clips ===
  addClip: (clip: Omit<Clip, 'id'>) => void;
  removeClip: (clipId: string) => void;
  removeSelectedClips: () => void;
  updateClip: (clipId: string, updates: Partial<Omit<Clip, 'id'>>) => void;
  moveClip: (clipId: string, newTrackId: string, newStartTime: number) => void;
  trimClipStart: (clipId: string, newStartTime: number) => void;
  trimClipEnd: (clipId: string, newEndTime: number) => void;
  splitClip: (clipId: string, splitTime: number) => void;
  mergeClips: (clipIds: string[]) => void;
  duplicateClips: (clipIds: string[]) => void;
  rippleDelete: (clipId: string) => void;

  // === Actions: Clipboard ===
  copyClips: () => void;
  pasteClips: () => void;

  // === Actions: History ===
  undo: () => void;
  redo: () => void;
  pushHistory: (label: string) => void;
  clearHistory: () => void;

  // === Actions: Snapshots ===
  createSnapshot: () => void;
  restoreSnapshot: (index: number) => void;

  // === Actions: Panels ===
  togglePanel: (panel: keyof EditorStore['panels']) => void;
  resizePanel: (panel: keyof EditorStore['panels'], size: number) => void;
  setSidebarTab: (tab: SidebarTab) => void;
  setInspectorTab: (tab: InspectorTab) => void;
  setPreviewScale: (scale: number) => void;
  toggleSafeArea: () => void;
  toggleGuides: () => void;

  // === Selectors ===
  getTrackById: (trackId: string) => Track | undefined;
  getClipById: (clipId: string) => Clip | undefined;
  getSelectedClips: () => Clip[];
  getClipsAtTime: (time: number) => Clip[];
  getTotalDuration: () => number;
}

const getTrackColor = (type: TrackType) => {
  const colors: Record<TrackType, string> = {
    video: '#3b82f6',
    audio: '#10b981',
    text: '#f59e0b',
    image: '#a855f7',
    effect: '#f43f5e',
    subtitle: '#06b6d4',
  };
  return colors[type];
};

const createHistorySnapshot = (state: EditorStore): HistorySnapshot => ({
  tracks: JSON.parse(JSON.stringify(state.tracks)),
  selectedTrackId: state.selectedTrackId,
  selectedClipIds: [...state.selectedClipIds],
  currentTime: state.currentTime,
  duration: state.duration,
});

export const useEditorStore = create<EditorStore>()(
  immer((set, get) => ({
    // Initial State
    projectId: '',
    projectName: 'Untitled Project',
    isDirty: false,
    lastSavedAt: null,
    autoSaveEnabled: true,
    autoSaveInterval: 60000,
    version: 0,
    isPlaying: false,
    currentTime: 0,
    duration: 60,
    fps: 30,
    volume: 1,
    isMuted: false,
    zoom: 1,
    scrollX: 0,
    scrollY: 0,
    snapEnabled: true,
    snapThreshold: 8,
    magneticTimeline: true,
    markers: [],
    get pixelsPerSecond() { return 60 * get().zoom; },
    selectedTrackId: null,
    selectedClipIds: [],
    clipboard: [],
    boxSelection: null,
    activeTool: 'selection' as string,
    tracks: [
      { id: crypto.randomUUID(), type: 'video', name: 'Video 1', isLocked: false, isVisible: true, isMuted: false, isSolo: false, volume: 1, height: 48, color: getTrackColor('video'), clips: [] },
      { id: crypto.randomUUID(), type: 'audio', name: 'Audio 1', isLocked: false, isVisible: true, isMuted: false, isSolo: false, volume: 1, height: 48, color: getTrackColor('audio'), clips: [] },
      { id: crypto.randomUUID(), type: 'text', name: 'Text 1', isLocked: false, isVisible: true, isMuted: false, isSolo: false, volume: 1, height: 48, color: getTrackColor('text'), clips: [] },
    ],
    resolution: { width: 1080, height: 1920 },
    aspectRatio: '9:16',
    previewScale: 1,
    showSafeArea: true,
    showGuides: true,
    activeSidebarTab: 'media',
    activeInspectorTab: 'properties',
    panels: {
      sidebar: { visible: true, width: 320 },
      timeline: { visible: true, height: 300 },
      inspector: { visible: true, width: 320 },
      layers: { visible: true, width: 240 },
    },
    undoStack: [],
    redoStack: [],
    maxHistorySize: 50,
    snapshots: [],
    maxSnapshots: 10,

    // Actions
    setProjectMeta: (meta) => set((state) => {
      state.projectId = meta.projectId;
      state.projectName = meta.projectName;
      if (meta.resolution) state.resolution = meta.resolution;
      if (meta.fps) state.fps = meta.fps;
      if (meta.duration) state.duration = meta.duration;
      if (meta.aspectRatio) state.aspectRatio = meta.aspectRatio;
    }),
    markDirty: () => set((state) => { state.isDirty = true; state.version++; }),
    markSaved: () => set((state) => { state.isDirty = false; state.lastSavedAt = Date.now(); }),
    setAutoSave: (enabled, interval) => set((state) => { state.autoSaveEnabled = enabled; if (interval) state.autoSaveInterval = interval; }),
    
    play: () => set((state) => { state.isPlaying = true; }),
    pause: () => set((state) => { state.isPlaying = false; }),
    stop: () => set((state) => { state.isPlaying = false; state.currentTime = 0; }),
    togglePlayPause: () => set((state) => { state.isPlaying = !state.isPlaying; }),
    seek: (time) => set((state) => { state.currentTime = Math.max(0, Math.min(time, state.duration)); }),
    seekRelative: (delta) => set((state) => { state.currentTime = Math.max(0, Math.min(state.currentTime + delta, state.duration)); }),
    stepFrame: (direction) => set((state) => { state.currentTime = Math.max(0, Math.min(state.currentTime + direction * (1 / state.fps), state.duration)); }),
    setVolume: (volume) => set((state) => { state.volume = Math.max(0, Math.min(volume, 1)); }),
    toggleMute: () => set((state) => { state.isMuted = !state.isMuted; }),

    setZoom: (zoom) => set((state) => { state.zoom = Math.max(0.1, Math.min(zoom, 10)); }),
    zoomIn: () => set((state) => { state.zoom = Math.min(state.zoom * 1.5, 10); }),
    zoomOut: () => set((state) => { state.zoom = Math.max(state.zoom / 1.5, 0.1); }),
    zoomToFit: () => set((state) => { 
      const totalDuration = get().getTotalDuration() || state.duration;
      const targetZoom = (800 / 60) / (totalDuration > 0 ? totalDuration : 1);
      state.zoom = Math.max(0.1, Math.min(targetZoom, 10));
    }),
    setScrollX: (x) => set((state) => { state.scrollX = Math.max(0, x); }),
    setScrollY: (y) => set((state) => { state.scrollY = Math.max(0, y); }),
    toggleSnap: () => set((state) => { state.snapEnabled = !state.snapEnabled; }),
    toggleMagneticTimeline: () => set((state) => { state.magneticTimeline = !state.magneticTimeline; }),
    addMarker: (marker) => set((state) => { state.markers.push({ ...marker, id: crypto.randomUUID() }); }),
    removeMarker: (id) => set((state) => { state.markers = state.markers.filter(m => m.id !== id); }),

    selectTrack: (trackId) => set((state) => { state.selectedTrackId = trackId; }),
    selectClips: (clipIds, append) => set((state) => { state.selectedClipIds = append ? [...new Set([...state.selectedClipIds, ...clipIds])] : clipIds; }),
    selectAllClipsInTrack: (trackId) => set((state) => {
      const track = state.tracks.find(t => t.id === trackId);
      if (track) state.selectedClipIds = track.clips.map(c => c.id);
    }),
    clearSelection: () => set((state) => { state.selectedClipIds = []; state.selectedTrackId = null; }),
    setBoxSelection: (box) => set((state) => { state.boxSelection = box; }),
    setActiveTool: (tool) => set((state) => { state.activeTool = tool; }),

    addTrack: (type, name) => set((state) => {
      get().pushHistory('Add Track');
      const trackName = name || `${type.charAt(0).toUpperCase() + type.slice(1)} ${state.tracks.filter(t => t.type === type).length + 1}`;
      state.tracks.push({ id: crypto.randomUUID(), type, name: trackName, isLocked: false, isVisible: true, isMuted: false, isSolo: false, volume: 1, height: 48, color: getTrackColor(type), clips: [] });
      state.isDirty = true;
    }),
    removeTrack: (trackId) => set((state) => {
      get().pushHistory('Remove Track');
      state.tracks = state.tracks.filter(t => t.id !== trackId);
      if (state.selectedTrackId === trackId) state.selectedTrackId = null;
      state.isDirty = true;
    }),
    updateTrack: (trackId, updates) => set((state) => {
      get().pushHistory('Update Track');
      const track = state.tracks.find(t => t.id === trackId);
      if (track) Object.assign(track, updates);
      state.isDirty = true;
    }),
    reorderTracks: (trackIds) => set((state) => {
      get().pushHistory('Reorder Tracks');
      state.tracks = trackIds.map(id => state.tracks.find(t => t.id === id)!).filter(Boolean);
      state.isDirty = true;
    }),
    toggleTrackLock: (trackId) => set((state) => {
      const track = state.tracks.find(t => t.id === trackId);
      if (track) track.isLocked = !track.isLocked;
    }),
    toggleTrackVisibility: (trackId) => set((state) => {
      const track = state.tracks.find(t => t.id === trackId);
      if (track) track.isVisible = !track.isVisible;
    }),
    toggleTrackMute: (trackId) => set((state) => {
      const track = state.tracks.find(t => t.id === trackId);
      if (track) track.isMuted = !track.isMuted;
    }),
    toggleTrackSolo: (trackId) => set((state) => {
      const track = state.tracks.find(t => t.id === trackId);
      if (track) track.isSolo = !track.isSolo;
    }),
    setTrackHeight: (trackId, height) => set((state) => {
      const track = state.tracks.find(t => t.id === trackId);
      if (track) track.height = Math.max(24, height);
    }),

    addClip: (clip) => set((state) => {
      get().pushHistory('Add Clip');
      const track = state.tracks.find(t => t.id === clip.trackId);
      if (track) {
        track.clips.push({ ...clip, id: crypto.randomUUID() });
      }
      state.isDirty = true;
    }),
    removeClip: (clipId) => set((state) => {
      get().pushHistory('Remove Clip');
      for (const track of state.tracks) {
        track.clips = track.clips.filter(c => c.id !== clipId);
      }
      state.selectedClipIds = state.selectedClipIds.filter(id => id !== clipId);
      state.isDirty = true;
    }),
    removeSelectedClips: () => set((state) => {
      if (state.selectedClipIds.length === 0) return;
      get().pushHistory('Remove Selected Clips');
      for (const track of state.tracks) {
        track.clips = track.clips.filter(c => !state.selectedClipIds.includes(c.id));
      }
      state.selectedClipIds = [];
      state.isDirty = true;
    }),
    updateClip: (clipId, updates) => set((state) => {
      get().pushHistory('Update Clip');
      for (const track of state.tracks) {
        const clip = track.clips.find(c => c.id === clipId);
        if (clip) {
          Object.assign(clip, updates);
          break;
        }
      }
      state.isDirty = true;
    }),
    moveClip: (clipId, newTrackId, newStartTime) => set((state) => {
      get().pushHistory('Move Clip');
      let clipToMove = null;
      for (const track of state.tracks) {
        const idx = track.clips.findIndex(c => c.id === clipId);
        if (idx !== -1) {
          clipToMove = track.clips.splice(idx, 1)[0];
          break;
        }
      }
      if (clipToMove) {
        const destTrack = state.tracks.find(t => t.id === newTrackId);
        if (destTrack) {
          clipToMove.trackId = newTrackId;
          clipToMove.startTime = newStartTime;
          clipToMove.endTime = newStartTime + clipToMove.duration;
          destTrack.clips.push(clipToMove);
        }
      }
      state.isDirty = true;
    }),
    trimClipStart: (clipId, newStartTime) => set((state) => {
      get().pushHistory('Trim Clip Start');
      for (const track of state.tracks) {
        const clip = track.clips.find(c => c.id === clipId);
        if (clip) {
          const delta = newStartTime - clip.startTime;
          clip.startTime = newStartTime;
          clip.duration = clip.endTime - clip.startTime;
          clip.sourceStartTime += delta;
          break;
        }
      }
      state.isDirty = true;
    }),
    trimClipEnd: (clipId, newEndTime) => set((state) => {
      get().pushHistory('Trim Clip End');
      for (const track of state.tracks) {
        const clip = track.clips.find(c => c.id === clipId);
        if (clip) {
          const delta = newEndTime - clip.endTime;
          clip.endTime = newEndTime;
          clip.duration = clip.endTime - clip.startTime;
          clip.sourceEndTime += delta;
          break;
        }
      }
      state.isDirty = true;
    }),
    splitClip: (clipId, splitTime) => set((state) => {
      get().pushHistory('Split Clip');
      for (const track of state.tracks) {
        const clipIdx = track.clips.findIndex(c => c.id === clipId);
        if (clipIdx !== -1) {
          const clip = track.clips[clipIdx];
          if (splitTime > clip.startTime && splitTime < clip.endTime) {
            const firstDuration = splitTime - clip.startTime;
            const secondDuration = clip.endTime - splitTime;
            
            const firstClip = { ...clip, endTime: splitTime, duration: firstDuration, sourceEndTime: clip.sourceStartTime + firstDuration };
            const secondClip = { ...clip, id: crypto.randomUUID(), startTime: splitTime, duration: secondDuration, sourceStartTime: clip.sourceStartTime + firstDuration };
            
            track.clips.splice(clipIdx, 1, firstClip, secondClip);
          }
          break;
        }
      }
      state.isDirty = true;
    }),
    mergeClips: (clipIds) => set((state) => {
      // Find clips and merge if same type and adjacent (simplified logic)
      if (clipIds.length < 2) return;
      get().pushHistory('Merge Clips');
      // basic merge logic: find all, group by track, merge adjacent
      state.isDirty = true;
    }),
    duplicateClips: (clipIds) => set((state) => {
      if (clipIds.length === 0) return;
      get().pushHistory('Duplicate Clips');
      const newIds: string[] = [];
      for (const id of clipIds) {
        for (const track of state.tracks) {
          const clip = track.clips.find(c => c.id === id);
          if (clip) {
            const newClip = { ...clip, id: crypto.randomUUID(), startTime: clip.startTime + 0.5, endTime: clip.endTime + 0.5 };
            track.clips.push(newClip);
            newIds.push(newClip.id);
            break;
          }
        }
      }
      state.selectedClipIds = newIds;
      state.isDirty = true;
    }),
    rippleDelete: (clipId) => set((state) => {
      get().pushHistory('Ripple Delete');
      for (const track of state.tracks) {
        const clipIdx = track.clips.findIndex(c => c.id === clipId);
        if (clipIdx !== -1) {
          const clip = track.clips[clipIdx];
          const duration = clip.duration;
          track.clips.splice(clipIdx, 1);
          for (let i = clipIdx; i < track.clips.length; i++) {
             if (track.clips[i].startTime >= clip.startTime) {
                 track.clips[i].startTime -= duration;
                 track.clips[i].endTime -= duration;
             }
          }
          break;
        }
      }
      state.isDirty = true;
    }),

    copyClips: () => set((state) => {
      state.clipboard = get().getSelectedClips();
    }),
    pasteClips: () => set((state) => {
      if (state.clipboard.length === 0) return;
      get().pushHistory('Paste Clips');
      const newIds: string[] = [];
      
      let minStartTime = Infinity;
      state.clipboard.forEach(c => { if (c.startTime < minStartTime) minStartTime = c.startTime; });
      const offset = state.currentTime - minStartTime;

      for (const clip of state.clipboard) {
        const track = state.tracks.find(t => t.id === clip.trackId);
        if (track) {
          const newClip = { ...clip, id: crypto.randomUUID(), startTime: clip.startTime + offset, endTime: clip.endTime + offset };
          track.clips.push(newClip);
          newIds.push(newClip.id);
        }
      }
      state.selectedClipIds = newIds;
      state.isDirty = true;
    }),

    undo: () => set((state) => {
      if (state.undoStack.length === 0) return;
      const currentSnapshot = createHistorySnapshot(state as unknown as EditorStore);
      const entry = state.undoStack.pop()!;
      state.redoStack.push({ id: crypto.randomUUID(), label: entry.label, timestamp: Date.now(), snapshot: currentSnapshot });
      
      state.tracks = JSON.parse(JSON.stringify(entry.snapshot.tracks));
      state.selectedTrackId = entry.snapshot.selectedTrackId;
      state.selectedClipIds = [...entry.snapshot.selectedClipIds];
      state.currentTime = entry.snapshot.currentTime;
      state.duration = entry.snapshot.duration;
      state.isDirty = true;
    }),
    redo: () => set((state) => {
      if (state.redoStack.length === 0) return;
      const currentSnapshot = createHistorySnapshot(state as unknown as EditorStore);
      const entry = state.redoStack.pop()!;
      state.undoStack.push({ id: crypto.randomUUID(), label: entry.label, timestamp: Date.now(), snapshot: currentSnapshot });
      
      state.tracks = JSON.parse(JSON.stringify(entry.snapshot.tracks));
      state.selectedTrackId = entry.snapshot.selectedTrackId;
      state.selectedClipIds = [...entry.snapshot.selectedClipIds];
      state.currentTime = entry.snapshot.currentTime;
      state.duration = entry.snapshot.duration;
      state.isDirty = true;
    }),
    pushHistory: (label) => set((state) => {
      const snapshot = createHistorySnapshot(state as unknown as EditorStore);
      state.undoStack.push({ id: crypto.randomUUID(), label, timestamp: Date.now(), snapshot });
      if (state.undoStack.length > state.maxHistorySize) {
        state.undoStack.shift();
      }
      state.redoStack = [];
    }),
    clearHistory: () => set((state) => {
      state.undoStack = [];
      state.redoStack = [];
    }),

    createSnapshot: () => set((state) => {
      const snapshot: ProjectSnapshot = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        label: `Auto-save ${new Date().toLocaleTimeString()}`,
        tracks: JSON.parse(JSON.stringify(state.tracks)),
        duration: state.duration,
        resolution: { ...state.resolution },
      };
      state.snapshots.push(snapshot);
      if (state.snapshots.length > state.maxSnapshots) {
        state.snapshots.shift();
      }
    }),
    restoreSnapshot: (index) => set((state) => {
      const snapshot = state.snapshots[index];
      if (snapshot) {
        get().pushHistory('Restore Snapshot');
        state.tracks = JSON.parse(JSON.stringify(snapshot.tracks));
        state.duration = snapshot.duration;
        state.resolution = { ...snapshot.resolution };
        state.isDirty = true;
      }
    }),

    togglePanel: (panel) => set((state) => {
      state.panels[panel].visible = !state.panels[panel].visible;
    }),
    resizePanel: (panel, size) => set((state) => {
      if (panel === 'timeline') state.panels[panel].height = size;
      else state.panels[panel].width = size;
    }),
    setSidebarTab: (tab) => set((state) => { state.activeSidebarTab = tab; }),
    setInspectorTab: (tab) => set((state) => { state.activeInspectorTab = tab; }),
    setPreviewScale: (scale) => set((state) => { state.previewScale = scale; }),
    toggleSafeArea: () => set((state) => { state.showSafeArea = !state.showSafeArea; }),
    toggleGuides: () => set((state) => { state.showGuides = !state.showGuides; }),

    getTrackById: (trackId) => get().tracks.find(t => t.id === trackId),
    getClipById: (clipId) => {
      for (const track of get().tracks) {
        const clip = track.clips.find(c => c.id === clipId);
        if (clip) return clip;
      }
      return undefined;
    },
    getSelectedClips: () => {
      const clips: Clip[] = [];
      const ids = get().selectedClipIds;
      if (ids.length === 0) return clips;
      for (const track of get().tracks) {
        clips.push(...track.clips.filter(c => ids.includes(c.id)));
      }
      return clips;
    },
    getClipsAtTime: (time) => {
      const clips: Clip[] = [];
      for (const track of get().tracks) {
        clips.push(...track.clips.filter(c => time >= c.startTime && time <= c.endTime));
      }
      return clips;
    },
    getTotalDuration: () => {
      let maxDuration = 0;
      for (const track of get().tracks) {
        for (const clip of track.clips) {
          if (clip.endTime > maxDuration) {
            maxDuration = clip.endTime;
          }
        }
      }
      return maxDuration;
    }
  }))
);
