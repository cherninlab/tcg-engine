import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mantine/core';

export interface ParticleConfig {
  color: string;
  size: number;
  count: number;
  speed: number;
  opacity: number;
  // More options for customization
  blur?: number;
  glow?: boolean;
  fadeOut?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right' | 'random';
}

export interface AnimatedBackgroundProps {
  children?: React.ReactNode;
  particleConfig?: ParticleConfig;
  imagePath?: string;
  disableOnMobile?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A component that renders an animated background with particles or custom effects
 * Automatically disables complex effects on low-end devices or can be configured to disable on mobile
 */
export function AnimatedBackground({
  children,
  particleConfig = {
    color: '#ffcc00',
    size: 3,
    count: 50,
    speed: 1.5,
    opacity: 0.7,
    blur: 0,
    glow: true,
    fadeOut: true,
    direction: 'up'
  },
  imagePath,
  disableOnMobile = false,
  className = '',
  style = {}
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<{ x: number; y: number; size: number; speed: number; opacity: number }[]>([]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set up canvas and resize handler
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Initialize particles
  useEffect(() => {
    if (disableOnMobile && isMobile) return;
    if (!canvasRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Create particles
    particlesRef.current = [];
    for (let i = 0; i < particleConfig.count; i++) {
      particlesRef.current.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: (Math.random() * particleConfig.size) + 1,
        speed: (Math.random() * particleConfig.speed) + 0.2,
        opacity: Math.random() * particleConfig.opacity
      });
    }

    // Animation function
    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particlesRef.current.forEach((particle, i) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particleConfig.color;
        ctx.globalAlpha = particle.opacity;

        if (particleConfig.glow) {
          ctx.shadowBlur = particleConfig.blur || 10;
          ctx.shadowColor = particleConfig.color;
        }

        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        // Update particle position
        if (particleConfig.direction === 'up' || particleConfig.direction === 'random' && Math.random() > 0.5) {
          particle.y -= particle.speed;
          if (particle.y < -10) {
            particle.y = dimensions.height + 10;
            particle.x = Math.random() * dimensions.width;
          }
        } else if (particleConfig.direction === 'down') {
          particle.y += particle.speed;
          if (particle.y > dimensions.height + 10) {
            particle.y = -10;
            particle.x = Math.random() * dimensions.width;
          }
        } else if (particleConfig.direction === 'left') {
          particle.x -= particle.speed;
          if (particle.x < -10) {
            particle.x = dimensions.width + 10;
            particle.y = Math.random() * dimensions.height;
          }
        } else if (particleConfig.direction === 'right') {
          particle.x += particle.speed;
          if (particle.x > dimensions.width + 10) {
            particle.x = -10;
            particle.y = Math.random() * dimensions.height;
          }
        }

        // Fade effect
        if (particleConfig.fadeOut) {
          particle.opacity -= 0.002;
          if (particle.opacity <= 0) {
            particle.opacity = particleConfig.opacity;
          }
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions, particleConfig, disableOnMobile, isMobile]);

  return (
    <Box
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      {(!disableOnMobile || !isMobile) && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}
      {imagePath && (
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${imagePath})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        />
      )}
      <Box
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
