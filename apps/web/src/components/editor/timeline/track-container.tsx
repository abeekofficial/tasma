"use client";

import React, { useState } from "react";
import { Reorder } from "framer-motion";
import { TrackHeader, TrackType } from "./track-header";

const MOCK_TRACKS = [
  { id: 'v3', type: 'video' as TrackType, name: 'Adjustment Layer 1', color: '#ec4899' },
  { id: 'v2', type: 'subtitle' as TrackType, name: 'Captions', color: '#eab308' },
  { id: 'v1', type: 'video' as TrackType, name: 'Main Cam', color: '#3b82f6' },
  { id: 'a1', type: 'audio' as TrackType, name: 'Dialogue', color: '#10b981' },
  { id: 'a2', type: 'audio' as TrackType, name: 'SFX', color: '#10b981' },
  { id: 'a3', type: 'audio' as TrackType, name: 'Music', color: '#10b981' },
];

export const TrackContainer = () => {
  const [tracks, setTracks] = useState(MOCK_TRACKS);

  return (
    <Reorder.Group 
      axis="y" 
      values={tracks} 
      onReorder={setTracks} 
      className="flex flex-col w-full h-full bg-[#111111]"
    >
      {tracks.map((track) => (
        <Reorder.Item 
          key={track.id} 
          value={track}
          className="relative"
        >
          <TrackHeader {...track} />
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};
