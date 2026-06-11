"use client";

import React, { useState } from 'react';
import { Users, Search, Filter, ShieldCheck, Mail, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

export default function EnterprisePage() {
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const candidates = [
    { id: "1", name: "Sarah Connor", email: "sarah.c@sky.net", score: 94, skills: ["Java", "Spring Boot", "Kafka", "Docker"], experience: "Senior backend developer (5 years)", status: "Direct Schedule", verdict: "🌟 Strong Technical Asset: The candidate exhibits deep conceptual clarity. Recommended for direct scheduling with engineering managers." },
    { id: "2", name: "John Doe", email: "johndoe@gmail.com", score: 86, skills: ["React", "TypeScript", "Tailwind", "CSS"], experience: "Frontend engineer (3 years)", status: "Recommend Interview", verdict: "🌟 Recommend for Technical Loop: Shows good React patterns, but need to check system design and caching configurations." },
    { id: "3", name: "Arthur Dent", email: "dent@hitchhiker.org", score: 72, skills: ["Python", "SQL", "JPA", "Docker"], experience: "Mid-level backend (3 years)", status: "Review Resume", verdict: "📈 Growth Potential: Shows good foundations but needs mock sessions on system architecture and containerization." },
    { id: "4", name: "Ellen Ripley", email: "ripley@nostromo.org", score: 96, skills: ["Java", "Security", "JPA", "PostgreSQL"], experience: "Systems Architect (8 years)", status: "Direct Schedule", verdict: "🌟 Outstanding Architect: Perfect conceptual definition of filter chains and row level postgres security metrics." }
  ];

  return (
    <main className="min-h-screen bg-background relative overflow-hidden py-16 px-6">
      {/* Decorative Glow */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-brand-purpleGlow blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Recruiter & Enterprise Suite
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
            Verify candidate rankings, inspect AI feedback reports, and invite top-scoring developers directly.
          </p>
        </div>

        {/* Split screen: List and details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Candidates list (2 cols) */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-charcoal-light space-y-4 h-[550px] overflow-y-auto scrollbar">
            <div className="flex items-center justify-between border-b border-charcoal-light/40 pb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Talent Pool Rankings</span>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search candidate..."
                    className="bg-charcoal/50 border border-charcoal-light rounded px-8 py-1.5 text-[10px] text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {candidates.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCandidate(c)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                    selectedCandidate?.id === c.id
                      ? 'border-brand-purple bg-brand-purpleGlow'
                      : 'border-charcoal-light bg-charcoal/30 hover:border-charcoal-light/80'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="block text-xs font-bold text-white">{c.name}</span>
                    <span className="block text-[9px] text-gray-400 font-light">{c.experience}</span>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {c.skills.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-charcoal text-[8px] text-gray-400 border border-charcoal-light">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="block text-lg font-black text-brand-cyan font-display">{c.score}%</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-semibold tracking-wider uppercase ${
                      c.status === 'Direct Schedule' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Candidate detail view (1 col) */}
          <div className="glass-panel p-6 rounded-xl border border-charcoal-light h-[550px] flex flex-col justify-between">
            {selectedCandidate ? (
              <div className="space-y-6">
                <div className="border-b border-charcoal-light/40 pb-4 space-y-1">
                  <span className="text-[10px] text-brand-purple font-bold uppercase tracking-widest block">Executive Candidate File</span>
                  <h3 className="text-base font-bold text-white">{selectedCandidate.name}</h3>
                  <span className="text-[9px] text-gray-500 block">{selectedCandidate.email}</span>
                </div>

                <div className="space-y-2">
                  <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest">AI Performance Index</span>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-brand-cyan font-display leading-none">{selectedCandidate.score}%</span>
                    <div className="flex-1 h-2 rounded-full bg-charcoal">
                      <div className="h-full rounded-full bg-brand-cyan" style={{ width: `${selectedCandidate.score}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest">Candidate Stack</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedCandidate.skills.map((sk: string) => (
                      <span key={sk} className="px-2 py-0.5 rounded bg-charcoal text-[9px] text-gray-300 border border-charcoal-light">{sk}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest">Recruiter Verdict</span>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-light">{selectedCandidate.verdict}</p>
                </div>

                <div className="flex gap-2 pt-4 border-t border-charcoal-light/40">
                  <button className="flex-1 py-2 rounded bg-white text-black text-[10px] font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    Invite Candidate
                  </button>
                  <button className="px-3 py-2 rounded bg-charcoal border border-charcoal-light text-gray-300 text-[10px] hover:bg-charcoal/80 transition-colors">
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 space-y-4 my-auto">
                <div className="w-12 h-12 rounded-full bg-charcoal flex items-center justify-center mx-auto border border-charcoal-light">
                  <Users className="w-5 h-5 text-gray-500" />
                </div>
                <div className="space-y-1">
                  <span className="block text-xs font-semibold text-white">No Candidate Selected</span>
                  <span className="block text-[9px] text-gray-500 max-w-[180px] mx-auto leading-relaxed">Select a candidate from the talent list to view AI insights and verdict.</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.03] pointer-events-none"></div>
    </main>
  );
}
