"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Key, Trash2, Copy, Check } from "lucide-react";

export default function ApiKeysPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const keys = [
    { id: "1", name: "Production API Key", prefix: "tsm_prod_...", created: "Oct 12, 2023", lastUsed: "2 mins ago", status: "active" },
    { id: "2", name: "Development Key", prefix: "tsm_dev_...", created: "Nov 05, 2023", lastUsed: "5 days ago", status: "active" },
  ];

  const handleCopy = (id: string) => {
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage your API keys for developer access.</CardDescription>
          </div>
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Create New Key
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {keys.map((key) => (
              <div key={key.id} className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Key className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-zinc-200">{key.name}</h4>
                        <Badge variant="success" className="h-5 px-1.5 text-[10px]">Active</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <code className="px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-xs text-zinc-400 font-mono">
                          {key.prefix}
                        </code>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0"
                          onClick={() => handleCopy(key.id)}
                        >
                          {copied === key.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                      <p className="text-xs text-zinc-500 mt-2">
                        Created on {key.created} • Last used {key.lastUsed}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-rose-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
