/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "hsl(33.913, 27.0588%, 83.3333%)",
        "border-light": "hsl(33.913, 27.0588%, 83.3333%)",
        input: "hsl(33.913, 27.0588%, 83.3333%)",
        ring: "hsl(123.038, 46.1988%, 33.5294%)",
        background: "hsl(37.5, 36.3636%, 95.6863%)",
        foreground: "hsl(8.8889, 27.8351%, 19.0196%)",
        primary: {
          DEFAULT: "hsl(123.038, 46.1988%, 33.5294%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        secondary: {
          DEFAULT: "hsl(124.6154, 39.3939%, 93.5294%)",
          foreground: "hsl(124.4776, 55.3719%, 23.7255%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 66.3866%, 46.6667%)",
          foreground: "hsl(0, 0%, 100%)",
        },
        muted: {
          DEFAULT: "hsl(33.75, 34.7826%, 90.9804%)",
          foreground: "hsl(15, 25.2874%, 34.1176%)",
        },
        accent: {
          DEFAULT: "hsl(122, 37.5%, 84.3137%)",
          foreground: "hsl(124.4776, 55.3719%, 23.7255%)",
        },
        popover: {
          DEFAULT: "hsl(37.5, 36.3636%, 95.6863%)",
          foreground: "hsl(8.8889, 27.8351%, 19.0196%)",
        },
        card: {
          DEFAULT: "hsl(37.5, 36.3636%, 95.6863%)",
          foreground: "hsl(8.8889, 27.8351%, 19.0196%)",
        },
        sidebar: {
          DEFAULT: "hsl(33.75, 34.7826%, 90.9804%)",
          foreground: "hsl(8.8889, 27.8351%, 19.0196%)",
          primary: "hsl(123.038, 46.1988%, 33.5294%)",
          "primary-foreground": "hsl(0, 0%, 100%)",
          accent: "hsl(122, 37.5%, 84.3137%)",
          "accent-foreground": "hsl(124.4776, 55.3719%, 23.7255%)",
          border: "hsl(33.913, 27.0588%, 83.3333%)",
          ring: "hsl(123.038, 46.1988%, 33.5294%)",
        },
        chart: {
          1: "hsl(122.4242, 39.4422%, 49.2157%)",
          2: "hsl(122.7907, 43.4343%, 38.8235%)",
          3: "hsl(123.038, 46.1988%, 33.5294%)",
          4: "hsl(124.4776, 55.3719%, 23.7255%)",
          5: "hsl(125.7143, 51.2195%, 8.0392%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", { fontFeatureSettings: '"cv11", "ss01"' }],
        serif: ["var(--font-serif)", { fontFeatureSettings: '"cv11", "ss01"' }],
        mono: ["var(--font-mono)", { fontFeatureSettings: '"cv11", "ss01"' }],
      },
      boxShadow: {
        "2xs": "var(--shadow-2xs)",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)",
      },
    },
  },
  plugins: [],
};
