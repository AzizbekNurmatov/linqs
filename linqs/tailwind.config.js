/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
      },
      colors: {
        primary: {
          from: '#6C5CE7',
          to: '#FF7675',
        },
        accent: '#00CEC9',
        text: {
          main: '#2D3436',
          muted: '#636E72',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'Outfit', 'system-ui', 'sans-serif'],
        body: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'squircle': '24px',
      },
    },
  },
  plugins: [],
}

