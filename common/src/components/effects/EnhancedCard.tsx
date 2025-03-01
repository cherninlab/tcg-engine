import React, { useState, useRef, useEffect } from 'react';
import { Box, Paper, Badge, Text } from '@mantine/core';
import { UI_CONSTANTS } from '../../theme';

export interface CardFaceProps {
  imagePath?: string;
  svgComponent?: React.ReactNode;
  badgeText?: string;
  badgeColor?: string;
  elementType?: 'fire' | 'water' | 'earth' | 'air' | 'light' | 'dark';
  cardTitle?: string;
  cardPower?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  glowColor?: string;
}

export interface EnhancedCardProps {
  frontFace: CardFaceProps;
  backFace?: CardFaceProps;
  width?: number;
  height?: number;
  onClick?: () => void;
  interactive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  // Effect options
  enableParallax?: boolean;
  enableGlow?: boolean;
  enableFlip?: boolean;
  enableShine?: boolean;
  disableEffectsOnMobile?: boolean;
}

const elementGradients = {
  fire: 'radial-gradient(circle, rgba(255, 107, 0, 0.7) 0%, rgba(200, 0, 0, 0.8) 100%)',
  water: 'radial-gradient(circle, rgba(0, 147, 233, 0.7) 0%, rgba(0, 59, 119, 0.8) 100%)',
  earth: 'radial-gradient(circle, rgba(76, 175, 80, 0.7) 0%, rgba(27, 94, 32, 0.8) 100%)',
  air: 'radial-gradient(circle, rgba(189, 189, 189, 0.7) 0%, rgba(117, 117, 117, 0.8) 100%)',
  light: 'radial-gradient(circle, rgba(255, 236, 179, 0.7) 0%, rgba(255, 193, 7, 0.8) 100%)',
  dark: 'radial-gradient(circle, rgba(79, 55, 139, 0.7) 0%, rgba(49, 27, 82, 0.8) 100%)'
};

const rarityColors = {
  common: '#8c8c8c',
  uncommon: '#3c9f40',
  rare: '#2e86de',
  epic: '#8e44ad',
  legendary: '#e74c3c'
};

const rarityGlows = {
  common: '0 0 5px rgba(140, 140, 140, 0.7)',
  uncommon: '0 0 8px rgba(60, 159, 64, 0.7)',
  rare: '0 0 10px rgba(46, 134, 222, 0.7)',
  epic: '0 0 15px rgba(142, 68, 173, 0.8)',
  legendary: '0 0 20px rgba(231, 76, 60, 0.9)'
};

/**
 * Enhanced card component with advanced visual effects and animations
 * Designed for TCG games with mobile-friendly performance optimizations
 */
export function EnhancedCard({
  frontFace,
  backFace,
  width = 200,
  height = 280,
  onClick,
  interactive = true,
  style,
  className = '',
  enableParallax = true,
  enableGlow = true,
  enableFlip = false,
  enableShine = true,
  disableEffectsOnMobile = true
}: EnhancedCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [transform, setTransform] = useState('');
  const [glowOpacity, setGlowOpacity] = useState(0);
  const [shinePosition, setShinePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Check mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Performance flag - disable effects on mobile if requested
  const effectsEnabled = !disableEffectsOnMobile || !isMobile;

  // Handle mouse movement for parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!effectsEnabled || !interactive) return;

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();

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
        const rotateY = normalizedX * 10; // Max 10 degrees rotation
        const rotateX = -normalizedY * 10;
        setTransform(`perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`);
      }

      // Calculate glow strength based on mouse position
      if (enableGlow) {
        const distanceFromCenter = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
        const glowStrength = 1 - Math.min(distanceFromCenter, 1); // 1 at center, 0 at edge
        setGlowOpacity(glowStrength * 0.6); // Max opacity 0.6
      }

      // Calculate shine position
      if (enableShine) {
        setShinePosition({ x: (normalizedX + 1) / 2, y: (normalizedY + 1) / 2 });
      }
    }
  };

  // Reset effects when mouse leaves
  const handleMouseLeave = () => {
    if (!effectsEnabled || !interactive) return;

    setTransform('');
    setGlowOpacity(0);
  };

  // Handle click for flipping
  const handleClick = () => {
    if (enableFlip && interactive) {
      setIsFlipped(!isFlipped);
    }

    if (onClick) {
      onClick();
    }
  };

  // Determine which face to show
  const currentFace = isFlipped && backFace ? backFace : frontFace;
  const rarityGlow = currentFace.rarity ? rarityGlows[currentFace.rarity] : undefined;
  const customGlow = currentFace.glowColor ? `0 0 15px ${currentFace.glowColor}` : undefined;

  return (
    <Paper
      ref={cardRef}
      className={className}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        borderRadius: '12px',
        transition: `transform ${UI_CONSTANTS.ANIMATIONS.DURATION.MEDIUM} ${UI_CONSTANTS.ANIMATIONS.TIMING},
                     box-shadow ${UI_CONSTANTS.ANIMATIONS.DURATION.MEDIUM} ${UI_CONSTANTS.ANIMATIONS.TIMING}`,
        transform: effectsEnabled ? transform : '',
        cursor: interactive ? 'pointer' : 'default',
        boxShadow: effectsEnabled && enableGlow ?
          (customGlow || rarityGlow || `0 0 20px rgba(255, 215, 0, ${glowOpacity})`) :
          '0 5px 15px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Card content */}
      <Box
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #333, #111)',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          transition: `transform ${UI_CONSTANTS.ANIMATIONS.DURATION.MEDIUM} ${UI_CONSTANTS.ANIMATIONS.TIMING}`,
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* Card header with badge if provided */}
        {currentFace.badgeText && (
          <Box
            style={{
              padding: '8px',
              display: 'flex',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 2,
            }}
          >
            <Badge
              color={currentFace.badgeColor || 'red'}
              size="lg"
            >
              {currentFace.badgeText}
            </Badge>
          </Box>
        )}

        {/* Card image / content area */}
        <Box
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          {/* Element background */}
          {currentFace.elementType && (
            <Box
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: elementGradients[currentFace.elementType],
                opacity: 0.7,
                zIndex: 0,
              }}
            />
          )}

          {/* Card image if provided */}
          {currentFace.imagePath && (
            <Box
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${currentFace.imagePath})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 1,
              }}
            />
          )}

          {/* SVG component if provided */}
          {currentFace.svgComponent && (
            <Box
              style={{
                position: 'relative',
                zIndex: 2,
              }}
            >
              {currentFace.svgComponent}
            </Box>
          )}

          {/* Shine effect overlay */}
          {effectsEnabled && enableShine && (
            <Box
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at ${shinePosition.x * 100}% ${shinePosition.y * 100}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%)`,
                mixBlendMode: 'overlay',
                zIndex: 5,
                pointerEvents: 'none',
              }}
            />
          )}
        </Box>

        {/* Card footer with title and power if provided */}
        {(currentFace.cardTitle || currentFace.cardPower) && (
          <Box
            style={{
              padding: '10px',
              background: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 2,
            }}
          >
            {currentFace.cardTitle && (
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
              >
                {currentFace.cardTitle}
              </Text>
            )}
            {currentFace.cardPower && (
              <Text
                style={{
                  color: '#ffcc00',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 204, 0, 0.5)',
                }}
              >
                {currentFace.cardPower}
              </Text>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
