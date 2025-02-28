import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@mantine/core';
import GameBoard from '../../components/game/GameBoard';
import { Card, GameAction, GameState, createMockGameState } from '../../types/game';
import styles from './GamePlay.module.css';

function GamePlayPage() {
	const { gameId } = useParams<{ gameId?: string }>();
	const [gameState, setGameState] = useState<GameState>(() => {
		// Initialize with mock data
		return createMockGameState();
	});

	// For a real implementation, we'd fetch the game state from the API
	useEffect(() => {
		// This would be replaced with actual API calls in a real implementation
		// If gameId is provided, we'd fetch that specific game
		console.log(`Game ID from route: ${gameId || 'Not provided, using mock data'}`);
	}, [gameId]);

	// Game action handlers
	const handleCardSelect = (card: Card) => {
		// Toggle selection on the card
		setGameState((prevState) => ({
			...prevState,
			selectedCard: prevState.selectedCard?.id === card.id ? undefined : card,
			targetingMode: prevState.selectedCard?.id !== card.id && card.type === 'creature',
		}));
	};

	const handleCardPlay = (card: Card) => {
		if (!gameState.isPlayerTurn) return;
		if (card.cost > gameState.player.mana) return;

		// Create a new action
		const action: GameAction = {
			id: crypto.randomUUID(),
			type: 'play_card',
			player: gameState.player.id,
			timestamp: Date.now(),
			data: { cardId: card.id },
			description: `You played ${card.name}.`,
		};

		// Update game state
		setGameState((prevState) => {
			const playerHand = prevState.player.hand.filter((c) => c.id !== card.id);
			const playerBoard = [...prevState.player.board];

			// For creatures and artifacts, move to board
			if (card.type === 'creature' || card.type === 'artifact') {
				playerBoard.push({
					...card,
					zone: 'board',
					onBoard: true,
					inHand: false,
				});
			}

			// Update player mana
			const updatedPlayer = {
				...prevState.player,
				hand: playerHand,
				board: playerBoard,
				mana: prevState.player.mana - card.cost,
			};

			return {
				...prevState,
				player: updatedPlayer,
				history: [...prevState.history, action],
				selectedCard: undefined,
				targetingMode: false,
			};
		});
	};

	const handleAttack = (attackerId: string, defenderId: string) => {
		// Find the attacker
		const attacker = gameState.player.board.find((card) => card.id === attackerId);
		if (!attacker || attacker.type !== 'creature') return;

		// Check if defender is a player or creature
		const isDefenderPlayer = defenderId === gameState.opponent.id;
		let defenderName = 'Opponent';
		let defenderPower = 0;
		let defenderBlock = 0;

		if (!isDefenderPlayer) {
			// Find the defending creature
			const defender = gameState.opponent.board.find((card) => card.id === defenderId);
			if (!defender || defender.type !== 'creature') return;

			defenderName = defender.name;
			defenderPower = defender.attack || 0;
			defenderBlock = defender.defense || 0;
		}

		// Create attack action
		const action: GameAction = {
			id: crypto.randomUUID(),
			type: 'attack',
			player: gameState.player.id,
			timestamp: Date.now(),
			data: { attackerId, defenderId },
			description: `Your ${attacker.name} attacked ${defenderName}.`,
		};

		// Update game state based on attack
		setGameState((prevState) => {
			let updatedOpponent = { ...prevState.opponent };
			const attackerPower = attacker.attack || 0;

			if (isDefenderPlayer) {
				// Direct attack to opponent
				updatedOpponent.health = Math.max(0, updatedOpponent.health - attackerPower);
			} else {
				// Creature combat
				const updatedOpponentBoard = [...prevState.opponent.board];
				const defenderIndex = updatedOpponentBoard.findIndex((c) => c.id === defenderId);

				if (defenderIndex >= 0) {
					const defender = updatedOpponentBoard[defenderIndex];
					// Apply damage to defender
					updatedOpponentBoard[defenderIndex] = {
						...defender,
						defense: (defender.defense || 0) - attackerPower,
					};

					// Remove defender if destroyed
					if ((defender.defense || 0) - attackerPower <= 0) {
						updatedOpponentBoard.splice(defenderIndex, 1);
						updatedOpponent.graveyard = [...updatedOpponent.graveyard, {
							...defender,
							zone: 'graveyard',
							onBoard: false,
						}];
					}
				}

				updatedOpponent.board = updatedOpponentBoard;
			}

			// Check if the game is over
			const isGameOver = updatedOpponent.health <= 0;

			return {
				...prevState,
				opponent: updatedOpponent,
				history: [...prevState.history, action],
				selectedCard: undefined,
				targetingMode: false,
				winner: isGameOver ? prevState.player.id : undefined,
			};
		});
	};

	const handleEndTurn = () => {
		if (!gameState.isPlayerTurn) return;

		// Create end turn action
		const action: GameAction = {
			id: crypto.randomUUID(),
			type: 'end_turn',
			player: gameState.player.id,
			timestamp: Date.now(),
			data: {},
			description: 'You ended your turn.',
		};

		// Draw card for opponent
		const opponentDrawAction: GameAction = {
			id: crypto.randomUUID(),
			type: 'draw_card',
			player: gameState.opponent.id,
			timestamp: Date.now() + 100,
			data: { count: 1 },
			description: 'Opponent drew a card.',
		};

		// Update game state for opponent's turn
		setGameState((prevState) => {
			// Move a card from opponent's deck to hand
			const opponentDeck = [...prevState.opponent.deck];
			const drawnCard = opponentDeck.pop();
			const opponentHand = drawnCard
				? [...prevState.opponent.hand, { ...drawnCard, zone: 'hand', inHand: true }]
				: prevState.opponent.hand;

			// Increase opponent's mana for the new turn
			const newMana = Math.min(prevState.opponent.maxMana + 1, 10);

			const updatedOpponent = {
				...prevState.opponent,
				isActive: true,
				deck: opponentDeck,
				hand: opponentHand,
				mana: newMana,
				maxMana: newMana,
			};

			const updatedPlayer = {
				...prevState.player,
				isActive: false,
			};

			return {
				...prevState,
				player: updatedPlayer,
				opponent: updatedOpponent,
				turn: prevState.turn + 1,
				isPlayerTurn: false,
				history: [...prevState.history, action, opponentDrawAction],
			};
		});

		// Simulate opponent's turn after a delay
		setTimeout(() => {
			simulateOpponentTurn();
		}, 2000);
	};

	// Simple AI for opponent's turn
	const simulateOpponentTurn = () => {
		// Simplified AI logic - just play cards and attack if possible
		setGameState((prevState) => {
			let updatedOpponent = { ...prevState.opponent };
			let updatedPlayer = { ...prevState.player };
			const history = [...prevState.history];

			// Find a playable card from opponent's hand
			const playableCards = updatedOpponent.hand
				.filter(card => card.cost <= updatedOpponent.mana)
				.sort((a, b) => b.cost - a.cost); // Play highest cost cards first

			// Play a card if possible
			if (playableCards.length > 0) {
				const cardToPlay = playableCards[0];
				const action: GameAction = {
					id: crypto.randomUUID(),
					type: 'play_card',
					player: updatedOpponent.id,
					timestamp: Date.now(),
					data: { cardId: cardToPlay.id },
					description: `Opponent played ${cardToPlay.name}.`,
				};

				// Update opponent state
				updatedOpponent.hand = updatedOpponent.hand.filter(c => c.id !== cardToPlay.id);
				updatedOpponent.mana -= cardToPlay.cost;

				if (cardToPlay.type === 'creature' || cardToPlay.type === 'artifact') {
					updatedOpponent.board.push({
						...cardToPlay,
						zone: 'board',
						onBoard: true,
						inHand: false,
					});
				}

				history.push(action);
			}

			// Attack with creatures if possible
			const attackingCreatures = updatedOpponent.board.filter(card => card.type === 'creature');

			for (const attacker of attackingCreatures) {
				// Simple AI - prefer attacking creatures first
				const playerCreatures = updatedPlayer.board.filter(card => card.type === 'creature');

				if (playerCreatures.length > 0) {
					// Attack a random player creature
					const targetIndex = Math.floor(Math.random() * playerCreatures.length);
					const target = playerCreatures[targetIndex];

					const action: GameAction = {
						id: crypto.randomUUID(),
						type: 'attack',
						player: updatedOpponent.id,
						timestamp: Date.now(),
						data: { attackerId: attacker.id, defenderId: target.id },
						description: `Opponent's ${attacker.name} attacked your ${target.name}.`,
					};

					// Apply damage to player's creature
					const attackerPower = attacker.attack || 0;
					const updatedTargetDefense = (target.defense || 0) - attackerPower;

					if (updatedTargetDefense <= 0) {
						// Remove destroyed creature
						updatedPlayer.board = updatedPlayer.board.filter(c => c.id !== target.id);
						updatedPlayer.graveyard.push({
							...target,
							zone: 'graveyard',
							onBoard: false,
						});
					} else {
						// Update creature defense
						updatedPlayer.board = updatedPlayer.board.map(c =>
							c.id === target.id ? { ...c, defense: updatedTargetDefense } : c
						);
					}

					history.push(action);
				} else {
					// Attack player directly
					const action: GameAction = {
						id: crypto.randomUUID(),
						type: 'attack',
						player: updatedOpponent.id,
						timestamp: Date.now(),
						data: { attackerId: attacker.id, defenderId: updatedPlayer.id },
						description: `Opponent's ${attacker.name} attacked you directly.`,
					};

					// Apply damage to player
					const attackerPower = attacker.attack || 0;
					updatedPlayer.health = Math.max(0, updatedPlayer.health - attackerPower);

					history.push(action);
				}
			}

			// End opponent turn
			const endTurnAction: GameAction = {
				id: crypto.randomUUID(),
				type: 'end_turn',
				player: updatedOpponent.id,
				timestamp: Date.now(),
				data: {},
				description: 'Opponent ended their turn.',
			};

			// Draw card for player
			const playerDrawAction: GameAction = {
				id: crypto.randomUUID(),
				type: 'draw_card',
				player: updatedPlayer.id,
				timestamp: Date.now() + 100,
				data: { count: 1 },
				description: 'You drew a card.',
			};

			// Move a card from player's deck to hand
			if (updatedPlayer.deck.length > 0) {
				const playerDeck = [...updatedPlayer.deck];
				const drawnCard = playerDeck.pop();
				if (drawnCard) {
					updatedPlayer.hand.push({
						...drawnCard,
						zone: 'hand',
						inHand: true
					});
					updatedPlayer.deck = playerDeck;
				}
			}

			// Increase player's mana for the new turn
			const newPlayerMana = Math.min(updatedPlayer.maxMana + 1, 10);
			updatedPlayer.mana = newPlayerMana;
			updatedPlayer.maxMana = newPlayerMana;
			updatedPlayer.isActive = true;

			updatedOpponent.isActive = false;

			// Check if game is over
			const isGameOver = updatedPlayer.health <= 0;

			return {
				...prevState,
				player: updatedPlayer,
				opponent: updatedOpponent,
				turn: prevState.turn + 1,
				isPlayerTurn: true,
				history: [...history, endTurnAction, playerDrawAction],
				winner: isGameOver ? updatedOpponent.id : undefined,
			};
		});
	};

	return (
		<Container size="xl" className={styles.gamePlayContainer}>
			{gameState.winner ? (
				<div className={styles.gameOverOverlay}>
					<div className={styles.gameOverContent}>
						<h1>Game Over</h1>
						<p>{gameState.winner === gameState.player.id ? 'You Won!' : 'You Lost!'}</p>
						<button onClick={() => window.location.reload()}>Play Again</button>
					</div>
				</div>
			) : null}

			<GameBoard
				gameState={gameState}
				onCardSelect={handleCardSelect}
				onCardPlay={handleCardPlay}
				onAttack={handleAttack}
				onEndTurn={handleEndTurn}
			/>
		</Container>
	);
}

export default GamePlayPage;
