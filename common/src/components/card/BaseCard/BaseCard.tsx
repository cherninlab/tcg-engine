import clsx from 'clsx';
import { forwardRef } from 'react';
import { type CardComponentProps } from '../../../types/ui/components';
import styles from './BaseCard.module.css';

/**
 * Base card component that provides foundational card functionality.
 * All other card components should extend from this base.
 */
export const BaseCard = forwardRef<HTMLDivElement, CardComponentProps>(
	({ card, onClick, onDragStart, onDragEnd, className, ...props }, ref) => {
		const cardClasses = clsx(
			styles.root,
			{
				[styles.interactive]: !!onClick,
				[styles.draggable]: !!(onDragStart || onDragEnd),
			},
			className
		);

		return (
			<div ref={ref} className={cardClasses} onClick={onClick} onDragStart={onDragStart} onDragEnd={onDragEnd} {...props}>
				<div className={styles.content}>
					{card.name && <div className={styles.name}>{card.name}</div>}
					{card.cost !== undefined && <div className={styles.cost}>{card.cost}</div>}
					{card.imageUrl && <div className={styles.art} style={{ backgroundImage: `url(${card.imageUrl})` }} />}
					{card.description && <div className={styles.description}>{card.description}</div>}
					{(card.attack !== undefined || card.defense !== undefined) && (
						<div className={styles.stats}>
							{card.attack !== undefined && <div className={styles.attack}>{card.attack}</div>}
							{card.defense !== undefined && <div className={styles.defense}>{card.defense}</div>}
						</div>
					)}
				</div>
			</div>
		);
	}
);

BaseCard.displayName = 'BaseCard';
