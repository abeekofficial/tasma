"use client";

import { PreviewWorkspace } from "../preview/preview-workspace";

export function CenterPreview() {
  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 relative overflow-hidden">
      <PreviewWorkspace />
    </div>
  );
}
