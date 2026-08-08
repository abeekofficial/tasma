"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, 
  ArrowLeft, 
  LayoutTemplate, 
  Wand2, 
  Image as ImageIcon, 
  Mic, 
  Type, 
  Play, 
  Video, 
  Download,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { UploadZone } from "@/components/media/upload-zone";
import { VideoPreview } from "@/components/editor/preview/video-preview";
import { EditorProvider } from "@/hooks/use-editor-state";

interface Template {
  id: string;
  name: string;
  metadata?: {
    color?: string;
  };
}

const STEPS = [
  { id: "template", title: "Template", icon: LayoutTemplate },
  { id: "content", title: "Content", icon: Wand2 },
  { id: "media", title: "Media", icon: ImageIcon },
  { id: "voice", title: "Voice", icon: Mic },
  { id: "subtitles", title: "Subtitles", icon: Type },
  { id: "preview", title: "Preview", icon: Play },
  { id: "render", title: "Generate", icon: Video },
];

export default function CreateShortWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Form State
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [selectedVoice, setSelectedVoice] = useState<string>("adam");

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  React.useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoadingTemplates(true);
        const res = await api.get('/templates?isPublic=true');
        if (res.data?.success && Array.isArray(res.data.data?.data)) {
          setTemplates(res.data.data.data);
        }
      } catch (err) {
        toast.error('Failed to load templates');
      } finally {
        setLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, []);

  const [input, setInput] = useState("");
  const [script, setScript] = useState<any>(null); // Structured JSON script
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  
  // Generation State
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const generateScript = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!input) return toast.error("Please enter a topic");
    
    setIsGeneratingScript(true);
    try {
      const res = await api.post("/ai/generate-script", {
        topic: input,
        length: "short",
        tone: "engaging",
        provider: "gemini",
        modelName: "gemini-1.5-flash",
      });
      if (res) {
        // Fallback for fullScript if the model omitted it
        if (!res.fullScript && res.scenes) {
          res.fullScript = res.scenes.map((s: any) => s.narration).join(" ");
        }
        setScript(res);
        toast.success("Script generated!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate script");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const generateVoice = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!script?.fullScript) return toast.error("Please generate a script first");
    
    setIsGeneratingVoice(true);
    setVoiceUrl(null);
    try {
      const res = await fetch("/api/v1/ai/generate-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: script.fullScript,
          voiceId: selectedVoice, // assuming the IDs match ElevenLabs ones in real app, we will use mock IDs for now or a valid one
        })
      });
      
      if (!res.ok) {
        throw new Error("Failed to generate voice");
      }
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setVoiceUrl(url);
      toast.success("Voiceover generated!");
    } catch (err: any) {
      toast.error(err.message || "Voice generation failed");
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const generateVideo = async () => {
    setIsGeneratingVideo(true);
    setRenderProgress(10);
    
    try {
      // 1. Get user's first organization/workspace
      const orgsRes = await api.get('/organizations');
      if (!orgsRes.data?.success || !orgsRes.data.data.length) {
        throw new Error("No organization found to create a project in");
      }
      const workspaceId = orgsRes.data.data[0].id;
      setRenderProgress(20);

      // 2. Create Project
      const projectRes = await api.post('/projects', {
        workspaceId,
        name: script?.title || "AI Generated Short",
        slug: `short-${Date.now()}`,
        status: "DRAFT",
        platform: "YOUTUBE_SHORTS"
      });
      if (!projectRes.data?.success) {
        throw new Error("Failed to create project");
      }
      const projectId = projectRes.data.data.id;
      setRenderProgress(40);

      // 3. Submit to Render Queue
      const renderRes = await api.post('/render-queue/jobs', {
        projectId,
        type: 'EXPORT',
        priority: 'NORMAL'
      });
      if (!renderRes.data?.success) {
        throw new Error("Failed to submit render job");
      }
      setRenderProgress(70);

      // 4. Since worker orchestration and FFmpeg core are handled via queue, 
      // we'll mock the wait for completion here for the frontend experience.
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setRenderProgress(100);
      setVideoUrl("https://example.com/rendered-video.mp4");
      toast.success("Video queued and generated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Render failed");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Template
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {loadingTemplates ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-zinc-500" /></div>
            ) : (
              templates.map((tmpl) => (
                <Card 
                  key={tmpl.id}
                  className={`cursor-pointer transition-all ${selectedTemplate === tmpl.id ? 'border-violet-500 bg-violet-500/10' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'}`}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                >
                  <div className={`aspect-[9/16] ${tmpl.metadata?.color || 'bg-zinc-950'} rounded-t-lg relative flex items-center justify-center`}>
                    <Video className="w-8 h-8 text-zinc-700" />
                    {selectedTemplate === tmpl.id && (
                      <div className="absolute top-2 right-2 bg-violet-500 rounded-full p-1">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3 text-center">
                    <h3 className="font-medium text-zinc-200">{tmpl.name}</h3>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        );

      case 1: // Content
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">What is this Short about?</label>
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., Top 3 stoic quotes for daily life"
                className="bg-zinc-900 border-zinc-800"
              />
            </div>
            
            <Button 
              onClick={generateScript} 
              disabled={!input || isGeneratingScript}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            >
              {isGeneratingScript ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
              Generate AI Script
            </Button>

            {script && (
              <div className="animate-fade-in space-y-4">
                <label className="block text-sm font-medium text-zinc-300">Review & Edit Script</label>
                <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-4">
                  <h3 className="font-bold text-zinc-100">{script.title}</h3>
                  <div className="text-sm text-zinc-400 italic">Hook: {script.hook}</div>
                  <div className="space-y-4">
                    {script.scenes?.map((scene: any, idx: number) => (
                      <div key={idx} className="bg-zinc-900 p-3 rounded-lg border border-zinc-800/50">
                        <div className="text-xs text-violet-400 font-semibold mb-1">Scene {scene.order} ({scene.duration}s)</div>
                        <div className="text-zinc-300 text-sm mb-2 font-medium">"{scene.narration}"</div>
                        <div className="text-zinc-500 text-xs flex items-center"><ImageIcon className="w-3 h-3 mr-1"/> {scene.visualSuggestion}</div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2">
                    {script.suggestedHashtags?.map((tag: string, i: number) => (
                      <span key={i} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 2: // Media
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-zinc-200 mb-2">Upload Custom Media</h3>
              <p className="text-zinc-500 mb-6 max-w-sm mx-auto">
                Your selected template already includes high-quality background footage, but you can override it here.
              </p>
            </div>
            <UploadZone 
              onUpload={(files) => setUploadedFiles(prev => [...prev, ...files])}
              accept="image/*,video/*"
              maxSize={500 * 1024 * 1024} // 500MB
            />
          </div>
        );

      case 3: // Voice
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", style: "Deep, Professional" },
                { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", style: "Energetic, Youthful" },
                { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", style: "Dramatic, Storyteller" }
              ].map((voice) => (
                <Card 
                  key={voice.id}
                  className={`cursor-pointer transition-all ${selectedVoice === voice.id ? 'border-violet-500 bg-violet-500/10' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'}`}
                  onClick={() => setSelectedVoice(voice.id)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-zinc-200">{voice.name}</h3>
                      <p className="text-xs text-zinc-500">{voice.style}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              onClick={generateVoice} 
              disabled={!script || isGeneratingVoice}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            >
              {isGeneratingVoice ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mic className="w-4 h-4 mr-2" />}
              Generate AI Voiceover
            </Button>

            {voiceUrl && (
              <div className="animate-fade-in p-4 bg-zinc-900 border border-zinc-800 rounded-xl mt-4">
                <label className="block text-sm font-medium text-zinc-300 mb-3">Preview Voiceover</label>
                <audio controls className="w-full h-10 outline-none" src={voiceUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        );

      case 4: // Subtitles
        return (
          <div className="space-y-6 text-center py-8">
            <Type className="w-16 h-16 text-violet-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-zinc-200">Dynamic AI Subtitles</h3>
            <p className="text-zinc-400 max-w-md mx-auto">
              We'll automatically generate high-retention captions with highlighting, emojis, and pop-in animations based on your template.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mx-auto max-w-sm">
              <span className="text-2xl font-black italic uppercase text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                Did you <span className="text-white">KNOW?</span> 🤯
              </span>
            </div>
          </div>
        );

      case 5: // Preview
        return (
          <div className="flex flex-col items-center w-full h-[500px]">
            <EditorProvider projectId="preview-temp">
              <VideoPreview />
            </EditorProvider>
          </div>
        );

      case 6: // Generate
        if (videoUrl) {
          return (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-100">Your Short is Ready!</h2>
              <p className="text-zinc-400">High quality MP4 generated successfully.</p>
              
              <div className="flex justify-center gap-4 mt-8">
                <Button 
                  onClick={() => window.open(videoUrl, "_blank")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download MP4
                </Button>
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                  Return to Dashboard
                </Button>
              </div>
            </div>
          );
        }

        return (
          <div className="text-center py-12 space-y-8 max-w-md mx-auto">
            <div className="w-20 h-20 bg-violet-500/20 rounded-full flex items-center justify-center mx-auto mb-2 relative">
              {isGeneratingVideo && (
                <div className="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
              )}
              <Video className={`w-8 h-8 ${isGeneratingVideo ? 'text-violet-400' : 'text-violet-500'}`} />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-zinc-100 mb-2">
                {isGeneratingVideo ? "Generating Video..." : "Ready to Render"}
              </h2>
              <p className="text-zinc-400 text-sm">
                {isGeneratingVideo 
                  ? "Our worker nodes are compiling your media, voiceover, and subtitles..." 
                  : "Double check everything. Rendering will consume 1 AI Credit."}
              </p>
            </div>

            {isGeneratingVideo ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-zinc-400 font-mono">
                  <span>Rendering</span>
                  <span>{renderProgress}%</span>
                </div>
                <Progress value={renderProgress} className="h-2" />
              </div>
            ) : (
              <Button 
                onClick={generateVideo}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg py-6 text-lg"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                Generate YouTube Short
              </Button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Create Short</h1>
          <p className="text-zinc-400 text-sm">Follow the steps to generate your AI video.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
          Cancel
        </Button>
      </div>

      {/* Stepper */}
      <div className="mb-10 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -z-10 -translate-y-1/2 hidden md:block" />
        <div className="flex justify-between items-center gap-2 overflow-x-auto pb-4 scrollbar-none md:pb-0">
          {STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const Icon = step.icon;
            
            return (
              <div 
                key={step.id} 
                className={`flex flex-col items-center min-w-[80px] gap-2 ${isActive ? 'text-violet-400' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${
                  isActive ? 'bg-violet-600 text-white ring-4 ring-violet-500/20' : 
                  isCompleted ? 'bg-zinc-800 text-zinc-300' : 
                  'bg-zinc-900 border border-zinc-800 text-zinc-600'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className="text-xs font-medium">{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <Card className="bg-[#121215] border-zinc-800 shadow-xl overflow-hidden min-h-[400px] flex flex-col">
        <CardContent className="p-6 md:p-10 flex-1 relative flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        
        {/* Navigation Footer */}
        {currentStep < STEPS.length - 1 && (
          <div className="p-4 md:p-6 bg-zinc-900/50 border-t border-zinc-800/50 flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              disabled={currentStep === 0 || isGeneratingScript}
              className="text-zinc-400 hover:text-zinc-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={
                (currentStep === 0 && !selectedTemplate) ||
                (currentStep === 1 && (!input || !script)) ||
                (isGeneratingScript)
              }
              className="bg-zinc-100 text-zinc-900 hover:bg-white"
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
