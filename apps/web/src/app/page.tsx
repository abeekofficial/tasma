import Link from "next";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, Video, Mic, Edit3, Type, Share2, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 glass border-x-0 border-t-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-violet-500" />
          <span className="text-xl font-bold text-zinc-100">Tasma</span>
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="primary">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-32 pb-24 text-center">
        <div className="animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-100 mb-6 tracking-tight max-w-4xl mx-auto">
            Create Viral Videos with <span className="text-gradient">AI</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            The all-in-one AI video studio for creators and teams. Generate scripts, voices, and stunning visuals in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto px-8">
                Get Started Free
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 gap-2">
              <Play className="w-4 h-4" /> Watch Demo
            </Button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {[
            { icon: Type, title: "AI Script Generation", desc: "Generate engaging scripts tuned for high retention." },
            { icon: Mic, title: "Realistic AI Voices", desc: "Clone your voice or choose from our premium library." },
            { icon: Edit3, title: "Timeline Editor", desc: "Professional web-based editor with infinite tracks." },
            { icon: Video, title: "Auto Subtitles", desc: "Dynamic, animated captions that catch the eye." },
            { icon: Share2, title: "Social Publishing", desc: "Directly publish to TikTok, YouTube, and Instagram." },
            { icon: Users, title: "Team Collaboration", desc: "Work together with real-time editing and comments." },
          ].map((feature, i) => (
            <div key={i} className="glass glass-hover p-6 rounded-2xl animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-violet-500">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-zinc-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="mt-32 pb-20">
          <h2 className="text-3xl font-bold text-zinc-100 mb-12">Simple, transparent pricing</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {["Free", "Creator", "Pro", "Team", "Enterprise"].map((plan) => (
              <div key={plan} className="glass p-8 rounded-2xl w-full max-w-xs text-left hover:border-violet-500/50 transition-all duration-300">
                <h3 className="text-2xl font-bold text-zinc-100 mb-2">{plan}</h3>
                <div className="text-3xl font-bold text-zinc-100 mb-6">
                  {plan === "Free" ? "$0" : plan === "Creator" ? "$19" : plan === "Pro" ? "$49" : plan === "Team" ? "$99" : "Custom"}
                  <span className="text-lg text-zinc-500 font-normal">/mo</span>
                </div>
                <ul className="space-y-3 mb-8 text-zinc-400">
                  <li className="flex items-center gap-2">✓ Feature included</li>
                  <li className="flex items-center gap-2">✓ Feature included</li>
                  <li className="flex items-center gap-2">✓ Feature included</li>
                </ul>
                <Button variant={plan === "Pro" ? "primary" : "outline"} className="w-full">
                  Choose {plan}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 py-8 text-center text-zinc-500">
        <p>&copy; {new Date().getFullYear()} Tasma. All rights reserved.</p>
      </footer>
    </div>
  );
}
