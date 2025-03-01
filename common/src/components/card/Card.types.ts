import type { ReactNode } from 'react';
import type { UICard } from '../../types/ui/state';

/**
 * Visual variants for card display
 */
export type CardVariant = 'default' | 'enhanced' | 'compact' | 'detailed';

/**
 * Visual effects configuration
 */
export interface CardEffects {
	/** Whether to enable parallax effect */
	enableParallax?: boolean;
	/** Whether to enable glow effect */
	enableGlow?: boolean;
	/** Whether to enable shine effect */
	enableShine?: boolean;
	/** Whether to disable effects on mobile */
	disableEffectsOnMobile?: boolean;
}

/**
 * Base props for all card components
 */
export interface CardBaseProps {
	/** Card data */
	card: UICard;
	/** Visual variant */
	variant?: CardVariant;
	/** Visual effects configuration */
	effects?: CardEffects;
	/** Whether the card is interactive */
	interactive?: boolean;
	/** Whether the card is selected */
	selected?: boolean;
	/** Whether the card is disabled */
	disabled?: boolean;
	/** Additional content to render */
	children?: ReactNode;
	/** Click handler */
	onClick?: () => void;
	/** Additional CSS class names */
	className?: string;
	/** Additional inline styles */
	style?: React.CSSProperties;
}
