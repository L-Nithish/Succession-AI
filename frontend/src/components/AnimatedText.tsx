"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export default function AnimatedText({ text, className = "" }: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const words = containerRef.current.querySelectorAll(".word");

    gsap.fromTo(
      words,
      { y: 100, opacity: 0, rotateX: -90 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.05,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      }
    );
  }, [text]);

  return (
    <div ref={containerRef} className={`overflow-hidden perspective-[1000px] ${className}`}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="word inline-block origin-bottom mr-[0.25em]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}
