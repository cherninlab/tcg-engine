import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../router';
import styles from './Home.module.css';

interface DailyRewards {
	current: number;
	claimed: boolean;
}

interface LastDeck {
	name: string;
	cover: string;
	cards: number;
}

interface Event {
	type: string;
	name: string;
	timeLeft: string;
	status: string;
}

const Home: React.FC = () => {
	// State for daily rewards
	const [dailyRewards, setDailyRewards] = useState<DailyRewards>({
		current: 3,
		claimed: false,
	});

	// State for last deck
	const [lastDeck, setLastDeck] = useState<LastDeck>({
		name: 'Dragon Control',
		cover: 'https://placehold.co/400x600',
		cards: 40,
	});

	// State for active events
	const [activeEvents, setActiveEvents] = useState<Event[]>([
		{
			type: 'LIMITED EVENT',
			name: 'Crystal Tournament',
			timeLeft: '2d 14h',
			status: '3 matches played',
		},
		{
			type: 'WEEKLY EVENT',
			name: 'Element Masters',
			timeLeft: '4d 8h',
			status: 'Not started',
		},
	]);

	// Handle claiming rewards
	const handleClaimReward = () => {
		setDailyRewards({
			...dailyRewards,
			claimed: true,
		});
	};

	return (
		<main className={styles.homeContainer}>
			<div className={styles.contentGrid}>
				{/* Left Column */}
				<div className={styles.leftColumn}>
					{/* Featured Card */}
					<div className={styles.featuredCard}>
						<img src="https://placehold.co/1200x400" className={styles.featuredCardImage} alt="Featured Card" />
						<div className={styles.featuredGradient}></div>
						<div className={styles.featuredContent}>
							<div className={styles.featuredContentFlex}>
								<div>
									<h1 className={styles.featuredTitle}>Dragon's Ascent</h1>
									<p className={styles.featuredSubtitle}>Season 8 Now Live</p>
								</div>
								<button className={styles.battlePassButton}>
									<span className={styles.buttonHighlight}></span>
									<span className={styles.buttonText}>BATTLE PASS</span>
								</button>
							</div>
						</div>
					</div>

					{/* Game Modes */}
					<div className={styles.gameModesGrid}>
						{/* Ranked Duel */}
						<button className={styles.gameModeCard}>
							<div className={styles.primaryGradient}></div>
							<div className={styles.gameModeHeader}>
								<img src="https://placehold.co/48x48" alt="Ranked" className={styles.gameModeIcon} />
								<div className={styles.gameModeInfo}>
									<h2 className={styles.gameModeTitle}>Ranked Duel</h2>
									<div className={styles.rankInfo}>
										<span className={styles.rankText}>Platinum II</span>
										<span className={styles.separator}>•</span>
										<span className={styles.lpText}>2150/2400 LP</span>
									</div>
								</div>
							</div>
							<div className={styles.progressBar}>
								<div className={styles.progressFill} style={{ width: '75%' }}></div>
							</div>
							<span className={styles.progressText}>Win 2 more duels to rank up</span>
						</button>

						{/* Quick Duel */}
						<button className={styles.gameModeCard}>
							<div className={styles.secondaryGradient}></div>
							<div className={styles.gameModeHeader}>
								<img src="https://placehold.co/48x48" alt="Quick" className={styles.gameModeIcon} />
								<div className={styles.gameModeInfo}>
									<h2 className={styles.gameModeTitle}>Quick Duel</h2>
									<div className={styles.casualText}>Casual matches</div>
								</div>
							</div>
						</button>

						{/* Combat Simulator */}
						<Link to={routes.app.game.battlefield} className={styles.gameModeCardLink}>
							<div className={styles.gameModeCard}>
								<div className={styles.primaryGradient}></div>
								<div className={styles.gameModeHeader}>
									<img src="https://placehold.co/48x48" alt="Combat" className={styles.gameModeIcon} />
									<div className={styles.gameModeInfo}>
										<h2 className={styles.gameModeTitle}>Combat Simulator</h2>
										<div className={styles.casualText}>Practice your skills</div>
									</div>
								</div>
							</div>
						</Link>

						{/* Card Packs */}
						<Link to={routes.app.cardPacks} className={styles.gameModeCardLink}>
							<div className={styles.gameModeCard}>
								<div className={styles.secondaryGradient}></div>
								<div className={styles.gameModeHeader}>
									<img src="https://placehold.co/48x48" alt="Card Packs" className={styles.gameModeIcon} />
									<div className={styles.gameModeInfo}>
										<h2 className={styles.gameModeTitle}>Card Packs</h2>
										<div className={styles.casualText}>Open packs and collect cards</div>
									</div>
								</div>
							</div>
						</Link>

						{/* Leaderboard */}
						<Link to={routes.app.leaderboard} className={styles.gameModeCardLink}>
							<div className={styles.gameModeCard}>
								<div className={styles.secondaryGradient}></div>
								<div className={styles.gameModeHeader}>
									<img src="https://placehold.co/48x48" alt="Leaderboard" className={styles.gameModeIcon} />
									<div className={styles.gameModeInfo}>
										<h2 className={styles.gameModeTitle}>Leaderboards</h2>
										<div className={styles.casualText}>Top players ranking</div>
									</div>
								</div>
							</div>
						</Link>

						{/* Deck Builder */}
						<Link to={routes.app.game.deck} className={styles.gameModeCardLink}>
							<div className={styles.gameModeCard}>
								<div className={styles.tertiaryGradient}></div>
								<div className={styles.gameModeHeader}>
									<img src="https://placehold.co/48x48" alt="Deck" className={styles.gameModeIcon} />
									<div className={styles.gameModeInfo}>
										<h2 className={styles.gameModeTitle}>Deck Builder</h2>
										<div className={styles.casualText}>Create and edit decks</div>
									</div>
								</div>
							</div>
						</Link>

						{/* Profile */}
						<Link to={routes.app.profile.view} className={styles.gameModeCardLink}>
							<div className={styles.gameModeCard}>
								<div className={styles.tertiaryGradient}></div>
								<div className={styles.gameModeHeader}>
									<img src="https://placehold.co/48x48" alt="Profile" className={styles.gameModeIcon} />
									<div className={styles.gameModeInfo}>
										<h2 className={styles.gameModeTitle}>Profile</h2>
										<div className={styles.casualText}>View stats and achievements</div>
									</div>
								</div>
							</div>
						</Link>

						{/* Shop */}
						<Link to={routes.app.shop} className={styles.gameModeCardLink}>
							<div className={styles.gameModeCard}>
								<div className={styles.secondaryGradient}></div>
								<div className={styles.gameModeHeader}>
									<img src="https://placehold.co/48x48" alt="Shop" className={styles.gameModeIcon} />
									<div className={styles.gameModeInfo}>
										<h2 className={styles.gameModeTitle}>Shop</h2>
										<div className={styles.casualText}>Purchase packs and deals</div>
									</div>
								</div>
							</div>
						</Link>

						{/* Achievements */}
						<Link to={routes.app.achievements} className={styles.gameModeCardLink}>
							<div className={styles.gameModeCard}>
								<div className={styles.tertiaryGradient}></div>
								<div className={styles.gameModeHeader}>
									<img src="https://placehold.co/48x48" alt="Achievements" className={styles.gameModeIcon} />
									<div className={styles.gameModeInfo}>
										<h2 className={styles.gameModeTitle}>Achievements</h2>
										<div className={styles.casualText}>Complete quests and earn rewards</div>
									</div>
								</div>
							</div>
						</Link>

						{/* Friends */}
						<Link to={routes.app.friends} className={styles.gameModeCardLink}>
							<div className={styles.gameModeCard}>
								<div className={styles.primaryGradient}></div>
								<div className={styles.gameModeHeader}>
									<img src="https://placehold.co/48x48" alt="Friends" className={styles.gameModeIcon} />
									<div className={styles.gameModeInfo}>
										<h2 className={styles.gameModeTitle}>Friends</h2>
										<div className={styles.casualText}>Connect and play with friends</div>
									</div>
								</div>
							</div>
						</Link>
					</div>

					{/* Events */}
					<div className={styles.gameModesGrid}>
						{activeEvents.map((event, index) => (
							<div key={index} className={styles.gameModeCard}>
								<div className={styles.gameModeHeader}>
									<div>
										<div className={styles.rankText}>{event.type}</div>
										<h3 className={styles.gameModeTitle}>{event.name}</h3>
									</div>
									<div
										style={{
											background: '#1A1E2A',
											borderRadius: '9999px',
											padding: '4px 12px',
											fontSize: '14px',
										}}
									>
										{event.timeLeft}
									</div>
								</div>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<span className={styles.lpText}>{event.status}</span>
									<button
										style={{
											padding: '8px 16px',
											borderRadius: '4px',
											background: '#3A424F',
											fontSize: '14px',
											border: 'none',
											color: 'white',
											cursor: 'pointer',
										}}
									>
										View
									</button>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Right Column */}
				<div className={styles.rightColumn}>
					{/* Daily Rewards */}
					<div className={styles.rewardsCard}>
						<h2 className={styles.rewardsTitle}>Daily Rewards</h2>
						<div className={styles.rewardsGrid}>
							{Array.from({ length: 7 }, (_, i) => (
								<div key={i} className={styles.rewardItem}>
									<div className={`${styles.rewardBox} ${i < dailyRewards.current ? styles.active : ''}`}>
										<img
											src="https://placehold.co/32x32"
											className={`${styles.rewardIcon} ${i < dailyRewards.current ? styles.active : ''}`}
											alt={`Day ${i + 1} reward`}
										/>
									</div>
								</div>
							))}
						</div>
						{!dailyRewards.claimed && (
							<button className={styles.claimButton} onClick={handleClaimReward}>
								<span className={styles.buttonHighlight}></span>
								<span className={styles.buttonText}>Claim Reward</span>
							</button>
						)}
					</div>

					{/* Last Deck */}
					<div className={styles.deckCard}>
						<div className={styles.deckHeader}>
							<h2 className={styles.deckTitle}>Last Deck</h2>
							<Link to={routes.app.game.deck}>
								<button className={styles.editButton}>Edit</button>
							</Link>
						</div>
						<div className={styles.deckPreview}>
							<Link to={routes.app.game.deck}>
								<img src={lastDeck.cover} className={styles.deckImage} alt="Deck Cover" />
								<div className={styles.deckGradient}></div>
								<div className={styles.deckInfo}>
									<div className={styles.deckInfoFlex}>
										<span className={styles.deckName}>{lastDeck.name}</span>
										<span className={styles.deckCount}>{lastDeck.cards} cards</span>
									</div>
								</div>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Home;
