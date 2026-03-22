import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'surface-lowest': '#0e0e0e',
        'surface-low': '#1c1b1b',
        'surface': '#201f1f',
        'surface-high': '#2a2a2a',
        'surface-highest': '#353534',
        'surface-bright': '#3a3939',
        'primary': '#acc7ff',
        'primary-container': '#508ff8',
        'primary-fixed': '#d7e2ff',
        'on-surface': '#e5e2e1',
        'on-surface-variant': '#c2c6d5',
        'outline': '#8c909e',
        'outline-variant': '#424753',
        'error': '#ffb4ab',
        'error-container': '#93000a',
      },
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
        DEFAULT: '0.125rem',
        sm: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },
      boxShadow: {
        'ghost': '0 40px 40px 0 rgba(0, 0, 0, 0.08)',
        'glow-primary': '0 0 15px rgba(172, 199, 255, 0.3)',
      },
      backdropBlur: {
        xs: '8px',
        sm: '16px',
        DEFAULT: '24px',
        md: '32px',
        lg: '48px',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #acc7ff 0%, #508ff8 100%)',
      },
    },
  },
  plugins: [],
}

export default config
