"use client";

import * as React from "react";
import { useState, useEffect } from "react";

// Hand-curated selection of beautiful, modern designer palettes
const PALETTES = [
    { bg: "#fef6e4", card: "#ffffff", text: "#171717" },
    { bg: "#0f0e17", card: "#1a1a2e", text: "#fffffe" },
    { bg: "#ffd803", card: "#ffffff", text: "#272343" },
    { bg: "#e3f6f5", card: "#65b89bff", text: "#272343" },
    { bg: "#9e3e9aff", card: "#ff8906", text: "#fffffe" },
    { bg: "#232946", card: "#8b7a99ff", text: "#b8c1ec" },
    { bg: "#faeee7", card: "#ffc6c7", text: "#33272a" },
    { bg: "#16161a", card: "#7f5af0", text: "#fffffe" },
];

export default function ColorPicker() {
    // Sync state to default globals.css values
    const [colors, setColors] = useState({
        bg: "#f8fafc",
        card: "#e2e8f0",
        text: "#000000"
    });

    // Dynamically pipe our React state into the global CSS variables!
    // This causes the entire app to instantly and performantly recolor.
    useEffect(() => {
        document.documentElement.style.setProperty("--background", colors.bg);
        document.documentElement.style.setProperty("--card-bg", colors.card);
        document.documentElement.style.setProperty("--text-main", colors.text);
    }, [colors]);

    const handleShuffle = () => {
        // Pick a completely random palette from our curated array
        const randomPalette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
        setColors(randomPalette);
    };

    return (
        <div className="flex flex-col items-center mt-6 gap-4 pointer-events-auto z-30">
            <div className="flex gap-4">

                {/* Background Color Picker */}
                <div
                    className="relative w-12 h-12 rounded-xl shadow-sm border border-black/20 hover:scale-110 transition-transform overflow-hidden cursor-pointer"
                    style={{ backgroundColor: colors.bg }}
                >
                    <input
                        type="color"
                        value={colors.bg}
                        onChange={(e) => setColors(prev => ({ ...prev, bg: e.target.value }))}
                        className="absolute inset-0 w-20 h-20 -top-4 -left-4 opacity-0 cursor-pointer"
                        title="Change Background Color"
                    />
                </div>

                {/* Card Color Picker */}
                <div
                    className="relative w-12 h-12 rounded-xl shadow-sm border border-black/20 hover:scale-110 transition-transform overflow-hidden cursor-pointer"
                    style={{ backgroundColor: colors.card }}
                >
                    <input
                        type="color"
                        value={colors.card}
                        onChange={(e) => setColors(prev => ({ ...prev, card: e.target.value }))}
                        className="absolute inset-0 w-20 h-20 -top-4 -left-4 opacity-0 cursor-pointer"
                        title="Change Card Color"
                    />
                </div>

                {/* Text Color Picker */}
                <div
                    className="relative w-12 h-12 rounded-xl shadow-sm border border-black/20 hover:scale-110 transition-transform overflow-hidden cursor-pointer"
                    style={{ backgroundColor: colors.text }}
                >
                    <input
                        type="color"
                        value={colors.text}
                        onChange={(e) => setColors(prev => ({ ...prev, text: e.target.value }))}
                        className="absolute inset-0 w-20 h-20 -top-4 -left-4 opacity-0 cursor-pointer"
                        title="Change Text Color"
                    />
                </div>

            </div>

            <button
                onClick={handleShuffle}
                className="px-6 py-2 bg-white/80 text-black rounded-full shadow-sm text-sm font-bold opacity-80 hover:opacity-100 transition-all border border-black/10 active:scale-95 hover:bg-white"
            >
                Shuffle Colors
            </button>
        </div>
    );
}
