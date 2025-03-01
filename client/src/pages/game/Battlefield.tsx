import React, { MouseEvent, useEffect, useState } from 'react';
import styles from './Battlefield.module.css';

// Types
interface GameState {
	turn: number;
	phase: 'main' | 'attack' | 'defense' | 'end';
	activePlayer: 'player' | 'opponent';
	timer: number;
	playerLife: number;
	opponentLife: number;
	playerMana: { current: number; total: number };
	opponentMana: { current: number; total: number };
	playerDeck: number;
	opponentDeck: number;
}

interface Card {
	id: number;
	name: string;
	type: string;
	rarity?: string;
	cost?: number;
	power?: number;
	defense?: number;
	effect?: string;
	image: string;
	canPlay?: boolean;
	canAttack?: boolean;
	status?: 'ready' | 'tapped';
}

interface Zones {
	creatures: (Card | null)[];
	artifacts: (Card | null)[];
	enchantments: (Card | null)[];
}

interface Position {
	x: number;
	y: number;
}

interface LogEntry {
	type: 'play' | 'attack' | 'block' | 'damage' | 'effect';
	player: 'player' | 'opponent';
	card: string;
	target?: string;
}

const Battlefield: React.FC = () => {
	// Game state
	const [gameState, setGameState] = useState<GameState>({
		turn: 1,
		phase: 'main',
		activePlayer: 'player',
		timer: 120,
		playerLife: 20,
		opponentLife: 20,
		playerMana: { current: 6, total: 6 },
		opponentMana: { current: 6, total: 6 },
		playerDeck: 24,
		opponentDeck: 21,
	});

	// Cards in hand
	const [playerHand, setPlayerHand] = useState<Card[]>([
		{
			id: 1,
			name: 'Dragon Knight',
			type: 'Creature',
			cost: 4,
			power: 1500,
			defense: 1200,
			rarity: 'rare',
			effect: 'When this card attacks, draw a card',
			image: 'https://placehold.co/240x340',
			canPlay: true,
		},
		{
			id: 2,
			name: 'Magic Bolt',
			type: 'Spell',
			cost: 2,
			rarity: 'common',
			effect: 'Deal 3 damage to any target',
			image: 'https://placehold.co/240x340',
			canPlay: true,
		},
		{
			id: 3,
			name: 'Ancient Shield',
			type: 'Artifact',
			cost: 3,
			rarity: 'uncommon',
			effect: 'Your creatures get +0/+2',
			image: 'https://placehold.co/240x340',
			canPlay: true,
		},
	]);

	const [opponentHand, setOpponentHand] = useState<number>(4);

	// Cards on field
	const [playerField, setPlayerField] = useState<Zones>({
		creatures: [
			{
				id: 4,
				name: 'Stone Warrior',
				type: 'Creature',
				power: 1000,
				defense: 2000,
				status: 'ready',
				image: 'https://placehold.co/240x340',
				canAttack: true,
			},
			null,
			null,
			null,
			null,
		],
		artifacts: [null, null, null],
		enchantments: [null, null, null],
	});

	const [opponentField, setOpponentField] = useState<Zones>({
		creatures: [
			{
				id: 5,
				name: 'Dark Mage',
				type: 'Creature',
				power: 800,
				defense: 1200,
				status: 'tapped',
				image: 'https://placehold.co/240x340',
			},
			{
				id: 6,
				name: 'Shadow Beast',
				type: 'Creature',
				power: 1300,
				defense: 1000,
				status: 'ready',
				image: 'https://placehold.co/240x340',
			},
			null,
			null,
			null,
		],
		artifacts: [
			{
				id: 7,
				name: 'Dark Orb',
				type: 'Artifact',
				image: 'https://placehold.co/240x340',
			},
			null,
			null,
		],
		enchantments: [null, null, null],
	});

	// Card interaction state
	const [selectedCard, setSelectedCard] = useState<Card | null>(null);
	const [targetableCards, setTargetableCards] = useState<number[]>([]);
	const [hoveredCard, setHoveredCard] = useState<Card | null>(null);
	const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });
	const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });
	const [arrowType, setArrowType] = useState<'attack' | 'spell' | 'support' | null>(null);
	const [showCardPreview, setShowCardPreview] = useState<boolean>(false);
	const [previewCard, setPreviewCard] = useState<Card | null>(null);

	// Action log
	const [actionLog, setActionLog] = useState<LogEntry[]>([
		{ type: 'play', player: 'opponent', card: 'Dark Mage' },
		{ type: 'attack', player: 'player', card: 'Stone Warrior', target: 'Dark Mage' },
	]);

	// Mouse position tracking
	const handleMouseMove = (event: MouseEvent) => {
		setMousePos({ x: event.clientX, y: event.clientY });
	};

	// Dragging functionality
	const startDrag = (event: MouseEvent, card: Card, type: 'attack' | 'spell' | 'support') => {
		const rect = (event.target as Element).getBoundingClientRect();
		setStartPos({
			x: rect.left + rect.width / 2,
			y: rect.top + rect.height / 2,
		});
		setSelectedCard(card);
		setArrowType(type);
	};

	const endDrag = () => {
		setSelectedCard(null);
		// Here you would implement the logic for handling the action
		// depending on what card was selected and what target was selected
	};

	// Generate SVG path for arrow
	const getPath = (): string => {
		if (!startPos.x || !mousePos.x) return '';

		const dx = mousePos.x - startPos.x;
		const dy = mousePos.y - startPos.y;
		const controlPoint1 = { x: startPos.x + dx / 2, y: startPos.y };
		const controlPoint2 = { x: startPos.x + dx / 2, y: mousePos.y };

		return `M ${startPos.x} ${startPos.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${mousePos.x} ${mousePos.y}`;
	};

	// Card preview
	const handleCardHover = (card: Card) => {
		setHoveredCard(card);
		setShowCardPreview(true);
		setPreviewCard(card);
	};

	const handleCardLeave = () => {
		setHoveredCard(null);
		setShowCardPreview(false);
		setPreviewCard(null);
	};

	// Phase management
	const nextPhase = () => {
		const phases: ('main' | 'attack' | 'defense' | 'end')[] = ['main', 'attack', 'defense', 'end'];
		const currentIndex = phases.indexOf(gameState.phase);
		const nextIndex = (currentIndex + 1) % phases.length;

		setGameState((prev) => ({
			...prev,
			phase: phases[nextIndex],
			// If we've gone through all phases, increment turn and switch player
			...(nextIndex === 0
				? {
						turn: prev.turn + 1,
						activePlayer: prev.activePlayer === 'player' ? 'opponent' : 'player',
				  }
				: {}),
		}));
	};

	// Game timer
	useEffect(() => {
		const timer = setInterval(() => {
			if (gameState.timer > 0) {
				setGameState((prev) => ({ ...prev, timer: prev.timer - 1 }));
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [gameState.timer]);

	// Play a card from hand
	const playCard = (card: Card, index: number) => {
		// Check if we have enough mana
		if (card.cost && card.cost > gameState.playerMana.current) return;

		// Remove from hand
		const newHand = [...playerHand];
		newHand.splice(index, 1);
		setPlayerHand(newHand);

		// Place on battlefield based on card type
		if (card.type === 'Creature') {
			const newField = { ...playerField };
			const firstEmptySlot = newField.creatures.findIndex((slot) => slot === null);

			if (firstEmptySlot !== -1) {
				newField.creatures[firstEmptySlot] = { ...card, status: 'tapped', canAttack: false };
				setPlayerField(newField);
			}
		} else if (card.type === 'Artifact') {
			const newField = { ...playerField };
			const firstEmptySlot = newField.artifacts.findIndex((slot) => slot === null);

			if (firstEmptySlot !== -1) {
				newField.artifacts[firstEmptySlot] = card;
				setPlayerField(newField);
			}
		} else if (card.type === 'Spell') {
			// For spells, we'd typically show targeting UI
			console.log('Casting spell:', card.name);
		}

		// Deduct mana
		if (card.cost) {
			setGameState((prev) => ({
				...prev,
				playerMana: {
					...prev.playerMana,
					current: prev.playerMana.current - card.cost,
				},
			}));
		}

		// Add to action log
		setActionLog((prev) => [{ type: 'play', player: 'player', card: card.name }, ...prev]);
	};

	// Attack with a creature
	const attackWithCreature = (index: number) => {
		const creature = playerField.creatures[index];
		if (!creature || creature.status === 'tapped' || !creature.canAttack) return;

		// Mark as tapped
		const newField = { ...playerField };
		newField.creatures[index] = { ...creature, status: 'tapped', canAttack: false };
		setPlayerField(newField);

		// Log the attack
		setActionLog((prev) => [{ type: 'attack', player: 'player', card: creature.name }, ...prev]);
	};

	return (
		<div className={styles.container} onMouseMove={handleMouseMove} onMouseUp={endDrag}>
			{/* Background */}
			<div className={styles.backgroundImage} style={{ backgroundImage: 'url(https://placehold.co/1920x1080)' }}></div>
			<div className={styles.backgroundGradient}></div>

			{/* Game content */}
			<div className={styles.gameWrapper}>
				{/* Header with player info and game status */}
				<header className={styles.header}>
					<div className={styles.playerInfo}>
						<div className={styles.avatarContainer}>
							<div className={styles.avatar}>
								<img src="https://placehold.co/32x32" alt="Opponent Avatar" className={styles.avatarImage} />
							</div>
							<div>
								<div className={styles.playerName}>Opponent</div>
								<div className={styles.playerHealth}>
									<span className={styles.healthValue}>{gameState.opponentLife}</span>
									<span className={styles.healthLabel}>HP</span>
								</div>
							</div>
						</div>

						<div className={styles.manaContainer}>
							{Array.from({ length: gameState.opponentMana.total }).map((_, i) => (
								<div
									key={i}
									className={`${styles.manaOrb} ${i < gameState.opponentMana.current ? styles.manaFilled : styles.manaEmpty}`}
								></div>
							))}
						</div>
					</div>

					<div className={styles.gameControls}>
						<div className={styles.gameStatus}>
							<div className={styles.statusItem}>
								<div className={styles.statusLabel}>Turn</div>
								<div className={styles.turnNumber}>{gameState.turn}</div>
							</div>
							<div className={styles.statusItem}>
								<div className={styles.statusLabel}>Phase</div>
								<div className={styles.phaseText}>{gameState.phase}</div>
							</div>
							<div className={styles.statusItem}>
								<div className={styles.statusLabel}>Timer</div>
								<div className={styles.timerText}>{gameState.timer}</div>
							</div>
						</div>

						<button className={styles.surrenderButton}>
							<div className={styles.buttonHighlight}></div>
							<span className={styles.buttonText}>Surrender</span>
						</button>
					</div>
				</header>

				{/* Main gameplay area */}
				<main className={styles.main}>
					{/* Arrow canvas for targeting */}
					<div className={styles.arrowCanvas}>
						<svg width="100%" height="100%">
							<defs>
								<filter id="glow">
									<feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
									<feComposite in="blur" in2="SourceGraphic" operator="over" />
								</filter>
								<linearGradient id="arrowGradient-attack" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" stopColor="#DD4D44" stopOpacity="0.5" />
									<stop offset="50%" stopColor="#DD4D44" stopOpacity="1" />
									<stop offset="100%" stopColor="#DD4D44" stopOpacity="0.5" />
								</linearGradient>
								<linearGradient id="arrowGradient-spell" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" stopColor="#69B7F9" stopOpacity="0.5" />
									<stop offset="50%" stopColor="#69B7F9" stopOpacity="1" />
									<stop offset="100%" stopColor="#69B7F9" stopOpacity="0.5" />
								</linearGradient>
								<linearGradient id="arrowGradient-support" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" stopColor="#79DC69" stopOpacity="0.5" />
									<stop offset="50%" stopColor="#79DC69" stopOpacity="1" />
									<stop offset="100%" stopColor="#79DC69" stopOpacity="0.5" />
								</linearGradient>
							</defs>

							<g className="arrow-group">
								{selectedCard && (
									<>
										<path
											d={getPath()}
											className={`${styles.arrowPath} ${
												arrowType === 'attack'
													? styles.arrowPathAttack
													: arrowType === 'spell'
													? styles.arrowPathSpell
													: styles.arrowPathSupport
											} ${styles.animatedStroke}`}
										/>
										<path
											d={getPath()}
											fill="none"
											strokeWidth="2"
											strokeLinecap="round"
											className={
												arrowType === 'attack'
													? styles.arrowOutlineAttack
													: arrowType === 'spell'
													? styles.arrowOutlineSpell
													: styles.arrowOutlineSupport
											}
										/>
									</>
								)}
							</g>
						</svg>
					</div>

					<div className={styles.gameArea}>
						{/* Opponent's area */}
						<div className={styles.opponentArea}>
							{/* Opponent's hand */}
							<div className={styles.handContainer}>
								<div className={styles.opponentHandCount}>{opponentHand} cards</div>
								<div className={styles.handCards}>
									{Array.from({ length: opponentHand }).map((_, i) => (
										<div key={i} className={styles.opponentCard}></div>
									))}
								</div>
							</div>

							{/* Opponent's field */}
							<div className={styles.fieldZones}>
								<div>
									<div className={styles.zoneLabel}>Creatures</div>
									<div className={styles.creaturesZone}>
										{opponentField.creatures.map((card, index) => (
											<div key={index} className={styles.cardSlot}>
												{card ? (
													<div className={`${styles.cardContainer} ${card.status === 'tapped' ? styles.tappedCard : ''}`}>
														<div className={`${styles.cardFrame} ${targetableCards.includes(index) ? styles.targetableCard : ''}`}>
															<img src={card.image} alt={card.name} className={styles.cardImage} />

															{card.power !== undefined && card.defense !== undefined && (
																<div className={styles.cardStats}>
																	<div className={styles.powerStat}>{card.power}</div>
																	<div className={styles.defenseStat}>{card.defense}</div>
																</div>
															)}
														</div>
													</div>
												) : (
													<div className={styles.emptySlot}></div>
												)}
											</div>
										))}
									</div>
								</div>

								<div>
									<div className={styles.zoneLabel}>Artifacts & Enchantments</div>
									<div className={styles.supportZone}>
										{[...opponentField.artifacts, ...opponentField.enchantments].map((card, index) => (
											<div key={index} className={styles.supportSlot}>
												{card ? (
													<div className={styles.cardContainer}>
														<div className={styles.cardFrame}>
															<img src={card.image} alt={card.name} className={styles.cardImage} />
														</div>
													</div>
												) : (
													<div className={styles.emptySlot}></div>
												)}
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* Battlefield divider with deck and graveyard */}
						<div className={styles.battlefieldDivider}>
							<div className={styles.deckArea}>
								<div className={styles.deckCounter}>
									<div className={styles.deckLabel}>Deck</div>
									<div className={styles.deckCount}>{gameState.opponentDeck}</div>
								</div>

								<div className={styles.graveyardZone}>GY</div>
							</div>
						</div>

						{/* Player's area */}
						<div className={styles.playerArea}>
							{/* Player's field */}
							<div className={styles.fieldZones}>
								<div>
									<div className={styles.zoneLabel}>Creatures</div>
									<div className={styles.creaturesZone}>
										{playerField.creatures.map((card, index) => (
											<div key={index} className={styles.cardSlot}>
												{card ? (
													<div
														className={`${styles.cardContainer} ${card.status === 'tapped' ? styles.tappedCard : ''}`}
														onMouseDown={(e) => startDrag(e, card, 'attack')}
														onMouseEnter={() => handleCardHover(card)}
														onMouseLeave={handleCardLeave}
													>
														<div className={`${styles.cardFrame} ${card.canAttack ? styles.attackableCard : ''}`}>
															<img src={card.image} alt={card.name} className={styles.cardImage} />

															{card.power !== undefined && card.defense !== undefined && (
																<div className={styles.cardStats}>
																	<div className={styles.powerStat}>{card.power}</div>
																	<div className={styles.defenseStat}>{card.defense}</div>
																</div>
															)}
														</div>
													</div>
												) : (
													<div className={styles.emptySlot}></div>
												)}
											</div>
										))}
									</div>
								</div>

								<div>
									<div className={styles.zoneLabel}>Artifacts & Enchantments</div>
									<div className={styles.supportZone}>
										{[...playerField.artifacts, ...playerField.enchantments].map((card, index) => (
											<div key={index} className={styles.supportSlot}>
												{card ? (
													<div className={styles.cardContainer} onMouseEnter={() => handleCardHover(card)} onMouseLeave={handleCardLeave}>
														<div className={styles.cardFrame}>
															<img src={card.image} alt={card.name} className={styles.cardImage} />
														</div>
													</div>
												) : (
													<div className={styles.emptySlot}></div>
												)}
											</div>
										))}
									</div>
								</div>
							</div>
						</div>

						{/* Player's hand */}
						<div className={styles.playerHand}>
							{playerHand.map((card, index) => (
								<div
									key={card.id}
									className={`${styles.handCard} ${card.canPlay ? styles.canPlayCard : styles.cannotPlayCard}`}
									onClick={() => playCard(card, index)}
									onMouseEnter={() => handleCardHover(card)}
									onMouseLeave={handleCardLeave}
									onMouseDown={(e) => card.type === 'Spell' && startDrag(e, card, 'spell')}
								>
									<div className={styles.cardFrame}>
										<img src={card.image} alt={card.name} className={styles.cardImage} />

										{card.cost !== undefined && (
											<div className={styles.cardStats}>
												<div className={styles.powerStat}>{card.cost}</div>
											</div>
										)}

										{card.power !== undefined && card.defense !== undefined && (
											<div className={styles.cardStats}>
												<div className={styles.powerStat}>{card.power}</div>
												<div className={styles.defenseStat}>{card.defense}</div>
											</div>
										)}
									</div>
								</div>
							))}
						</div>

						{/* Deck area (player) */}
						<div className={styles.deckArea} style={{ bottom: '16px', top: 'auto' }}>
							<div className={styles.deckCounter}>
								<div className={styles.deckLabel}>Deck</div>
								<div className={styles.deckCount}>{gameState.playerDeck}</div>
							</div>

							<div className={styles.graveyardZone}>GY</div>
						</div>

						{/* Card preview */}
						{showCardPreview && hoveredCard && (
							<div
								className={styles.cardPreview}
								style={{
									left: `${mousePos.x + 20}px`,
									top: `${mousePos.y - 100}px`,
								}}
							>
								<div className={styles.previewContent}>
									<img src={hoveredCard.image} alt={hoveredCard.name} className={styles.previewImage} />
									<h3 className={styles.previewTitle}>{hoveredCard.name}</h3>
									<div className={styles.previewType}>{hoveredCard.type}</div>

									{hoveredCard.effect && <p className={styles.previewEffect}>{hoveredCard.effect}</p>}

									{hoveredCard.type === 'Creature' && hoveredCard.power !== undefined && hoveredCard.defense !== undefined && (
										<div className={styles.previewStats}>
											<span>
												Power: <span style={{ color: '#DD4D44' }}>{hoveredCard.power}</span>
											</span>
											<span>
												Defense: <span style={{ color: '#69B7F9' }}>{hoveredCard.defense}</span>
											</span>
										</div>
									)}
								</div>
							</div>
						)}

						{/* Action log */}
						<div className={styles.actionLog}>
							{actionLog.map((entry, index) => (
								<div
									key={index}
									className={`${styles.logEntry} ${entry.player === 'player' ? styles.logEntryPlayer : styles.logEntryOpponent}`}
								>
									{entry.player === 'player' ? 'You' : 'Opponent'} {entry.type === 'play' ? 'played' : 'attacked with'} {entry.card}
									{entry.target && ` targeting ${entry.target}`}
								</div>
							))}
						</div>

						{/* Phase buttons */}
						<div className={styles.phaseButtons}>
							<button
								className={`${styles.phaseButton} ${gameState.phase === 'main' ? styles.activePhase : ''}`}
								onClick={() => setGameState((prev) => ({ ...prev, phase: 'main' }))}
							>
								Main
							</button>
							<button
								className={`${styles.phaseButton} ${gameState.phase === 'attack' ? styles.activePhase : ''}`}
								onClick={() => setGameState((prev) => ({ ...prev, phase: 'attack' }))}
							>
								Attack
							</button>
							<button
								className={`${styles.phaseButton} ${gameState.phase === 'defense' ? styles.activePhase : ''}`}
								onClick={() => setGameState((prev) => ({ ...prev, phase: 'defense' }))}
							>
								Defense
							</button>
							<button className={styles.phaseButton} onClick={nextPhase}>
								End Turn
							</button>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Battlefield;
