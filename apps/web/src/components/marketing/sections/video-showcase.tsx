import Image from "next/image";
import { Play } from "lucide-react";

export function VideoShowcase() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            See it in action
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Discover how easy it is to supercharge your workflow.
          </p>
        </div>

        <div className="relative group cursor-pointer rounded-2xl overflow-hidden border bg-muted/20 shadow-2xl aspect-video max-w-5xl mx-auto">
          <Image
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070"
            alt="Platform showcase video"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/30 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110 border border-white/30">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl">
                <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
          
          {/* Glassmorphism bottom bar overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex items-end">
            <div className="text-white">
              <h3 className="font-semibold text-lg md:text-xl">Platform Overview</h3>
              <p className="text-white/70 text-sm md:text-base">2:45 • Introducing the new features</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
