"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  const tiers = [
    {
      name: "Starter",
      description: "Perfect for individuals and small projects.",
      monthlyPrice: "$15",
      yearlyPrice: "$12",
      features: ["Up to 3 projects", "Basic analytics", "24-hour support response time", "Community access"],
      highlighted: false,
    },
    {
      name: "Pro",
      description: "Ideal for growing teams and businesses.",
      monthlyPrice: "$49",
      yearlyPrice: "$39",
      features: ["Unlimited projects", "Advanced analytics", "1-hour support response time", "Custom domains", "Team collaboration"],
      highlighted: true,
    },
    {
      name: "Enterprise",
      description: "For large scale organizations with custom needs.",
      monthlyPrice: "Custom",
      yearlyPrice: "Custom",
      features: ["Everything in Pro", "Dedicated success manager", "SSO & SAML", "Custom SLAs", "On-premise deployment options"],
      highlighted: false,
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your needs. Always know what you'll pay.
          </p>

          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-8 bg-muted rounded-full p-1 transition-colors hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <motion.div
                className="w-6 h-6 bg-background rounded-full shadow-sm border"
                animate={{ x: isYearly ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium flex items-center gap-2 ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              Yearly
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-semibold">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-3xl p-8 border ${
                tier.highlighted
                  ? "bg-background shadow-2xl shadow-primary/10 border-primary/50"
                  : "bg-muted/10 shadow-lg"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}
              {tier.highlighted && (
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl pointer-events-none" />
              )}
              
              <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-muted-foreground text-sm min-h-[40px]">{tier.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    {tier.name === "Enterprise" ? tier.monthlyPrice : (isYearly ? tier.yearlyPrice : tier.monthlyPrice)}
                  </span>
                  {tier.name !== "Enterprise" && <span className="text-muted-foreground font-medium">/mo</span>}
                </div>
              </div>

              <ul className="space-y-4 mb-8 relative z-10">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-medium transition-all relative z-10 ${
                  tier.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {tier.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
