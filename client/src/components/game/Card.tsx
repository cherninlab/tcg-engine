import { CardComponentProps } from '@rism-tcg/common/src/types/ui';
import React from 'react';
import styles from './Card.module.css';

const Card: React.FC<CardComponentProps> = ({ card, onClick, onDragStart, onDragEnd, className }) => {
	const handleClick = () => {
		if (card.isPlayable && onClick) {
			onClick();
		}
	};

	const getRarityColor = (rarity: string): string => {
		switch (rarity) {
			case 'legendary':
				return '#ffd700';
			case 'rare':
				return '#4dabf7';
			case 'uncommon':
				return '#69db7c';
			default:
				return '#ced4da';
		}
	};

	return (
		<div
			className={`${styles.gameCard} ${card.isSelected ? styles.selected : ''} ${card.isPlayable ? styles.playable : styles.disabled} ${
				className || ''
			}`}
			onClick={handleClick}
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			draggable={card.isPlayable}
			style={{
				borderColor: getRarityColor(card.rarity),
			}}
		>
			<div className={styles.cardCost}>{card.cost}</div>
			<div className={styles.cardImage}>
				<img src={card.imageUrl} alt={card.name} />
			</div>
			<div className={styles.cardName}>{card.name}</div>
			<div className={styles.cardType}>{card.type}</div>
			{card.type === 'creature' && (
				<div className={styles.cardStats}>
					<span className={styles.attack}>{card.attack}</span>
					<span className={styles.defense}>{card.defense}</span>
				</div>
			)}
			<div className={styles.cardDescription}>{card.description || card.displayEffect}</div>
			{card.animations?.map((animation, index) => (
				<div
					key={`${animation.type}-${index}`}
					className={`${styles.animation} ${styles[animation.type]}`}
					style={{
						animationDuration: `${animation.duration}ms`,
						animationDelay: animation.delay ? `${animation.delay}ms` : undefined,
					}}
				/>
			))}
		</div>
	);
};

export default Card;
