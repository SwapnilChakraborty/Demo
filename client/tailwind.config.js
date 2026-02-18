/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#DC2626',
                    light: '#EF4444',
                    dark: '#991B1B',
                    50: '#FEF2F2',
                    100: '#FEE2E2',
                },
                red: {
                    600: '#DC2626',
                    700: '#B91C1C',
                    800: '#991B1B',
                },
                dark: '#1a1a2e',
                light: '#F8F9FA',
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            boxShadow: {
                'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
                'nav': '0 -4px 20px rgba(0, 0, 0, 0.1)',
            },
        },
    },
    plugins: [],
}
