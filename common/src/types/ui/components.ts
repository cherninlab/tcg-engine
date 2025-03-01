import type { ClientGameState, UICard } from '.';
import type { GamePlayer } from '../base/player';
import type { GameAction } from '../game/action';

export interface CardComponentProps {
	/**
	 * The card data from the server with UI state
	 */
	card: UICard;

	/**
	 * Handler for when the card is clicked
	 */
	onClick?: () => void;

	/**
	 * Handlers for drag operations (UI only)
	 */
	onDragStart?: () => void;
	onDragEnd?: () => void;

	/**
	 * Additional CSS class name
	 */
	className?: string;
}

export interface GameBoardProps {
	gameState: ClientGameState;
	onCardSelect: (cardId: string) => void;
	onCardPlay: (cardId: string) => void;
	onAttack: (attackerId: string, defenderId: string) => void;
	onEndTurn: () => void;
	className?: string;
}

export interface PlayerInfoProps {
	player: GamePlayer;
	isOpponent: boolean;
	isActive: boolean;
	className?: string;
}

export interface GameLogProps {
	history: GameAction[];
	className?: string;
}

export interface BattleMessageProps {
	message: string;
	type: 'info' | 'success' | 'error' | 'warning';
	duration?: number;
	className?: string;
}

export interface TooltipProps {
	content: React.ReactNode;
	children: React.ReactNode;
	position?: 'top' | 'bottom' | 'left' | 'right';
	className?: string;
}

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	className?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	isLoading?: boolean;
	className?: string;
}
