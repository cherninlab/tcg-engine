import clsx from 'clsx';
import { forwardRef } from 'react';
import { type ButtonProps } from '../../../types/ui/components';
import styles from './Button.module.css';

/**
 * Button component for user interactions.
 * Supports different variants, sizes, and states.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, variant = 'primary', size = 'md', isLoading = false, className, ...props }, ref) => {
		const buttonClasses = clsx(
			styles.root,
			styles[variant],
			styles[`size-${size}`],
			{
				[styles.loading]: isLoading,
			},
			className
		);

		return (
			<button ref={ref} className={buttonClasses} disabled={isLoading || props.disabled} {...props}>
				{isLoading && (
					<span className={styles.spinner} aria-hidden="true">
						<svg className={styles.spinnerSvg} viewBox="0 0 24 24">
							<circle className={styles.spinnerCircle} cx="12" cy="12" r="10" fill="none" strokeWidth="3" />
						</svg>
					</span>
				)}
				<span className={styles.content}>{children}</span>
			</button>
		);
	}
);

Button.displayName = 'Button';
