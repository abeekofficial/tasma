'use client';

import React, { useState } from 'react';
import { Laptop, Smartphone, Tablet, Globe, Clock, ShieldAlert, LogOut } from 'lucide-react';

type Session = {
  id: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  ip: string;
  location?: string;
  lastActive: string;
  isCurrent: boolean;
};

export default function SessionsPage() {
  // Mock data for initial UI
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      device: 'desktop',
      browser: 'Chrome 120.0',
      os: 'Windows 11',
      ip: '192.168.1.42',
      location: 'San Francisco, CA',
      lastActive: 'Just now',
      isCurrent: true
    },
    {
      id: '2',
      device: 'mobile',
      browser: 'Safari',
      os: 'iOS 17.2',
      ip: '192.168.1.15',
      location: 'San Jose, CA',
      lastActive: '2 hours ago',
      isCurrent: false
    }
  ]);
  const [isRevoking, setIsRevoking] = useState<string | null>(null);

  const handleRevoke = async (id: string) => {
    setIsRevoking(id);
    // Simulate API call
    setTimeout(() => {
      setSessions(prev => prev.filter(s => s.id !== id));
      setIsRevoking(null);
    }, 1000);
  };

  const handleLogoutAll = () => {
    // Simulate API call
    setSessions(prev => prev.filter(s => s.isCurrent));
  };

  const DeviceIcon = ({ type }: { type: Session['device'] }) => {
    switch (type) {
      case 'desktop': return <Laptop className="w-5 h-5" />;
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'tablet': return <Tablet className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Active Sessions</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage devices currently signed into your account.</p>
        </div>
        
        {sessions.length > 1 && (
          <button 
            onClick={handleLogoutAll}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-red-500/50 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign out all other devices
          </button>
        )}
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div 
            key={session.id} 
            className={`p-5 rounded-xl border ${session.isCurrent ? 'bg-violet-900/10 border-violet-500/30' : 'bg-zinc-900/50 border-zinc-800'} backdrop-blur-xl flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${session.isCurrent ? 'bg-violet-500/20 text-violet-400' : 'bg-zinc-800 text-zinc-400'}`}>
                <DeviceIcon type={session.device} />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-zinc-100">{session.os} · {session.browser}</h3>
                  {session.isCurrent && (
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-violet-500/20 text-violet-400 border border-violet-500/20">
                      This device
                    </span>
                  )}
                </div>
                
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
                  <span className="flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> {session.ip}</span>
                  {session.location && (
                    <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {session.location}</span>
                  )}
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {session.lastActive}</span>
                </div>
              </div>
            </div>

            {!session.isCurrent && (
              <button
                onClick={() => handleRevoke(session.id)}
                disabled={isRevoking === session.id}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-zinc-300 hover:text-red-400 bg-zinc-800 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
              >
                {isRevoking === session.id ? 'Revoking...' : 'Revoke'}
              </button>
            )}
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="text-center py-12 bg-zinc-900/30 rounded-xl border border-zinc-800 border-dashed">
            <Globe className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400">No active sessions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
