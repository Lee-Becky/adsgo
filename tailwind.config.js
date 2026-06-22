/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ── Colors ────────────────────────────────────────── */
      colors: {
        primary: {
          DEFAULT: 'var(--primary-500)',
          50:  'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
          950: 'var(--primary-950)',
          /* 1.0 compat aliases */
          hover: 'var(--primary-700)',
          light: 'var(--primary-50)',
          mid:   'var(--primary-200)',
          text:  'var(--primary-700)',
        },
        luna: {
          violet:      'var(--luna-violet)',
          'violet-lt': 'var(--luna-violet-light)',
          'violet-pl': 'var(--luna-violet-pale)',
          amber:       'var(--luna-amber)',
          'amber-lt':  'var(--luna-amber-light)',
          'amber-pl':  'var(--luna-amber-pale)',
          bg:          'var(--luna-bg)',
          'bg-warm':   'var(--luna-bg-warm)',
          border:      'var(--luna-border)',
        },
        neutral: {
          50:  'var(--neutral-50)',
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
          900: 'var(--neutral-900)',
          950: 'var(--neutral-950)',
        },
        ink: {
          50:  'var(--ink-50)',
          100: 'var(--ink-100)',
          200: 'var(--ink-200)',
          300: 'var(--ink-300)',
          400: 'var(--ink-400)',
          500: 'var(--ink-500)',
          600: 'var(--ink-600)',
          700: 'var(--ink-700)',
          800: 'var(--ink-800)',
          900: 'var(--ink-900)',
          950: 'var(--ink-950)',
        },
        success: {
          DEFAULT: 'var(--success-500)',
          50:  'var(--success-50)',
          100: 'var(--success-100)',
          200: 'var(--success-200)',
          300: 'var(--success-300)',
          400: 'var(--success-400)',
          500: 'var(--success-500)',
          600: 'var(--success-600)',
          700: 'var(--success-700)',
          800: 'var(--success-800)',
          900: 'var(--success-900)',
          950: 'var(--success-950)',
        },
        danger: {
          DEFAULT: 'var(--danger-500)',
          50:  'var(--danger-50)',
          100: 'var(--danger-100)',
          200: 'var(--danger-200)',
          300: 'var(--danger-300)',
          400: 'var(--danger-400)',
          500: 'var(--danger-500)',
          600: 'var(--danger-600)',
          700: 'var(--danger-700)',
          800: 'var(--danger-800)',
          900: 'var(--danger-900)',
          950: 'var(--danger-950)',
        },
        warning: {
          DEFAULT: 'var(--warning-500)',
          50:  'var(--warning-50)',
          100: 'var(--warning-100)',
          200: 'var(--warning-200)',
          300: 'var(--warning-300)',
          400: 'var(--warning-400)',
          500: 'var(--warning-500)',
          600: 'var(--warning-600)',
          700: 'var(--warning-700)',
          800: 'var(--warning-800)',
          900: 'var(--warning-900)',
          950: 'var(--warning-950)',
        },
        info: {
          DEFAULT: 'var(--info-500)',
          50:  'var(--info-50)',
          100: 'var(--info-100)',
          200: 'var(--info-200)',
          300: 'var(--info-300)',
          400: 'var(--info-400)',
          500: 'var(--info-500)',
          600: 'var(--info-600)',
          700: 'var(--info-700)',
          800: 'var(--info-800)',
          900: 'var(--info-900)',
          950: 'var(--info-950)',
        },
        /* 1.0 backward-compat aliases */
        error: {
          DEFAULT: 'var(--danger-500)',
          50:  'var(--danger-50)',
          100: 'var(--danger-100)',
          500: 'var(--danger-500)',
          600: 'var(--danger-600)',
          700: 'var(--danger-700)',
        },
        secondary: 'var(--neutral-500)',
        surface:    'var(--surface-card)',
        background: 'var(--surface-page)',
        border:     'var(--neutral-200)',
        /* Platform colors */
        meta:   'var(--platform-meta)',
        google: 'var(--platform-google)',
        tiktok: 'var(--platform-tiktok)',
        bing:   'var(--platform-bing)',
        /* Chart colors */
        chart: {
          1:  'var(--chart-1)',
          2:  'var(--chart-2)',
          3:  'var(--chart-3)',
          4:  'var(--chart-4)',
          5:  'var(--chart-5)',
          6:  'var(--chart-6)',
          7:  'var(--chart-7)',
          8:  'var(--chart-8)',
          9:  'var(--chart-9)',
          10: 'var(--chart-10)',
        },
      },

      /* ── Typography ────────────────────────────────────── */
      fontFamily: {
        heading: ['Sora', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        body:    ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
        /* 1.0 compat — old code using font-sans picks up the new body font */
        sans:    ['DM Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'display':  ['2.25rem',  { lineHeight: '1.2',  fontWeight: '700', letterSpacing: '-0.025em' }],
        'h1':       ['1.5rem',   { lineHeight: '1.25', fontWeight: '600' }],
        'h2':       ['1.25rem',  { lineHeight: '1.3',  fontWeight: '600' }],
        'h3':       ['1.125rem', { lineHeight: '1.35', fontWeight: '600' }],
        'body-lg':  ['1rem',     { lineHeight: '1.5',  fontWeight: '400' }],
        'body':     ['0.875rem', { lineHeight: '1.5',  fontWeight: '400' }],
        'caption':  ['0.75rem',  { lineHeight: '1.4',  fontWeight: '500' }],
        'overline': ['0.6875rem',{ lineHeight: '1.3',  fontWeight: '600', letterSpacing: '0.05em' }],
        'kpi':      ['2rem',     { lineHeight: '1.15', fontWeight: '700', letterSpacing: '-0.02em' }],
        'kpi-lg':   ['2.5rem',   { lineHeight: '1.1',  fontWeight: '700', letterSpacing: '-0.025em' }],
      },
      fontWeight: {
        regular:  '400',
        medium:   '500',
        semibold: '600',
        bold:     '700',
      },

      /* ── Border Radius ─────────────────────────────────── */
      borderRadius: {
        'xs':      'var(--radius-xs)',
        'sm':      'var(--radius-sm)',
        'base':    'var(--radius-base)',
        DEFAULT:   'var(--radius-base)',
        'md':      'var(--radius-md)',
        'lg':      'var(--radius-lg)',
        'xl':      'var(--radius-xl)',
        '2xl':     'var(--radius-2xl)',
        /* 1.0 compat */
        'checkbox': 'var(--radius-sm)',
        'tag':      'var(--radius-base)',
        'inner':    'var(--radius-lg)',
        'section':  'var(--radius-xl)',
      },

      /* ── Box Shadows ───────────────────────────────────── */
      boxShadow: {
        'ring':        'var(--shadow-ring)',
        'xs':          'var(--shadow-xs)',
        'sm':          'var(--shadow-sm)',
        'md':          'var(--shadow-md)',
        'lg':          'var(--shadow-lg)',
        'xl':          'var(--shadow-xl)',
        '2xl':         'var(--shadow-2xl)',
        'glow':        'var(--shadow-glow)',
        'luna':        'var(--shadow-luna)',
        'card-hover':  'var(--shadow-card-hover)',
        'focus':       'var(--shadow-focus)',
        /* 1.0 compat aliases */
        'primary-focus':    'var(--shadow-glow)',
        'error-focus':      '0 4px 14px 0 rgba(239,68,68,0.2)',
        'adsgo-card':       'var(--shadow-sm)',
        'adsgo-depth':      'var(--shadow-md)',
        'adsgo-card-hover': 'var(--shadow-card-hover)',
        'adsgo-card-selected': '0 0 0 2px rgba(99,102,241,0.15), 0 8px 24px -4px rgba(99,102,241,0.12)',
      },

      /* ── Animations ────────────────────────────────────── */
      animation: {
        /* Micro interactions */
        'fade-in':          'fadeIn var(--duration-normal) var(--ease-out)',
        'fade-out':         'fadeOut var(--duration-fast) var(--ease-in)',
        'slide-up':         'slideUp var(--duration-normal) var(--ease-out)',
        'slide-down':       'slideDown var(--duration-normal) var(--ease-out)',
        'slide-in-right':   'slideInRight var(--duration-normal) var(--ease-out)',
        'slide-out-right':  'slideOutRight var(--duration-fast) var(--ease-in)',
        'scale-in':         'scaleIn var(--duration-normal) var(--ease-spring)',
        'scale-out':        'scaleOut var(--duration-fast) var(--ease-in)',
        /* Page transitions */
        'page-enter':       'pageEnter var(--duration-slow) var(--ease-out)',
        /* Data loading */
        'shimmer':          'shimmer 2s ease-in-out infinite',
        'pulse-subtle':     'pulseSubtle 2s ease-in-out infinite',
        /* Luna AI */
        'luna-thinking':    'lunaThinking 1.5s ease-in-out infinite',
        'luna-glow':        'lunaGlow 3s ease-in-out infinite',
        'luna-suggest':     'lunaSuggest var(--duration-slow) var(--ease-spring)',
        /* List stagger (combine with animation-delay) */
        'stagger-in':       'staggerIn var(--duration-normal) var(--ease-out) both',
        /* 1.0 compat */
        'step-enter':       'slideUp 0.35s ease-out',
        'progress-indeterminate': 'progressIndeterminate 1.8s ease-in-out infinite',
        'error-pulse':      'errorPulse 1.2s ease-in-out 3',
        'bubble-expand':    'scaleIn 0.3s ease-out',
        'bubble-collapse':  'scaleOut 0.25s ease-in forwards',
        'gen-float':        'genFloat 2.5s ease-in-out infinite',
        'gen-ring':         'genRing 3s ease-out infinite',
        'gen-dot':          'genDot 1s ease-in-out infinite',
        'gen-fade-in-left': 'genFadeInLeft 0.8s ease-out both',
        'gen-fade-in-right':'genFadeInRight 0.8s ease-out both',
        'gen-text-in':      'genTextIn 0.5s ease-out both',
        'scan':             'scan 3s linear infinite',
      },
      keyframes: {
        /* ── Core keyframes ─────────────────────────────── */
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        fadeOut: {
          from: { opacity: '1' },
          to:   { opacity: '0' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        slideOutRight: {
          from: { opacity: '1', transform: 'translateX(0)' },
          to:   { opacity: '0', transform: 'translateX(16px)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          from: { opacity: '1', transform: 'scale(1)' },
          to:   { opacity: '0', transform: 'scale(0.95)' },
        },
        pageEnter: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        staggerIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%,100%': { backgroundPosition: '200% center' },
          '50%':     { backgroundPosition: '0% center' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },

        /* ── Luna AI keyframes ──────────────────────────── */
        lunaThinking: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.05)' },
        },
        lunaGlow: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(139,92,246,0.1), 0 0 4px rgba(245,158,11,0.05)' },
          '50%':      { boxShadow: '0 0 24px rgba(139,92,246,0.25), 0 0 8px rgba(245,158,11,0.15)' },
        },
        lunaSuggest: {
          from: { opacity: '0', transform: 'translateY(-8px) scale(0.98)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },

        /* ── 1.0 compat keyframes ───────────────────────── */
        progressIndeterminate: {
          '0%':   { width: '0%', marginLeft: '0%' },
          '50%':  { width: '60%', marginLeft: '20%' },
          '100%': { width: '0%', marginLeft: '100%' },
        },
        errorPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.55)', borderColor: 'rgb(239,68,68)' },
          '50%':      { boxShadow: '0 0 0 10px rgba(239,68,68,0)', borderColor: 'rgb(239,68,68)' },
        },
        genFloat: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        genRing: {
          '0%':   { transform: 'scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        genDot: {
          '0%,100%': { transform: 'translateY(0)', opacity: '0.4' },
          '50%':     { transform: 'translateY(-6px)', opacity: '1' },
        },
        genFadeInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        genFadeInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        genTextIn: {
          from: { opacity: '0', transform: 'translateY(15px)', filter: 'blur(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)', filter: 'blur(0px)' },
        },
        scan: {
          '0%':   { top: '0%', opacity: '0' },
          '5%':   { opacity: '1' },
          '95%':  { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
      },

      /* ── Spacing ───────────────────────────────────────── */
      spacing: {
        '4.5': '1.125rem', /* 18px */
        '13':  '3.25rem',  /* 52px */
        '15':  '3.75rem',  /* 60px */
        '18':  '4.5rem',   /* 72px */
        '22':  '5.5rem',   /* 88px */
      },

      /* ── Width / Max-width ─────────────────────────────── */
      maxWidth: {
        'content': '1440px',
        'sidebar': '240px',
        'sidebar-collapsed': '64px',
        'drawer':  '480px',
        'modal-sm': '400px',
        'modal-md': '560px',
        'modal-lg': '720px',
        'modal-xl': '960px',
      },

      /* ── Transitions ───────────────────────────────────── */
      transitionDuration: {
        'instant': '75ms',
        'fast':    '150ms',
        'normal':  '250ms',
        'slow':    '400ms',
        'slower':  '600ms',
        'luna':    '800ms',
      },
      transitionTimingFunction: {
        'default': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring':  'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'bounce':  'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },

      /* ── Backdrop blur ─────────────────────────────────── */
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
      },
    },
  },
  plugins: [],
}
