import { ReactNode } from 'react';

/**
 * Card elevation levels
 */
export type CardElevation = 'none' | 'low' | 'medium' | 'high';

/**
 * Card border styles
 */
export type CardBorder = 'none' | 'light' | 'medium' | 'heavy';

/**
 * Props for the Card component
 */
export interface CardProps {
	/** The content to be rendered inside the card */
	children: ReactNode;

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

	/** Optional image URL for card background */
	backgroundImage?: string;

	/** Optional hover effect */
	hoverEffect?: 'none' | 'lift' | 'glow';
}
