"use client";

import React from 'react';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black z-0">
      {/* Cinematic AI Image with Ken Burns Pan */}
      <div 
        className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%] bg-cover bg-center origin-center mix-blend-screen opacity-70"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          animation: 'kenBurns 30s ease-in-out infinite alternate',
        }}
      ></div>
      
      {/* Heavy Cinematic Vignette for focal contrast */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-90"></div>
      
      {/* Global CSS for the ultra-smooth Pan Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes kenBurns {
          0% { transform: scale(1) translate(0%, 0%); }
          50% { transform: scale(1.1) translate(-2%, 2%); }
          100% { transform: scale(1) translate(2%, -1%); }
        }
      `}} />
    </div>
  );
}
