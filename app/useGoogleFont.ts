import { useEffect } from "react";

const loadedFonts = new Set<string>(); // Track which fonts are already loaded

export function useGoogleFont(fontNames: string[]) {
    useEffect(() => {
        fontNames.forEach((fontName) => {
            // Skip if already injected
            if (loadedFonts.has(fontName)) return;

            // Build the Google Fonts URL from the font name
            const encodedName = fontName.replace(/ /g, "+");
            const url = `https://fonts.googleapis.com/css2?family=${encodedName}:wght@400;700;900&display=swap`;

            // Create a <link> tag and inject it into the document <head>
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = url;
            document.head.appendChild(link);

            // Mark as loaded so we don't inject it again
            loadedFonts.add(fontName);
        });
    }, [fontNames.join(",")]); // Re-run whenever the list of fonts changes
}
