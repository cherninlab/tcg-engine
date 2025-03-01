import React, { useState } from 'react';
import styles from './Achievements.module.css';

// Types
interface QuestReward {
	type: 'coins' | 'gems' | 'pack';
	amount: number;
}

interface Quest {
	id: number;
	name: string;
	progress: number;
	total: number;
	reward: QuestReward;
	timeLeft: string;
	completed: boolean;
}

interface AchievementReward {
	type: 'card-back' | 'title' | 'emote' | 'avatar' | 'card-style';
	name: string;
}

interface Achievement {
	id: number;
	name: string;
	desc: string;
	progress?: number;
	total?: number;
	reward: AchievementReward;
	points: number;
	completed: boolean;
}

interface QuestsData {
	daily: Quest[];
	weekly: Quest[];
}

interface AchievementsData {
	combat: Achievement[];
	collection: Achievement[];
	mastery: Achievement[];
}

// Component for reward modal
interface RewardModalProps {
	show: boolean;
	onClose: () => void;
	reward?: QuestReward;
}

const RewardModal: React.FC<RewardModalProps> = ({ show, onClose, reward }) => {
	if (!show || !reward) return null;

	return (
		<div className={styles.modalOverlay} onClick={onClose}>
			<div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
				<img src="https://placehold.co/120x120" alt="Reward" className={styles.rewardImage} />
				<h3 className={styles.modalTitle}>Quest Complete!</h3>
				<p className={styles.modalSubtitle}>You earned:</p>
				<div className={styles.modalReward}>
					<img src="https://placehold.co/32x32" alt={reward.type} className={styles.modalRewardIcon} />
					<span className={styles.modalRewardValue}>{reward.amount}</span>
				</div>
				<button className={styles.claimButton} onClick={onClose}>
					<span className={styles.buttonHighlight}></span>
					<span className={styles.buttonText}>Claim</span>
				</button>
			</div>
		</div>
	);
};

// Quest item component
interface QuestItemProps {
	quest: Quest;
	onClaim: (quest: Quest) => void;
}

const QuestItem: React.FC<QuestItemProps> = ({ quest, onClaim }) => {
	const progressPercent = (quest.progress / quest.total) * 100;

	return (
		<div className={styles.questCard}>
			{quest.completed && <div className={styles.questCompleted}></div>}
			<div className={styles.questCardContent}>
				<div className={styles.questHeader}>
					<h3 className={styles.questTitle}>{quest.name}</h3>
					<div className={styles.questTimeLeft}>{quest.timeLeft}</div>
				</div>
				<div className={styles.progressBar}>
					<div className={styles.progressFill} style={{ width: `${progressPercent}%` }}></div>
				</div>
				<div className={styles.progressStats}>
					<div className={styles.progressText}>
						{quest.progress}/{quest.total}
					</div>
					<div className={styles.rewardContainer}>
						<img src="https://placehold.co/24x24" alt={quest.reward.type} className={styles.rewardIcon} />
						<span className={quest.reward.type === 'coins' ? styles.coinsReward : styles.gemsReward}>{quest.reward.amount}</span>
					</div>
				</div>
				{quest.completed && (
					<button className={styles.claimButton} onClick={() => onClaim(quest)} style={{ marginTop: '1rem' }}>
						<span className={styles.buttonHighlight}></span>
						<span className={styles.buttonText}>Claim</span>
					</button>
				)}
			</div>
		</div>
	);
};

// Achievement item component
interface AchievementItemProps {
	achievement: Achievement;
	onClick: (achievement: Achievement) => void;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement, onClick }) => {
	return (
		<div
			className={`${styles.achievementItem} ${achievement.completed ? styles.achievementCompleted : ''}`}
			onClick={() => onClick(achievement)}
		>
			<div className={styles.achievementBorder}></div>
			<div className={styles.achievementContent}>
				<div className={styles.achievementIconContainer}>
					<div className={styles.achievementIcon}>✨</div>
					<div className={styles.achievementInfo}>
						<div className={styles.achievementHeader}>
							<h3 className={styles.achievementName}>{achievement.name}</h3>
							<div className={styles.achievementPoints}>{achievement.points} pts</div>
						</div>
						<p className={styles.achievementDesc}>{achievement.desc}</p>

						{!achievement.completed && achievement.progress !== undefined && (
							<div className={styles.achievementProgressContainer}>
								<div className={styles.achievementProgressBar}>
									<div
										className={styles.achievementProgressFill}
										style={{ width: `${(achievement.progress / achievement.total!) * 100}%` }}
									></div>
								</div>
								<div className={styles.achievementProgressText}>
									{achievement.progress}/{achievement.total}
								</div>
							</div>
						)}

						{achievement.completed && (
							<div className={styles.achievementCompletedText}>
								<span>✓</span>
								<span>Completed</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

// Main Achievements component
const Achievements: React.FC = () => {
	// Tab state
	const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

	// Selected achievement state
	const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

	// Reward modal state
	const [showRewardModal, setShowRewardModal] = useState(false);
	const [currentReward, setCurrentReward] = useState<QuestReward | undefined>(undefined);

	// Mock data
	const [quests] = useState<QuestsData>({
		daily: [
			{
				id: 1,
				name: 'Win 3 Battles',
				progress: 2,
				total: 3,
				reward: { type: 'coins', amount: 500 },
				timeLeft: '5h 23m',
				completed: false,
			},
			{
				id: 2,
				name: 'Play 5 Dragon Cards',
				progress: 5,
				total: 5,
				reward: { type: 'gems', amount: 50 },
				timeLeft: '5h 23m',
				completed: true,
			},
			{
				id: 3,
				name: 'Cast 10 Spells',
				progress: 4,
				total: 10,
				reward: { type: 'pack', amount: 1 },
				timeLeft: '5h 23m',
				completed: false,
			},
		],
		weekly: [
			{
				id: 4,
				name: 'Win 20 Ranked Games',
				progress: 12,
				total: 20,
				reward: { type: 'gems', amount: 200 },
				timeLeft: '3d 12h',
				completed: false,
			},
			{
				id: 5,
				name: 'Deal 50000 Damage',
				progress: 35000,
				total: 50000,
				reward: { type: 'gems', amount: 200 },
				timeLeft: '3d 12h',
				completed: false,
			},
		],
	});

	const [achievements] = useState<AchievementsData>({
		combat: [
			{
				id: 1,
				name: 'Dragon Master',
				desc: 'Win 100 games with Dragon-type cards',
				progress: 82,
				total: 100,
				reward: { type: 'card-back', name: 'Dragon Scale' },
				points: 50,
				completed: false,
			},
			{
				id: 2,
				name: 'Perfect Victory',
				desc: 'Win a game without taking damage',
				reward: { type: 'title', name: 'The Untouchable' },
				points: 100,
				completed: true,
			},
			{
				id: 3,
				name: 'Combo King',
				desc: 'Play 6 cards in one turn',
				reward: { type: 'emote', name: 'Mind Blown' },
				points: 25,
				completed: true,
			},
		],
		collection: [
			{
				id: 4,
				name: 'Card Collector',
				desc: 'Collect 500 unique cards',
				progress: 423,
				total: 500,
				reward: { type: 'avatar', name: 'Master Collector' },
				points: 75,
				completed: false,
			},
		],
		mastery: [
			{
				id: 5,
				name: 'Legend in the Making',
				desc: 'Reach Master Rank',
				reward: { type: 'card-style', name: 'Golden Aura' },
				points: 150,
				completed: false,
			},
		],
	});

	// Total points and next reward
	const [totalPoints] = useState(275);
	const [nextReward] = useState(300);

	// Handle showing the reward modal
	const handleClaimReward = (quest: Quest) => {
		setCurrentReward(quest.reward);
		setShowRewardModal(true);
	};

	// Handle achievement click
	const handleAchievementClick = (achievement: Achievement) => {
		setSelectedAchievement(achievement);
		// Could show a modal with more details or effects
	};

	return (
		<div className={styles.container}>
			{/* Background elements */}
			<div className={styles.backgroundImage}></div>
			<div className={styles.backgroundGradient}></div>

			{/* Main content */}
			<div className={styles.content}>
				{/* Header */}
				<div className={styles.header}>
					<h1 className={styles.pageTitle}>Quests & Achievements</h1>
					<div className={styles.pointsContainer}>
						<div className={styles.pointsLabel}>Achievement Points</div>
						<div className={styles.pointsValue}>
							<span className={styles.points}>{totalPoints}</span>
							<div className={styles.nextReward}>Next reward: {nextReward}</div>
						</div>
					</div>
				</div>

				{/* Main grid */}
				<div className={styles.mainGrid}>
					{/* Left column - Quests and Achievements */}
					<div>
						{/* Quests card */}
						<div className={styles.card}>
							<div className={styles.tabsContainer}>
								<button
									className={`${styles.tabButton} ${activeTab === 'daily' ? styles.questTab : ''}`}
									onClick={() => setActiveTab('daily')}
								>
									Daily Quests
								</button>
								<button
									className={`${styles.tabButton} ${activeTab === 'weekly' ? styles.weeklyTab : ''}`}
									onClick={() => setActiveTab('weekly')}
								>
									Weekly Quests
								</button>
							</div>

							<div className={styles.questsList}>
								{quests[activeTab].map((quest) => (
									<QuestItem key={quest.id} quest={quest} onClaim={handleClaimReward} />
								))}
							</div>
						</div>

						{/* Achievements cards */}
						{Object.entries(achievements).map(([category, categoryAchievements]) => (
							<div key={category} className={styles.achievementCard}>
								<h2 className={styles.achievementTitle}>{category} Achievements</h2>
								<div className={styles.achievementsList}>
									{categoryAchievements.map((achievement) => (
										<AchievementItem key={achievement.id} achievement={achievement} onClick={handleAchievementClick} />
									))}
								</div>
							</div>
						))}
					</div>

					{/* Right column - Progress tracking */}
					<div>
						{/* Daily progress card */}
						<div className={styles.sidebarCard}>
							<h2 className={styles.sidebarTitle}>Daily Progress</h2>
							<div className={styles.dailyProgressContainer}>
								<div className={styles.progressHeader}>
									<div className={styles.progressLevel}>Level 5</div>
									<div className={styles.progressCount}>3/5 quests</div>
								</div>

								<div className={styles.dailyGrid}>
									{[...Array(5)].map((_, i) => (
										<div key={i} className={styles.dailyItem}>
											<div className={`${styles.dailyBox} ${i < 3 ? styles.dailyActive : ''}`}>
												<img
													src="https://placehold.co/32x32"
													alt="Quest icon"
													className={`${styles.dailyIcon} ${i < 3 ? styles.dailyActiveIcon : ''}`}
												/>
											</div>
										</div>
									))}
								</div>

								<button className={styles.claimButton}>
									<span className={styles.buttonHighlight}></span>
									<span className={styles.buttonText}>Claim Level Reward</span>
								</button>
							</div>
						</div>

						{/* Achievement progress card */}
						<div className={styles.sidebarCard}>
							<h2 className={styles.sidebarTitle}>Achievement Progress</h2>
							<div className={styles.achievementTrackingContainer}>
								<div className={styles.achievementTrackItem}>
									<div className={styles.achievementTrackHeader}>
										<span className={styles.achievementTrackName}>Combat Master</span>
										<span className={styles.achievementTrackProgress}>12/20</span>
									</div>
									<div className={styles.achievementTrackBar}>
										<div className={styles.achievementTrackFill} style={{ width: '60%' }}></div>
									</div>
								</div>

								<div className={styles.achievementTrackItem}>
									<div className={styles.achievementTrackHeader}>
										<span className={styles.achievementTrackName}>Card Collector</span>
										<span className={styles.achievementTrackProgress}>8/15</span>
									</div>
									<div className={styles.achievementTrackBar}>
										<div className={styles.achievementTrackFill} style={{ width: '53%' }}></div>
									</div>
								</div>

								<div className={styles.achievementTrackItem}>
									<div className={styles.achievementTrackHeader}>
										<span className={styles.achievementTrackName}>Master Duelist</span>
										<span className={styles.achievementTrackProgress}>5/10</span>
									</div>
									<div className={styles.achievementTrackBar}>
										<div className={styles.achievementTrackFill} style={{ width: '50%' }}></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Reward modal */}
			<RewardModal show={showRewardModal} onClose={() => setShowRewardModal(false)} reward={currentReward} />
		</div>
	);
};

export default Achievements;
