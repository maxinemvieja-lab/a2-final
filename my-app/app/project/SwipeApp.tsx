"use client";

import { useState, useRef, useEffect } from "react";
import { LockOpenIcon, LockClosedIcon, ArrowLeftIcon, AdjustmentsHorizontalIcon, ArrowsUpDownIcon, ArrowPathRoundedSquareIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(ScrollToPlugin, Draggable);

import { useGoogleFont } from "../useGoogleFont";
import { fontLibrary, getRandomFontFrom } from "../fonts";

import SavedSidebar from "./SavedSidebar";
import NextCardPeek from "./NextCardPeek";
import ColorPicker from "./ColorPicker";
import Noise from "./Noise";

type FilterType = "all" | keyof typeof fontLibrary;
const getFontList = (filter: FilterType) => filter === "all"
  ? Object.values(fontLibrary).flat()
  : fontLibrary[filter];

export default function SwipeApp() {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // --- Font State ---
  const [fonts, setFonts] = useState({ head: "Playfair Display", subhead: "Inter" });
  const [nextFonts, setNextFonts] = useState({ head: "Space Mono", subhead: "Outfit" });

  // --- Lock State ---
  const [lockedTop, setLockedTop] = useState(false);
  const [lockedBottom, setLockedBottom] = useState(false);

  // --- Filter State ---
  const [filterHead, setFilterHead] = useState<FilterType>("all");
  const [filterSubhead, setFilterSubhead] = useState<FilterType>("all");
  const [isFilterHeadOpen, setIsFilterHeadOpen] = useState(false);
  const [isFilterSubheadOpen, setIsFilterSubheadOpen] = useState(false);

  // --- Sidebar State ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [savedPairings, setSavedPairings] = useState<{ head: string; subhead: string }[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("savedFonts");
    if (saved) setSavedPairings(JSON.parse(saved));
  }, []);

  const savePairing = (pair: { head: string; subhead: string }) => {
    setSavedPairings(prev => {
      const next = [pair, ...prev];
      localStorage.setItem("savedFonts", JSON.stringify(next));
      return next;
    });
  };

  useGoogleFont([
    fonts.head, fonts.subhead,
    nextFonts.head, nextFonts.subhead,
    ...savedPairings.map(p => p.head),
    ...savedPairings.map(p => p.subhead),
  ]);

  const stateRef = useRef({ fonts, nextFonts, lockedTop, lockedBottom, filterHead, filterSubhead });
  useEffect(() => {
    stateRef.current = { fonts, nextFonts, lockedTop, lockedBottom, filterHead, filterSubhead };
  }, [fonts, nextFonts, lockedTop, lockedBottom, filterHead, filterSubhead]);

  const THRESHOLD = 100;

  const triggerLeftSwipeTop = () => {
    const s = stateRef.current;
    gsap.to(topRef.current, {
      x: -600, y: -50, rotation: -30, opacity: 0,
      duration: 0.6, ease: "power2.out",
      onComplete: () => {
        setFonts(prev => ({ ...prev, head: s.nextFonts.head }));
        setNextFonts(prev => ({ ...prev, head: getRandomFontFrom(getFontList(s.filterHead), s.nextFonts.head) }));
        gsap.set(topRef.current, { x: 0, y: 0, rotation: 0, opacity: 1 });
      }
    });
  };

  const triggerLeftSwipeBottom = () => {
    const s = stateRef.current;
    gsap.to(bottomRef.current, {
      x: -600, y: 50, rotation: -20, opacity: 0,
      duration: 0.6, ease: "power2.out",
      onComplete: () => {
        setFonts(prev => ({ ...prev, subhead: s.nextFonts.subhead }));
        setNextFonts(prev => ({ ...prev, subhead: getRandomFontFrom(getFontList(s.filterSubhead), s.nextFonts.subhead) }));
        gsap.set(bottomRef.current, { x: 0, y: 0, rotation: 0, opacity: 1 });
      }
    });
  };

  const triggerRightSwipe = () => {
    const s = stateRef.current;
    savePairing({ head: s.fonts.head, subhead: s.fonts.subhead });

    gsap.to([topRef.current, bottomRef.current], {
      x: 500, rotation: 30, opacity: 0,
      duration: 0.6, ease: "power2.out",
      onComplete: () => {
        setFonts(prev => ({
          head: s.lockedTop ? prev.head : s.nextFonts.head,
          subhead: s.lockedBottom ? prev.subhead : s.nextFonts.subhead,
        }));
        setNextFonts(prev => ({
          head: getRandomFontFrom(getFontList(s.filterHead), s.nextFonts.head),
          subhead: getRandomFontFrom(getFontList(s.filterSubhead), s.nextFonts.subhead),
        }));
        gsap.set([topRef.current, bottomRef.current], { x: 0, y: 0, rotation: 0, opacity: 1 });
      }
    });
  };

  const snapBackTop = () => gsap.to(topRef.current, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: "back.out(1.5)" });
  const snapBackBottom = () => gsap.to(bottomRef.current, { x: 0, y: 0, rotation: 0, duration: 0.5, ease: "back.out(1.5)" });
  const snapBackBoth = () => gsap.to([topRef.current, bottomRef.current], { x: 0, y: 0, rotation: 0, duration: 0.5, ease: "back.out(1.5)" });

  // Initialization of Draggable
  useEffect(() => {
    if (!topRef.current || !bottomRef.current) return;

    // Pivot from the shared crease so they appear as one solid card
    gsap.set(topRef.current, { transformOrigin: "bottom center" });
    gsap.set(bottomRef.current, { transformOrigin: "top center" });

    const dragTop = Draggable.create(topRef.current, {
      type: "x",
      onDrag: function () {
        const x = this.x;
        const rot = x * (18 / 300);
        gsap.set(topRef.current, { rotation: rot });

        if (x > 0) {
          gsap.set(bottomRef.current, { x: x, rotation: rot });
        } else {
          gsap.set(bottomRef.current, { x: 0, rotation: 0 });
        }
      },
      onDragEnd: function () {
        const offset = this.x;
        const s = stateRef.current;
        if (offset < -THRESHOLD) {
          s.lockedTop ? snapBackBoth() : triggerLeftSwipeTop();
        } else if (offset > THRESHOLD) {
          triggerRightSwipe();
        } else {
          snapBackBoth();
        }
      }
    });

    const dragBottom = Draggable.create(bottomRef.current, {
      type: "x",
      onDrag: function () {
        const x = this.x;
        const rot = x * (18 / 300);
        gsap.set(bottomRef.current, { rotation: rot });

        if (x > 0) {
          gsap.set(topRef.current, { x: x, rotation: rot });
        } else {
          gsap.set(topRef.current, { x: 0, rotation: 0 });
        }
      },
      onDragEnd: function () {
        const offset = this.x;
        const s = stateRef.current;
        if (offset < -THRESHOLD) {
          s.lockedBottom ? snapBackBoth() : triggerLeftSwipeBottom();
        } else if (offset > THRESHOLD) {
          triggerRightSwipe();
        } else {
          snapBackBoth();
        }
      }
    });

    return () => {
      dragTop[0].kill();
      dragBottom[0].kill();
    };
  }, []);

  type Category = FilterType;
  const CATEGORIES: Category[] = ["all", "serif", "sansSerif", "display", "mono", "handwriting"];
  const categoryLabel = (c: Category) => c === "all" ? "All Fonts" : c === "sansSerif" ? "Sans Serif" : c;

  const FilterDropdown = ({ which }: { which: "head" | "subhead" }) => {
    const isHead = which === "head";
    const active = isHead ? filterHead : filterSubhead;
    const isOpen = isHead ? isFilterHeadOpen : isFilterSubheadOpen;
    const setActive = isHead ? setFilterHead : setFilterSubhead;
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleOpen = () => {
      if (isHead) { setIsFilterHeadOpen(p => !p); setIsFilterSubheadOpen(false); }
      else { setIsFilterSubheadOpen(p => !p); setIsFilterHeadOpen(false); }
    };

    useEffect(() => {
      if (isOpen && menuRef.current) {
        gsap.fromTo(menuRef.current, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.2, ease: "power2.out" });
      }
    }, [isOpen]);

    return (
      <div className="relative">
        <button
          onClick={toggleOpen}
          className={`w-12 h-12 rounded-full bg-white border shadow-sm flex items-center justify-center transition-colors hover:scale-105 active:scale-95 ${active !== "all" ? "border-black text-[var(--text-main)]" : "border-black/5 text-gray-700 hover:bg-gray-100"}`}
        >
          <AdjustmentsHorizontalIcon className="w-6 h-6" />
        </button>
        {isOpen && (
          <div
            ref={menuRef}
            className="absolute left-16 top-0 bg-white border border-black/10 shadow-xl rounded-2xl p-4 w-48 flex flex-col gap-1 z-50"
          >
            <p className="text-xs font-bold opacity-40 mb-1 px-2">{isHead ? "TOP CARD" : "BOTTOM CARD"}</p>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => { setActive(cat); if (isHead) setIsFilterHeadOpen(false); else setIsFilterSubheadOpen(false); }}
                className={`text-left px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${active === cat ? "bg-black text-white" : "hover:bg-gray-100 text-[var(--text-main)]"}`}
              >
                {categoryLabel(cat)}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="noise-overlay">
        <Noise
          patternSize={250}
          patternScaleX={2}
          patternScaleY={2}
          patternRefreshInterval={2}
          patternAlpha={15}
        />
      </div>

      <button
        onClick={() => gsap.to(window, { duration: 1, scrollTo: "#intro-hero", ease: "power3.inOut" })}
        className="absolute top-8 left-8 text-sm font-semibold text-[var(--text-main)]/50 hover:text-[var(--text-main)] transition-colors rounded-full border border-black/10 p-2 shadow-sm bg-white flex items-center justify-center z-40"
        title="Back to Intro"
      >
        <ArrowUpIcon className="w-5 h-5" strokeWidth={2.5} />
      </button>

      <button
        onClick={() => setIsSidebarOpen(true)}
        className="absolute top-8 right-8 text-sm font-semibold text-[var(--text-main)]/50 hover:text-[var(--text-main)] transition-colors rounded-full border border-black/10 px-4 py-2 shadow-sm bg-white flex items-center gap-2 z-40"
      >
        <ArrowLeftIcon className="w-4 h-4" strokeWidth={2.5} />
        Open Saved Pairs ({savedPairings.length})
      </button>

      <div className="flex gap-12 items-start">
        <div className="flex flex-col relative">
          <NextCardPeek fonts={fonts} nextFonts={nextFonts} lockedTop={lockedTop} lockedBottom={lockedBottom} />

          <div
            ref={topRef}
            className="w-80 h-50 rounded-t-[32px] border border-white/60 border-b-black/5 shadow-lg p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing z-20"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <div className="flex justify-between items-start">
              <p className="text-sm font-semibold opacity-40 select-none pointer-events-none">{fonts.head}</p>
              <button
                onClick={() => setLockedTop(l => !l)}
                onPointerDown={(e) => e.stopPropagation()}
                className={`transition-colors pointer-events-auto ${lockedTop ? "text-[var(--text-main)]" : "text-gray-400 hover:text-[var(--text-main)]"}`}
              >
                {lockedTop ? <LockClosedIcon className="w-5 h-5" /> : <LockOpenIcon className="w-5 h-5" />}
              </button>
            </div>
            <div className="border-t border-black/10 pt-4">
              <h1 className="text-6xl font-extrabold tracking-tight select-none pointer-events-none" style={{ fontFamily: fonts.head }}>Head</h1>
            </div>
          </div>

          <div
            ref={bottomRef}
            className="w-80 h-50 rounded-b-[32px] border border-transparent border-t-0 shadow-lg p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing z-10"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <div className="relative">
              <button
                onClick={() => setLockedBottom(l => !l)}
                onPointerDown={(e) => e.stopPropagation()}
                className={`absolute top-0 right-0 transition-colors pointer-events-auto ${lockedBottom ? "text-[var(--text-main)]" : "text-gray-400 hover:text-[var(--text-main)]"}`}
              >
                {lockedBottom ? <LockClosedIcon className="w-5 h-5" /> : <LockOpenIcon className="w-5 h-5" />}
              </button>
              <h2 className="text-2xl font-bold mb-1 pr-6 select-none pointer-events-none" style={{ fontFamily: fonts.subhead }}>Subhead</h2>
              <p className="text-xs opacity-60 select-none pointer-events-none" style={{ fontFamily: fonts.subhead }}>This is some sample body text.</p>
            </div>
            <div className="border-t border-black/10 pt-4">
              <p className="text-sm font-semibold opacity-40 select-none pointer-events-none">{fonts.subhead}</p>
            </div>
          </div>

          <ColorPicker />
        </div>

        <div className="flex flex-col justify-between h-[400px] py-4 pointer-events-auto z-30">
          <FilterDropdown which="head" />
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setFonts(p => ({ head: p.subhead, subhead: p.head })); setNextFonts(p => ({ head: p.subhead, subhead: p.head })); }}
              title="Swap Fonts"
              className="w-12 h-12 rounded-full bg-white border border-black/5 shadow-sm hover:bg-gray-100 transition-colors hover:scale-105 active:scale-95 flex items-center justify-center text-[var(--text-main)]"
            >
              <ArrowsUpDownIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                const s = stateRef.current;
                setFonts(prev => ({
                  head: s.lockedTop ? prev.head : getRandomFontFrom(getFontList(s.filterHead), prev.head),
                  subhead: s.lockedBottom ? prev.subhead : getRandomFontFrom(getFontList(s.filterSubhead), prev.subhead),
                }));
                setNextFonts(() => ({
                  head: getRandomFontFrom(getFontList(s.filterHead), s.fonts.head),
                  subhead: getRandomFontFrom(getFontList(s.filterSubhead), s.fonts.subhead),
                }));
              }}
              title="Shuffle Pairings"
              className="w-12 h-12 rounded-full bg-white border border-black/5 shadow-sm hover:bg-gray-100 transition-colors hover:scale-105 active:scale-95 flex items-center justify-center text-[var(--text-main)]"
            >
              <ArrowPathRoundedSquareIcon className="w-6 h-6" />
            </button>
          </div>
          <FilterDropdown which="subhead" />
        </div>
      </div>

      <SavedSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        savedPairings={savedPairings}
        onDelete={(idx) => setSavedPairings(prev => {
          const next = prev.filter((_, i) => i !== idx);
          localStorage.setItem("savedFonts", JSON.stringify(next));
          return next;
        })}
      />
    </section>
  );
}
