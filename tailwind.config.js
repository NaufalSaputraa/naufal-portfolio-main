/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#0071E3",
                "primary-hover": "#006EDB",
                "primary-press": "#0076DF",
                "secondary": "#0071E3",
                "background-light": "#f7f7f7",
                "background-dark": "#18181A",
                "surface-dark": "#272729",
                "text-dominant": "#1D1D1F",
                "text-secondary": "#333336",
                "text-tertiary": "#6E6E73",
                "surface-light": "#EDEDF2",
            },
            fontFamily: {
                "display": ["Space Grotesk", "Inter", "sans-serif"],
                "sans": ["Archivo", "Inter", "sans-serif"],
            },
            backgroundImage: {
                'glow-gradient': 'radial-gradient(circle at center, rgba(0, 113, 227, 0.15) 0%, rgba(24, 24, 26, 0) 70%)',
                'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
            }
        },
    },
    plugins: [],
}
