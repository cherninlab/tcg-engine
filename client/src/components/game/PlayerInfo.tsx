import React from 'react';
import { Player } from '../../types/game';
import styles from './PlayerInfo.module.css';

interface PlayerInfoProps {
  player: Player;
  isOpponent: boolean;
  isActive: boolean;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ player, isOpponent, isActive }) => {
  return (
    <div className={`${styles.playerInfo} ${isOpponent ? styles.opponent : styles.player} ${isActive ? styles.active : ''}`}>
      <div className={styles.playerAvatar}>
        <img src={player.avatar} alt={player.name} />
        {isActive && <div className={styles.activeIndicator} />}
      </div>

      <div className={styles.playerDetails}>
        <div className={styles.playerName}>{player.name}</div>

        <div className={styles.playerStats}>
          <div className={styles.statGroup}>
            <div className={styles.statIcon}>❤️</div>
            <div className={styles.statValue}>{player.health}/{player.maxHealth}</div>
          </div>

          <div className={styles.statGroup}>
            <div className={styles.statIcon}>💎</div>
            <div className={styles.statValue}>{player.mana}/{player.maxMana}</div>
          </div>

          <div className={styles.statGroup}>
            <div className={styles.statIcon}>🎴</div>
            <div className={styles.statValue}>{player.deck.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
