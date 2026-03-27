"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { XMarkIcon, TrashIcon, LockClosedIcon } from "@heroicons/react/24/outline";

type Pairing = { head: string; subhead: string };

type Props = {
    isOpen: boolean;
    onClose: () => void;
    savedPairings: Pairing[];
    onDelete: (idx: number) => void;
};

export default function SavedSidebar({ isOpen, onClose, savedPairings, onDelete }: Props) {
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sidebarRef.current) return;
        if (isOpen) {
            gsap.to(sidebarRef.current, { x: "0%", opacity: 1, duration: 0.5, ease: "power3.out" });
        } else {
            gsap.to(sidebarRef.current, { x: "-100%", opacity: 0, duration: 0.4, ease: "power3.in" });
        }
    }, [isOpen]);

    return (
        <div
            ref={sidebarRef}
            style={{ 
                transform: "translateX(-100%)", 
                opacity: 0, 
                pointerEvents: isOpen ? "auto" : "none" 
            }}
            className="absolute top-0 left-0 h-full w-[400px] shadow-2xl z-50 border-r border-black/10 flex flex-col bg-[#f8fafc] text-[var(--text-main)]"
        >
            {/* Header */}
            <div className="p-8 border-b border-black/10 flex justify-between items-center bg-white">
                <h2 className="text-xl font-bold">Saved Pairings</h2>
                <button
                    onClick={onClose}
                    className="p-2 bg-white rounded-full border border-black/5 hover:border-black/20 shadow-sm transition-colors"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
                {savedPairings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-40 text-center px-4 pb-20">
                        <LockClosedIcon className="w-12 h-12 mb-4" />
                        <p>No saved pairs. Swipe to the right to save the perfect pair!</p>
                    </div>
                ) : (
                    savedPairings.map((pair, idx) => (
                        <div
                            key={idx}
                            className="p-6 border border-white/60 bg-white/50 rounded-3xl shadow-sm relative group transition-transform hover:scale-[1.02]"
                        >
                            <button
                                onClick={() => onDelete(idx)}
                                title="Delete saved pair"
                                className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 shadow-sm"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>

                            <p className="text-xs opacity-40 font-semibold mb-2">{pair.head}</p>
                            <h1 className="text-4xl leading-none tracking-tight mb-6" style={{ fontFamily: pair.head }}>
                                Heading
                            </h1>

                            <p className="text-xs opacity-40 font-semibold mb-2">{pair.subhead}</p>
                            <p className="text-sm opacity-80" style={{ fontFamily: pair.subhead }}>
                                This is how the pairing looks with body text.
                            </p>

                            <div className="flex gap-2 mt-6 pt-4 border-t border-black/5">
                                <a
                                    href={`https://fonts.google.com/?query=${pair.head.replace(/ /g, "+")}`}
                                    target="_blank"
                                    className="flex-1 py-3 bg-black text-white rounded-xl text-xs font-semibold text-center hover:bg-gray-800 transition-colors"
                                >
                                    Get Head Font
                                </a>
                                <a
                                    href={`https://fonts.google.com/?query=${pair.subhead.replace(/ /g, "+")}`}
                                    target="_blank"
                                    className="flex-1 py-3 bg-black text-white rounded-xl text-xs font-semibold text-center hover:bg-gray-800 transition-colors"
                                >
                                    Get Subhead Font
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
