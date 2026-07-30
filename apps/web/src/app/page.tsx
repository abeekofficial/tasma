import { Navbar } from "@/components/marketing/navigation/navbar";
import { Footer } from "@/components/marketing/navigation/footer";

// Note: These would typically be imported from other files once created by other agents
const HeroSection = () => <section id="hero" className="min-h-screen flex items-center justify-center border-b border-white/10 text-zinc-500 pt-16">Hero Section Placeholder</section>;
const FeaturesSection = () => <section id="features" className="py-24 flex items-center justify-center border-b border-white/10 text-zinc-500">Features Section Placeholder</section>;
const WorkflowSection = () => <section id="workflow" className="py-24 flex items-center justify-center border-b border-white/10 text-zinc-500">Workflow Section Placeholder</section>;
const AiDemoSection = () => <section id="ai-demo" className="py-24 flex items-center justify-center border-b border-white/10 text-zinc-500">AI Demo Section Placeholder</section>;
const VideoShowcaseSection = () => <section id="showcase" className="py-24 flex items-center justify-center border-b border-white/10 text-zinc-500">Video Showcase Section Placeholder</section>;
const TestimonialsSection = () => <section id="testimonials" className="py-24 flex items-center justify-center border-b border-white/10 text-zinc-500">Testimonials Section Placeholder</section>;
const PricingSection = () => <section id="pricing" className="py-24 flex items-center justify-center border-b border-white/10 text-zinc-500">Pricing Section Placeholder</section>;
const FaqSection = () => <section id="faq" className="py-24 flex items-center justify-center border-b border-white/10 text-zinc-500">FAQ Section Placeholder</section>;
const IntegrationsSection = () => <section id="integrations" className="py-24 flex items-center justify-center border-b border-white/10 text-zinc-500">Integrations Section Placeholder</section>;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <AiDemoSection />
        <VideoShowcaseSection />
        <TestimonialsSection />
        <IntegrationsSection />
        <PricingSection />
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}
