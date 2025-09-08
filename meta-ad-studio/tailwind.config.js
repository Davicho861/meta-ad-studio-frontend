module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
        colors: {
          'midnight-900': '#0b1020',
          'midnight-800': '#0f1724',
          'accent-500': '#7c5cff',
          'muted-400': '#9aa4bf',
          background: '#0f1724',
        },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      }
  },
    darkMode: 'class',
  plugins: [],
}