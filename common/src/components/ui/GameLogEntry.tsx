import React from 'react';
import { COLORS, TYPOGRAPHY, BORDERS } from '../../theme/designSystem';

export type LogEntryType = 'success' | 'error' | 'info' | 'warning' | 'special';

export interface GameLogEntryProps {
  type: LogEntryType;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
  className?: string;
  children?: React.ReactNode;
}

const getTypeColor = (type: LogEntryType) => {
  switch (type) {
    case 'success':
      return COLORS.SUCCESS.FROM;
    case 'error':
      return COLORS.DANGER.FROM;
    case 'warning':
      return COLORS.SECONDARY.FROM;
    case 'special':
      return COLORS.SPECIAL.FROM;
    case 'info':
    default:
      return COLORS.PRIMARY.FROM;
  }
};

export const GameLogEntry: React.FC<GameLogEntryProps> = ({
  type,
  title,
  description,
  icon,
  image,
  className = '',
  children,
}) => {
  const borderColor = getTypeColor(type);
  const titleColor = getTypeColor(type);

  return (
    <div
      className={className}
      style={{
        backgroundColor: COLORS.BG_DARK,
        borderRadius: BORDERS.RADIUS.MD,
        padding: '16px',
        borderLeft: `4px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {image && (
        <img
          src={image}
          alt="Log Entry Icon"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: BORDERS.RADIUS.SM,
            objectFit: 'cover',
          }}
        />
      )}
      {icon && icon}

      <div style={{ flex: 1 }}>
        <p style={{
          color: titleColor,
          fontSize: TYPOGRAPHY.FONT_SIZE.MD,
          marginBottom: description ? '4px' : 0,
        }}>
          {title}
        </p>

        {description && (
          <p style={{
            fontSize: TYPOGRAPHY.FONT_SIZE.SM,
            color: 'rgba(255, 255, 255, 0.6)',
          }}>
            {description}
          </p>
        )}

        {children}
      </div>
    </div>
  );
};

export default GameLogEntry;
