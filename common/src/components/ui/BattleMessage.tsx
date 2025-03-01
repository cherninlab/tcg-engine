import React from 'react';
import { COLORS, TYPOGRAPHY, COMPONENTS, BORDERS, EFFECTS } from '../../theme/designSystem';
import Card from './Card';

export type BattleMessageType = 'duel' | 'reward' | 'battle' | 'chain';

export interface BattleMessageProps {
  type: BattleMessageType;
  title: string;
  children: React.ReactNode;
  actionButtons?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
}

const getBadgeColors = (type: BattleMessageType) => {
  switch (type) {
    case 'duel':
      return {
        from: COLORS.PRIMARY.FROM,
        to: COLORS.PRIMARY.TO,
      };
    case 'reward':
      return {
        from: COLORS.SPECIAL.FROM,
        to: COLORS.SPECIAL.TO,
      };
    case 'battle':
      return {
        from: COLORS.DANGER.FROM,
        to: COLORS.DANGER.TO,
      };
    case 'chain':
      return {
        from: COLORS.SECONDARY.FROM,
        to: COLORS.SECONDARY.TO,
      };
    default:
      return {
        from: COLORS.PRIMARY.FROM,
        to: COLORS.PRIMARY.TO,
      };
  }
};

export const BattleMessage: React.FC<BattleMessageProps> = ({
  type,
  title,
  children,
  actionButtons,
  className = '',
  style = {},
  onMouseEnter,
  onMouseLeave,
}) => {
  const badgeColors = getBadgeColors(type);

  return (
    <div
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative',
        backgroundColor: COLORS.BG_SECTION,
        borderRadius: BORDERS.RADIUS.LG,
        padding: COMPONENTS.CARD.PADDING,
        border: `2px solid ${COLORS.BG_DARK}`,
        boxShadow: '0px 10px 20px rgba(0,0,0,0.3), inset 0px 1px 2px rgba(255,255,255,0.1)',
        transition: 'transform 0.2s ease',
        ...style
      }}
    >
      {/* Badge Label */}
      <div
        style={{
          position: 'absolute',
          top: '-12px',
          left: '16px',
          background: `linear-gradient(to right, ${badgeColors.from}, ${badgeColors.to})`,
          padding: '4px 16px',
          borderRadius: BORDERS.RADIUS.SM,
          fontSize: TYPOGRAPHY.FONT_SIZE.SM,
          color: COLORS.TEXT.PRIMARY,
          textShadow: EFFECTS.TEXT_SHADOW,
        }}
      >
        {title.toUpperCase()}
      </div>

      {/* Message Content */}
      <div style={{ marginTop: '8px' }}>
        {children}
      </div>

      {/* Action Buttons */}
      {actionButtons && (
        <div style={{
          display: 'flex',
          gap: '16px',
          marginTop: '24px'
        }}>
          {actionButtons}
        </div>
      )}
    </div>
  );
};

export default BattleMessage;
