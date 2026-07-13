"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import gsap from 'gsap';

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuInnerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const navItems = [
    { name: 'Home', path: '/', number: '01' },
    { name: 'Features', path: '/features', number: '02' },
    { name: 'Mock Engine', path: '/mock', number: '03' },
    { name: 'Analytics', path: '/dashboard', number: '04' },
    { name: 'Enterprise', path: '/enterprise', number: '05' },
    { name: 'Pricing', path: '/pricing', number: '06' },
  ];

  useEffect(() => {
    // Initialize GSAP Timeline
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline({ paused: true })
        .to(overlayRef.current, {
          yPercent: 100,
          duration: 0.8,
          ease: "power4.inOut",
        })
        .fromTo(linkRefs.current, 
          { yPercent: 100, opacity: 0, rotate: 5 },
          { 
            yPercent: 0, 
            opacity: 1, 
            rotate: 0,
            duration: 0.8, 
            stagger: 0.05, 
            ease: "power4.out" 
          },
          "-=0.4" // Start slightly before the curtain finishes
        )
        .fromTo(".menu-footer", 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.6"
        );
    });

    return () => ctx.revert();
  }, []);

  const toggleMenu = () => {
    if (isOpen) {
      tl.current?.reverse();
    } else {
      tl.current?.play();
    }
    setIsOpen(!isOpen);
  };

  // Close menu on navigation
  useEffect(() => {
    if (isOpen) {
      toggleMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {/* FIXED TOP BAR */}
      <header className="fixed top-0 left-0 w-full z-[60] mix-blend-difference text-white">
        <div className="max-w-[100vw] px-8 md:px-12 h-24 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="group flex items-center">
            <span className="font-display text-2xl font-black tracking-widest uppercase">
              Succession<span className="text-white group-hover:opacity-0 transition-opacity">.AI</span>
              <span className="absolute text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity -ml-[2.25rem]">.AI</span>
            </span>
          </Link>

          {/* Action Button & Auth profile */}
          <div className="flex items-center gap-8">
            {user ? (
              <button
                onClick={logout}
                className="hidden md:block uppercase font-mono text-xs tracking-widest hover:text-red-400 transition-colors"
              >
                Sign Out [{user.fullName}]
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden md:block uppercase font-mono text-xs tracking-widest hover:text-brand-purple transition-colors"
              >
                Authenticate
              </Link>
            )}

            {/* Hamburger Button */}
            <button 
              onClick={toggleMenu}
              className="flex flex-col justify-center items-center w-12 h-12 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors duration-300 relative overflow-hidden group"
            >
              <div className="relative z-10 font-mono text-[10px] tracking-widest uppercase font-bold">
                {isOpen ? 'CLS' : 'MNU'}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* FULL SCREEN OVERLAY */}
      <div 
        ref={overlayRef} 
        className="fixed top-[-100%] left-0 w-full h-screen bg-white text-black z-50 flex flex-col justify-between"
      >
        <div ref={menuInnerRef} className="flex-1 flex flex-col justify-center px-8 md:px-32 max-w-7xl mx-auto w-full">
          <nav className="flex flex-col gap-2 md:gap-4">
            {navItems.map((item, index) => {
              const isActive = pathname === item.path;
              return (
                <div key={item.name} className="overflow-hidden">
                  <Link
                    href={item.path}
                    ref={(el) => { linkRefs.current[index] = el; }}
                    className={`group flex items-center gap-4 md:gap-12 w-fit cursor-pointer ${isActive ? 'opacity-50' : 'hover:opacity-70'} transition-opacity`}
                  >
                    <span className="font-mono text-sm md:text-xl text-gray-400 w-8 md:w-12 text-left">
                      {item.number}
                    </span>
                    <span className="font-display text-5xl md:text-[8vw] font-black uppercase leading-none tracking-tighter">
                      {item.name}
                    </span>
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Menu Footer */}
        <div className="menu-footer flex justify-between items-end p-8 md:p-12 font-mono text-xs uppercase tracking-widest text-gray-500">
          <div className="flex gap-8">
            <a href="#" className="hover:text-black">Twitter</a>
            <a href="#" className="hover:text-black">LinkedIn</a>
            <a href="#" className="hover:text-black">Terms</a>
          </div>
          <div>
            &copy; 2026 Succession.AI
          </div>
        </div>
      </div>
    </>
  );
}
