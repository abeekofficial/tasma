import Image from "next/image";

export function Testimonials() {
  const testimonials = [
    {
      body: "This platform has completely transformed how our team collaborates. The speed and intuitiveness are unmatched.",
      author: {
        name: "Sarah Jenkins",
        handle: "@sarahj",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
      },
    },
    {
      body: "I was skeptical at first, but the AI features actually work as advertised. It saves me hours every week.",
      author: {
        name: "David Chen",
        handle: "@davidchen_dev",
        imageUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop",
      },
    },
    {
      body: "Beautifully designed and incredibly powerful. It feels like the future of software development.",
      author: {
        name: "Elena Rodriguez",
        handle: "@elenarod",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
      },
    },
    {
      body: "The premium feel isn't just skin deep. The architecture underneath is solid, making scaling a breeze.",
      author: {
        name: "Marcus Johnson",
        handle: "@marcusj_tech",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      },
    },
    {
      body: "Finally, a tool that respects the developer's time. Clean UI, fast interactions, zero bloat.",
      author: {
        name: "Alex Kim",
        handle: "@alexkim",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      },
    },
    {
      body: "We migrated our entire enterprise workflow here and haven't looked back. Highly recommended for serious teams.",
      author: {
        name: "Rachel Moore",
        handle: "@rachelmoore",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
      },
    },
  ];

  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Loved by builders
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Don't just take our word for it. Here's what the community is saying.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="break-inside-avoid bg-background border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-foreground/80 mb-6 leading-relaxed">
                "{testimonial.body}"
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                  <Image
                    src={testimonial.author.imageUrl}
                    alt={testimonial.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{testimonial.author.name}</h4>
                  <p className="text-muted-foreground text-xs">{testimonial.author.handle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
