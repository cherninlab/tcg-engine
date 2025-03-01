import { ReactNode } from 'react';

/**
 * Base elevation levels for cards
 */
export type CardElevation = 'none' | 'low' | 'medium' | 'high';

/**
 * Base border styles for cards
 */
export type CardBorder = 'none' | 'light' | 'medium' | 'heavy';

/**
 * Base hover effects for cards
 */
export type CardHoverEffect = 'none' | 'lift' | 'glow' | 'shine' | 'parallax';

/**
 * Base animation timing options
 */
export type CardAnimationTiming = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

/**
 * Base card theme options
 */
export interface CardTheme {
	backgroundColor?: string;
	borderColor?: string;
	textColor?: string;
	glowColor?: string;
}

/**
 * Base props interface for all card components
 */
export interface BaseCardProps {
	/** The content to be rendered inside the card */
	children?: ReactNode;

	/** The elevation/shadow level of the card */
	elevation?: CardElevation;

	/** The border style of the card */
	border?: CardBorder;

	/** Whether the card should take full width */
	fullWidth?: boolean;

	/** Whether the card should take full height */
	fullHeight?: boolean;

	/** Additional CSS class names */
	className?: string;

	/** Click handler */
	onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;

	/** Whether the card is clickable */
	clickable?: boolean;

	/** Whether the card is selected */
	selected?: boolean;

	/** Whether the card is disabled */
	disabled?: boolean;

	/** Optional header content */
	header?: ReactNode;

	/** Optional footer content */
	footer?: ReactNode;

	/** Optional background image URL */
	backgroundImage?: string;

	/** Optional hover effect */
	hoverEffect?: CardHoverEffect;

	/** Optional theme overrides */
	theme?: CardTheme;

	/** Optional animation timing */
	animationTiming?: CardAnimationTiming;

	/** Optional custom styles */
	style?: React.CSSProperties;
}
