/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      fontFamily: {
        fredoka: ['var(--font-fredoka)', 'Comic Sans MS', 'cursive', 'sans-serif'],
        quicksand: ['var(--font-quicksand)', 'sans-serif'],
      },
      animation: {
        'panel-in': 'panelIn 0.5s cubic-bezier(0.76, 0, 0.24, 1) forwards',
      },
      keyframes: {
        panelIn: {
          from: { opacity: '0', clipPath: 'inset(0 100% 0 0)' },
          to: { opacity: '1', clipPath: 'inset(0 0% 0 0)' },
        },
      },
      typography: () => ({
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              h1: {
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      }),
    },
  },
}

export default config
