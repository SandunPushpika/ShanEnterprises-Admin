/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "4rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB", // Main blue
          dark: "#1D4ED8",
          light: "#EFF6FF",
        },

        secondary: {
          DEFAULT: "#0F172A",
          light: "#334155",
        },

        accent: {
          DEFAULT: "#3B82F6",
          light: "#BFDBFE",
        },

        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",

        dark: "#0F172A",

        light: "#FFFFFF",

        muted: "#64748B",

        border: "#E2E8F0",

        surface: "#F8FAFC",

        card: "#FFFFFF",

        sidebar: "#FFFFFF",

        sidebarHover: "#EFF6FF",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },

      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at top left, rgba(37,99,235,0.08), transparent 35%), radial-gradient(circle at bottom right, rgba(59,130,246,0.06), transparent 35%)",

        "card-gradient":
          "linear-gradient(180deg, rgba(255,255,255,1), rgba(248,250,252,1))",

        "cta-gradient":
          "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
      },

      boxShadow: {
        glow: "0 10px 30px rgba(37,99,235,0.15)",

        soft: "0 10px 30px rgba(15,23,42,0.06)",

        card: "0 4px 20px rgba(15,23,42,0.06)",
      },

      borderRadius: {
        xl2: "1.25rem",
      },

      animation: {
        float: "float 6s ease-in-out infinite",
        pulseSlow: "pulse 6s infinite",
      },

      keyframes: {
        float: {
          "0%,100%": {
            transform: "translateY(0px)",
          },

          "50%": {
            transform: "translateY(-10px)",
          },
        },
      },
    },
  },

  plugins: [],
};