/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        panel:
          "0 24px 60px -34px rgba(113, 63, 18, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.65)",
      },
      borderRadius: {
        shell: "2rem",
        panel: "1.5rem",
      },
      colors: {
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        sage: {
          100: "#d8f0eb",
          600: "#0f766e",
          700: "#115e59",
        },
        ink: {
          950: "#1f2937",
        },
        sand: {
          50: "#f8f5ef",
          100: "#f0e7db",
          200: "#e3d3bd",
        },
      },
      fontFamily: {
        sans: ["Be Vietnam Pro", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "hero-wash":
          "radial-gradient(circle at top right, rgba(245, 158, 11, 0.16), transparent 34%), radial-gradient(circle at left center, rgba(15, 118, 110, 0.12), transparent 32%), linear-gradient(180deg, #fcfaf5 0%, #f7f2e8 100%)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -10px, 0)" },
        },
      },
      animation: {
        drift: "drift 4.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
