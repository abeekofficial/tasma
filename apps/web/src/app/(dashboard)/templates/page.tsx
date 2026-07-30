'use client';

import React, { useState } from 'react';
import { Search, Star, Copy, Play, TrendingUp } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SkeletonCard } from '@/components/ui/skeleton';

const CATEGORIES = ['All', 'Reddit Story', 'Top List', 'Podcast Clip', 'Product Showcase', 'Tutorial', 'News', 'Custom'];

const MOCK_TEMPLATES = [
  { id: '1', name: 'Reddit Story Minimal', category: 'Reddit Story', platform: 'TikTok', rating: 4.8, uses: '12k', color: 'from-orange-500 to-red-500' },
  { id: '2', name: 'Top 5 Tech Gadgets', category: 'Top List', platform: 'YouTube Shorts', rating: 4.9, uses: '8.5k', color: 'from-blue-500 to-cyan-500' },
  { id: '3', name: 'Podcast Split Screen', category: 'Podcast Clip', platform: 'Instagram Reels', rating: 4.7, uses: '15k', color: 'from-violet-500 to-purple-500' },
  { id: '4', name: 'Viral News Flash', category: 'News', platform: 'TikTok', rating: 4.6, uses: '5k', color: 'from-emerald-500 to-teal-500' },
  { id: '5', name: 'Product Reveal Pro', category: 'Product Showcase', platform: 'Instagram Reels', rating: 4.9, uses: '22k', color: 'from-pink-500 to-rose-500' },
];

export default function TemplatesPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(false);

  const filteredTemplates = MOCK_TEMPLATES.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeTab === 'All' || t.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full space-y-8 animate-fade-in pb-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Templates</h1>
        <p className="text-sm text-zinc-400">Jumpstart your videos with professional AI templates.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <Input 
          placeholder="Search templates for any style or platform..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 py-6 text-lg bg-zinc-900/50 border-zinc-800 rounded-xl w-full max-w-2xl"
        />
      </div>

      {!search && activeTab === 'All' && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-zinc-200">Featured & Trending</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl overflow-hidden border border-zinc-800/60 flex h-64 group relative">
              <div className="w-1/2 bg-gradient-to-br from-violet-600 to-purple-800 relative">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                  <Button variant="secondary" className="rounded-full shadow-lg">
                    <Play className="w-4 h-4 mr-2" /> Preview
                  </Button>
                </div>
              </div>
              <div className="w-1/2 p-6 flex flex-col justify-center">
                <Badge variant="secondary" className="w-fit mb-3 bg-violet-500/20 text-violet-300">New Trending</Badge>
                <h3 className="text-2xl font-bold text-zinc-100 mb-2">Dynamic Storyteller</h3>
                <p className="text-zinc-400 text-sm mb-6 line-clamp-2">Perfect for Reddit stories with dynamic auto-captions and background gameplay.</p>
                <Button className="w-full">Use Template</Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} variant="pill" className="w-full">
          <div className="overflow-x-auto pb-2 scrollbar-none mb-6">
            <TabsList className="bg-transparent border-none p-0 inline-flex min-w-max gap-2">
              {CATEGORIES.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="rounded-full px-5 py-2 data-[state=active]:bg-violet-600 data-[state=active]:text-white bg-zinc-900 border border-zinc-800"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0 outline-none">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} className="h-72" />)}
              </div>
            ) : filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map(template => (
                  <div key={template.id} className="glass rounded-xl border border-zinc-800/60 overflow-hidden group hover:border-violet-500/50 transition-colors flex flex-col">
                    <div className={`h-40 bg-gradient-to-br ${template.color} relative`}>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-black/40 backdrop-blur-md text-white border-none">{template.platform}</Badge>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm">
                        <Button variant="secondary" size="sm" className="rounded-full">
                          <Play className="w-3 h-3 mr-2" /> Preview
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-zinc-100 truncate pr-2">{template.name}</h3>
                      </div>
                      <p className="text-xs text-zinc-500 mb-4">{template.category}</p>
                      
                      <div className="mt-auto flex items-center justify-between text-xs text-zinc-400 mb-4">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-amber-500 mr-1 fill-amber-500" />
                          {template.rating}
                        </div>
                        <div className="flex items-center">
                          <Copy className="w-3 h-3 mr-1" />
                          {template.uses} uses
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-colors">
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 mb-4">
                  <Search className="w-8 h-8 text-zinc-500" />
                </div>
                <h3 className="text-xl font-medium text-zinc-200 mb-2">No templates found</h3>
                <p className="text-zinc-400">Try adjusting your search or category filter.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
