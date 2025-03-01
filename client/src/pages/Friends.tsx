import React, { useEffect, useRef, useState } from 'react';
import styles from './Friends.module.css';

// Types for friends data
interface Friend {
	id: number;
	name: string;
	rank: string;
	avatar: string;
	status: string;
	lastActive: string;
	favorite: boolean;
}

interface FriendRequest {
	id: number;
	name: string;
	rank: string;
	avatar: string;
	mutualFriends: number;
}

interface RecentMatch {
	id: number;
	opponent: string;
	result: 'win' | 'loss';
	deck: string;
	time: string;
}

interface Message {
	sender: string;
	text: string;
	time: string;
}

interface ChatData {
	messages: Message[];
	newMessage: string;
}

interface FriendsState {
	online: Friend[];
	offline: Friend[];
}

// Chat Modal Component
interface ChatModalProps {
	show: boolean;
	friend: Friend | null;
	chat: ChatData;
	onClose: () => void;
	onSendMessage: (message: string) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ show, friend, chat, onClose, onSendMessage }) => {
	const [message, setMessage] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Scroll to bottom of messages when new messages are added
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [chat.messages]);

	if (!show || !friend) return null;

	const handleSendMessage = () => {
		if (message.trim()) {
			onSendMessage(message);
			setMessage('');
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSendMessage();
		}
	};

	return (
		<div className={styles.chatModal}>
			<div className={styles.chatHeader}>
				<div className={styles.chatTitle}>{friend.name}</div>
				<button className={styles.closeChat} onClick={onClose}>
					×
				</button>
			</div>
			<div className={styles.chatMessages}>
				{chat.messages.map((msg, index) => (
					<div key={index} className={`${styles.messageItem} ${msg.sender === 'You' ? styles.myMessage : styles.friendMessage}`}>
						<div className={`${styles.messageBubble} ${msg.sender === 'You' ? styles.myMessageBubble : styles.friendMessageBubble}`}>
							{msg.text}
						</div>
						<div className={styles.messageInfo}>
							<span>{msg.sender}</span>
							<span>{msg.time}</span>
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>
			<div className={styles.chatInputContainer}>
				<input
					type="text"
					className={styles.chatInput}
					placeholder="Type a message..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyPress={handleKeyPress}
				/>
				<button className={styles.sendButton} onClick={handleSendMessage}>
					📤
				</button>
			</div>
		</div>
	);
};

// Friend Item Component
interface FriendItemProps {
	friend: Friend;
	onChatClick: (friend: Friend) => void;
}

const FriendItem: React.FC<FriendItemProps> = ({ friend, onChatClick }) => {
	return (
		<div className={styles.friendCard}>
			<div className={styles.friendBorder}></div>
			<div className={styles.friendContent}>
				<img src={friend.avatar} alt={friend.name} className={styles.avatar} />
				<div className={styles.friendInfo}>
					<div className={styles.nameRow}>
						<h3 className={styles.friendName}>{friend.name}</h3>
						{friend.favorite && <span className={styles.favoriteStar}>★</span>}
					</div>
					<div className={styles.statusRow}>
						<span className={styles.rankText}>{friend.rank}</span>
						<span className={styles.separator}></span>
						<span className={`${styles.statusText} ${friend.status === 'Online' ? styles.onlineStatus : ''}`}>{friend.status}</span>
					</div>
				</div>
				<div className={styles.actionButtons}>
					<button className={`${styles.actionButton} ${styles.chatButton}`} onClick={() => onChatClick(friend)}>
						<span className={styles.buttonHighlight}></span>
						<span className={styles.buttonText}>💬</span>
					</button>
					<button className={`${styles.actionButton} ${styles.duelButton}`}>
						<span className={styles.buttonHighlight}></span>
						<span className={styles.buttonText}>⚔️</span>
					</button>
					<button className={`${styles.actionButton} ${styles.profileButton}`}>
						<span className={styles.buttonHighlight}></span>
						<span className={styles.buttonText}>👁️</span>
					</button>
				</div>
			</div>
		</div>
	);
};

// Friend Request Item Component
interface FriendRequestItemProps {
	request: FriendRequest;
	onAccept: (id: number) => void;
	onDecline: (id: number) => void;
}

const FriendRequestItem: React.FC<FriendRequestItemProps> = ({ request, onAccept, onDecline }) => {
	return (
		<div className={styles.requestContent}>
			<img src={request.avatar} alt={request.name} className={styles.avatar} />
			<div className={styles.requestInfo}>
				<div className={styles.nameRow}>
					<h3 className={styles.friendName}>{request.name}</h3>
				</div>
				<div className={styles.statusRow}>
					<span className={styles.rankText}>{request.rank}</span>
					<span className={styles.separator}></span>
					<span className={styles.mutualFriends}>{request.mutualFriends} mutual friends</span>
				</div>
			</div>
			<div className={styles.actionButtons}>
				<button className={`${styles.requestButton} ${styles.acceptButton}`} onClick={() => onAccept(request.id)}>
					<span className={styles.buttonHighlight}></span>
					<span className={styles.buttonText}>Accept</span>
				</button>
				<button className={`${styles.requestButton} ${styles.declineButton}`} onClick={() => onDecline(request.id)}>
					<span className={styles.buttonHighlight}></span>
					<span className={styles.buttonText}>Decline</span>
				</button>
			</div>
		</div>
	);
};

// Match Item Component
interface MatchItemProps {
	match: RecentMatch;
}

const MatchItem: React.FC<MatchItemProps> = ({ match }) => {
	return (
		<div className={styles.matchCard}>
			<div className={`${styles.resultIcon} ${match.result === 'win' ? styles.winResult : styles.lossResult}`}>
				{match.result === 'win' ? 'W' : 'L'}
			</div>
			<div className={styles.matchInfo}>
				<div className={styles.opponentName}>vs {match.opponent}</div>
				<div className={styles.statusRow}>
					<span className={styles.deckName}>{match.deck}</span>
					<span className={styles.separator}></span>
					<span className={styles.matchTime}>{match.time}</span>
				</div>
			</div>
			<button className={`${styles.actionButton} ${styles.profileButton}`}>
				<span className={styles.buttonHighlight}></span>
				<span className={styles.buttonText}>👁️</span>
			</button>
		</div>
	);
};

// Main Friends Component
const Friends: React.FC = () => {
	// State
	const [activeTab, setActiveTab] = useState<'online' | 'offline' | 'requests'>('online');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
	const [showChat, setShowChat] = useState(false);

	// Mock data
	const [friends, setFriends] = useState<FriendsState>({
		online: [
			{
				id: 1,
				name: 'DragonMaster',
				rank: 'Platinum II',
				avatar: 'https://placehold.co/60x60',
				status: 'In Match',
				lastActive: 'now',
				favorite: true,
			},
			{
				id: 2,
				name: 'SpellWeaver',
				rank: 'Diamond III',
				avatar: 'https://placehold.co/60x60',
				status: 'In Shop',
				lastActive: 'now',
				favorite: false,
			},
		],
		offline: [
			{
				id: 3,
				name: 'ShadowLord',
				rank: 'Gold I',
				avatar: 'https://placehold.co/60x60',
				status: 'Last seen 2h ago',
				lastActive: '2h ago',
				favorite: true,
			},
		],
	});

	const [requests, setRequests] = useState<FriendRequest[]>([
		{
			id: 4,
			name: 'MysticKnight',
			rank: 'Platinum III',
			avatar: 'https://placehold.co/60x60',
			mutualFriends: 3,
		},
	]);

	const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([
		{
			id: 1,
			opponent: 'DragonMaster',
			result: 'win',
			deck: 'Dragon Control',
			time: '15m ago',
		},
		{
			id: 2,
			opponent: 'SpellWeaver',
			result: 'loss',
			deck: 'Spell Combo',
			time: '1h ago',
		},
	]);

	const [chat, setChat] = useState<ChatData>({
		messages: [
			{
				sender: 'DragonMaster',
				text: 'Great game!',
				time: '5m ago',
			},
			{
				sender: 'You',
				text: 'Thanks! Your dragon deck is amazing',
				time: '4m ago',
			},
		],
		newMessage: '',
	});

	// Handlers
	const handleChatOpen = (friend: Friend) => {
		setSelectedFriend(friend);
		setShowChat(true);
	};

	const handleChatClose = () => {
		setShowChat(false);
	};

	const handleSendMessage = (message: string) => {
		setChat({
			...chat,
			messages: [
				...chat.messages,
				{
					sender: 'You',
					text: message,
					time: 'just now',
				},
			],
		});
	};

	const handleAcceptRequest = (id: number) => {
		// In a real app, this would make an API call
		const request = requests.find((req) => req.id === id);
		if (request) {
			// Add to friends list
			setFriends({
				...friends,
				online: [
					...friends.online,
					{
						id: request.id,
						name: request.name,
						rank: request.rank,
						avatar: request.avatar,
						status: 'Online',
						lastActive: 'now',
						favorite: false,
					},
				],
			});

			// Remove from requests
			setRequests(requests.filter((req) => req.id !== id));
		}
	};

	const handleDeclineRequest = (id: number) => {
		// In a real app, this would make an API call
		setRequests(requests.filter((req) => req.id !== id));
	};

	// Filter friends based on search query
	const filteredFriends = searchQuery
		? friends[activeTab].filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))
		: friends[activeTab];

	return (
		<div className={styles.container}>
			{/* Background elements */}
			<div className={styles.backgroundImage}></div>
			<div className={styles.backgroundGradient}></div>

			{/* Main content */}
			<div className={styles.content}>
				<div className={styles.mainGrid}>
					{/* Left column - Friends and Matches */}
					<div className={styles.mainContent}>
						{/* Friends Card */}
						<div className={styles.card}>
							<div className={styles.tabsContainer}>
								<div className={styles.tabsGroup}>
									<button
										className={`${styles.tabButton} ${activeTab === 'online' ? styles.tabButtonActive : ''}`}
										onClick={() => setActiveTab('online')}
									>
										Online <span className={styles.tabCount}>({friends.online.length})</span>
									</button>
									<button
										className={`${styles.tabButton} ${activeTab === 'offline' ? styles.offlineTab : ''}`}
										onClick={() => setActiveTab('offline')}
									>
										Offline <span className={styles.tabCount}>({friends.offline.length})</span>
									</button>
									<button
										className={`${styles.tabButton} ${activeTab === 'requests' ? styles.requestsTab : ''}`}
										onClick={() => setActiveTab('requests')}
									>
										Requests <span className={styles.tabCount}>({requests.length})</span>
									</button>
								</div>
								<div className={styles.searchContainer}>
									<input
										type="text"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className={styles.searchInput}
										placeholder="Search friends..."
									/>
								</div>
							</div>

							<div className={styles.friendsList}>
								{activeTab !== 'requests'
									? filteredFriends.map((friend) => <FriendItem key={friend.id} friend={friend} onChatClick={handleChatOpen} />)
									: requests.map((request) => (
											<FriendRequestItem
												key={request.id}
												request={request}
												onAccept={handleAcceptRequest}
												onDecline={handleDeclineRequest}
											/>
									  ))}
							</div>
						</div>

						{/* Recent Matches */}
						<div className={styles.card}>
							<h2 className={styles.cardTitle}>Recent Matches with Friends</h2>
							<div className={styles.friendsList}>
								{recentMatches.map((match) => (
									<MatchItem key={match.id} match={match} />
								))}
							</div>
						</div>
					</div>

					{/* Right column - Profile and Suggestions */}
					<div>
						{/* Your Profile */}
						<div className={styles.profileCard}>
							<h2 className={styles.cardTitle}>Your Profile</h2>
							<div className={styles.profileHeader}>
								<img src="https://placehold.co/120x120" alt="Your Avatar" className={styles.profileAvatar} />
								<div className={styles.profileInfo}>
									<h3 className={styles.username}>YourUsername</h3>
									<div className={styles.userRank}>Diamond II</div>
								</div>
							</div>
							<div className={styles.statsGrid}>
								<div className={styles.statBox}>
									<div className={`${styles.statValue} ${styles.friendsCount}`}>42</div>
									<div className={styles.statLabel}>Friends</div>
								</div>
								<div className={styles.statBox}>
									<div className={`${styles.statValue} ${styles.winRate}`}>85%</div>
									<div className={styles.statLabel}>Win Rate</div>
								</div>
							</div>
						</div>

						{/* Suggested Friends */}
						<div className={styles.suggestedCard}>
							<h2 className={styles.cardTitle}>Suggested Friends</h2>
							<div className={styles.suggestedList}>
								{[...Array(3)].map((_, i) => (
									<div key={i} className={styles.suggestedItem}>
										<img src="https://placehold.co/60x60" alt="Suggested Friend" className={styles.suggestedAvatar} />
										<div className={styles.suggestedInfo}>
											<div className={styles.suggestedName}>Player Name</div>
											<div className={styles.mutualCount}>5 mutual friends</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Chat Modal */}
			{showChat && selectedFriend && (
				<ChatModal show={showChat} friend={selectedFriend} chat={chat} onClose={handleChatClose} onSendMessage={handleSendMessage} />
			)}
		</div>
	);
};

export default Friends;
