"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import IntroHero from "./project/Herosection";
import SwipeApp from "./project/SwipeApp";

gsap.registerPlugin(ScrollToPlugin);

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      {/* Intro & Rationale Landing Section */}
      <IntroHero />

      {/* 
        The Swipe App Component 
        It has a predefined ID so the Intro arrow can smoothly scroll to it.
      */}
      <div id="swipe-app">
        <SwipeApp />
      </div>
    </main>
  );
}
