import React from 'react';
import { Card as CardType } from '../../types/game';
import './Card.css';

interface CardProps {
	card: CardType;
	isSelected?: boolean;
	isPlayable?: boolean;
	onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ card, isSelected = false, isPlayable = true, onClick }) => {
	const handleClick = () => {
		if (isPlayable && onClick) {
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
			className={`game-card ${isSelected ? 'selected' : ''} ${isPlayable ? 'playable' : 'disabled'}`}
			onClick={handleClick}
			style={{
				borderColor: getRarityColor(card.rarity),
			}}
		>
			<div className="card-cost">{card.cost}</div>
			<div className="card-image">
				<img src={card.imageUrl} alt={card.name} />
			</div>
			<div className="card-name">{card.name}</div>
			<div className="card-type">{card.type}</div>
			{card.type === 'creature' && (
				<div className="card-stats">
					<span className="attack">{card.attack}</span>
					<span className="defense">{card.defense}</span>
				</div>
			)}
			<div className="card-description">{card.description}</div>
			{card.effects.length > 0 && (
				<div className="card-effects">
					{card.effects.map((effect, index) => (
						<div key={index} className="effect">
							{effect.description}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Card;
