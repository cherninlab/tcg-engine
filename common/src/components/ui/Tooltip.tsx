import React, { useState, useRef, useEffect } from 'react';
import { COLORS, TYPOGRAPHY, BORDERS, Z_INDEX, ANIMATIONS } from '../../theme/designSystem';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  contentClassName?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  className = '',
  contentClassName = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updateTooltipPosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const updateTooltipPosition = () => {
    if (!targetRef.current || !tooltipRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;

    switch (position) {
      case 'top':
        x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        y = targetRect.top - tooltipRect.height - 8;
        break;
      case 'bottom':
        x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        y = targetRect.bottom + 8;
        break;
      case 'left':
        x = targetRect.left - tooltipRect.width - 8;
        y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = targetRect.right + 8;
        y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    // Keep tooltip within viewport
    x = Math.max(10, Math.min(x, window.innerWidth - tooltipRect.width - 10));
    y = Math.max(10, Math.min(y, window.innerHeight - tooltipRect.height - 10));

    setCoords({ x, y });
  };

  useEffect(() => {
    // Clean up timeout on unmount
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Ensure tooltip position is updated when content changes or window resizes
  useEffect(() => {
    if (isVisible) updateTooltipPosition();

    const handleResize = () => {
      if (isVisible) updateTooltipPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible, content]);

  // Clone children with mouse event handlers
  const childrenWithProps = React.cloneElement(children, {
    ref: (el: HTMLElement | null) => {
      targetRef.current = el;
      // Forward ref if the child has a ref
      const childRef = (children as any).ref;
      if (typeof childRef === 'function') childRef(el);
    },
    onMouseEnter: (e: React.MouseEvent) => {
      showTooltip();
      // Call the original onMouseEnter if it exists
      if (children.props.onMouseEnter) children.props.onMouseEnter(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hideTooltip();
      // Call the original onMouseLeave if it exists
      if (children.props.onMouseLeave) children.props.onMouseLeave(e);
    },
  });

  return (
    <>
      {childrenWithProps}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={className}
          style={{
            position: 'fixed',
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            zIndex: Z_INDEX.TOOLTIP,
            pointerEvents: 'none',
          }}
        >
          <div
            className={contentClassName}
            style={{
              backgroundColor: COLORS.BG_DARK,
              color: COLORS.TEXT.PRIMARY,
              padding: '8px 12px',
              borderRadius: BORDERS.RADIUS.SM,
              fontSize: TYPOGRAPHY.FONT_SIZE.SM,
              fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
              maxWidth: '200px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              opacity: 0,
              animation: `fadeIn ${ANIMATIONS.DURATION.FAST} ${ANIMATIONS.EASING} forwards`,
            }}
          >
            {content}
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default Tooltip;
