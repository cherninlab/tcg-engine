import React from 'react';
import { COLORS, TYPOGRAPHY, BORDERS } from '../../theme/designSystem';

export interface PlayerStat {
  label: string;
  value: string | number;
  valueColor?: string;
}

export interface PlayerProfileProps {
  avatar?: string;
  playerName: string;
  rank?: {
    title: string;
    icon?: string;
    color?: string;
  };
  stats?: PlayerStat[];
  className?: string;
  style?: React.CSSProperties;
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({
  avatar,
  playerName,
  rank,
  stats = [],
  className = '',
  style = {},
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        ...style,
      }}
    >
      {/* Avatar with Glow Effect */}
      {avatar && (
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              inset: '-2px',
              background: `linear-gradient(to bottom, ${COLORS.SECONDARY.FROM}, ${COLORS.SECONDARY.TO})`,
              borderRadius: '50%',
              animation: 'pulse 2s infinite',
            }}
          />
          <img
            src={avatar}
            alt={`${playerName}'s Avatar`}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              position: 'relative',
              objectFit: 'cover',
            }}
          />
        </div>
      )}

      <div style={{ flex: 1 }}>
        {/* Player Name and Rank */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h3
            style={{
              fontSize: TYPOGRAPHY.FONT_SIZE['2XL'],
              textShadow: '0px 1px 2px rgba(0,0,0,0.5)',
              color: COLORS.TEXT.PRIMARY,
            }}
          >
            {playerName}
          </h3>

          {rank && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {rank.icon && (
                <img
                  src={rank.icon}
                  alt="Rank Icon"
                  style={{ width: '24px', height: '24px' }}
                />
              )}
              <span
                style={{
                  color: rank.color || COLORS.SECONDARY.FROM,
                }}
              >
                {rank.title}
              </span>
            </div>
          )}
        </div>

        {/* Player Stats */}
        {stats.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(stats.length, 3)}, 1fr)`,
              gap: '16px',
              backgroundColor: COLORS.BG_DARK,
              borderRadius: BORDERS.RADIUS.MD,
              padding: '16px',
            }}
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  borderLeft: index > 0 ? `2px solid ${COLORS.BG_SECTION}` : undefined,
                }}
              >
                <p
                  style={{
                    color: COLORS.PRIMARY.FROM,
                    marginBottom: '4px',
                  }}
                >
                  {stat.label}
                </p>
                <p
                  style={{
                    fontSize: TYPOGRAPHY.FONT_SIZE['2XL'],
                    color: stat.valueColor || COLORS.TEXT.PRIMARY,
                  }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;
