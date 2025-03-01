/**
 * UI Components Export
 * This file exports all UI components in a consistent manner
 *
 * Pattern:
 * 1. Named exports (for destructuring import)
 * 2. Default exports (for direct import)
 */

// Main UI Components
export * from './Button';
export * from './Card';
export * from './Modal';
export * from './Notification';
export * from './Tabs';
export * from './Tooltip';

// Game-specific UI components
export * from './BattleMessage';
export * from './GameCard';
export * from './GameLogEntry';
export * from './PlayerProfile';

// Default exports for direct imports
import BattleMessage from './BattleMessage';
import Button from './Button';
import Card from './Card';
import GameCard from './GameCard';
import GameLogEntry from './GameLogEntry';
import Modal from './Modal';
import Notification from './Notification';
import PlayerProfile from './PlayerProfile';
import Tabs from './Tabs';
import Tooltip from './Tooltip';

// Re-export default exports
export {
	// Game UI components
	BattleMessage,
	// Core UI components
	Button,
	Card,
	GameCard,
	GameLogEntry,
	Modal,
	Notification,
	PlayerProfile,
	Tabs,
	Tooltip,
};
