import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './DeckBuilder.module.css';

interface Card {
	id: number;
	name: string;
	type: string;
	rarity: string;
	cost: number;
	power?: number;
	defense?: number;
	effect: string;
	image: string;
	owned: number;
}

interface DeckCard extends Card {
	quantity: number;
}

interface CardPreviewPosition {
	x: number;
	y: number;
}

const DeckBuilder: React.FC = () => {
	// Navigation
	const navigate = useNavigate();

	// State management
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);
	const [deckCards, setDeckCards] = useState<DeckCard[]>([]);
	const [deckName, setDeckName] = useState<string>('New Deck');
	const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
	const [showCardPreview, setShowCardPreview] = useState<boolean>(false);
	const [previewPosition, setPreviewPosition] = useState<CardPreviewPosition>({ x: 0, y: 0 });
	const [showFilters, setShowFilters] = useState<boolean>(false);
	const [view, setView] = useState<'collection' | 'shop'>('collection');
	const [filters, setFilters] = useState({
		search: '',
		type: 'all',
		rarity: 'all',
	});

	// Mock data for card collection
	const [cardCollection, setCardCollection] = useState<Card[]>([
		{
			id: 1,
			name: 'Ancient Dragon',
			type: 'Creature',
			rarity: 'legendary',
			cost: 8,
			power: 3000,
			defense: 2500,
			effect: 'Cannot be targeted by spells',
			image: 'https://placehold.co/300x400',
			owned: 1,
		},
		{
			id: 2,
			name: 'Magic Shield',
			type: 'Spell',
			rarity: 'rare',
			cost: 2,
			effect: 'Protect your creature',
			image: 'https://placehold.co/300x400',
			owned: 4,
		},
		{
			id: 3,
			name: 'Elemental Guardian',
			type: 'Creature',
			rarity: 'epic',
			cost: 5,
			power: 2000,
			defense: 2000,
			effect: 'When summoned, deal 500 damage to all enemy creatures',
			image: 'https://placehold.co/300x400',
			owned: 2,
		},
		{
			id: 4,
			name: 'Mystic Orb',
			type: 'Spell',
			rarity: 'rare',
			cost: 3,
			effect: 'Draw 2 cards',
			image: 'https://placehold.co/300x400',
			owned: 3,
		},
		{
			id: 5,
			name: 'Shadow Assassin',
			type: 'Creature',
			rarity: 'epic',
			cost: 4,
			power: 2500,
			defense: 1500,
			effect: 'Can attack immediately after being summoned',
			image: 'https://placehold.co/300x400',
			owned: 2,
		},
		{
			id: 6,
			name: 'Time Warp',
			type: 'Spell',
			rarity: 'legendary',
			cost: 7,
			effect: 'Take an extra turn after this one',
			image: 'https://placehold.co/300x400',
			owned: 1,
		},
	]);

	// Handler functions
	const handleCardHover = (card: Card, event: React.MouseEvent) => {
		setHoveredCard(card);
		setShowCardPreview(true);
		updatePreviewPosition(event);
	};

	const handleCardLeave = () => {
		setHoveredCard(null);
		setShowCardPreview(false);
	};

	const updatePreviewPosition = (event: React.MouseEvent) => {
		setPreviewPosition({
			x: event.clientX + 20,
			y: event.clientY - 100,
		});
	};

	const handleCardClick = (card: Card) => {
		// Logic to add card to deck
		if (deckCards.length >= 40) return;

		const existingCard = deckCards.find((c) => c.id === card.id);
		if (existingCard) {
			// Check if we have enough copies of this card
			const totalInDeck = existingCard.quantity + 1;
			if (totalInDeck > card.owned) return;

			setDeckCards(deckCards.map((c) => (c.id === card.id ? { ...c, quantity: c.quantity + 1 } : c)));
		} else {
			setDeckCards([...deckCards, { ...card, quantity: 1 }]);
		}
	};

	const handleRemoveCard = (card: DeckCard) => {
		if (card.quantity > 1) {
			setDeckCards(deckCards.map((c) => (c.id === card.id ? { ...c, quantity: c.quantity - 1 } : c)));
		} else {
			setDeckCards(deckCards.filter((c) => c.id !== card.id));
		}
	};

	const handleSaveDeck = () => {
		// Logic to save deck
		console.log('Saving deck:', { name: deckName, cards: deckCards });
		// Navigate back to decks list or home
		navigate('/');
	};

	const handleTypeFilterChange = (type: string) => {
		setFilters({ ...filters, type });
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilters({ ...filters, search: e.target.value });
	};

	const handleViewChange = (newView: 'collection' | 'shop') => {
		setView(newView);
	};

	// Filter cards based on search and filters
	const filteredCards = cardCollection.filter((card) => {
		const matchesSearch =
			filters.search === '' ||
			card.name.toLowerCase().includes(filters.search.toLowerCase()) ||
			card.effect.toLowerCase().includes(filters.search.toLowerCase());

		const matchesType = filters.type === 'all' || card.type.toLowerCase() === filters.type;

		const matchesRarity = filters.rarity === 'all' || card.rarity === filters.rarity;

		return matchesSearch && matchesType && matchesRarity;
	});

	// Calculate deck stats
	const totalCards = deckCards.reduce((sum, card) => sum + card.quantity, 0);
	const averageCost = deckCards.length === 0 ? 0 : deckCards.reduce((sum, card) => sum + card.cost * card.quantity, 0) / totalCards;

	const creatureCount = deckCards.filter((card) => card.type === 'Creature').reduce((sum, card) => sum + card.quantity, 0);

	const spellCount = deckCards.filter((card) => card.type === 'Spell').reduce((sum, card) => sum + card.quantity, 0);

	return (
		<div className={styles.container}>
			<div className={styles.pageWrapper}>
				{/* Header with background */}
				<div className={styles.header} style={{ backgroundImage: 'url(https://placehold.co/1920x1080)' }}>
					<div className={styles.headerGradient} />

					<nav className={styles.nav}>
						<div className={styles.navLeft}>
							<Link to="/">
								<button className={styles.backButton}>←</button>
							</Link>
							<div className={styles.deckNameWrapper}>
								<input
									type="text"
									value={deckName}
									onChange={(e) => setDeckName(e.target.value)}
									className={styles.deckNameInput}
									placeholder="Enter Deck Name"
								/>
								<div className={styles.deckInfoTooltip}>40 cards max</div>
							</div>
						</div>

						<div className={styles.navRight}>
							<div className={styles.currencyContainer}>
								<img src="https://placehold.co/24x24" alt="Coins" className={styles.currencyIcon} />
								<span className={styles.currencyAmount}>12,500</span>
							</div>

							<button className={styles.saveButton} onClick={handleSaveDeck}>
								<div className={styles.buttonHighlight} />
								<span className={styles.buttonText}>Save Deck</span>
							</button>
						</div>
					</nav>
				</div>

				{/* Main content */}
				<main className={styles.main}>
					<div className={styles.toolbarRow}>
						<div className={styles.toolsContainer}>
							<div className={styles.searchContainer}>
								<input
									type="text"
									className={styles.searchInput}
									placeholder="Search cards..."
									value={filters.search}
									onChange={handleSearchChange}
								/>
								<div className={styles.searchIcon}>⌕</div>
							</div>

							<div className={styles.toolsContainer}>
								<button className={styles.filtersButton} onClick={() => setShowFilters(!showFilters)}>
									Filters <span className={styles.filtersIcon}>{showFilters ? '▼' : '▶'}</span>
								</button>

								<div className={styles.typeFilters}>
									{['All', 'Creatures', 'Spells', 'Traps'].map((type) => (
										<button
											key={type}
											className={filters.type === type.toLowerCase() ? styles.typeFilterButtonActive : styles.typeFilterButton}
											onClick={() => handleTypeFilterChange(type.toLowerCase())}
										>
											{type}
										</button>
									))}
								</div>
							</div>
						</div>

						<div className={styles.viewToggle}>
							<button
								className={view === 'collection' ? styles.viewButtonCollection : styles.viewButton}
								onClick={() => handleViewChange('collection')}
							>
								Collection
							</button>
							<button className={view === 'shop' ? styles.viewButtonShop : styles.viewButton} onClick={() => handleViewChange('shop')}>
								Card Packs
							</button>
						</div>
					</div>

					<div className={styles.contentContainer}>
						{/* Card Collection */}
						<div className={styles.collectionContainer}>
							<div className={styles.cardsGrid}>
								{filteredCards.map((card) => (
									<div
										key={card.id}
										className={styles.cardItem}
										onMouseEnter={(e) => handleCardHover(card, e)}
										onMouseLeave={handleCardLeave}
										onMouseMove={updatePreviewPosition}
										onClick={() => handleCardClick(card)}
									>
										<div className={styles.cardWrapper}>
											<div
												className={`${styles.cardBorder} ${
													card.rarity === 'rare'
														? styles.rarityBorderRare
														: card.rarity === 'epic'
														? styles.rarityBorderEpic
														: card.rarity === 'legendary'
														? styles.rarityBorderLegendary
														: ''
												}`}
											/>
											<div className={styles.cardInner}>
												<div className={styles.cardOverlay} />
												<img src={card.image} className={styles.cardImage} alt={card.name} />
												<div className={styles.cardCost}>{card.cost}</div>
												<div className={styles.cardCount}>x{card.owned}</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Deck Builder */}
						<div className={styles.deckContainer}>
							<div className={styles.deckContent}>
								<div className={styles.deckHeader}>
									<h2 className={styles.deckTitle}>Your Deck</h2>
									<div className={styles.deckCount}>{totalCards}/40 Cards</div>
								</div>

								<div className={styles.deckGrid}>
									{deckCards.map((card) => (
										<div
											key={card.id}
											className={styles.cardItem}
											onClick={() => handleRemoveCard(card)}
											onMouseEnter={(e) => handleCardHover(card, e)}
											onMouseLeave={handleCardLeave}
											onMouseMove={updatePreviewPosition}
										>
											<div className={styles.cardWrapper}>
												<div
													className={`${styles.cardBorder} ${
														card.rarity === 'rare'
															? styles.rarityBorderRare
															: card.rarity === 'epic'
															? styles.rarityBorderEpic
															: card.rarity === 'legendary'
															? styles.rarityBorderLegendary
															: ''
													}`}
												/>
												<div className={styles.cardInner}>
													<div className={styles.cardOverlay} />
													<img src={card.image} className={styles.cardImage} alt={card.name} />
													<div className={styles.cardCost}>{card.cost}</div>
													<div className={styles.cardCount}>x{card.quantity}</div>
												</div>
											</div>
										</div>
									))}

									{/* Empty slots */}
									{Array.from({ length: Math.max(0, 40 - totalCards) }).map((_, index) => (
										<div key={`empty-${index}`} className={styles.deckSlot}>
											+
										</div>
									))}
								</div>

								<div className={styles.deckStats}>
									<div className={styles.statsRow}>
										<span>Average Cost: {averageCost.toFixed(1)}</span>
										<span>Creatures: {creatureCount}</span>
										<span>Spells: {spellCount}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>

			{/* Card Preview */}
			{showCardPreview && hoveredCard && (
				<div className={styles.cardPreview} style={{ left: `${previewPosition.x}px`, top: `${previewPosition.y}px` }}>
					<div className={styles.previewContent}>
						<img src={hoveredCard.image} className={styles.previewImage} alt={hoveredCard.name} />
						<h3 className={styles.previewTitle}>{hoveredCard.name}</h3>
						<div className={styles.previewType}>{hoveredCard.type}</div>
						<p className={styles.previewEffect}>{hoveredCard.effect}</p>

						{hoveredCard.type === 'Creature' && (
							<div className={styles.previewStats}>
								<span>
									Power: <span className={styles.previewStatPower}>{hoveredCard.power}</span>
								</span>
								<span>
									Defense: <span className={styles.previewStatDefense}>{hoveredCard.defense}</span>
								</span>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default DeckBuilder;
