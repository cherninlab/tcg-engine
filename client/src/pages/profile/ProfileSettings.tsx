import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Profile.module.css';

interface SettingsForm {
	username: string;
	email: string;
	avatar: string;
	title: string;
	notifications: {
		matches: boolean;
		friends: boolean;
		rewards: boolean;
		events: boolean;
	};
}

const ProfileSettings: React.FC = () => {
	const [formState, setFormState] = useState<SettingsForm>({
		username: 'DragonMaster',
		email: 'player@example.com',
		avatar: 'https://placehold.co/120x120',
		title: 'Legend of the Arena',
		notifications: {
			matches: true,
			friends: true,
			rewards: true,
			events: false,
		},
	});

	const [activeSection, setActiveSection] = useState<'general' | 'notifications' | 'privacy'>('general');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;

		if (type === 'checkbox') {
			setFormState((prev) => ({
				...prev,
				notifications: {
					...prev.notifications,
					[name.split('.')[1]]: checked,
				},
			}));
		} else {
			setFormState((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// In a real app, this would send the data to an API
		console.log('Saving settings:', formState);
		alert('Settings saved!');
	};

	return (
		<div className={styles.container}>
			{/* Background elements */}
			<div className={styles.backgroundImage}></div>
			<div className={styles.backgroundGradient}></div>

			{/* Main content */}
			<div className={styles.content}>
				<div className={styles.layout}>
					{/* Sidebar with preview */}
					<div className={styles.sidebar}>
						<div className={styles.profileCard}>
							<div className={styles.avatarContainer}>
								<div className={styles.avatarWrapper}>
									<div className={styles.avatarBorder}></div>
									<img src={formState.avatar} alt={formState.username} className={styles.avatar} />
								</div>
								<h1 className={styles.playerName}>{formState.username}</h1>
								<div className={styles.playerTitle}>{formState.title}</div>
							</div>
						</div>

						<div className={styles.statsCard}>
							<h2 className={styles.cardTitle}>Preview</h2>
							<p style={{ opacity: 0.6, marginBottom: '1rem' }}>This is how your profile will appear to other players.</p>
							<Link to="/profile">
								<button
									style={{
										background: 'linear-gradient(to bottom, #69B7F9, #4086F8)',
										border: 'none',
										borderRadius: '6px',
										padding: '0.75rem 1rem',
										color: 'white',
										width: '100%',
										cursor: 'pointer',
									}}
								>
									View Profile
								</button>
							</Link>
						</div>
					</div>

					{/* Main Content */}
					<div className={styles.mainContent}>
						<h1 className={styles.cardTitle} style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
							Profile Settings
						</h1>

						{/* Tabs */}
						<div className={styles.tabsContainer} style={{ marginBottom: '2rem' }}>
							<button
								className={`${styles.tabButton} ${activeSection === 'general' ? styles.tabButtonActive : ''}`}
								onClick={() => setActiveSection('general')}
							>
								General
							</button>
							<button
								className={`${styles.tabButton} ${activeSection === 'notifications' ? styles.tabButtonActive : ''}`}
								onClick={() => setActiveSection('notifications')}
							>
								Notifications
							</button>
							<button
								className={`${styles.tabButton} ${activeSection === 'privacy' ? styles.tabButtonActive : ''}`}
								onClick={() => setActiveSection('privacy')}
							>
								Privacy
							</button>
						</div>

						{/* Settings Form */}
						<div className={styles.matchesCard} style={{ marginBottom: '1.5rem' }}>
							<form onSubmit={handleSubmit}>
								{activeSection === 'general' && (
									<div className={styles.statsList} style={{ gap: '1.5rem' }}>
										<div>
											<div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Username</div>
											<input
												type="text"
												name="username"
												value={formState.username}
												onChange={handleInputChange}
												style={{
													background: '#2A313B',
													border: '1px solid #3A424F',
													borderRadius: '6px',
													padding: '0.75rem 1rem',
													color: 'white',
													width: '100%',
												}}
											/>
										</div>
										<div>
											<div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Email</div>
											<input
												type="email"
												name="email"
												value={formState.email}
												onChange={handleInputChange}
												style={{
													background: '#2A313B',
													border: '1px solid #3A424F',
													borderRadius: '6px',
													padding: '0.75rem 1rem',
													color: 'white',
													width: '100%',
												}}
											/>
										</div>
										<div>
											<div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Avatar URL</div>
											<input
												type="text"
												name="avatar"
												value={formState.avatar}
												onChange={handleInputChange}
												style={{
													background: '#2A313B',
													border: '1px solid #3A424F',
													borderRadius: '6px',
													padding: '0.75rem 1rem',
													color: 'white',
													width: '100%',
												}}
											/>
										</div>
										<div>
											<div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>Title</div>
											<input
												type="text"
												name="title"
												value={formState.title}
												onChange={handleInputChange}
												style={{
													background: '#2A313B',
													border: '1px solid #3A424F',
													borderRadius: '6px',
													padding: '0.75rem 1rem',
													color: 'white',
													width: '100%',
												}}
											/>
										</div>
									</div>
								)}

								{activeSection === 'notifications' && (
									<div className={styles.statsList} style={{ gap: '1.5rem' }}>
										<h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Notification Settings</h3>

										<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
											<input
												type="checkbox"
												id="matches"
												name="notifications.matches"
												checked={formState.notifications.matches}
												onChange={handleInputChange}
												style={{ width: '20px', height: '20px' }}
											/>
											<label htmlFor="matches">Match Invitations and Results</label>
										</div>

										<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
											<input
												type="checkbox"
												id="friends"
												name="notifications.friends"
												checked={formState.notifications.friends}
												onChange={handleInputChange}
												style={{ width: '20px', height: '20px' }}
											/>
											<label htmlFor="friends">Friend Requests</label>
										</div>

										<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
											<input
												type="checkbox"
												id="rewards"
												name="notifications.rewards"
												checked={formState.notifications.rewards}
												onChange={handleInputChange}
												style={{ width: '20px', height: '20px' }}
											/>
											<label htmlFor="rewards">Daily Rewards and Gifts</label>
										</div>

										<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
											<input
												type="checkbox"
												id="events"
												name="notifications.events"
												checked={formState.notifications.events}
												onChange={handleInputChange}
												style={{ width: '20px', height: '20px' }}
											/>
											<label htmlFor="events">Events and Tournaments</label>
										</div>
									</div>
								)}

								{activeSection === 'privacy' && (
									<div className={styles.statsList} style={{ gap: '1.5rem' }}>
										<h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Privacy Settings</h3>
										<p style={{ opacity: 0.8 }}>
											Privacy settings control who can see your profile, send you match requests, and view your match history. These
											settings will be available in a future update.
										</p>
									</div>
								)}

								<div style={{ marginTop: '2rem' }}>
									<button
										type="submit"
										style={{
											background: 'linear-gradient(to bottom, #79DC69, #4DB140)',
											border: 'none',
											borderRadius: '6px',
											padding: '0.75rem 2rem',
											color: 'white',
											cursor: 'pointer',
											fontWeight: 'bold',
										}}
									>
										Save Changes
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileSettings;
