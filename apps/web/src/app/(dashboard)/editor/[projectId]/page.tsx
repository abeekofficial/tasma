'use client';

import { use } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { EditorProvider } from '@/hooks/use-editor-state';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

import TopToolbar from '@/components/editor/layout/top-toolbar';
import LeftSidebar from '@/components/editor/layout/left-sidebar';
import CenterPreview from '@/components/editor/layout/center-preview';
import RightInspector from '@/components/editor/layout/right-inspector';
import BottomTimeline from '@/components/editor/layout/bottom-timeline';

export default function EditorPage({ params }: { params: { projectId: string } | Promise<{ projectId: string }> }) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  
  return (
    <EditorProvider projectId={resolvedParams.projectId}>
      <EditorPageContent />
    </EditorProvider>
  );
}

function EditorPageContent() {
  useKeyboardShortcuts();

  return (
    <>
      <style>{`
        html, body {
          overflow: hidden;
          height: 100vh;
          width: 100vw;
          margin: 0;
          padding: 0;
        }
      `}</style>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-violet-500/30">
        <TopToolbar />
        <div className="flex-1 min-h-0 w-full">
          <PanelGroup direction="vertical">
            <Panel defaultSize={70} minSize={30}>
              <PanelGroup direction="horizontal">
                <Panel defaultSize={20} minSize={10}>
                  <LeftSidebar />
                </Panel>
                <PanelResizeHandle className="w-1 bg-zinc-800 hover:bg-violet-500 transition-colors" />
                <Panel defaultSize={60} minSize={30}>
                  <CenterPreview />
                </Panel>
                <PanelResizeHandle className="w-1 bg-zinc-800 hover:bg-violet-500 transition-colors" />
                <Panel defaultSize={20} minSize={10}>
                  <RightInspector />
                </Panel>
              </PanelGroup>
            </Panel>
            <PanelResizeHandle className="h-1 bg-zinc-800 hover:bg-violet-500 transition-colors" />
            <Panel defaultSize={30} minSize={15}>
              <BottomTimeline />
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </>
  );
}
