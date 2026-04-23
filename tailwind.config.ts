import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1a1a1a',
          soft: '#2a2a2a',
          muted: '#4a4a4a',
        },
        paper: {
          DEFAULT: '#fafaf7',
          soft: '#f3f2ed',
          line: '#e5e3dc',
        },
        accent: {
          DEFAULT: '#8a5a3b',   // warm terracotta — SIO-achtig, rustig
          soft: '#b88c6b',
          hover: '#6f4629',
        },
        signal: {
          ok: '#4a6b3a',
          warn: '#a66b1f',
          risk: '#9b3a3a',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        prose: '68ch',
      },
    },
  },
  plugins: [],
};

export default config;
