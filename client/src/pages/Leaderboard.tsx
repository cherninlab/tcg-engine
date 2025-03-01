import React, { useState } from 'react';
import styles from './Leaderboard.module.css';

// Types
interface Player {
	rank: number;
	name: string;
	avatar: string;
	rating: number;
	wins: number;
	winRate: string;
	streak: number;
	favorite: string;
	isOnline: boolean;
}

const Leaderboard: React.FC = () => {
	// State for filters
	const [activeTab, setActiveTab] = useState<'global' | 'friends' | 'guild'>('global');
	const [activeSeason, setActiveSeason] = useState<'current' | 'last' | 'all-time'>('current');
	const [activeRank, setActiveRank] = useState<'all' | 'master' | 'diamond' | 'platinum'>('all');

	// Modal state
	const [showPlayerCard, setShowPlayerCard] = useState(false);
	const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

	// Mock player data
	const playerRank = 1337;
	const categories = ['global', 'friends', 'guild'];
	const seasons = ['current', 'last', 'all-time'];
	const ranks = ['all', 'master', 'diamond', 'platinum'];

	const leaderboard: Player[] = [
		{
			rank: 1,
			name: 'DragonMaster',
			avatar: 'https://placehold.co/60x60',
			rating: 2850,
			wins: 286,
			winRate: '72%',
			streak: 12,
			favorite: 'Dragon Control',
			isOnline: true,
		},
		{
			rank: 2,
			name: 'SpellWeaver',
			avatar: 'https://placehold.co/60x60',
			rating: 2790,
			wins: 245,
			winRate: '68%',
			streak: 5,
			favorite: 'Spell Combo',
			isOnline: false,
		},
		{
			rank: 3,
			name: 'ShadowLord',
			avatar: 'https://placehold.co/60x60',
			rating: 2760,
			wins: 312,
			winRate: '65%',
			streak: 3,
			favorite: 'Aggro Knights',
			isOnline: true,
		},
		{
			rank: 4,
			name: 'EternalFrost',
			avatar: 'https://placehold.co/60x60',
			rating: 2720,
			wins: 198,
			winRate: '62%',
			streak: 0,
			favorite: 'Ice Control',
			isOnline: false,
		},
		{
			rank: 5,
			name: 'PhoenixRising',
			avatar: 'https://placehold.co/60x60',
			rating: 2695,
			wins: 275,
			winRate: '64%',
			streak: 7,
			favorite: 'Fire Aggro',
			isOnline: true,
		},
	];

	// Open player profile modal
	const handleOpenProfile = (player: Player) => {
		setSelectedPlayer(player);
		setShowPlayerCard(true);
	};

	// Close player profile modal
	const handleCloseProfile = () => {
		setShowPlayerCard(false);
	};

	// Load more players
	const handleLoadMore = () => {
		console.log('Loading more players...');
		// In a real app, this would fetch the next page of players
	};

	// Claim rewards
	const handleClaimRewards = () => {
		console.log('Claiming rewards...');
		// In a real app, this would trigger a reward claim API call
	};

	return (
		<div className={styles.container}>
			{/* Background elements */}
			<div className={styles.backgroundImage}></div>
			<div className={styles.backgroundGradient}></div>

			{/* Main content */}
			<div className={styles.content}>
				<header className={styles.header}>
					<div className={styles.headerTop}>
						<h1 className={styles.title}>Leaderboards</h1>

						<div className={styles.headerControls}>
							<div className={styles.rankCard}>
								<div className={styles.rankLabel}>Your Rank</div>
								<div className={styles.rankInfo}>
									<span className={styles.rankValue}>#{playerRank}</span>
									<div className={styles.rankPercentile}>Top 8%</div>
								</div>
							</div>

							<button className={`${styles.button} ${styles.primaryButton}`} onClick={handleClaimRewards}>
								<span className={styles.buttonHighlight}></span>
								<span className={styles.buttonText}>Claim Rewards</span>
							</button>
						</div>
					</div>

					<div className={styles.filterBar}>
						{/* Category filter */}
						<div className={styles.filterGroup}>
							{(categories as ('global' | 'friends' | 'guild')[]).map((category) => (
								<button
									key={category}
									className={`${styles.filterTab} ${activeTab === category ? `${styles.filterTabActive} ${styles.categoryTabActive}` : ''}`}
									onClick={() => setActiveTab(category as 'global' | 'friends' | 'guild')}
								>
									{category}
								</button>
							))}
						</div>

						{/* Season filter */}
						<div className={styles.filterGroup}>
							{(seasons as ('current' | 'last' | 'all-time')[]).map((season) => (
								<button
									key={season}
									className={`${styles.filterTab} ${activeSeason === season ? `${styles.filterTabActive} ${styles.seasonTabActive}` : ''}`}
									onClick={() => setActiveSeason(season as 'current' | 'last' | 'all-time')}
								>
									{season.replace('-', ' ')}
								</button>
							))}
						</div>

						{/* Rank filter */}
						<div className={styles.filterGroup}>
							{(ranks as ('all' | 'master' | 'diamond' | 'platinum')[]).map((rank) => (
								<button
									key={rank}
									className={`${styles.filterTab} ${activeRank === rank ? `${styles.filterTabActive} ${styles.rankTabActive}` : ''}`}
									onClick={() => setActiveRank(rank as 'all' | 'master' | 'diamond' | 'platinum')}
								>
									{rank}
								</button>
							))}
						</div>
					</div>
				</header>

				<main>
					<div className={styles.leaderboardList}>
						{leaderboard.map((player) => (
							<div key={player.rank} className={styles.playerCard}>
								<div
									className={`${styles.playerCardGlow} ${
										player.rank === 1
											? styles.playerCardGlow1
											: player.rank === 2
											? styles.playerCardGlow2
											: player.rank === 3
											? styles.playerCardGlow3
											: ''
									}`}
								></div>

								<div className={styles.playerCardContent}>
									<div className={styles.playerCardInner}>
										<div
											className={`${styles.playerRank} ${
												player.rank === 1 ? styles.rank1 : player.rank === 2 ? styles.rank2 : player.rank === 3 ? styles.rank3 : ''
											}`}
										>
											#{player.rank}
										</div>

										<div className={styles.avatarContainer}>
											<div className={`${styles.onlineIndicator} ${player.isOnline ? styles.online : styles.offline}`}></div>
											<img
												src={player.avatar}
												alt={player.name}
												className={`${styles.playerAvatar} ${
													player.rank === 1
														? styles.avatarBorder1
														: player.rank === 2
														? styles.avatarBorder2
														: player.rank === 3
														? styles.avatarBorder3
														: styles.avatarBorder3
												}`}
											/>
										</div>

										<div className={styles.playerInfo}>
											<div className={styles.playerNameRow}>
												<h3 className={styles.playerName}>{player.name}</h3>
												<div className={styles.favoriteDeck}>{player.favorite}</div>
											</div>

											<div className={styles.playerStats}>
												<div>
													Rating: <span className={styles.statRating}>{player.rating}</span>
												</div>
												<div>
													Wins: <span className={styles.statWins}>{player.wins}</span>
												</div>
												<div>
													Win Rate: <span className={styles.statWinRate}>{player.winRate}</span>
												</div>
												<div className={styles.playerStreak}>
													Streak: <span className={styles.statStreak}>{player.streak}</span>
													{player.streak > 0 && '🔥'}
												</div>
											</div>
										</div>

										<button
											className={`${styles.button} ${styles.primaryButton} ${styles.viewProfileButton}`}
											onClick={() => handleOpenProfile(player)}
										>
											<span className={styles.buttonHighlight}></span>
											<span className={styles.buttonText}>View Profile</span>
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</main>

				<div className={styles.loadMoreContainer}>
					<button className={`${styles.button} ${styles.tertiaryButton}`} onClick={handleLoadMore}>
						<span className={styles.buttonHighlight}></span>
						<span className={styles.buttonText}>Load More</span>
					</button>
				</div>
			</div>

			{/* Player profile modal */}
			{showPlayerCard && selectedPlayer && (
				<div className={styles.modal} onClick={handleCloseProfile}>
					<div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
						<div className={styles.modalHeader}>
							<img src={selectedPlayer.avatar} alt={selectedPlayer.name} className={styles.modalAvatar} />
							<div>
								<h3 className={styles.modalPlayerName}>{selectedPlayer.name}</h3>
								<div className={styles.modalOnlineStatus}>
									<div className={`${styles.modalOnlineDot} ${selectedPlayer.isOnline ? styles.online : styles.offline}`}></div>
									<span className={styles.modalOnlineText}>{selectedPlayer.isOnline ? 'Online' : 'Offline'}</span>
								</div>
							</div>
						</div>

						<div className={styles.modalStats}>
							<div className={styles.modalStatCard}>
								<div className={styles.modalStatLabel}>Rating</div>
								<div className={`${styles.modalStatValue} ${styles.statRating}`}>{selectedPlayer.rating}</div>
							</div>

							<div className={styles.modalStatCard}>
								<div className={styles.modalStatLabel}>Win Rate</div>
								<div className={`${styles.modalStatValue} ${styles.statWinRate}`}>{selectedPlayer.winRate}</div>
							</div>
						</div>

						<div className={styles.modalActions}>
							<button className={`${styles.button} ${styles.primaryButton} ${styles.modalActionButton}`}>
								<span className={styles.buttonHighlight}></span>
								<span className={styles.buttonText}>Challenge</span>
							</button>

							<button className={`${styles.button} ${styles.secondaryButton} ${styles.modalActionButton}`}>
								<span className={styles.buttonHighlight}></span>
								<span className={styles.buttonText}>Add Friend</span>
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Leaderboard;
