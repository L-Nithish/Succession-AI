import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-charcoal-light bg-charcoal-dark/30 pt-16 pb-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] rounded-full bg-brand-purpleGlow blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 relative z-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-display font-semibold tracking-tight text-white">
              Interview<span className="text-gray-400">Ace</span>
            </span>
          </div>
          <p className="text-gray-400 text-xs max-w-sm leading-relaxed mb-6">
            Elite AI-powered interview preparation ecosystem. We train candidates for hard technical, behavioral, and system design pipelines using deep neural scoring and cinematic simulations.
          </p>
          <span className="text-xs text-gray-500">© 2026 InterviewAce Inc. All rights reserved.</span>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-4">Platform</h4>
          <ul className="space-y-2.5 text-xs text-gray-400">
            <li><Link href="/features" className="hover:text-brand-purple transition-colors">Resume Analyzer</Link></li>
            <li><Link href="/mock" className="hover:text-brand-purple transition-colors">Mock Console</Link></li>
            <li><Link href="/dashboard" className="hover:text-brand-purple transition-colors">Analytics Radar</Link></li>
            <li><Link href="/enterprise" className="hover:text-brand-purple transition-colors">Enterprise Suite</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-4">Enterprise</h4>
          <ul className="space-y-2.5 text-xs text-gray-400">
            <li><Link href="/pricing" className="hover:text-brand-purple transition-colors">Pricing Models</Link></li>
            <li><Link href="/pricing" className="hover:text-brand-purple transition-colors">FAQs & Support</Link></li>
            <li><span className="text-gray-600 cursor-not-allowed">Developer API</span></li>
            <li><span className="text-gray-600 cursor-not-allowed">Status Logs</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-charcoal-light/30 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 relative z-10">
        <div className="flex gap-4">
          <span className="hover:text-gray-300 cursor-pointer">Privacy Charter</span>
          <span className="hover:text-gray-300 cursor-pointer">Security Standards</span>
          <span className="hover:text-gray-300 cursor-pointer">CORS Configs</span>
        </div>
        <span>Designed in alignment with Cupertino and Vercel branding guidelines.</span>
      </div>
    </footer>
  );
}
