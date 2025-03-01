import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './Card.module.css';
import type { CardBaseProps } from './Card.types';
import { useCardEffects } from './hooks/useCardEffects';

/**
 * Card component for displaying game cards with various visual styles and effects.
 * Uses the game's type system and handles all visual variants through props.
 */
export const Card = forwardRef<HTMLDivElement, CardBaseProps>(
	(
		{
			card,
			variant = 'default',
			effects = {},
			interactive = true,
			selected = false,
			disabled = false,
			children,
			onClick,
			className,
			style,
			...props
		},
		ref
	) => {
		// Destructure card properties
		const { name, type, cost, power, toughness, imageUrl, displayEffect, rarity, isPlayable, isSelected, attack, defense, animations } =
			card;

		// Use the card effects hook if effects are enabled
		const { transform, glowOpacity, shinePosition, effectsEnabled, handleMouseMove, handleMouseLeave } = useCardEffects(effects);

		// Combine class names
		const cardClasses = clsx(
			styles.root,
			styles[variant],
			styles[`type-${type}`],
			styles[`rarity-${rarity}`],
			{
				[styles.interactive]: interactive && !disabled,
				[styles.selected]: selected || isSelected,
				[styles.disabled]: disabled || !isPlayable,
				[styles.hasEffects]: effectsEnabled,
			},
			className
		);

		// Combine styles with transform
		const combinedStyles: React.CSSProperties = {
			...style,
			transform: effectsEnabled ? transform : undefined,
		};

		// Create header content
		const header = (
			<div className={styles.header}>
				{name && <div className={styles.name}>{name}</div>}
				{cost !== undefined && <div className={styles.cost}>{cost}</div>}
			</div>
		);

		// Create footer content
		const footer = (type === 'creature' || attack !== undefined || defense !== undefined) && (
			<div className={styles.footer}>
				<div className={styles.stats}>
					{(attack ?? power) !== undefined && <div className={styles.attack}>{attack ?? power}</div>}
					{(defense ?? toughness) !== undefined && <div className={styles.defense}>{defense ?? toughness}</div>}
				</div>
			</div>
		);

		return (
			<div
				ref={ref}
				className={cardClasses}
				onClick={!disabled ? onClick : undefined}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				style={combinedStyles}
				{...props}
			>
				{/* Card frame */}
				<div className={styles.frame}>
					{header}

					{/* Card art */}
					{imageUrl && <div className={styles.art} style={{ backgroundImage: `url(${imageUrl})` }} />}

					{/* Card content */}
					<div className={styles.content}>
						{displayEffect && <div className={styles.effect}>{displayEffect}</div>}
						{children}
					</div>

					{footer}

					{/* Visual effects */}
					{effectsEnabled && (
						<>
							{/* Shine effect */}
							<div
								className={styles.shine}
								style={{
									background: `radial-gradient(circle at ${shinePosition.x * 100}% ${
										shinePosition.y * 100
									}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%)`,
								}}
							/>

							{/* Glow effect */}
							<div
								className={styles.glow}
								style={{
									opacity: glowOpacity,
								}}
							/>
						</>
					)}

					{/* Animations */}
					{animations?.map((animation, index) => (
						<div
							key={index}
							className={clsx(styles.animation, styles[`animation-${animation.type}`])}
							style={{
								animationDuration: `${animation.duration}ms`,
								animationDelay: animation.delay ? `${animation.delay}ms` : undefined,
							}}
						/>
					))}
				</div>
			</div>
		);
	}
);

Card.displayName = 'Card';
