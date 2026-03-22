import type { Config } from 'tailwindcss'

/**
 * Tailwind v4 — this config is minimal.
 * All design tokens (colors, fonts, radius, shadows) live in globals.css @theme.
 * Tailwind v4 reads CSS @theme directly and generates utilities from it.
 */
const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}

export default config
