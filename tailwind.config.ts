import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // New Palette Mapping
        "hi-dark": "#222222",
        "hi-gray": "#E5E5E5",
        "hi-orange-red": "#E65100",
        "hi-yellow": "#FFB800",
        "hi-blue-light": "#0088CC",
        
        // Legacy fallbacks
        "hi-blue": "#0088CC",
        "hi-orange": "#E65100",
        "hi-dark-orange": "#FFB800",
      },
      fontFamily: {
        sans: ["'Neue Montreal'", "var(--font-montserrat)", "Inter", "sans-serif"],
        serif: ["'The Seasons'", "var(--font-playfair)", "serif"],
        madani: ["'Madani Arabic'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
