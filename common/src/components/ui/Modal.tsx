import React, { useEffect } from 'react';
import { BORDERS, COLORS, COMPONENTS, TYPOGRAPHY } from '../../theme/designSystem';
import clsx from 'clsx';
import Button from './Button';
import styles from './Modal.module.css';

export interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	actions?: React.ReactNode;
	maxWidth?: string;
	className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, actions, maxWidth = '400px', className = '' }) => {
	// Close on escape key
	useEffect(() => {
		const handleEscKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && isOpen) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscKey);
		}

		return () => {
			document.removeEventListener('keydown', handleEscKey);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className={clsx(styles.overlay)}
			onClick={onClose}
			style={{
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
			}}
		>
			<div
				className={clsx(styles.modal, className)}
				onClick={(e) => e.stopPropagation()}
				style={{
					backgroundColor: COLORS.BG_SECTION,
					borderRadius: BORDERS.RADIUS.LG,
					padding: COMPONENTS.CARD.PADDING,
					maxWidth,
					width: '100%',
				}}
			>
				<div className={clsx(styles.header)}>
					<h3
						className={clsx(styles.title)}
						style={{
							fontSize: TYPOGRAPHY.FONT_SIZE['2XL'],
							fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
							color: COLORS.TEXT.PRIMARY,
						}}
					>
						{title}
					</h3>

					<button className={clsx(styles.closeButton)} onClick={onClose} aria-label="Close modal">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
				</div>

				<div className={clsx(styles.body)}>{children}</div>

				<div className={clsx(styles.footer)}>
					{actions || (
						<Button variant="danger" onClick={onClose}>
							Close
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Modal;
