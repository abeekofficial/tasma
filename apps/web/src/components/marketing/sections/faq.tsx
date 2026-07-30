"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does the AI generation actually work?",
      answer: "Our platform uses fine-tuned large language models tailored specifically for UI component generation. It analyzes your natural language prompt and synthesizes production-ready React code styled with Tailwind CSS, leveraging our extensive design system.",
    },
    {
      question: "Can I self-host the Enterprise version?",
      answer: "Yes, our Enterprise plan includes options for on-premise deployment or deployment within your own private cloud infrastructure (AWS, GCP, Azure). Contact our sales team for architecture details.",
    },
    {
      question: "What happens if I exceed my monthly project limit on the Starter plan?",
      answer: "Your existing projects will remain fully functional, but you won't be able to create new ones until you upgrade your plan or remove an existing project. We'll send you a friendly notification before you hit your limit.",
    },
    {
      question: "Do you offer discounts for open-source projects or students?",
      answer: "Absolutely! We're committed to supporting the community. Students and open-source maintainers can apply for a free Pro license through our community program page.",
    },
    {
      question: "How easy is it to migrate from other platforms?",
      answer: "We provide automated CLI tools and detailed documentation to make migration as seamless as possible. Most teams complete their migration in a matter of days, and our support team is available to help with any complex configurations.",
    },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div
                key={index}
                className="border rounded-xl bg-background overflow-hidden transition-colors hover:border-primary/50"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-medium text-lg">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="text-muted-foreground flex-shrink-0 ml-4"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.section
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { opacity: 1, height: "auto", marginBottom: 24 },
                        collapsed: { opacity: 0, height: 0, marginBottom: 0 }
                      }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div className="px-6 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
