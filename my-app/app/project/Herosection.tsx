"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

export default function IntroHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return;
    const q = gsap.utils.selector(containerRef.current);

    // Staggered entrance animation mimicking the original motion delays
    gsap.fromTo(q(".hero-element"),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.1
      }
    );

    // Horizontal ScrollTrigger for the Hero section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,           // pin the container in place
        scrub: 1,            // smooth scrubbing
        start: "top top",    // when top of container hits top of viewport
        end: "+=250%",       // total scrolling distance for 3 panels
      }
    });

    // Translate the track horizontally across 3 screens
    tl.to(trackRef.current, {
      xPercent: -66.6666,    // 3 panels wide, shift left by 2 panels (66.66%)
      ease: "none"
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const scrollToApp = () => {
    gsap.to(window, { duration: 1, scrollTo: "#swipe-app", ease: "power3.inOut" });
  };

  return (
    <section ref={containerRef} id="intro-hero" className="h-screen w-full bg-[#0a0a0a] text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 50% 0%, #333 0%, transparent 60%)",
      }} />

      {/* Horizontal Track container - Notice the width is 300vw for three screens */}
      <div ref={trackRef} className="flex h-screen w-[300vw] relative z-10 will-change-transform">

        {/* Screen 1: Original Hero View (100vw) */}
        <div className="w-screen h-full flex flex-col justify-center px-8 md:px-24">
          <div className="max-w-5xl">
            <p className="hero-element text-sm uppercase tracking-widest text-zinc-400 mb-6 font-mono opacity-0">
              Assignment 2 - Interface Development
            </p>

            <h1
              className="hero-element text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-500 opacity-0"
              style={{ fontFamily: "'helvetica', sans-serif" }}
            >
              JUST MY TYPE
            </h1>

            <div
              className="hero-element max-w-2xl text-lg md:text-xl text-zinc-300 font-light leading-relaxed mb-12 space-y-6 opacity-0"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <p>
                The main concept for this project was “Tinder for Fonts” where the goal is to allow users to quickly compare font pairings and save them in a list with direct links to the download pages of the fonts.
              </p>
            </div>

            <button
              onClick={scrollToApp}
              className="hero-element group relative inline-flex items-center justify-center px-8 py-4 font-bold text-black bg-white rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 opacity-0"
            >
              <span className="relative z-10 flex items-center gap-3">
                Scroll or Click
              </span>
            </button>
          </div>
        </div>

        {/* Screen 2: Project Info View (100vw) */}
        <div className="w-screen h-full flex flex-col justify-center px-8 md:px-24 border-l border-white/5 bg-[#0d0d0d]">
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-6xl font-bold mb-12 text-zinc-100 uppercase tracking-tight" style={{ fontFamily: "'helvetica', sans-serif" }}>
              The project must have three core functions;
            </h2>

            <ul className="space-y-10 text-xl md:text-2xl text-zinc-400 font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
              <li className="flex gap-8 items-center group">
                <span className="flex-shrink-0 w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center text-lg font-mono text-white bg-zinc-800/50 group-hover:bg-zinc-700 transition-colors">1</span>
                <span>draggable cards with animation (left and right);</span>
              </li>
              <li className="flex gap-8 items-center group">
                <span className="flex-shrink-0 w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center text-lg font-mono text-white bg-zinc-800/50 group-hover:bg-zinc-700 transition-colors">2</span>
                <span>load Google fonts in a Queue when the cards are swiped left;</span>
              </li>
              <li className="flex gap-8 items-center group">
                <span className="flex-shrink-0 w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center text-lg font-mono text-white bg-zinc-800/50 group-hover:bg-zinc-700 transition-colors">3</span>
                <span>save fonts in a list when the cards are swiped right.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Screen 3: Technologies Used (100vw) */}
        <div className="w-screen h-full flex flex-col justify-center px-8 md:px-24 border-l border-white/5 bg-[#111]">
          <div className="max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-10 text-zinc-100 uppercase tracking-tight" style={{ fontFamily: "'helvetica', sans-serif" }}>
              Technologies Used
            </h2>

            <ul className="space-y-10 text-lg md:text-xl text-zinc-400 font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
              <li className="flex flex-col gap-3">
                <span className="font-bold text-white text-2xl flex items-center gap-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-sm font-mono text-white bg-zinc-800/50">1</span>
                  GSAP - for the interactions and the animation of the cards.
                </span>
                <span className="pl-14 leading-relaxed">
                  I used it because of the drag physics it applies to the design. It helped make the action of card dragging more dynamic, making the interaction feel more like throwing.
                  I also used the scroll trigger for the first section, with the rationale to make the whole experience more animated.
                </span>
              </li>
              <li className="flex flex-col gap-3">
                <span className="font-bold text-white text-2xl flex items-center gap-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-sm font-mono text-white bg-zinc-800/50">2</span>
                  Next.js and React
                </span>
                <span className="pl-14 leading-relaxed">
                  I used this as my core frameworks so that I can use the following components I sourced online like Grain from React Bits
                </span>
              </li>
              <li className="flex flex-col gap-3">
                <span className="font-bold text-white text-2xl flex items-center gap-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-sm font-mono text-white bg-zinc-800/50">3</span>
                  Shadcn and Tailwind CSS
                </span>
                <span className="pl-14 leading-relaxed">
                  I used for styling the page and for the color change function
                </span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
