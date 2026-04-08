// ── Design Tokens — App English Mobile ──
export const Colors = {
  // Backgrounds
  bgPrimary:    '#0d0d1a',
  bgSecondary:  '#13132a',
  bgCard:       '#1a1a35',
  bgCardHover:  '#202040',

  // Accent
  purple:       '#7c3aed',
  purple2:      '#9d5cf6',
  pink:         '#ec4899',
  pink2:        '#f472b6',
  cyan:         '#06b6d4',
  green:        '#10b981',
  green2:       '#34d399',
  orange:       '#f59e0b',
  red:          '#ef4444',

  // Text
  textPrimary:   '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted:     '#64748b',

  // Borders
  border:        'rgba(255,255,255,0.08)',
  borderSubtle:  'rgba(255,255,255,0.04)',

  // Gradient stops
  gradientStart: '#7c3aed',
  gradientEnd:   '#ec4899',
} as const;

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
  '3xl': 32,
} as const;

export const Radius = {
  sm:   6,
  md:   10,
  lg:   16,
  xl:   24,
  full: 999,
} as const;

export const FontSize = {
  xs:   11,
  sm:   12,
  base: 14,
  md:   16,
  lg:   18,
  xl:   22,
  '2xl': 26,
  '3xl': 32,
} as const;

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  purple: {
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;
