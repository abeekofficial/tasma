import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950 py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-violet-500" />
              <span className="text-xl font-bold text-zinc-100">Tasma</span>
            </Link>
            <p className="text-zinc-400 text-sm">
              The ultimate AI video studio for modern creators and marketing teams.
            </p>
          </div>
          
          <div>
            <h3 className="text-zinc-100 font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="#features" className="hover:text-zinc-100 transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-zinc-100 transition-colors">Pricing</Link></li>
              <li><Link href="#integrations" className="hover:text-zinc-100 transition-colors">Integrations</Link></li>
              <li><Link href="#changelog" className="hover:text-zinc-100 transition-colors">Changelog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-zinc-100 font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/blog" className="hover:text-zinc-100 transition-colors">Blog</Link></li>
              <li><Link href="/docs" className="hover:text-zinc-100 transition-colors">Documentation</Link></li>
              <li><Link href="/help" className="hover:text-zinc-100 transition-colors">Help Center</Link></li>
              <li><Link href="/community" className="hover:text-zinc-100 transition-colors">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-zinc-100 font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/privacy" className="hover:text-zinc-100 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-zinc-100 transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-zinc-100 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Tasma, Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="https://twitter.com/tasma" className="hover:text-zinc-300">Twitter</Link>
            <Link href="https://github.com/tasma" className="hover:text-zinc-300">GitHub</Link>
            <Link href="https://discord.gg/tasma" className="hover:text-zinc-300">Discord</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
