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
        cyber: {
          green: "#00FF41",
          purple: "#BD00FF",
          blue: "#00D4FF",
          pink: "#FF00E5",
        },
        space: {
          950: "#030712",
          900: "#0a0a0f",
          800: "#111118",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Orbitron", "sans-serif"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "scan-line": "scan-line 8s linear infinite",
        "matrix-rain": "matrix-rain 20s linear infinite",
        "flicker": "flicker 0.15s infinite",
        "text-shimmer": "text-shimmer 3s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(0, 255, 65, 0.3), 0 0 40px rgba(0, 255, 65, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(0, 255, 65, 0.5), 0 0 60px rgba(0, 255, 65, 0.2)",
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "matrix-rain": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "0% 100%" },
        },
        "flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "text-shimmer": {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-grid": `
          linear-gradient(rgba(0, 255, 65, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 65, 0.03) 1px, transparent 1px)
        `,
        "noise": "url('/noise.png')",
      },
    },
  },
  plugins: [],
};

export default config;
