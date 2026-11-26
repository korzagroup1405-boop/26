import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#240407',
        wine: '#35080D',
        wineLight: '#4A0D14',
        gold: '#F9B923',
        goldSoft: '#E8C878',
        cream: '#F5F0EA',
        beige: '#C7B8B5',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '24px',
        xl3: '32px',
      },
      // Extra opacity steps used for the hairline borders and glass surfaces.
      opacity: {
        8: '0.08',
        12: '0.12',
        15: '0.15',
        18: '0.18',
        22: '0.22',
        35: '0.35',
        45: '0.45',
        55: '0.55',
        65: '0.65',
        85: '0.85',
        92: '0.92',
        98: '0.98',
      },
      boxShadow: {
        soft: '0 30px 80px -40px rgba(0,0,0,0.9)',
        gold: '0 24px 60px -24px rgba(249,185,35,0.35)',
      },
      letterSpacing: {
        wider2: '0.28em',
      },
      keyframes: {
        floatIn: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        kenburns: {
          '0%': { transform: 'scale(1.06) translate3d(0,0,0)' },
          '100%': { transform: 'scale(1.16) translate3d(0,-1.5%,0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        ember: {
          '0%,100%': { opacity: '0.45' },
          '50%': { opacity: '0.9' },
        },
        seal: {
          '0%': { opacity: '0', transform: 'scale(0.85) rotate(-6deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
      },
      animation: {
        floatIn: 'floatIn 900ms cubic-bezier(0.16,1,0.3,1) both',
        kenburns: 'kenburns 24s ease-in-out infinite alternate',
        shimmer: 'shimmer 1.1s ease-in-out',
        ember: 'ember 5s ease-in-out infinite',
        seal: 'seal 700ms cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
};

export default config;
