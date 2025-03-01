import { useCallback, useEffect, useState } from 'react';

export interface CardEffectsOptions {
	enableParallax?: boolean;
	enableGlow?: boolean;
	enableShine?: boolean;
	disableEffectsOnMobile?: boolean;
	maxRotation?: number;
	maxGlowOpacity?: number;
}

export interface CardEffectsResult {
	transform: string;
	glowOpacity: number;
	shinePosition: { x: number; y: number };
	isMobile: boolean;
	effectsEnabled: boolean;
	handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
	handleMouseLeave: () => void;
}

/**
 * Hook to handle common card effects like parallax, glow, and shine
 */
export function useCardEffects({
	enableParallax = true,
	enableGlow = true,
	enableShine = true,
	disableEffectsOnMobile = true,
	maxRotation = 10,
	maxGlowOpacity = 0.6,
}: CardEffectsOptions = {}): CardEffectsResult {
	const [transform, setTransform] = useState('');
	const [glowOpacity, setGlowOpacity] = useState(0);
	const [shinePosition, setShinePosition] = useState({ x: 0, y: 0 });
	const [isMobile, setIsMobile] = useState(false);

	// Check for mobile device
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.matchMedia('(max-width: 768px)').matches);
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Determine if effects should be enabled
	const effectsEnabled = !disableEffectsOnMobile || !isMobile;

	// Handle mouse movement for effects
	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!effectsEnabled) return;

			const element = e.currentTarget;
			const rect = element.getBoundingClientRect();

			// Calculate mouse position relative to card center
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;
			const mouseX = e.clientX - centerX;
			const mouseY = e.clientY - centerY;

			// Normalize to values between -1 and 1
			const normalizedX = mouseX / (rect.width / 2);
			const normalizedY = mouseY / (rect.height / 2);

			// Apply rotation and 3D transform based on mouse position
			if (enableParallax) {
				const rotateY = normalizedX * maxRotation;
				const rotateX = -normalizedY * maxRotation;
				setTransform(`perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`);
			}

			// Calculate glow strength based on mouse position
			if (enableGlow) {
				const distanceFromCenter = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
				const glowStrength = 1 - Math.min(distanceFromCenter, 1);
				setGlowOpacity(glowStrength * maxGlowOpacity);
			}

			// Calculate shine position
			if (enableShine) {
				setShinePosition({
					x: (normalizedX + 1) / 2,
					y: (normalizedY + 1) / 2,
				});
			}
		},
		[effectsEnabled, enableParallax, enableGlow, enableShine, maxRotation, maxGlowOpacity]
	);

	// Reset effects when mouse leaves
	const handleMouseLeave = useCallback(() => {
		if (!effectsEnabled) return;

		setTransform('');
		setGlowOpacity(0);
	}, [effectsEnabled]);

	return {
		transform,
		glowOpacity,
		shinePosition,
		isMobile,
		effectsEnabled,
		handleMouseMove,
		handleMouseLeave,
	};
}
