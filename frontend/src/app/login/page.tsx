"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, user } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("ROLE_USER");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    if (isRegister) {
      const error = await register(email, password, fullName, role);
      if (error) {
        setErrorMsg(error);
        setSubmitting(false);
      } else {
        // Auto-login after successful registration
        const success = await login(email, password);
        if (success) {
          router.push("/dashboard");
        } else {
          setErrorMsg("Account created, but automatic sign-in failed. Please login manually.");
          setIsRegister(false);
          setSubmitting(false);
        }
      }
    } else {
      const success = await login(email, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setErrorMsg("Invalid email or password credentials.");
        setSubmitting(false);
      }
    }
  };

  return (
    <main className="min-h-[80vh] flex items-center justify-center relative overflow-hidden py-16 px-6">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-brand-purpleGlow blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] rounded-full bg-brand-blueGlow blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Form container */}
        <div className="glass-panel p-8 rounded-2xl border border-charcoal-light shadow-glass">
          
          {/* Header */}
          <div className="text-center mb-8 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center mx-auto shadow-glowing">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              {isRegister ? "Create Credentials" : "Sign In Console"}
            </h1>
            <p className="text-gray-400 text-xs font-light">
              {isRegister ? "Get immediate access to interview preparation." : "Connect to the full-stack database session."}
            </p>
          </div>

          {/* Error display */}
          {errorMsg && (
            <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 flex items-start gap-2 text-[10px] text-red-400 mb-6 animate-pulse">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dexter Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-charcoal/50 border border-charcoal-light rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                required
                placeholder="dexter@interviewace.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-charcoal/50 border border-charcoal-light rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-charcoal/50 border border-charcoal-light rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple"
              />
            </div>

            {isRegister && (
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Account Class</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-charcoal/50 border border-charcoal-light rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-purple"
                >
                  <option value="ROLE_USER">Candidate (Standard Prep)</option>
                  <option value="ROLE_RECRUITER">Enterprise Recruiter</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-white text-black font-bold text-xs hover:bg-gray-200 transition-colors shadow-glowing flex items-center justify-center gap-1 mt-6"
            >
              {submitting ? "Processing Request..." : isRegister ? "Sign Up" : "Authenticate"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center mt-6 border-t border-charcoal-light/40 pt-4">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMsg("");
              }}
              className="text-[10px] text-gray-400 hover:text-brand-purple transition-colors"
            >
              {isRegister ? "Already have an account? Sign In" : "Don't have credentials yet? Sign Up"}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
