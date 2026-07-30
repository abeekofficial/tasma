'use client';

import React from 'react';
import { Download, FileVideo, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ExportHistoryPage() {
  const exports = [
    {
      id: '1',
      project: 'Marketing Campaign Intro',
      format: 'MP4',
      resolution: '1080p',
      size: '45.2 MB',
      date: '2024-03-15T14:30:00Z',
      status: 'completed',
      url: '#'
    },
    {
      id: '2',
      project: 'Product Demo Flow',
      format: 'MP4',
      resolution: '4K',
      size: '128.5 MB',
      date: '2024-03-14T09:15:00Z',
      status: 'processing',
      url: null
    },
    {
      id: '3',
      project: 'Social Media Snippet',
      format: 'GIF',
      resolution: '720p',
      size: '12.1 MB',
      date: '2024-03-12T16:45:00Z',
      status: 'failed',
      url: null
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Completed</span>;
      case 'processing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">Processing</span>;
      case 'failed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">Failed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Export History</h1>
        <p className="text-sm text-zinc-400 mt-1">View and download your previously exported videos.</p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 bg-zinc-800/50 uppercase border-b border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Project</th>
                <th className="px-6 py-4 font-medium">Format</th>
                <th className="px-6 py-4 font-medium">Resolution</th>
                <th className="px-6 py-4 font-medium">Size</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {exports.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileVideo className="w-4 h-4 text-violet-400" />
                      <span className="font-medium text-zinc-200">{item.project}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">{item.format}</td>
                  <td className="px-6 py-4 text-zinc-400">{item.resolution}</td>
                  <td className="px-6 py-4 text-zinc-400">{item.size || '-'}</td>
                  <td className="px-6 py-4 text-zinc-400">{formatDate(item.date)}</td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-right">
                    {item.status === 'completed' && (
                      <button className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {exports.length === 0 && (
          <div className="text-center py-12">
            <FileVideo className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400">No exports yet.</p>
          </div>
        )}
        
        {/* Pagination placeholder */}
        {exports.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-900/30">
            <span className="text-sm text-zinc-500">Showing 1 to 3 of 3 entries</span>
            <div className="flex gap-2">
              <button disabled className="p-1 rounded bg-zinc-800 text-zinc-600 disabled:opacity-50">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button disabled className="p-1 rounded bg-zinc-800 text-zinc-600 disabled:opacity-50">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
