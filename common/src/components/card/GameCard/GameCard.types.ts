import { BaseCardProps } from '../BaseCard';

/**
 * Element types supported by the game
 */
export type ElementType = 'fire' | 'water' | 'earth' | 'air' | 'light' | 'dark';

/**
 * Card rarity levels
 */
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/**
 * Card badge configuration
 */
export interface CardBadge {
	text: string;
	color?: string;
}

/**
 * Card stats configuration
 */
export interface CardStats {
	power?: number;
	defense?: number;
	cost?: number;
}

/**
 * Props specific to game cards
 */
export interface GameCardProps extends BaseCardProps {
	/** Card title */
	title?: string;

	/** Card description */
	description?: string;

	/** Card element type */
	elementType?: ElementType;

	/** Card rarity */
	rarity?: CardRarity;

	/** Card badge */
	badge?: CardBadge;

	/** Card stats */
	stats?: CardStats;

	/** Card image path */
	imagePath?: string;

	/** SVG component to render instead of image */
	svgComponent?: React.ReactNode;

	/** Whether to enable parallax effect */
	enableParallax?: boolean;

	/** Whether to enable glow effect */
	enableGlow?: boolean;

	/** Whether to enable shine effect */
	enableShine?: boolean;

	/** Whether to disable effects on mobile */
	disableEffectsOnMobile?: boolean;
}
