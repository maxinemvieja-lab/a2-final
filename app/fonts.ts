// A curated library of Google Fonts, grouped by type
export const fontLibrary = {
    serif: [
        "Playfair Display", "Lora", "Merriweather", "EB Garamond",
        "Cormorant Garamond", "Libre Baskerville", "PT Serif", "Crimson Text",
        "Bitter", "Spectral"
    ],
    sansSerif: [
        "Inter", "Outfit", "Roboto", "Poppins", "Nunito", "DM Sans",
        "Plus Jakarta Sans", "Figtree", "Geist", "Manrope", "Sora"
    ],
    display: [
        "Space Grotesk", "Syne", "Unbounded", "Bebas Neue",
        "Anton", "Oswald", "Righteous", "Archivo Black", "Big Shoulders Display"
    ],
    mono: [
        "Space Mono", "JetBrains Mono", "Fira Code", "Source Code Pro", "Inconsolata"
    ],
    handwriting: [
        "Caveat", "Pacifico", "Dancing Script", "Kalam", "Sacramento",
        "Satisfy", "Patrick Hand", "Indie Flower"
    ],
};

// Flat list of all fonts combined
export const allFonts = Object.values(fontLibrary).flat();

// Picks a random font from a supplied list that isn't the current one
export const getRandomFontFrom = (list: string[], current: string): string => {
    if (list.length <= 1) return list[0] ?? current;
    let newFont: string;
    do {
        newFont = list[Math.floor(Math.random() * list.length)];
    } while (newFont === current);
    return newFont;
};
