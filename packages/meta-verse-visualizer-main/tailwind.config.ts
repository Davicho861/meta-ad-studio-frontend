import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        surface: 'hsl(var(--surface))',
        'surface-elevated': 'hsl(var(--surface-elevated))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        hover: 'hsl(var(--hover))',
        pressed: 'hsl(var(--pressed))',
        silver: {
          DEFAULT: 'hsl(var(--silver))',
          muted: 'hsl(var(--silver-muted))',
        },
        gold: {
          DEFAULT: 'hsl(var(--gold))',
          muted: 'hsl(var(--gold-muted))',
        },
        'executive-blue': {
          DEFAULT: 'hsl(var(--executive-blue))',
          muted: 'hsl(var(--executive-blue-muted))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        // Nuevos colores neón para estilo Midjourney/Kling AI
        'background-dark': '#121212',
        'surface-dark': '#1E1E1E',
        'primary-text': '#E0E0E0',
        'secondary-text': '#A0A0A0',
        'accent-blue': '#00AFFF',
        'accent-purple': '#9B59B6',
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-gold': 'var(--gradient-gold)',
        'gradient-surface': 'var(--gradient-surface)',
        'gradient-hover': 'var(--gradient-hover)',
      },
      boxShadow: {
        premium: 'var(--shadow-premium)',
        card: 'var(--shadow-card)',
        glow: 'var(--shadow-glow)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'holographic-glow': {
          '0%, 100%': {
            opacity: '0.5',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.02)',
          },
        },
        'portal-transition': {
          '0%': {
            transform: 'translateX(0) scale(1)',
            opacity: '1',
          },
          '25%': {
            transform: 'translateX(-10px) scale(0.98)',
            opacity: '0.8',
          },
          '50%': {
            transform: 'translateX(10px) scale(1.02)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateX(0) scale(1)',
            opacity: '1',
          },
        },
        'dimensional-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px hsl(var(--executive-blue) / 0.3)',
          },
          '50%': {
            boxShadow:
              '0 0 40px hsl(var(--executive-blue) / 0.6), 0 0 60px hsl(var(--executive-blue) / 0.4)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'holographic-glow': 'holographic-glow 3s ease-in-out infinite',
        'portal-transition': 'portal-transition 2s ease-in-out infinite',
        'dimensional-pulse': 'dimensional-pulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')], // eslint-disable-line @typescript-eslint/no-require-imports
} satisfies Config
