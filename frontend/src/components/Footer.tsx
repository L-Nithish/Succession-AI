import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-charcoal-light bg-charcoal-dark/30 pt-16 pb-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[150px] rounded-full bg-brand-purpleGlow blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 relative z-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <svg width="24" height="24" className="w-6 h-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="footer-logo-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0066ff" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <path d="M25 80 H50 V50 H75 V20" stroke="url(#footer-logo-grad)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="25" cy="80" r="10" fill="#0066ff" />
              <circle cx="50" cy="50" r="10" fill="#a855f7" />
              <circle cx="75" cy="20" r="10" fill="#ec4899" />
            </svg>
            <span className="font-display text-sm font-black tracking-widest text-white uppercase">
              SUCCESSION<span className="text-brand-purple">.AI</span>
            </span>
          </div>
          <p className="text-gray-400 text-xs max-w-sm leading-relaxed mb-6">
            Elite AI-powered interview preparation ecosystem. We train candidates for hard technical, behavioral, and system design pipelines using deep neural scoring and cinematic simulations.
          </p>
          <span className="text-xs text-gray-500">© 2026 Succession.AI Inc. All rights reserved.</span>
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
