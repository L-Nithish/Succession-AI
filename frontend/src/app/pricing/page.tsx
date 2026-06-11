"use client";

import React, { useState } from 'react';
import { Check, Info, Shield, HelpCircle, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const tiers = [
    { name: "Free Tier", price: "$0", desc: "Perfect for developer sandboxing.", features: ["3 AI mock interviews per month", "Standard resume keyword parsing", "Basic dashboard metrics", "Community FAQ board access"] },
    { name: "Pro Tier", price: "$29", desc: "For candidates actively interviewing.", features: ["Unlimited AI mock interviews", "Dynamic skills-to-roadmap extraction", "Full dashboard & history metrics", "Asynchronous follow-up chat engine", "Slack community room access"], highlight: true },
    { name: "Enterprise", price: "$149", desc: "For teams and recruiter suites.", features: ["All Pro tier capabilities", "Candidate talent pools ranking logs", "Direct scheduling invite integrations", "Dedicated pipeline manager", "99.9% uptime SLA guarantee"] }
  ];

  const faqs = [
    { q: "How does the AI evaluator compute my score?", a: "The offline rule-based analyzer evaluates your text length and key framework keyword intersections (like reconciliation, diffing, row locks). In production, it queries OpenAI chat completion APIs using prompt templates." },
    { q: "Can I connect my own OpenAI/Anthropic API keys?", a: "Yes. By declaring `app.openai.api-key` in `application.yml`, the backend automatically routes requests to the LLM directly, disabling the offline mock fallbacks." },
    { q: "Is my resume parsing data private?", a: "Absolutely. All resumes uploaded locally are stored in a private directory `./uploads` mapped in the backend workspace and can be deleted by you at any time." }
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-background relative overflow-hidden py-16 px-6">
      {/* Decorative Glow */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[300px] rounded-full bg-brand-purpleGlow blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[300px] rounded-full bg-brand-blueGlow blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Pricing Plans & Community
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
            Select a plan mapped to your current job preparation requirements. Connect to the developer community channels below.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`glass-panel p-8 rounded-2xl border flex flex-col justify-between relative ${
                t.highlight ? 'border-brand-purple shadow-glowing' : 'border-charcoal-light bg-charcoal/20'
              }`}
            >
              {t.highlight && (
                <span className="absolute top-4 right-4 bg-brand-purple text-white text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 rounded">
                  MOST POPULAR
                </span>
              )}
              <div className="space-y-4">
                <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t.name}</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl md:text-5xl font-black text-white font-display">{t.price}</span>
                  <span className="text-xs text-gray-500">/ month</span>
                </div>
                <p className="text-[11px] text-gray-400 font-light leading-relaxed">{t.desc}</p>
                <div className="border-t border-charcoal-light/30 pt-6 space-y-3">
                  {t.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-xs text-gray-300">
                      <Check className="w-4 h-4 text-brand-purple shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className={`w-full py-2.5 rounded-lg text-xs font-semibold mt-8 transition-colors ${
                t.highlight ? 'bg-white text-black hover:bg-gray-200' : 'bg-charcoal border border-charcoal-light text-white hover:bg-charcoal/80'
              }`}>
                Choose {t.name}
              </button>
            </div>
          ))}
        </div>

        {/* FAQs Panel */}
        <div className="max-w-3xl mx-auto mb-24 space-y-6">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-center text-white mb-10">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-charcoal-light/40 pb-4">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center text-left py-2 text-xs font-semibold text-white hover:text-brand-purple transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-xs text-gray-500">{activeFaq === index ? '−' : '+'}</span>
              </button>
              {activeFaq === index && (
                <p className="text-[11px] text-gray-400 font-light leading-relaxed pt-2 pl-1 whitespace-pre-line">{faq.a}</p>
              )}
            </div>
          ))}
        </div>

        {/* Newsletter Signup Community */}
        <div className="max-w-4xl mx-auto p-10 rounded-2xl border border-charcoal-light bg-charcoal/10 backdrop-blur-md text-center space-y-6">
          <h3 className="text-lg md:text-2xl font-display font-semibold text-white">Join the Succession.AI Community</h3>
          <p className="text-gray-400 text-xs max-w-md mx-auto leading-relaxed font-light">
            Subscribe to our weekly engineering newsletter to get system design checklists, mock interview sheets, and compiler sandbox guides directly to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 bg-charcoal/50 border border-charcoal-light rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
            />
            <button className="py-2.5 px-6 rounded-lg bg-brand-purple text-white text-xs font-semibold hover:bg-opacity-80 transition-colors flex items-center justify-center gap-1">
              Subscribe
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.03] pointer-events-none"></div>
    </main>
  );
}
