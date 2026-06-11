"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { LayoutDashboard, Award, History, BarChart3, AlertCircle, Sparkles, UserCheck, ShieldAlert } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SKILLS' | 'HISTORY'>('OVERVIEW');
  
  // Dashboard API state
  const [data, setData] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiFetch("/dashboard/overview");
        if (response.ok) {
          const statsData = await response.json();
          setData(statsData);
        }
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    if (user) {
      fetchStats();
    } else if (!authLoading) {
      setLoadingStats(false);
    }
  }, [user, authLoading]);

  // Loading Screen
  if (authLoading || (user && loadingStats)) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full border-2 border-brand-purple border-t-transparent animate-spin mb-4"></div>
        <span className="text-xs text-gray-500 font-semibold tracking-widest uppercase">Connecting to Database...</span>
      </main>
    );
  }

  // Guest Screen
  if (!user) {
    return (
      <main className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center py-16 px-6">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-brand-purpleGlow blur-[120px] pointer-events-none animate-pulse-slow"></div>
        <div className="relative z-10 text-center max-w-md p-8 rounded-2xl border border-charcoal-light bg-charcoal/30 backdrop-blur-md">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-white font-display mb-3">Access Denied</h1>
          <p className="text-xs text-gray-400 leading-relaxed font-light mb-8">
            This analytics panel is only accessible to authenticated members. Please sign in to view your skill radar and mock logs.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-gray-200 transition-colors shadow-glowing"
          >
            Authenticate Session
          </Link>
        </div>
      </main>
    );
  }

  // Loaded Dashboard Stats
  const totalResumes = data?.totalResumes ?? 0;
  const totalInterviews = data?.totalInterviews ?? 0;
  const completedInterviews = data?.completedInterviews ?? 0;
  const averageScore = data?.averageScore ?? 0;
  const skillsList = data?.skills ?? [];
  const recentInterviewsList = data?.recentInterviews ?? [];
  const trendMetrics = data?.weeklyProgressTrend ?? {};
  const coachInsight = data?.aiCareerCoachInsight ?? "";

  const stats = [
    { name: "Aggregate Mock Score", value: averageScore > 0 ? `${averageScore}%` : "0%", sub: "Continuous neural grading" },
    { name: "Resumes Uploaded", value: totalResumes.toString(), sub: "Skills seeded from parsing" },
    { name: "Completed Interviews", value: completedInterviews.toString(), sub: `${totalInterviews} sessions registered` },
    { name: "Preparation Index", value: averageScore > 0 ? (averageScore + 5).toString() : "0", sub: "Calculated skill tier" }
  ];

  return (
    <main className="min-h-screen bg-background relative overflow-hidden py-16 px-6">
      <div className="absolute top-[15%] left-[5%] w-[400px] h-[300px] rounded-full bg-brand-purpleGlow blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[15%] right-[5%] w-[400px] h-[300px] rounded-full bg-brand-blueGlow blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title & Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-charcoal-light/30 pb-8 mb-12 gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-gray-400 text-xs mt-1">Review your core skill charts, mock sessions history logs, and coaching reports.</p>
          </div>

          <div className="flex gap-1 bg-charcoal-dark border border-charcoal-light p-1 rounded-lg">
            {(['OVERVIEW', 'SKILLS', 'HISTORY'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab ? 'bg-charcoal text-white border border-white/5' : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.name} className="glass-card p-6 rounded-xl border border-charcoal-light">
                  <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{s.name}</span>
                  <span className="block text-2xl md:text-3xl font-bold text-white font-display mb-1">{s.value}</span>
                  <span className="block text-[9px] text-brand-purple font-medium">{s.sub}</span>
                </div>
              ))}
            </div>

            {/* Coach Insights */}
            <div className="glass-panel p-6 rounded-xl border border-brand-purple/20 bg-brand-purpleGlow flex gap-4 items-start">
              <div className="w-10 h-10 rounded-lg bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-brand-purple" />
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-brand-purple uppercase tracking-widest">AI Career Coach Verdict</span>
                <p 
                  className="text-xs text-gray-300 leading-relaxed font-light"
                  dangerouslySetInnerHTML={{ __html: coachInsight }}
                />
              </div>
            </div>

            {/* Grid splits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Radar Mini */}
              <div className="glass-panel p-6 rounded-xl border border-charcoal-light">
                <div className="flex items-center justify-between border-b border-charcoal-light/40 pb-3 mb-4">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Skill Radar Metrics</span>
                  <button onClick={() => setActiveTab('SKILLS')} className="text-[10px] text-brand-purple hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {skillsList.slice(0, 3).map((sk: any) => (
                    <div key={sk.id || sk.skillName} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300 font-medium">{sk.skillName}</span>
                        <span className="text-white font-bold">{sk.rating}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-charcoal">
                        <div className="h-full rounded-full bg-brand-purple" style={{ width: `${sk.rating}%` }}></div>
                      </div>
                    </div>
                  ))}
                  {skillsList.length === 0 && (
                    <span className="text-xs text-gray-500">No skill indices seeded yet. Upload a resume to populate this section.</span>
                  )}
                </div>
              </div>

              {/* Logs Mini */}
              <div className="glass-panel p-6 rounded-xl border border-charcoal-light">
                <div className="flex items-center justify-between border-b border-charcoal-light/40 pb-3 mb-4">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Recent Sessions</span>
                  <button onClick={() => setActiveTab('HISTORY')} className="text-[10px] text-brand-purple hover:underline">View History</button>
                </div>
                <div className="space-y-3">
                  {recentInterviewsList.slice(0, 3).map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center p-3 rounded-lg bg-charcoal/30 border border-charcoal-light/40">
                      <div className="space-y-0.5">
                        <span className="block text-xs font-semibold text-white">{item.title}</span>
                        <span className="block text-[9px] text-gray-500 uppercase tracking-widest">{item.type}</span>
                      </div>
                      <span className="text-xs font-bold text-brand-cyan">{item.score ? `${item.score}%` : 'IN PROGRESS'}</span>
                    </div>
                  ))}
                  {recentInterviewsList.length === 0 && (
                    <span className="text-xs text-gray-500">No session metrics found. Open the Mock Console page to start.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Skills detailed */}
        {activeTab === 'SKILLS' && (
          <div className="glass-panel p-6 rounded-xl border border-charcoal-light space-y-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-charcoal-light/40 pb-3">Complete Skill Progress Logs</h3>
            {skillsList.length > 0 ? (
              <div className="space-y-6">
                {skillsList.map((sk: any) => (
                  <div key={sk.id || sk.skillName} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-4 space-y-0.5">
                      <span className="block text-xs font-semibold text-white">{sk.skillName}</span>
                      <span className="block text-[9px] text-gray-500 uppercase tracking-wider">
                        {sk.rating >= 80 ? "Advanced" : sk.rating >= 60 ? "Proficient" : "Intermediate"}
                      </span>
                    </div>
                    <div className="md:col-span-4">
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>Rating Score</span>
                        <span className="text-brand-purple font-bold">{sk.rating}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-charcoal">
                        <div className="h-full rounded-full bg-brand-purple" style={{ width: `${sk.rating}%` }}></div>
                      </div>
                    </div>
                    <div className="md:col-span-4 p-2.5 rounded bg-charcoal/30 border border-charcoal-light/40 flex items-start gap-1.5 text-[10px] text-gray-400">
                      <AlertCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                      <span><strong>AI Analysis:</strong> {sk.weakPoints}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-gray-500">No skill progress indicators mapped. Upload a resume first.</div>
            )}
          </div>
        )}

        {/* Tab 3: History detailed */}
        {activeTab === 'HISTORY' && (
          <div className="glass-panel p-6 rounded-xl border border-charcoal-light overflow-x-auto">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-charcoal-light/40 pb-3 mb-4">Complete Interview Attempt History</h3>
            {recentInterviewsList.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs text-gray-300">
                <thead>
                  <tr className="border-b border-charcoal-light/40 text-gray-500 uppercase tracking-widest text-[9px]">
                    <th className="py-3 font-semibold">Session Title</th>
                    <th className="py-3 font-semibold">Type</th>
                    <th className="py-3 font-semibold">Date Completed</th>
                    <th className="py-3 font-semibold text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInterviewsList.map((item: any) => (
                    <tr key={item.id} className="border-b border-charcoal-light/20 last:border-none hover:bg-charcoal/10 transition-colors">
                      <td className="py-4 font-semibold text-white">{item.title}</td>
                      <td className="py-4">{item.type}</td>
                      <td className="py-4 text-gray-500">{item.date}</td>
                      <td className="py-4 text-right font-bold text-brand-cyan">{item.score ? `${item.score}%` : 'IN PROGRESS'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-xs text-gray-500">No history files recorded. Start technical practice.</div>
            )}
          </div>
        )}

      </div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.03] pointer-events-none"></div>
    </main>
  );
}
