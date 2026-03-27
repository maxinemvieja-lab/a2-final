"use client";

import { LockOpenIcon } from "@heroicons/react/24/outline";

type Props = {
    nextFonts: { head: string; subhead: string };
    fonts: { head: string; subhead: string };
    lockedTop: boolean;
    lockedBottom: boolean;
};

export default function NextCardPeek({ nextFonts, fonts, lockedTop, lockedBottom }: Props) {
    const headFont = lockedTop ? fonts.head : nextFonts.head;
    const subheadFont = lockedBottom ? fonts.subhead : nextFonts.subhead;

    return (
        <div
            className="absolute inset-0 flex flex-col pointer-events-none z-0 transition-transform duration-300 ease-out"
            style={{ transform: "scale(0.95) translateY(24px)", opacity: 0.5 }}
        >
            {/* Next Top Card */}
            <div
                className="w-80 h-50 rounded-t-[32px] border border-white/60 border-b-black/5 shadow-sm p-6 flex flex-col justify-between"
                style={{ backgroundColor: "var(--card-bg)" }}
            >
                <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold opacity-40">{headFont}</p>
                    <LockOpenIcon className="w-5 h-5 text-[var(--text-main)]" />
                </div>
                <div className="border-t border-black/10 pt-4">
                    <h1 className="text-6xl font-extrabold tracking-tight" style={{ fontFamily: headFont }}>
                        Head
                    </h1>
                </div>
            </div>

            {/* Next Bottom Card */}
            <div
                className="w-80 h-50 rounded-b-[32px] border border-transparent border-t-0 shadow-sm p-6 flex flex-col justify-between"
                style={{ backgroundColor: "var(--card-bg)" }}
            >
                <div className="relative">
                    <LockOpenIcon className="absolute top-0 right-0 w-5 h-5 text-[var(--text-main)]" />
                    <h2 className="text-2xl font-bold mb-1 pr-6" style={{ fontFamily: subheadFont }}>
                        Subhead
                    </h2>
                    <p className="text-xs opacity-60" style={{ fontFamily: subheadFont }}>
                        This is some sample body text.
                    </p>
                </div>
                <div className="border-t border-black/10 pt-4">
                    <p className="text-sm font-semibold opacity-40">{subheadFont}</p>
                </div>
            </div>
        </div>
    );
}
