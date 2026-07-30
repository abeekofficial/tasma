'use client';

import { use } from 'react';
import { EditorProvider } from '@/hooks/use-editor-state';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { EditorLayout } from '@/components/editor/editor-layout';

export default function EditorPage({ params }: { params: { projectId: string } | Promise<{ projectId: string }> }) {
  // Extract projectId (handling both object and promise params for Next.js 13-15 compatibility)
  const resolvedParams = params instanceof Promise ? use(params) : params;
  
  return (
    <EditorProvider projectId={resolvedParams.projectId}>
      <EditorPageContent />
    </EditorProvider>
  );
}

// Separate component so we can use hooks that require the EditorProvider context
function EditorPageContent() {
  useKeyboardShortcuts();

  return (
    <div className="h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-violet-500/30">
      <EditorLayout />
    </div>
  );
}
