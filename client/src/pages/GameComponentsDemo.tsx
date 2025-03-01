import React, { useState } from 'react';
import {
  Button,
  BattleMessage,
  GameLogEntry,
  PlayerProfile,
  GameCard as CardDetail
} from '../../../common/src/components/ui';
import { COLORS, TYPOGRAPHY } from '../../../common/src/theme/designSystem';

const GameComponentsDemo: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const handleSectionHover = (section: string | null) => {
    setActiveSection(section);
  };

  return (
    <div style={{
      padding: '32px',
      backgroundColor: COLORS.BG_PAGE,
      minHeight: '100vh',
      fontFamily: "'Russo One', system-ui, -apple-system, sans-serif",
    }}>
      <h1 style={{
        fontSize: '36px',
        textAlign: 'center',
        marginBottom: '32px',
        color: COLORS.TEXT.PRIMARY,
        textShadow: '0px 2px 4px rgba(0,0,0,0.5)',
      }}>
        Battle Messages
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '32px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Duel Request Message */}
        <BattleMessage
          type="duel"
          title="Duel Request"
          style={{
            transform: activeSection === 'duel' ? 'translateY(-2px)' : 'translateY(0)',
          }}
          onMouseEnter={() => handleSectionHover('duel')}
          onMouseLeave={() => handleSectionHover(null)}
          actionButtons={
            <>
              <Button
                variant="success"
                style={{ flex: 1 }}
              >
                Accept Challenge
              </Button>
              <Button
                variant="danger"
                style={{ flex: 1 }}
              >
                Decline
              </Button>
            </>
          }
        >
          <PlayerProfile
            avatar="https://placehold.co/80x80"
            playerName="GrandMaster_123"
            rank={{
              title: "Platinum II",
              icon: "https://placehold.co/24x24",
              color: COLORS.SECONDARY.FROM
            }}
            stats={[
              { label: "Win Rate", value: "67%", valueColor: COLORS.SUCCESS.FROM },
              { label: "Matches", value: "1,337" },
              { label: "Deck Type", value: "Control", valueColor: COLORS.SPECIAL.FROM }
            ]}
          />
        </BattleMessage>

        {/* Legendary Card Acquired */}
        <BattleMessage
          type="reward"
          title="Legendary Card Acquired"
          style={{
            transform: activeSection === 'reward' ? 'translateY(-2px)' : 'translateY(0)',
          }}
          onMouseEnter={() => handleSectionHover('reward')}
          onMouseLeave={() => handleSectionHover(null)}
        >
          <CardDetail
            image="https://placehold.co/240x336"
            title="Ancient Dragon"
            titleColor={COLORS.SECONDARY.FROM}
            tags={[
              { label: 'Legendary' },
              { label: 'Creature' },
              { label: 'Dragon' }
            ]}
            stats={[
              { label: 'Attack', value: '3000 / Defense: 2500', color: COLORS.PRIMARY.FROM }
            ]}
            description="When this card enters the battlefield, deal 3 damage to all enemy creatures."
            glowColor={COLORS.SECONDARY.FROM}
            actions={
              <>
                <Button
                  variant="success"
                  style={{ flex: 1 }}
                >
                  Add to Deck
                </Button>
                <Button
                  variant="primary"
                  square
                >
                  ★
                </Button>
              </>
            }
          />
        </BattleMessage>

        {/* Battle Log */}
        <BattleMessage
          type="battle"
          title="Battle Log"
          style={{
            transform: activeSection === 'battle' ? 'translateY(-2px)' : 'translateY(0)',
          }}
          onMouseEnter={() => handleSectionHover('battle')}
          onMouseLeave={() => handleSectionHover(null)}
          actionButtons={
            <>
              <Button
                variant="special"
                style={{ flex: 1 }}
              >
                Activate Counter
              </Button>
              <Button
                variant="danger"
                style={{ flex: 1 }}
              >
                Pass
              </Button>
            </>
          }
        >
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: TYPOGRAPHY.FONT_SIZE['2XL'] }}>Current Battle Phase</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  backgroundColor: COLORS.BG_DARK,
                  borderRadius: '50px',
                  padding: '4px 16px'
                }}>
                  Turn 3
                </div>
                <div style={{
                  backgroundColor: COLORS.BG_DARK,
                  borderRadius: '50px',
                  padding: '4px 16px',
                  color: COLORS.SUCCESS.FROM
                }}>
                  Your Turn
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
              <GameLogEntry
                type="success"
                title="Dragon Knight summoned successfully"
                description="Attack: 1500 / Defense: 1200"
                image="https://placehold.co/40x40"
              />

              <GameLogEntry
                type="error"
                title="Enemy activated Trap Card"
                description="Mirror Force triggered"
                image="https://placehold.co/40x40"
              />

              <GameLogEntry
                type="info"
                title="Chain Reaction Started"
                description="Waiting for response..."
                image="https://placehold.co/40x40"
              />
            </div>
          </div>
        </BattleMessage>

        {/* Chain Reaction */}
        <BattleMessage
          type="chain"
          title="Chain Reaction"
          style={{
            transform: activeSection === 'chain' ? 'translateY(-2px)' : 'translateY(0)',
          }}
          onMouseEnter={() => handleSectionHover('chain')}
          onMouseLeave={() => handleSectionHover(null)}
        >
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <h3 style={{ fontSize: TYPOGRAPHY.FONT_SIZE['2XL'] }}>Active Chain Sequence</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: COLORS.SUCCESS.FROM,
                  animation: 'pulse 1s infinite'
                }}></div>
                <span>Chain Active</span>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '24px',
                top: 0,
                width: '2px',
                height: '100%',
                backgroundColor: COLORS.BG_DARK
              }}></div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: COLORS.SUCCESS.FROM,
                      marginTop: '16px'
                    }}></div>
                  </div>
                  <div style={{
                    flex: 1,
                    backgroundColor: COLORS.BG_DARK,
                    borderRadius: '8px',
                    padding: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '8px'
                    }}>
                      <img
                        src="https://placehold.co/60x60"
                        alt="Card"
                        style={{ borderRadius: '4px' }}
                      />
                      <div>
                        <h4 style={{
                          fontSize: TYPOGRAPHY.FONT_SIZE.XL,
                          color: COLORS.SECONDARY.FROM
                        }}>Counter Spell</h4>
                        <p style={{ color: COLORS.PRIMARY.FROM }}>Quick Effect</p>
                      </div>
                    </div>
                    <p style={{
                      fontSize: TYPOGRAPHY.FONT_SIZE.SM,
                      color: 'rgba(255, 255, 255, 0.6)'
                    }}>
                      Negate the activation of an opponent's Spell Card and destroy it.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: COLORS.DANGER.FROM,
                      marginTop: '16px'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BattleMessage>
      </div>
    </div>
  );
};

export default GameComponentsDemo;
