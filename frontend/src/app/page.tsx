"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Code, Mic, Shield, Cpu, Radar, Users, ChevronDown } from 'lucide-react';
import HeroBackground from '@/components/HeroBackground';

gsap.registerPlugin(ScrollTrigger);

export default function ExperientialHome() {
  const mainRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Text Scale & Fade on Scroll
      if (heroTextRef.current) {
        gsap.to(heroTextRef.current, {
          scale: 1.5,
          opacity: 0,
          filter: "blur(10px)",
          ease: "none",
          scrollTrigger: {
            trigger: mainRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        });
      }

      // 2. Horizontal Scroll Section
      if (horizontalSectionRef.current && horizontalContainerRef.current) {
        let getToValue = () => -(horizontalSectionRef.current!.scrollWidth - window.innerWidth);
        
        gsap.to(horizontalSectionRef.current, {
          x: getToValue,
          ease: "none",
          scrollTrigger: {
            trigger: horizontalContainerRef.current,
            pin: true,
            pinType: "transform",
            scrub: 1,
            invalidateOnRefresh: true,
            end: () => "+=" + (horizontalSectionRef.current!.scrollWidth - window.innerWidth)
          }
        });
      }
    }, mainRef);

    return () => ctx.revert(); // cleanup
  }, []);

  return (
    <main ref={mainRef} className="bg-black text-white selection:bg-white selection:text-black font-sans w-full">
      
      {/* 1. BRUTALIST HERO */}
      <section className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden">
        <HeroBackground />
        
        <h1 
          ref={heroTextRef}
          className="text-[12vw] font-display font-extrabold uppercase leading-[0.8] tracking-tighter text-center mix-blend-difference z-10"
        >
          Transcend <br />
          <span className="text-transparent stroke-text" style={{ WebkitTextStroke: '2px white' }}>The Average</span>
        </h1>
        
        <div className="absolute bottom-10 flex w-full justify-between px-10 text-xs font-mono uppercase tracking-widest text-gray-500">
          <p>Scroll to Explore</p>
          <p>AI Interview Ecosystem V2</p>
        </div>
      </section>

      {/* 2. PINNED HORIZONTAL SCROLLING SECTION */}
      <section ref={horizontalContainerRef} className="h-screen w-full overflow-hidden bg-white text-black relative">
        <div 
          ref={horizontalSectionRef}
          className="flex h-full w-[300vw]"
        >
          {/* Panel 1: The Intro */}
          <div className="horizontal-panel w-screen shrink-0 h-full flex flex-col justify-center px-12 md:px-32 border-r border-black/10 relative">
            <h2 className="text-6xl md:text-[8vw] font-display font-black leading-none tracking-tighter mb-8 uppercase">
              Not Just Another <br/> Dashboard.
            </h2>
            <p className="max-w-2xl text-xl md:text-3xl font-light text-gray-600 leading-snug">
              We stripped away the clutter. What remains is a hyper-focused, ruthless engine designed to simulate FAANG-level engineering interviews.
            </p>
          </div>

          {/* Panel 2: Code Editor */}
          <div className="horizontal-panel w-screen shrink-0 h-full flex items-center justify-center p-12 relative bg-gray-50">
            <div className="absolute top-12 left-12">
              <Code className="w-16 h-16 text-black mb-4" />
              <h3 className="text-4xl font-display font-bold uppercase">Live Compilation</h3>
            </div>
            
            {/* Brutalist Code Mockup */}
            <div className="w-full max-w-4xl h-[60vh] bg-black text-white rounded-none border-[8px] border-black p-8 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.1)] flex flex-col">
              <div className="flex gap-2 mb-8 border-b border-white/20 pb-4">
                <div className="w-3 h-3 rounded-full bg-white"></div>
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              </div>
              <pre className="font-mono text-sm md:text-lg text-emerald-400 overflow-hidden">
                <code>{`function optimizeAlgorithm(matrix) {
  // AI is analyzing your space complexity...
  const optimized = new Map();
  for (let i = 0; i < matrix.length; i++) {
    // 99.8% Efficiency reached
    processNode(matrix[i], optimized);
  }
  return optimized;
}`}</code>
              </pre>
            </div>
          </div>

          {/* Panel 3: Voice / Behavioral */}
          <div className="horizontal-panel w-screen shrink-0 h-full flex flex-col justify-center px-12 md:px-32 bg-black text-white relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_50%)] pointer-events-none"></div>
            <Mic className="w-20 h-20 text-white mb-8" />
            <h2 className="text-6xl md:text-[8vw] font-display font-black leading-none tracking-tighter mb-8 uppercase text-transparent stroke-text" style={{ WebkitTextStroke: '2px white' }}>
              Speak. We Listen.
            </h2>
            <p className="max-w-xl text-lg md:text-2xl font-light text-gray-400 leading-snug">
              Zero-latency conversational intelligence. The engine processes semantic depth, hesitation markers, and confidence vectors in real time.
            </p>
          </div>
        </div>
      </section>

      {/* 3. TECHNOLOGY STACK GRID */}
      <section className="py-32 w-full bg-black text-white border-t border-white/10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <Cpu className="w-12 h-12 text-gray-500" />
            <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter">Under the Hood</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tech Card 1 */}
            <div className="border border-white/10 p-10 hover:bg-white/5 transition-colors group">
              <h3 className="text-2xl font-bold font-mono mb-4 text-brand-purple">GPT-4o Matrix</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Powered by OpenAI's flagship models, delivering zero-latency semantic evaluation of algorithmic time/space complexities and behavioral nuances.
              </p>
            </div>
            {/* Tech Card 2 */}
            <div className="border border-white/10 p-10 hover:bg-white/5 transition-colors group">
              <h3 className="text-2xl font-bold font-mono mb-4 text-emerald-400">Whisper ASR</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Real-time vocal cadence tracking. We measure confidence, hesitation markers, and tone to provide actionable feedback on your communication style.
              </p>
            </div>
            {/* Tech Card 3 */}
            <div className="border border-white/10 p-10 hover:bg-white/5 transition-colors group">
              <h3 className="text-2xl font-bold font-mono mb-4 text-brand-cyan">Virtual Threads</h3>
              <p className="text-gray-400 font-light leading-relaxed">
                Built on Java 21 architecture to handle thousands of concurrent mock interviews without a single dropped frame or backend timeout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SKILL RADAR PREVIEW */}
      <section className="min-h-screen w-full flex flex-col md:flex-row bg-white text-black">
        <div className="w-full md:w-1/2 p-12 md:p-32 flex flex-col justify-center border-r border-black/10">
          <Radar className="w-16 h-16 text-black mb-8" />
          <h2 className="text-5xl md:text-7xl font-display font-black leading-none tracking-tighter mb-8 uppercase">
            Data-Driven <br/> Execution.
          </h2>
          <p className="text-xl font-light text-gray-600 max-w-lg mb-10">
            Stop guessing. Our engine maps your performance across 15 distinct FAANG evaluation vectors. We expose your weaknesses before the recruiter does.
          </p>
          <ul className="space-y-4 font-mono text-sm">
            <li className="flex items-center gap-4"><div className="w-2 h-2 bg-black"></div> 100% Algorithmic Depth</li>
            <li className="flex items-center gap-4"><div className="w-2 h-2 bg-gray-400"></div> 85% System Design Clarity</li>
            <li className="flex items-center gap-4"><div className="w-2 h-2 bg-gray-200"></div> 42% Behavioral Cohesion (Needs Work)</li>
          </ul>
        </div>
        
        {/* Abstract Radar Visual */}
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center relative overflow-hidden p-12">
          {/* Concentric Circles representing a radar */}
          <div className="absolute w-[800px] h-[800px] rounded-full border-[1px] border-black/5 flex items-center justify-center animate-pulse-slow">
            <div className="w-[600px] h-[600px] rounded-full border-[1px] border-black/5 flex items-center justify-center">
              <div className="w-[400px] h-[400px] rounded-full border-[2px] border-black/10 flex items-center justify-center relative">
                {/* Radar Sweep */}
                <div className="absolute top-1/2 left-1/2 w-[200px] h-[200px] origin-top-left bg-gradient-to-br from-black/20 to-transparent rounded-br-full animate-spin" style={{ animationDuration: '4s' }}></div>
                
                {/* Data Points */}
                <div className="absolute top-10 left-10 w-4 h-4 bg-black rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]"></div>
                <div className="absolute bottom-20 right-20 w-3 h-3 bg-brand-purple rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                <div className="absolute top-1/2 right-10 w-5 h-5 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ENTERPRISE & SCALE */}
      <section className="py-32 w-full bg-charcoal-dark text-white border-y border-white/10 px-6 relative overflow-hidden">
        {/* Subtle grid in background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <Users className="w-16 h-16 text-white mb-8" />
            <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter mb-8">
              For Teams & <br/> Recruiters
            </h2>
            <p className="text-xl font-light text-gray-400 mb-8 leading-relaxed">
              Standardize your technical screening process. Deploy Succession.AI as an autonomous first-round interviewer. Save thousands of engineering hours while maintaining an elite hiring bar.
            </p>
            <Link href="/enterprise" className="inline-flex items-center gap-3 border border-white px-8 py-4 uppercase font-bold text-sm tracking-widest hover:bg-white hover:text-black transition-colors">
              Explore Enterprise Solutions
            </Link>
          </div>
          
          <div className="w-full md:w-1/2">
            <div className="bg-black/50 p-8 border border-white/10 backdrop-blur-sm">
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <span className="font-mono text-gray-500 uppercase text-sm">Candidates Screened</span>
                <span className="font-mono text-white">12,408</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                <span className="font-mono text-gray-500 uppercase text-sm">Engineering Hours Saved</span>
                <span className="font-mono text-emerald-400">8,200+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-gray-500 uppercase text-sm">Average Accuracy vs Human</span>
                <span className="font-mono text-brand-cyan">99.2%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDIONS */}
      <section className="py-32 w-full bg-white text-black px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tighter mb-16 text-center">Frequently Asked</h2>
          
          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <details className="group border-b border-black/10 pb-4 cursor-pointer">
              <summary className="flex justify-between items-center font-display text-2xl font-bold uppercase list-none">
                Is the AI actually evaluating my code?
                <ChevronDown className="w-6 h-6 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-4 text-gray-600 font-light text-lg">
                Yes. The engine executes your code in an isolated sandbox, captures stdout/stderr, and then passes the AST (Abstract Syntax Tree) to the AI along with Big-O constraints to ensure your solution is optimal.
              </p>
            </details>
            
            {/* FAQ Item 2 */}
            <details className="group border-b border-black/10 pb-4 cursor-pointer">
              <summary className="flex justify-between items-center font-display text-2xl font-bold uppercase list-none">
                Do I need a microphone?
                <ChevronDown className="w-6 h-6 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-4 text-gray-600 font-light text-lg">
                While you can type your responses, we highly recommend using a microphone. The Behavioral engine analyzes vocal tone, confidence, and pauses to grade your soft skills.
              </p>
            </details>
            
            {/* FAQ Item 3 */}
            <details className="group border-b border-black/10 pb-4 cursor-pointer">
              <summary className="flex justify-between items-center font-display text-2xl font-bold uppercase list-none">
                What companies is this modeled after?
                <ChevronDown className="w-6 h-6 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-4 text-gray-600 font-light text-lg">
                The interview rubrics are built directly from leaked and published grading matrices from Meta, Google, Amazon, and Netflix engineering rubrics.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* 7. FULL BLEED CTA */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center bg-black relative py-32 px-6">
        <Shield className="w-24 h-24 text-white mb-12" />
        <h2 className="text-5xl md:text-8xl font-display font-bold text-center uppercase tracking-tighter mb-12">
          Ready to <br/> Dominate?
        </h2>
        
        <Link 
          href="/mock" 
          className="group relative flex items-center justify-center px-12 py-6 bg-white text-black font-display font-bold text-xl md:text-3xl uppercase overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-4">
            Initialize Session <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform duration-300" />
          </span>
          {/* Hover Sweep Effect */}
          <div className="absolute inset-0 bg-gray-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
        </Link>
      </section>

    </main>
  );
}
