/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "hsl(25, 25%, 84%)",
        "border-light": "hsl(25, 25%, 84%)",
        input: "hsl(25, 25%, 84%)",
        ring: "hsl(350, 55%, 55%)",
        background: "hsl(30, 40%, 96.5%)",
        foreground: "hsl(15, 20%, 18%)",
        primary: {
          DEFAULT: "hsl(350, 55%, 55%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        secondary: {
          DEFAULT: "hsl(20, 45%, 93%)",
          foreground: "hsl(350, 40%, 28%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 66.3866%, 46.6667%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        muted: {
          DEFAULT: "hsl(28, 30%, 91%)",
          foreground: "hsl(15, 18%, 38%)",
        },
        accent: {
          DEFAULT: "hsl(35, 65%, 82%)",
          foreground: "hsl(30, 45%, 25%)",
        },
        popover: {
          DEFAULT: "hsl(30, 40%, 96.5%)",
          foreground: "hsl(15, 20%, 18%)",
        },
        card: {
          DEFAULT: "hsl(30, 40%, 96.5%)",
          foreground: "hsl(15, 20%, 18%)",
        },
        sidebar: {
          DEFAULT: "hsl(28, 30%, 91%)",
          foreground: "hsl(15, 20%, 18%)",
          primary: "hsl(350, 55%, 55%)",
          "primary-foreground": "hsl(0, 0%, 100%)",
          accent: "hsl(35, 65%, 82%)",
          "accent-foreground": "hsl(30, 45%, 25%)",
          border: "hsl(25, 25%, 84%)",
          ring: "hsl(350, 55%, 55%)",
        },
        chart: {
          1: "hsl(350, 60%, 68%)",
          2: "hsl(350, 55%, 58%)",
          3: "hsl(35, 65%, 65%)",
          4: "hsl(350, 45%, 40%)",
          5: "hsl(15, 30%, 20%)",
        },
        // Dewy brand extras — beauty-specific accents not covered by shadcn roles
        glow: {
          DEFAULT: "hsl(350, 55%, 55%)",
          light: "hsl(350, 60%, 68%)",
          dark: "hsl(350, 45%, 40%)",
        },
        gold: {
          DEFAULT: "hsl(35, 65%, 65%)",
          light: "hsl(35, 65%, 82%)",
          dark: "hsl(30, 45%, 25%)",
        },
      },
      borderRadius: {
        lg: 12,
        md: 10,
        sm: 8,
        xl: 16,
      },
      fontFamily: {
        sans: ["Montserrat", { fontFeatureSettings: '"cv11", "ss01"' }],
        serif: ["Merriweather", { fontFeatureSettings: '"cv11", "ss01"' }],
        mono: ["SourceCodePro", { fontFeatureSettings: '"cv11", "ss01"' }],
      },
      boxShadow: {
        "2xs": "0 1px 3px 0px rgba(0,0,0,0.05)",
        xs: "0 1px 3px 0px rgba(0,0,0,0.05)",
        sm: "0 1px 3px 0px rgba(0,0,0,0.1)",
        DEFAULT: "0 1px 3px 0px rgba(0,0,0,0.1)",
        md: "0 2px 4px -1px rgba(0,0,0,0.1)",
        lg: "0 4px 6px -1px rgba(0,0,0,0.1)",
        xl: "0 8px 10px -1px rgba(0,0,0,0.1)",
        "2xl": "0 1px 3px 0px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
