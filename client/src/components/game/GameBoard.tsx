import React from 'react';
import { Card as CardType, GameState, Player } from '../../types/game';
import Card from './Card';
import styles from './GameBoard.module.css';
import PlayerInfo from './PlayerInfo';

interface GameBoardProps {
	gameState: GameState;
	onCardSelect: (card: CardType) => void;
	onCardPlay: (card: CardType) => void;
	onAttack: (attackerId: string, defenderId: string) => void;
	onEndTurn: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, onCardSelect, onCardPlay, onAttack, onEndTurn }) => {
	const { player, opponent, isPlayerTurn, targetingMode, selectedCard, phase } = gameState;

	// Determine if a card is playable based on mana and turn
	const isCardPlayable = (card: CardType): boolean => {
		if (!isPlayerTurn) return false;
		if (targetingMode) return false;
		if (card.zone === 'hand') {
			return card.cost <= player.mana;
		}
		if (card.zone === 'board' && card.type === 'creature') {
			// Creatures can attack if it's combat phase and they're on board
			return phase === 'combat' && !card.isSelected;
		}
		return false;
	};

	const handleCardClick = (card: CardType) => {
		if (!isCardPlayable(card)) return;

		if (card.zone === 'hand') {
			onCardPlay(card);
		} else if (card.zone === 'board' && card.type === 'creature') {
			onCardSelect(card);
		}
	};

	const handlePlayerAreaClick = (player: Player) => {
		if (targetingMode && selectedCard) {
			// Target the opponent for attack or spell
			onAttack(selectedCard.id, player.id);
		}
	};

	return (
		<div className={styles.gameBoard}>
			<div className={styles.actionBar}>
				<div className={styles.phaseInfo}>
					<span>Turn {gameState.turn}</span>
					<span>Phase: {gameState.phase}</span>
				</div>
				<button className={styles.endTurnButton} disabled={!isPlayerTurn} onClick={onEndTurn}>
					End Turn
				</button>
			</div>

			<div className={styles.opponentArea} onClick={() => handlePlayerAreaClick(opponent)}>
				<PlayerInfo player={opponent} isOpponent={true} isActive={!isPlayerTurn} />

				<div className={styles.opponentHand}>
					{opponent.hand.map((card, index) => (
						<div key={card.id} className={styles.opponentCard}>
							{/* Show card backs for opponent hand */}
							<div className={styles.cardBack} />
						</div>
					))}
				</div>

				<div className={styles.opponentBoard}>
					{opponent.board.map((card) => (
						<div key={card.id} className={styles.boardCard}>
							<Card
								card={card}
								isPlayable={targetingMode && selectedCard?.type === 'creature'}
								onClick={() => {
									if (targetingMode && selectedCard) {
										onAttack(selectedCard.id, card.id);
									}
								}}
							/>
						</div>
					))}
				</div>
			</div>

			<div className={styles.battlefield}>
				<div className={styles.gameLog}>
					<h3>Game Log</h3>
					<div className={styles.logEntries}>
						{gameState.history.slice(-5).map((action) => (
							<div key={action.id} className={styles.logEntry}>
								{action.description}
							</div>
						))}
					</div>
				</div>
			</div>

			<div className={styles.playerArea}>
				<div className={styles.playerBoard}>
					{player.board.map((card) => (
						<div key={card.id} className={styles.boardCard}>
							<Card
								card={card}
								isPlayable={isCardPlayable(card)}
								isSelected={card.id === selectedCard?.id}
								onClick={() => handleCardClick(card)}
							/>
						</div>
					))}
				</div>

				<div className={styles.playerHand}>
					{player.hand.map((card) => (
						<div key={card.id} className={styles.handCard}>
							<Card
								card={card}
								isPlayable={isCardPlayable(card)}
								isSelected={card.id === selectedCard?.id}
								onClick={() => handleCardClick(card)}
							/>
						</div>
					))}
				</div>

				<PlayerInfo player={player} isOpponent={false} isActive={isPlayerTurn} />
			</div>
		</div>
	);
};

export default GameBoard;
