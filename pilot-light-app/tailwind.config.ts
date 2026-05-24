import type { Config } from "tailwindcss";

// Pilot Light — late-night broadcast palette.
// Anchor: near-black background, low-saturation amber accent, dusty-paper text.
// Inspired by old broadcast monitors and on-air light signage.

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0d",        // base background — near-black, slight cool
        bg: "#0b0b0d",
        surface: "#15151a",    // raised panel
        surface2: "#1d1d24",   // doubly-raised
        line: "#2a2a32",       // subtle border
        line2: "#3a3a44",      // hover border
        paper: "#e8e2d4",      // dusty warm off-white body text
        cream: "#cfc7b6",      // slightly dimmer paper
        muted: "#8a8275",      // muted text
        quiet: "#5d574c",      // very quiet text
        amber: "#c19243",      // ON-AIR amber — low saturation
        ember: "#a4762d",      // darker amber for hover/active
        accent: "#c19243",     // alias
        signal: "#9aa5b1",     // cool gray-blue for tags
      },
      fontFamily: {
        display: ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        serif: ["var(--font-fraunces)", "Georgia", "Times New Roman", "serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
