"use client";

import React from 'react';
import Link from 'next/link';
import { Terminal, Shield, Zap, Sparkles, Code, Mic, BarChart3, Users } from 'lucide-react';

export default function HomePage() {
  const stats = [
    { label: "AI Evaluations Conducted", value: "2.4M+" },
    { label: "Lighthouse Speed Score", value: "99" },
    { label: "Resume Extraction Accuracy", value: "98.7%" },
    { label: "Hired Success Index", value: "94.2%" }
  ];

  const roadmapSteps = [
    { number: "01", title: "Analyze Resume", desc: "Upload your CV and parse core skill clusters instantly." },
    { number: "02", title: "AI mock Interview", desc: "Simulate a live interview with technical and behavioral follow-up questions." },
    { number: "03", title: "Review feedback", desc: "Get an aggregate evaluation score, qualitative critiques, and weak point logs." },
    { number: "04", title: "Hired", desc: "Track progress charts and enter enterprise ranking tables for recruiters." }
  ];

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[350px] rounded-full bg-brand-purpleGlow blur-[160px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-brand-blueGlow blur-[140px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-charcoal-light bg-charcoal/50 backdrop-blur-md text-xs font-semibold text-brand-purple tracking-widest uppercase mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Category-defining interview training</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-8 leading-none max-w-5xl mx-auto">
          <span className="text-white block md:inline">Master Your </span>
          <span className="gradient-text block md:inline">Next Interview</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          The world's most intelligent interview preparation platform. Analyze resumes, practice technical or coding challenges, and review quantitative AI evaluation scorecards.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link
            href="/mock"
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors shadow-glowing flex items-center justify-center gap-2"
          >
            Start Free Mock
            <Zap className="w-4 h-4 fill-current" />
          </Link>
          <Link
            href="/features"
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg border border-charcoal-light bg-charcoal/30 backdrop-blur-sm text-gray-300 font-semibold text-sm hover:bg-charcoal/60 transition-colors flex items-center justify-center gap-2"
          >
            Explore Features
            <Terminal className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-2xl border border-charcoal-light bg-charcoal/20 backdrop-blur-md">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center md:text-left md:border-r last:border-none border-charcoal-light/40 px-4">
              <span className="block text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</span>
              <span className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature cards Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-semibold text-white tracking-tight mb-4">
            Cinematic Feature Architecture
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Our platform provides enterprise-grade analytical tools to prepare candidates from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-brand-purpleGlow flex items-center justify-center border border-brand-purple/20 mb-6">
              <Code className="w-5 h-5 text-brand-purple" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">Live Coding Sandbox</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Solve technical compiler queries directly inside the console. Verifies syntax, parses braces, and runs local tests.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-brand-blueGlow flex items-center justify-center border border-brand-blue/20 mb-6">
              <Mic className="w-5 h-5 text-brand-blue" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">Voice Mock Engines</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Experience natural dialogue flow. The AI interviewer processes your speech, flashes a typing state, and prompts follow-ups.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-brand-purpleGlow flex items-center justify-center border-brand-cyan/20 mb-6" style={{backgroundColor: 'rgba(6, 182, 212, 0.1)'}}>
              <BarChart3 className="w-5 h-5 text-brand-cyan" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">Analytics Skill Radar</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Visualize preparation indexes. Dynamically tracks weaknesses, logs scores, and maps hiring tags.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-32">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-display font-semibold text-white tracking-tight mb-4">
            Interactive User Pipeline
          </h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            From resume upload to hiring, follow our four-step ecosystem layout.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative">
          {roadmapSteps.map((step, index) => (
            <div key={step.title} className="relative p-6 rounded-xl border border-charcoal-light bg-charcoal/10 backdrop-blur-sm hover:border-brand-purple/30 transition-colors group">
              <span className="absolute top-4 right-4 text-3xl font-extrabold text-charcoal-light group-hover:text-brand-purple/20 transition-colors font-display">
                {step.number}
              </span>
              <h3 className="text-base font-semibold text-white mb-3 mt-6 uppercase tracking-wider">{step.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24 text-center">
        <div className="p-12 rounded-3xl border border-charcoal-light bg-gradient-to-br from-charcoal to-charcoal-dark relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-glow opacity-60 pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              Ready to land your dream role?
            </h2>
            <p className="text-gray-400 text-xs md:text-sm max-w-lg mx-auto mb-10 leading-relaxed font-light">
              Get direct recruiter access, mock interview consoles, and custom learning roadmaps today.
            </p>
            <Link
              href="/mock"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-colors shadow-glowing"
            >
              Get Started Instantly
              <Zap className="w-4 h-4 fill-current" />
            </Link>
          </div>
        </div>
      </section>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.03] pointer-events-none"></div>
    </main>
  );
}
