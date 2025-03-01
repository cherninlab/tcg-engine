import clsx from 'clsx';
import { forwardRef } from 'react';
import styles from './Card.module.css';
import type { CardProps } from './Card.types';

/**
 * Card component for containing content with optional elevation and borders.
 * Can be interactive and have header/footer sections.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
	(
		{
			children,
			elevation = 'low',
			border = 'none',
			fullWidth = false,
			fullHeight = false,
			className,
			onClick,
			clickable = false,
			selected = false,
			disabled = false,
			header,
			footer,
			backgroundImage,
			hoverEffect = 'none',
			...props
		},
		ref
	) => {
		// Combine class names
		const cardClasses = clsx(
			styles.root,
			styles[elevation],
			styles[`border-${border}`],
			{
				[styles.fullWidth]: fullWidth,
				[styles.fullHeight]: fullHeight,
				[styles.clickable]: clickable || onClick,
				[styles.selected]: selected,
				[styles.disabled]: disabled,
				[styles.hasBackgroundImage]: backgroundImage,
				[styles[`hover-${hoverEffect}`]]: hoverEffect !== 'none',
			},
			className
		);

		// Style object for background image
		const style = backgroundImage
			? {
					backgroundImage: `url(${backgroundImage})`,
			  }
			: undefined;

		return (
			<div ref={ref} className={cardClasses} onClick={!disabled ? onClick : undefined} style={style} {...props}>
				{header && <div className={styles.header}>{header}</div>}
				<div className={styles.content}>{children}</div>
				{footer && <div className={styles.footer}>{footer}</div>}
			</div>
		);
	}
);

Card.displayName = 'Card';
