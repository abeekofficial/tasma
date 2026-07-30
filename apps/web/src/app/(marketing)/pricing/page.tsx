"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Can I use the generated videos for commercial purposes?",
    answer: "Yes, all videos created on the Pro and Enterprise plans include a commercial license. Free tier videos require attribution."
  },
  {
    question: "How do AI credits work?",
    answer: "One credit equals approximately one minute of AI-generated video or audio. Credits refresh at the start of your billing cycle."
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Absolutely. You can cancel your subscription from your account settings. You'll retain access to your plan until the end of your billing period."
  },
  {
    question: "Do you offer custom enterprise solutions?",
    answer: "Yes, our Enterprise plan includes API access, custom integrations, and dedicated support. Contact sales for details."
  }
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for hobbyists and side projects.",
      price: isAnnual ? "0" : "0",
      period: "forever",
      features: [
        "720p watermarked exports",
        "10 AI generation credits/mo",
        "Basic timeline editor",
        "Standard voice library",
        "Community support"
      ],
      missing: [
        "Custom voice cloning",
        "Commercial rights",
        "4K export quality"
      ],
      cta: "Start Free",
      highlighted: false
    },
    {
      name: "Pro",
      description: "For professional creators and small teams.",
      price: isAnnual ? "29" : "39",
      period: "per user / month",
      features: [
        "1080p & 4K exports (no watermark)",
        "100 AI generation credits/mo",
        "Advanced timeline & effects",
        "Premium voice library & cloning",
        "Commercial rights",
        "Priority email support"
      ],
      missing: [],
      cta: "Upgrade to Pro",
      highlighted: true
    },
    {
      name: "Enterprise",
      description: "Custom solutions for scaling organizations.",
      price: "Custom",
      period: "contact us",
      features: [
        "Unlimited exports",
        "Custom AI credits volume",
        "API access",
        "SSO & advanced security",
        "Dedicated account manager",
        "24/7 phone support"
      ],
      missing: [],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 pt-24 pb-24">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Start for free, upgrade when you need more power.
          </p>
          
          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 rounded-full bg-slate-200 dark:bg-slate-800 p-1 transition-colors hover:bg-slate-300 dark:hover:bg-slate-700"
            >
              <motion.div 
                className="w-6 h-6 rounded-full bg-indigo-500 shadow-sm"
                layout
                animate={{
                  x: isAnnual ? 32 : 0
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium flex items-center gap-2 ${isAnnual ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              Annually
              <span className="px-2 py-1 text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                Save 25%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 items-start">
          {plans.map((plan, i) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-3xl border ${
                plan.highlighted 
                  ? 'bg-slate-900 dark:bg-slate-900 border-indigo-500 text-white shadow-2xl shadow-indigo-500/20' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className={`text-sm ${plan.highlighted ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  {plan.price !== "Custom" && <span className="text-3xl font-bold">$</span>}
                  <span className="text-5xl font-black">{plan.price}</span>
                </div>
                <div className={`text-sm mt-1 ${plan.highlighted ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                  {plan.period}
                </div>
              </div>

              <button className={`w-full py-3 rounded-xl font-medium mb-8 transition-colors ${
                plan.highlighted
                  ? 'bg-indigo-500 hover:bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}>
                {plan.cta}
              </button>

              <div className="space-y-4">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-3 text-sm">
                    <Check className={`w-5 h-5 shrink-0 ${plan.highlighted ? 'text-indigo-400' : 'text-indigo-500'}`} />
                    <span className={plan.highlighted ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}>{feature}</span>
                  </div>
                ))}
                {plan.missing.map((feature, j) => (
                  <div key={`missing-${j}`} className="flex items-start gap-3 text-sm">
                    <X className="w-5 h-5 shrink-0 text-slate-300 dark:text-slate-600" />
                    <span className="text-slate-400 dark:text-slate-500">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-600 dark:text-slate-400">Everything you need to know about our pricing.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-4 text-slate-600 dark:text-slate-400"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
