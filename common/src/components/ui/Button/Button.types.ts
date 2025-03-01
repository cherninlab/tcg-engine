import { ReactNode } from 'react';

/**
 * Button variants for different use cases
 */
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';

/**
 * Button sizes
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Props for the Button component
 */
export interface ButtonProps {
	/** The content to be rendered inside the button */
	children: ReactNode;

	/** The visual variant of the button */
	variant?: ButtonVariant;

	/** The size of the button */
	size?: ButtonSize;

	/** Whether the button is disabled */
	disabled?: boolean;

	/** Whether to show a loading state */
	loading?: boolean;

	/** Additional CSS class names */
	className?: string;

	/** Click handler */
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

	/** Type of button */
	type?: 'button' | 'submit' | 'reset';

	/** Whether the button should take full width */
	fullWidth?: boolean;

	/** Optional icon to show before the text */
	startIcon?: ReactNode;

	/** Optional icon to show after the text */
	endIcon?: ReactNode;

	/** Optional tooltip text */
	tooltip?: string;

	/** Whether the button is in an active state */
	active?: boolean;
}
