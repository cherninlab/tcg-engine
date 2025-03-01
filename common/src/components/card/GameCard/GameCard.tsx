import { Badge } from '@mantine/core';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { BaseCard } from '../BaseCard/BaseCard';
import { useCardEffects } from '../hooks';
import styles from './GameCard.module.css';
import type { GameCardProps } from './GameCard.types';

/**
 * GameCard component for displaying game-specific cards with advanced effects.
 * Extends BaseCard with game-specific functionality like elements, rarities, and stats.
 */
export const GameCard = forwardRef<HTMLDivElement, GameCardProps>(
	(
		{
			title,
			description,
			elementType,
			rarity,
			badge,
			stats,
			imagePath,
			svgComponent,
			enableParallax = true,
			enableGlow = true,
			enableShine = true,
			disableEffectsOnMobile = true,
			className,
			style,
			isPlayable = true,
			isHighlighted = false,
			showEffects = true,
			...props
		},
		ref
	) => {
		// Use the card effects hook
		const { transform, glowOpacity, shinePosition, effectsEnabled, handleMouseMove, handleMouseLeave } = useCardEffects({
			enableParallax,
			enableGlow,
			enableShine,
			disableEffectsOnMobile,
		});

		// Configure hover effects based on enabled features
		const hoverEffect = effectsEnabled
			? [enableParallax && 'parallax', enableGlow && 'glow', enableShine && 'shine'].filter(Boolean).join(' ')
			: 'none';

		// Combine class names
		const cardClasses = clsx(
			styles.root,
			rarity && styles[`rarity-${rarity}`],
			{
				[styles.playable]: isPlayable,
				[styles.highlighted]: isHighlighted,
				[styles.withEffects]: showEffects,
			},
			className
		);

		// Create header with badge if provided
		const header = badge && (
			<div className={styles.badge}>
				<Badge color={badge.color || 'red'} size="lg">
					{badge.text}
				</Badge>
			</div>
		);

		// Create footer with title and stats if provided
		const footer =
			title || stats ? (
				<div className={styles.footer}>
					{title && <div className={styles.title}>{title}</div>}
					{stats && (
						<div className={styles.stats}>
							{stats.cost && <div className={styles.stat}>{stats.cost}⭐</div>}
							{stats.power && <div className={styles.stat}>{stats.power}⚔️</div>}
							{stats.defense && <div className={styles.stat}>{stats.defense}🛡️</div>}
						</div>
					)}
				</div>
			) : undefined;

		// Combine styles with transform
		const combinedStyles: React.CSSProperties = {
			...style,
			transform: effectsEnabled ? transform : undefined,
		};

		return (
			<BaseCard
				ref={ref}
				className={cardClasses}
				style={combinedStyles}
				header={header}
				footer={footer}
				hoverEffect={hoverEffect as any}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				{...props}
			>
				{/* Element background */}
				{elementType && <div className={clsx(styles.element, styles[`element-${elementType}`])} />}

				{/* Card content */}
				<div className={styles.content}>
					{imagePath && <div className={styles.imageContainer} style={{ backgroundImage: `url(${imagePath})` }} />}
					{svgComponent && <div className={styles.svgContainer}>{svgComponent}</div>}
					{description && <div className={styles.description}>{description}</div>}

					{/* Shine effect */}
					{effectsEnabled && enableShine && (
						<div
							className={styles.shine}
							style={{
								background: `radial-gradient(circle at ${shinePosition.x * 100}% ${
									shinePosition.y * 100
								}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%)`,
							}}
						/>
					)}

					{/* Glow effect */}
					{effectsEnabled && enableGlow && (
						<div
							className={styles.glow}
							style={{
								opacity: glowOpacity,
							}}
						/>
					)}
				</div>
			</BaseCard>
		);
	}
);

GameCard.displayName = 'GameCard';
