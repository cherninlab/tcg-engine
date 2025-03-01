import React, { useEffect, useState } from 'react';
import { COLORS, TYPOGRAPHY, COMPONENTS, BORDERS, EFFECTS, Z_INDEX, ANIMATIONS } from '../../theme/designSystem';

export type NotificationVariant = 'success' | 'error' | 'info' | 'warning';

export interface NotificationProps {
  message: string;
  isVisible: boolean;
  onClose?: () => void;
  variant?: NotificationVariant;
  timeout?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  className?: string;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  isVisible,
  onClose,
  variant = 'success',
  timeout = COMPONENTS.NOTIFICATION.TIMEOUT,
  position = 'top-right',
  className = '',
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);

      if (timeout > 0) {
        const timer = setTimeout(() => {
          setIsAnimating(false);

          // Give time for the exit animation to complete
          setTimeout(() => {
            if (onClose) onClose();
          }, 300);
        }, timeout);

        return () => clearTimeout(timer);
      }
    } else {
      setIsAnimating(false);
    }
  }, [isVisible, timeout, onClose]);

  // Get background color based on variant
  const getBackgroundColor = () => {
    switch (variant) {
      case 'success':
        return `linear-gradient(to bottom, ${COLORS.SUCCESS.FROM}, ${COLORS.SUCCESS.TO})`;
      case 'error':
        return `linear-gradient(to bottom, ${COLORS.DANGER.FROM}, ${COLORS.DANGER.TO})`;
      case 'warning':
        return `linear-gradient(to bottom, ${COLORS.SECONDARY.FROM}, ${COLORS.SECONDARY.TO})`;
      case 'info':
      default:
        return `linear-gradient(to bottom, ${COLORS.PRIMARY.FROM}, ${COLORS.PRIMARY.TO})`;
    }
  };

  // Calculate position styles
  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return { top: '16px', left: '16px' };
      case 'bottom-right':
        return { bottom: '16px', right: '16px' };
      case 'bottom-left':
        return { bottom: '16px', left: '16px' };
      case 'top-center':
        return { top: '16px', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-center':
        return { bottom: '16px', left: '50%', transform: 'translateX(-50%)' };
      case 'top-right':
      default:
        return { top: '16px', right: '16px' };
    }
  };

  if (!isVisible && !isAnimating) return null;

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        padding: '16px',
        borderRadius: BORDERS.RADIUS.MD,
        background: getBackgroundColor(),
        color: COLORS.TEXT.PRIMARY,
        boxShadow: EFFECTS.BOX_SHADOW,
        zIndex: Z_INDEX.NOTIFICATION,
        opacity: isAnimating ? 1 : 0,
        transition: `opacity ${ANIMATIONS.DURATION.MEDIUM} ${ANIMATIONS.EASING}`,
        ...getPositionStyles(),
      }}
    >
      <p style={{
        margin: 0,
        fontFamily: TYPOGRAPHY.FONT_FAMILY.PRIMARY,
        fontSize: TYPOGRAPHY.FONT_SIZE.MD,
      }}>
        {message}
      </p>
    </div>
  );
};

export default Notification;
