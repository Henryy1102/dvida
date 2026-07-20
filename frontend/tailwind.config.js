/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Montserrat", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Inter", "system-ui", "serif"],
      },
      colors: {
        fondo: "#f8fafc",
        primary: "#0052a3",
        secondary: "#ffffff",
        accent: "#475569",
        purple: "#e0f2fe",
        card: "#ffffff",
        textMain: "#0f172a",
        subtext: "#64748b",
        borderColor: "#cbd5e1",
      },
      borderRadius: {
        'card': '8px',
      },
    },
  },
  plugins: [],
}

