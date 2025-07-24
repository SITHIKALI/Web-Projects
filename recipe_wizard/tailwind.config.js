/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", // light gray
        input: "var(--color-input)", // soft off-white with green undertones
        ring: "var(--color-ring)", // sage green
        background: "var(--color-background)", // pure white with subtle warmth
        foreground: "var(--color-foreground)", // deep charcoal
        primary: {
          DEFAULT: "var(--color-primary)", // sage green
          foreground: "var(--color-primary-foreground)", // white
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", // warm golden tone
          foreground: "var(--color-secondary-foreground)", // deep charcoal
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", // muted coral-red
          foreground: "var(--color-destructive-foreground)", // white
        },
        muted: {
          DEFAULT: "var(--color-muted)", // soft off-white with green undertones
          foreground: "var(--color-muted-foreground)", // medium gray
        },
        accent: {
          DEFAULT: "var(--color-accent)", // rich amber
          foreground: "var(--color-accent-foreground)", // deep charcoal
        },
        popover: {
          DEFAULT: "var(--color-popover)", // pure white with subtle warmth
          foreground: "var(--color-popover-foreground)", // deep charcoal
        },
        card: {
          DEFAULT: "var(--color-card)", // pure white with subtle warmth
          foreground: "var(--color-card-foreground)", // deep charcoal
        },
        success: {
          DEFAULT: "var(--color-success)", // fresh green
          foreground: "var(--color-success-foreground)", // white
        },
        warning: {
          DEFAULT: "var(--color-warning)", // gentle yellow-orange
          foreground: "var(--color-warning-foreground)", // deep charcoal
        },
        error: {
          DEFAULT: "var(--color-error)", // muted coral-red
          foreground: "var(--color-error-foreground)", // white
        },
        surface: "var(--color-surface)", // soft off-white with green undertones
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Source Sans 3', 'sans-serif'],
        'caption': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      boxShadow: {
        'recipe-card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'modal': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}