import './reset.css';
import './variables.css';

/**
 * Theme configuration for the application.
 * This includes colors, typography, spacing, etc.
 */
export const theme = {
	// Color palette
	colors: {
		primary: 'var(--color-primary)',
		primaryLight: 'var(--color-primary-light)',
		primaryDark: 'var(--color-primary-dark)',

		secondary: 'var(--color-secondary)',
		secondaryLight: 'var(--color-secondary-light)',
		secondaryDark: 'var(--color-secondary-dark)',

		success: 'var(--color-success)',
		warning: 'var(--color-warning)',
		danger: 'var(--color-danger)',
		info: 'var(--color-info)',

		background: 'var(--color-background)',
		backgroundDark: 'var(--color-background-dark)',

		text: 'var(--color-text)',
		textLight: 'var(--color-text-light)',
		textDark: 'var(--color-text-dark)',

		border: 'var(--color-border)',
		borderLight: 'var(--color-border-light)',
		borderDark: 'var(--color-border-dark)',
	},

	// Typography
	typography: {
		fontFamily: 'var(--font-family)',
		fontFamilyMono: 'var(--font-family-mono)',

		fontSize: {
			xs: 'var(--font-size-xs)',
			sm: 'var(--font-size-sm)',
			base: 'var(--font-size-base)',
			lg: 'var(--font-size-lg)',
			xl: 'var(--font-size-xl)',
			'2xl': 'var(--font-size-2xl)',
			'3xl': 'var(--font-size-3xl)',
			'4xl': 'var(--font-size-4xl)',
		},

		fontWeight: {
			light: 'var(--font-weight-light)',
			normal: 'var(--font-weight-normal)',
			middle: 'var(--font-weight-medium)',
			semibold: 'var(--font-weight-semibold)',
			bold: 'var(--font-weight-bold)',
		},

		lineHeight: {
			none: 'var(--line-height-none)',
			tight: 'var(--line-height-tight)',
			snug: 'var(--line-height-snug)',
			normal: 'var(--line-height-normal)',
			relaxed: 'var(--line-height-relaxed)',
			loose: 'var(--line-height-loose)',
		},
	},

	// Spacing
	spacing: {
		0: 'var(--spacing-0)',
		1: 'var(--spacing-1)',
		2: 'var(--spacing-2)',
		3: 'var(--spacing-3)',
		4: 'var(--spacing-4)',
		5: 'var(--spacing-5)',
		6: 'var(--spacing-6)',
		8: 'var(--spacing-8)',
		10: 'var(--spacing-10)',
		12: 'var(--spacing-12)',
		16: 'var(--spacing-16)',
		20: 'var(--spacing-20)',
		24: 'var(--spacing-24)',
	},

	// Border radius
	radius: {
		none: 'var(--radius-none)',
		sm: 'var(--radius-sm)',
		md: 'var(--radius-md)',
		lg: 'var(--radius-lg)',
		xl: 'var(--radius-xl)',
		'2xl': 'var(--radius-2xl)',
		'3xl': 'var(--radius-3xl)',
		full: 'var(--radius-full)',
	},

	// Shadows
	shadows: {
		sm: 'var(--shadow-sm)',
		md: 'var(--shadow-md)',
		lg: 'var(--shadow-lg)',
		xl: 'var(--shadow-xl)',
	},

	// Transitions
	transitions: {
		fast: 'var(--transition-fast)',
		normal: 'var(--transition-normal)',
		slow: 'var(--transition-slow)',
	},

	// Z-index
	zIndex: {
		negative: 'var(--z-negative)',
		elevate: 'var(--z-elevate)',
		sticky: 'var(--z-sticky)',
		drawer: 'var(--z-drawer)',
		dropdown: 'var(--z-dropdown)',
		modal: 'var(--z-modal)',
		popover: 'var(--z-popover)',
		toast: 'var(--z-toast)',
		tooltip: 'var(--z-tooltip)',
	},

	// Game-specific
	game: {
		card: {
			width: 'var(--card-width)',
			height: 'var(--card-height)',
			ratio: 'var(--card-ratio)',
		},
		symbols: {
			manaSize: 'var(--mana-symbol-size)',
			healthSize: 'var(--health-symbol-size)',
			attackSize: 'var(--attack-symbol-size)',
		},
	},
} as const;

// Type definitions
export type Theme = typeof theme;
export type ThemeColor = keyof typeof theme.colors;
export type ThemeSpacing = keyof typeof theme.spacing;
export type ThemeRadius = keyof typeof theme.radius;
export type ThemeShadow = keyof typeof theme.shadows;
export type ThemeTransition = keyof typeof theme.transitions;
export type ThemeZIndex = keyof typeof theme.zIndex;
