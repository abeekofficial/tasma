'use client';

import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, X, File, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface UploadZoneProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
}

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export function UploadZone({ 
  onUpload, 
  accept = 'image/*,video/*,audio/*', 
  maxSize = 100 * 1024 * 1024, // 100MB default
  multiple = true 
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const validFiles: File[] = [];
    const newUploads: UploadItem[] = [];

    Array.from(files).forEach((file) => {
      const id = Math.random().toString(36).substring(7);
      
      if (file.size > maxSize) {
        newUploads.push({
          id,
          file,
          progress: 0,
          status: 'error',
          error: `File exceeds ${(maxSize / (1024 * 1024)).toFixed(0)}MB limit`
        });
      } else {
        validFiles.push(file);
        newUploads.push({
          id,
          file,
          progress: 0,
          status: 'uploading'
        });
        
        // Simulate upload progress for UI demonstration
        simulateUpload(id);
      }
    });

    setUploads(prev => [...prev, ...newUploads]);
    if (validFiles.length > 0) {
      onUpload(validFiles);
    }
  };

  const simulateUpload = (id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploads(prev => prev.map(u => u.id === id ? { ...u, progress, status: 'success' } : u));
      } else {
        setUploads(prev => prev.map(u => u.id === id ? { ...u, progress } : u));
      }
    }, 500);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [maxSize, onUpload]);

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      <div 
        className={`
          relative w-full rounded-2xl border-2 border-dashed p-10 transition-all text-center
          ${isDragging 
            ? 'border-violet-500 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.15)]' 
            : 'border-zinc-700 hover:border-zinc-600 bg-zinc-900/30 hover:bg-zinc-900/50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept={accept}
          multiple={multiple}
          onChange={(e) => processFiles(e.target.files)}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
            <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-violet-400 animate-bounce' : ''}`} />
          </div>
          <div>
            <p className="text-lg font-medium text-zinc-200">
              Drag & drop files here, or <span className="text-violet-400 cursor-pointer">browse</span>
            </p>
            <p className="text-sm text-zinc-500 mt-2">
              Supports Images, Videos, and Audio up to {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      </div>

      {uploads.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-zinc-300">Uploads</h4>
          {uploads.map((upload) => (
            <div key={upload.id} className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-3 flex items-center gap-4 animate-fade-in">
              <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <File className="w-5 h-5 text-zinc-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-medium text-zinc-200 truncate pr-4">{upload.file.name}</span>
                  <span className="text-xs text-zinc-500 flex-shrink-0">{formatFileSize(upload.file.size)}</span>
                </div>
                
                {upload.status === 'error' ? (
                  <p className="text-xs text-red-400 flex items-center mt-1">
                    <AlertCircle className="w-3 h-3 mr-1" /> {upload.error}
                  </p>
                ) : (
                  <Progress 
                    value={upload.progress} 
                    size="sm" 
                    variant={upload.status === 'success' ? 'success' : 'primary'}
                  />
                )}
              </div>
              
              <div className="flex-shrink-0">
                {upload.status === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeUpload(upload.id); }}
                    className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
