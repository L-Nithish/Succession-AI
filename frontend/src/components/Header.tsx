"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Terminal, Shield, Zap, LayoutDashboard, Briefcase, DollarSign, LogOut, User } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: Zap },
    { name: 'Features', path: '/features', icon: Terminal },
    { name: 'Mock Engine', path: '/mock', icon: Shield },
    { name: 'Analytics', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Enterprise', path: '/enterprise', icon: Briefcase },
    { name: 'Pricing', path: '/pricing', icon: DollarSign },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-charcoal-light bg-background/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center shadow-glowing">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-display font-semibold tracking-tight text-white group-hover:text-brand-purple transition-colors">
            Interview<span className="text-gray-400">Ace</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-charcoal-dark/50 border border-charcoal-light p-1 rounded-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-charcoal text-white shadow-glass border border-white/5'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-purple' : 'text-gray-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Auth profile */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded bg-charcoal border border-charcoal-light text-[10px] text-gray-300 font-medium">
                <User className="w-3 h-3 text-brand-purple" />
                <span>{user.fullName}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded bg-charcoal/30 border border-charcoal-light text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1 text-[10px] font-bold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-semibold text-white rounded-lg group bg-gradient-to-br from-brand-purple to-brand-blue group-hover:from-brand-purple group-hover:to-brand-blue hover:text-white focus:ring-2 focus:outline-none focus:ring-purple-800"
            >
              <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-background rounded-md group-hover:bg-opacity-0">
                Authenticate
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
