import React, { useState } from 'react';
import styles from './Profile.module.css';

// Types for profile data
interface PlayerRank {
	current: string;
	peak: string;
	icon: string;
}

interface PlayerStats {
	wins: number;
	losses: number;
	winRate: string;
	streak: number;
	bestStreak: number;
	gamesPlayed: number;
}

interface SeasonStats {
	wins: number;
	rank: number;
	percentile: string;
}

interface Collection {
	total: number;
	completion: string;
	legendary: number;
	epic: number;
	rare: number;
	common: number;
}

interface Achievement {
	id: number;
	name: string;
	desc: string;
	progress?: number;
	total?: number;
	completed?: boolean;
	icon: string;
}

interface Match {
	result: 'win' | 'loss';
	opponent: string;
	deck: string;
	rating: string;
	time: string;
}

interface FavoriteDeck {
	name: string;
	wins: number;
	winRate: string;
	cover: string;
}

interface PlayerData {
	name: string;
	title: string;
	avatar: string;
	level: number;
	exp: number;
	nextLevel: number;
	rank: PlayerRank;
	stats: PlayerStats;
	seasonStats: SeasonStats;
	collection: Collection;
	achievements: Achievement[];
	recentMatches: Match[];
	favoriteDecks: FavoriteDeck[];
}

const Profile: React.FC = () => {
	// State for active tab
	const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'decks' | 'collection' | 'achievements'>('overview');

	// Mock player data (in a real application, this would come from an API)
	const playerData: PlayerData = {
		name: 'DragonMaster',
		title: 'Legend of the Arena',
		avatar: 'https://placehold.co/120x120',
		level: 42,
		exp: 7500,
		nextLevel: 10000,
		rank: {
			current: 'Diamond II',
			peak: 'Master',
			icon: 'https://placehold.co/32x32',
		},
		stats: {
			wins: 286,
			losses: 124,
			winRate: '69.8%',
			streak: 7,
			bestStreak: 12,
			gamesPlayed: 410,
		},
		seasonStats: {
			wins: 86,
			rank: 1337,
			percentile: 'Top 5%',
		},
		collection: {
			total: 850,
			completion: '72%',
			legendary: 24,
			epic: 86,
			rare: 240,
			common: 500,
		},
		achievements: [
			{
				id: 1,
				name: 'Dragon Tamer',
				desc: 'Win 100 games with Dragon-type cards',
				progress: 82,
				total: 100,
				icon: 'https://placehold.co/40x40',
			},
			{
				id: 2,
				name: 'Perfect Victory',
				desc: 'Win a game without taking damage',
				completed: true,
				icon: 'https://placehold.co/40x40',
			},
		],
		recentMatches: [
			{
				result: 'win',
				opponent: 'SpellWeaver',
				deck: 'Dragon Control',
				rating: '+25',
				time: '2h ago',
			},
			{
				result: 'win',
				opponent: 'ShadowLord',
				deck: 'Dragon Control',
				rating: '+22',
				time: '3h ago',
			},
			{
				result: 'loss',
				opponent: 'MysticKnight',
				deck: 'Dragon Control',
				rating: '-18',
				time: '5h ago',
			},
		],
		favoriteDecks: [
			{
				name: 'Dragon Control',
				wins: 156,
				winRate: '72%',
				cover: 'https://placehold.co/300x400',
			},
			{
				name: 'Aggro Knights',
				wins: 89,
				winRate: '65%',
				cover: 'https://placehold.co/300x400',
			},
		],
	};

	// Tab button class generator
	const getTabClass = (tab: string) => {
		return `${styles.tabButton} ${activeTab === tab ? styles.tabButtonActive : ''}`;
	};

	return (
		<div className={styles.container}>
			{/* Background elements */}
			<div className={styles.backgroundImage}></div>
			<div className={styles.backgroundGradient}></div>

			{/* Main content */}
			<div className={styles.content}>
				<div className={styles.layout}>
					{/* Sidebar */}
					<div className={styles.sidebar}>
						{/* Profile Card */}
						<div className={styles.profileCard}>
							<div className={styles.avatarContainer}>
								<div className={styles.avatarWrapper}>
									<div className={styles.avatarBorder}></div>
									<img src={playerData.avatar} alt={playerData.name} className={styles.avatar} />
								</div>
								<h1 className={styles.playerName}>{playerData.name}</h1>
								<div className={styles.playerTitle}>{playerData.title}</div>
								<div className={styles.rankBadge}>
									<img src={playerData.rank.icon} alt="Rank" className={styles.rankIcon} />
									<span>{playerData.rank.current}</span>
								</div>
							</div>

							<div className={styles.progressSection}>
								<div className={styles.progressHeader}>
									<span className={styles.progressLabel}>Level {playerData.level}</span>
									<span className={styles.expValue}>
										{playerData.exp} / {playerData.nextLevel}
									</span>
								</div>
								<div className={styles.progressBar}>
									<div className={styles.progressFill} style={{ width: `${(playerData.exp / playerData.nextLevel) * 100}%` }}></div>
								</div>
							</div>
						</div>

						{/* Season Stats Card */}
						<div className={styles.statsCard}>
							<h2 className={styles.cardTitle}>Season Stats</h2>
							<div className={styles.statsList}>
								<div className={styles.statItem}>
									<span>Rank</span>
									<span className={`${styles.statValue} ${styles.valueRank}`}>#{playerData.seasonStats.rank}</span>
								</div>
								<div className={styles.statItem}>
									<span>Wins</span>
									<span className={`${styles.statValue} ${styles.valueWins}`}>{playerData.seasonStats.wins}</span>
								</div>
								<div className={styles.statItem}>
									<span>Percentile</span>
									<span className={`${styles.statValue} ${styles.valuePercentile}`}>{playerData.seasonStats.percentile}</span>
								</div>
							</div>
						</div>
					</div>

					{/* Main Content */}
					<div className={styles.mainContent}>
						{/* Tabs */}
						<div className={styles.tabsContainer}>
							<button className={getTabClass('overview')} onClick={() => setActiveTab('overview')}>
								Overview
							</button>
							<button className={getTabClass('matches')} onClick={() => setActiveTab('matches')}>
								Match History
							</button>
							<button className={getTabClass('decks')} onClick={() => setActiveTab('decks')}>
								Decks
							</button>
							<button className={getTabClass('collection')} onClick={() => setActiveTab('collection')}>
								Collection
							</button>
							<button className={getTabClass('achievements')} onClick={() => setActiveTab('achievements')}>
								Achievements
							</button>
						</div>

						{/* Tab Content */}
						{activeTab === 'overview' && (
							<div>
								{/* Stats Overview */}
								<div className={styles.statsGrid}>
									<div className={styles.statBox}>
										<div className={styles.statBoxLabel}>Total Games</div>
										<div className={styles.statBoxValue}>{playerData.stats.gamesPlayed}</div>
									</div>
									<div className={styles.statBox}>
										<div className={styles.statBoxLabel}>Win Rate</div>
										<div className={`${styles.statBoxValue} ${styles.valueGreen}`}>{playerData.stats.winRate}</div>
									</div>
									<div className={styles.statBox}>
										<div className={styles.statBoxLabel}>Current Streak</div>
										<div className={`${styles.statBoxValue} ${styles.valueYellow}`}>{playerData.stats.streak}🔥</div>
									</div>
									<div className={styles.statBox}>
										<div className={styles.statBoxLabel}>Peak Rank</div>
										<div className={`${styles.statBoxValue} ${styles.valuePurple}`}>{playerData.rank.peak}</div>
									</div>
								</div>

								{/* Recent Matches */}
								<div className={styles.matchesCard}>
									<h2 className={styles.cardTitle}>Recent Matches</h2>
									<div className={styles.matchesList}>
										{playerData.recentMatches.map((match, index) => (
											<div key={index} className={`${styles.matchItem} ${match.result === 'win' ? styles.matchWin : styles.matchLoss}`}>
												<div className={styles.matchResult}>
													<span className={match.result === 'win' ? styles.resultWin : styles.resultLoss}>{match.result}</span>
												</div>
												<div className={styles.matchInfo}>
													<div className={styles.opponentName}>{match.opponent}</div>
													<div className={styles.deckName}>{match.deck}</div>
												</div>
												<div className={styles.matchStats}>
													<div className={match.result === 'win' ? styles.resultWin : styles.resultLoss}>{match.rating}</div>
													<div className={styles.matchTime}>{match.time}</div>
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Favorite Decks */}
								<div className={styles.matchesCard}>
									<h2 className={styles.cardTitle}>Favorite Decks</h2>
									<div className={styles.decksGrid}>
										{playerData.favoriteDecks.map((deck, index) => (
											<div key={index} className={styles.deckCard}>
												<div className={styles.deckBorder}></div>
												<div className={styles.deckContent}>
													<img src={deck.cover} alt={deck.name} className={styles.deckImage} />
													<div className={styles.deckFooter}>
														<div className={styles.deckStats}>
															<div>{deck.name}</div>
															<div className={styles.deckWinRate}>{deck.winRate}</div>
														</div>
														<div className={styles.deckWins}>{deck.wins} wins</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						)}

						{/* Achievements Tab */}
						{activeTab === 'achievements' && (
							<div className={styles.achievementsCard}>
								<div className={styles.achievementsList}>
									{playerData.achievements.map((achievement) => (
										<div key={achievement.id} className={styles.achievementItem}>
											<div className={styles.achievementHeader}>
												<img src={achievement.icon} alt={achievement.name} className={styles.achievementIcon} />
												<div className={styles.achievementContent}>
													<div className={styles.achievementTitleRow}>
														<h3>{achievement.name}</h3>
														{achievement.completed && <div className={styles.achievementComplete}>✓ Complete</div>}
													</div>
													<p className={styles.achievementDesc}>{achievement.desc}</p>
													{!achievement.completed && achievement.progress && achievement.total && (
														<div className={styles.achievementProgress}>
															<div className={styles.achievementProgressBar}>
																<div
																	className={styles.achievementProgressFill}
																	style={{
																		width: `${(achievement.progress / achievement.total) * 100}%`,
																	}}
																></div>
															</div>
															<div className={styles.achievementProgressText}>
																<span>
																	{achievement.progress}/{achievement.total}
																</span>
																<span>{Math.round((achievement.progress / achievement.total) * 100)}%</span>
															</div>
														</div>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Collection Tab */}
						{activeTab === 'collection' && (
							<div className={styles.matchesCard}>
								<h2 className={styles.cardTitle}>Card Collection</h2>

								<div className={styles.statsGrid}>
									<div className={styles.statBox}>
										<div className={styles.statBoxLabel}>Total Cards</div>
										<div className={styles.statBoxValue}>{playerData.collection.total}</div>
									</div>
									<div className={styles.statBox}>
										<div className={styles.statBoxLabel}>Completion</div>
										<div className={`${styles.statBoxValue} ${styles.valueGreen}`}>{playerData.collection.completion}</div>
									</div>
								</div>

								<h3 className={styles.cardTitle} style={{ marginTop: '1.5rem' }}>
									Rarity Breakdown
								</h3>
								<div className={styles.collectionGrid}>
									<div className={styles.rarityBox}>
										<span>Legendary</span>
										<span className={styles.rarityLegendary}>{playerData.collection.legendary}</span>
									</div>
									<div className={styles.rarityBox}>
										<span>Epic</span>
										<span className={styles.rarityEpic}>{playerData.collection.epic}</span>
									</div>
									<div className={styles.rarityBox}>
										<span>Rare</span>
										<span className={styles.rarityRare}>{playerData.collection.rare}</span>
									</div>
									<div className={styles.rarityBox}>
										<span>Common</span>
										<span className={styles.rarityCommon}>{playerData.collection.common}</span>
									</div>
								</div>
							</div>
						)}

						{/* Decks Tab */}
						{activeTab === 'decks' && (
							<div className={styles.matchesCard}>
								<h2 className={styles.cardTitle}>My Decks</h2>
								<div className={styles.decksGrid}>
									{playerData.favoriteDecks.map((deck, index) => (
										<div key={index} className={styles.deckCard}>
											<div className={styles.deckBorder}></div>
											<div className={styles.deckContent}>
												<img src={deck.cover} alt={deck.name} className={styles.deckImage} />
												<div className={styles.deckFooter}>
													<div className={styles.deckStats}>
														<div>{deck.name}</div>
														<div className={styles.deckWinRate}>{deck.winRate}</div>
													</div>
													<div className={styles.deckWins}>{deck.wins} wins</div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Match History Tab */}
						{activeTab === 'matches' && (
							<div className={styles.matchesCard}>
								<h2 className={styles.cardTitle}>Match History</h2>
								<div className={styles.matchesList}>
									{[...playerData.recentMatches, ...playerData.recentMatches].map((match, index) => (
										<div key={index} className={`${styles.matchItem} ${match.result === 'win' ? styles.matchWin : styles.matchLoss}`}>
											<div className={styles.matchResult}>
												<span className={match.result === 'win' ? styles.resultWin : styles.resultLoss}>{match.result}</span>
											</div>
											<div className={styles.matchInfo}>
												<div className={styles.opponentName}>{match.opponent}</div>
												<div className={styles.deckName}>{match.deck}</div>
											</div>
											<div className={styles.matchStats}>
												<div className={match.result === 'win' ? styles.resultWin : styles.resultLoss}>{match.rating}</div>
												<div className={styles.matchTime}>{match.time}</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
