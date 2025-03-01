import React, { useState } from 'react';
import styles from './CardPacks.module.css';

// Types
interface Card {
	id: number;
	name: string;
	type: string;
	rarity: 'common' | 'rare' | 'epic' | 'legendary';
	image: string;
	revealed: boolean;
}

interface PackType {
	name: string;
	image: string;
	price: number;
}

interface RarityEffect {
	color: string;
	glow: string;
}

// Rarity effects mapping
const rarityEffects: Record<string, RarityEffect> = {
	common: { color: '#69B7F9', glow: '0 0 20px rgba(105,183,249,0.5)' },
	rare: { color: '#8A55ED', glow: '0 0 20px rgba(138,85,237,0.5)' },
	epic: { color: '#F4BC41', glow: '0 0 20px rgba(244,188,65,0.5)' },
	legendary: { color: '#DD4D44', glow: '0 0 30px rgba(221,77,68,0.7)' },
};

const CardPacks: React.FC = () => {
	// State for the overall pack opening flow
	const [state, setState] = useState<'initial' | 'ready'>('initial');
	const [packType, setPackType] = useState<string>('dragon');
	const [cards, setCards] = useState<Card[]>([]);
	const [revealedCards, setRevealedCards] = useState<Card[]>([]);
	const [currentCard, setCurrentCard] = useState<Card | null>(null);
	const [showAll, setShowAll] = useState<boolean>(false);

	// Pack types available for purchase
	const packTypes: PackType[] = [
		{ name: 'dragon', image: 'https://placehold.co/200x280', price: 1000 },
		{ name: 'magic', image: 'https://placehold.co/200x280', price: 1000 },
		{ name: 'beast', image: 'https://placehold.co/200x280', price: 1000 },
	];

	// Generate a new pack of cards
	const generatePack = (type: string) => {
		// In a real app, this would make an API call to get the cards based on the pack type
		// For now, we'll use some mock data
		const newCards: Card[] = [
			{
				id: 1,
				name: 'Ancient Dragon',
				type: 'Creature',
				rarity: 'legendary',
				image: 'https://placehold.co/300x400',
				revealed: false,
			},
			{
				id: 2,
				name: 'Magic Shield',
				type: 'Spell',
				rarity: 'rare',
				image: 'https://placehold.co/300x400',
				revealed: false,
			},
			{
				id: 3,
				name: 'Stone Warrior',
				type: 'Creature',
				rarity: 'common',
				image: 'https://placehold.co/300x400',
				revealed: false,
			},
			{
				id: 4,
				name: 'Dark Ritual',
				type: 'Spell',
				rarity: 'epic',
				image: 'https://placehold.co/300x400',
				revealed: false,
			},
			{
				id: 5,
				name: 'Forest Wolf',
				type: 'Creature',
				rarity: 'common',
				image: 'https://placehold.co/300x400',
				revealed: false,
			},
		];

		setCards(newCards);
		setRevealedCards([]);
		setCurrentCard(null);
		setShowAll(false);
		setState('ready');
	};

	// Handle selecting a pack
	const handleSelectPack = (type: string) => {
		setPackType(type);
		generatePack(type);
	};

	// Reveal a single card
	const revealCard = (card: Card) => {
		if (showAll) return;

		// Update the card to be revealed
		const updatedCards = cards.map((c) => {
			if (c.id === card.id) {
				return { ...c, revealed: true };
			}
			return c;
		});

		setCards(updatedCards);
		setCurrentCard(card);

		// Add to revealed cards if not already there
		if (!revealedCards.some((c) => c.id === card.id)) {
			setRevealedCards([...revealedCards, card]);
		}

		// If all cards are revealed, show the summary view after a delay
		if (revealedCards.length + 1 === cards.length) {
			setTimeout(() => {
				setShowAll(true);
				setCurrentCard(null);
			}, 1500);
		}
	};

	// Reveal all remaining cards
	const revealAllCards = () => {
		const updatedCards = cards.map((card) => ({ ...card, revealed: true }));
		setCards(updatedCards);
		setRevealedCards(updatedCards);
		setShowAll(true);
		setCurrentCard(null);
	};

	// Reset to initial state to select another pack
	const handleOpenAnother = () => {
		setState('initial');
	};

	// Add cards to collection (in a real app, this would send the card IDs to an API)
	const handleAddToCollection = () => {
		console.log('Adding cards to collection:', cards);
		// In a real implementation, this would call an API
		// For now, we'll just reset to the initial state
		setState('initial');
	};

	// Close the card preview modal
	const handleClosePreview = () => {
		setCurrentCard(null);
	};

	// Get rarity style class name
	const getRarityClass = (rarity: string) => {
		switch (rarity) {
			case 'common':
				return styles.commonCard;
			case 'rare':
				return styles.rareCard;
			case 'epic':
				return styles.epicCard;
			case 'legendary':
				return styles.legendaryCard;
			default:
				return styles.commonCard;
		}
	};

	// Get rarity label class name
	const getRarityLabelClass = (rarity: string) => {
		switch (rarity) {
			case 'common':
				return styles.commonLabel;
			case 'rare':
				return styles.rareLabel;
			case 'epic':
				return styles.epicLabel;
			case 'legendary':
				return styles.legendaryLabel;
			default:
				return styles.commonLabel;
		}
	};

	return (
		<div className={styles.container}>
			{/* Background elements */}
			<div className={styles.backgroundImage}></div>
			<div className={styles.backgroundGradient}></div>

			{/* Main content */}
			<div className={styles.contentWrapper}>
				{state === 'initial' ? (
					// Pack selection view
					<div className={styles.packSelectionContainer}>
						<div className={styles.titleContainer}>
							<h1 className={styles.title}>Card Packs</h1>
							<p className={styles.subtitle}>Choose a pack to open</p>
						</div>

						<div className={styles.packGrid}>
							{packTypes.map((pack) => (
								<div key={pack.name} className={styles.packCard} onClick={() => handleSelectPack(pack.name)}>
									<div className={styles.packCardGlow}></div>
									<div className={styles.packCardContent}>
										<img src={pack.image} alt={`${pack.name} Pack`} className={styles.packImage} />
										<h3 className={styles.packTitle}>{pack.name} Pack</h3>
										<div className={styles.packPrice}>
											<img src="https://placehold.co/24x24" alt="Coins" className={styles.coinIcon} />
											<span className={styles.priceValue}>{pack.price}</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				) : (
					// Card opening view
					<div className={styles.cardOpeningContainer}>
						{!showAll ? (
							// Cards to be revealed
							<div className={styles.cardsGrid}>
								{cards.map((card) => (
									<div key={card.id} className={styles.cardWrapper} onClick={() => revealCard(card)}>
										<div className={`${styles.cardInner} ${card.revealed ? styles.cardFlipped : ''}`}>
											{/* Card back */}
											<div className={`${styles.cardFace} ${styles.cardBack}`}>
												<div className={styles.cardBackInner}>
													<img src="https://placehold.co/60x60" alt="Card Back" className={styles.cardBackImage} />
												</div>
											</div>

											{/* Card front */}
											<div className={`${styles.cardFace} ${styles.cardFront}`}>
												<div
													className={styles.cardBorder}
													style={{
														background: `linear-gradient(to bottom, ${rarityEffects[card.rarity].color}, ${
															rarityEffects[card.rarity].color
														}88)`,
														boxShadow: rarityEffects[card.rarity].glow,
													}}
												></div>
												<div className={styles.cardContent}>
													<img src={card.image} alt={card.name} className={styles.cardImage} />
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							// All cards revealed view
							<div>
								<div className={styles.revealedGrid}>
									{cards.map((card) => (
										<div key={card.id} className={styles.revealedCard}>
											<div className={`${styles.cardBorder} ${getRarityClass(card.rarity)}`}></div>
											<div className={styles.cardContent}>
												<img src={card.image} alt={card.name} className={styles.cardImage} />
												<div className={`${styles.cardLabel} ${getRarityLabelClass(card.rarity)}`}>{card.name}</div>
											</div>
										</div>
									))}
								</div>

								<div className={styles.buttonContainer}>
									<button className={`${styles.button} ${styles.primaryButton}`} onClick={handleOpenAnother}>
										<span className={styles.buttonHighlight}></span>
										<span className={styles.buttonText}>Open Another Pack</span>
									</button>

									<button className={`${styles.button} ${styles.secondaryButton}`} onClick={handleAddToCollection}>
										<span className={styles.buttonHighlight}></span>
										<span className={styles.buttonText}>Add All to Collection</span>
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Card preview modal */}
			{currentCard && !showAll && (
				<div className={styles.modalOverlay} onClick={handleClosePreview}>
					<div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
						<div
							className={styles.cardBorder}
							style={{
								background: `linear-gradient(to bottom, ${rarityEffects[currentCard.rarity].color}, ${
									rarityEffects[currentCard.rarity].color
								}88)`,
								boxShadow: rarityEffects[currentCard.rarity].glow,
							}}
						></div>
						<div className={styles.cardContent}>
							<img src={currentCard.image} alt={currentCard.name} className={styles.cardImage} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CardPacks;
