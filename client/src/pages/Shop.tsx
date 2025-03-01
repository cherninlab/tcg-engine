import React, { useState } from 'react';
import styles from './Shop.module.css';

// Type definitions for shop data
interface Price {
	coins?: number;
	gems?: number;
	original?: number;
}

interface Sale {
	original: number;
	discount: string;
}

interface PackContents {
	items: string[];
}

interface FeaturedPack {
	name: string;
	type: string;
	image: string;
	description: string;
	price: Price;
	contents: string[];
	background: string;
}

interface Pack {
	id: number;
	name: string;
	image: string;
	price: Price;
	cardCount: number;
	guarantees: string[];
	sale?: Sale;
	timeLeft?: string;
}

interface Deal {
	name: string;
	type: string;
	rarity?: string;
	image: string;
	price: Price;
	contents?: string[];
	timeLeft: string;
}

interface Currency {
	coins: number;
	gems: number;
}

interface PackDetailsModalProps {
	pack: Pack | null;
	onClose: () => void;
}

// Pack details modal component
const PackDetailsModal: React.FC<PackDetailsModalProps> = ({ pack, onClose }) => {
	if (!pack) return null;

	return (
		<div className={styles.modalOverlay} onClick={onClose}>
			<div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
				<div className={styles.modalHeader}>
					<h2 className={styles.modalTitle}>{pack.name}</h2>
					<button className={styles.closeButton} onClick={onClose}>
						×
					</button>
				</div>
				<div className={styles.modalBody}>
					<img src={pack.image} alt={pack.name} style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />

					<div style={{ marginBottom: '1rem' }}>
						<h3 style={{ marginBottom: '0.5rem' }}>Contents:</h3>
						<p>{pack.cardCount} cards per pack</p>
						<ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
							{pack.guarantees.map((guarantee, index) => (
								<li key={index}>{guarantee}</li>
							))}
						</ul>
					</div>

					<div>
						<h3 style={{ marginBottom: '0.5rem' }}>Price:</h3>
						<div className={styles.priceGroup}>
							<img
								src="https://placehold.co/24x24"
								alt={pack.price.coins ? 'Coins' : 'Gems'}
								className={pack.price.coins ? styles.coinIcon : styles.gemIcon}
							/>
							{pack.sale ? (
								<>
									<span className={styles.originalPrice}>{pack.sale.original}</span>
									<span className={pack.price.coins ? styles.discountPrice : styles.gemPrice}>{pack.price.coins || pack.price.gems}</span>
									<span style={{ color: '#DD4D44', marginLeft: '0.5rem' }}>({pack.sale.discount} off)</span>
								</>
							) : (
								<span className={pack.price.coins ? styles.discountPrice : styles.gemPrice}>{pack.price.coins || pack.price.gems}</span>
							)}
						</div>
					</div>
				</div>

				<div className={styles.modalFooter}>
					<button className={styles.buyNowButton} onClick={() => alert(`Purchased ${pack.name}!`)}>
						<span className={styles.smallButtonHighlight}></span>
						<span className={styles.smallButtonText}>Buy Pack</span>
					</button>
				</div>
			</div>
		</div>
	);
};

// Main Shop component
const Shop: React.FC = () => {
	// State for modal and shop data
	const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
	const [showPackDetails, setShowPackDetails] = useState<boolean>(false);

	// Mock data for shop
	const [currency] = useState<Currency>({
		coins: 12500,
		gems: 850,
	});

	const [featuredPack] = useState<FeaturedPack>({
		name: "Dragon's Ascent",
		type: 'expansion',
		image: 'https://placehold.co/600x800',
		description: 'Unleash ancient dragons and devastating spells',
		price: { gems: 1200 },
		contents: ['5 Dragon Cards', '1 Guaranteed Legendary', '3 Card Styles'],
		background: 'https://placehold.co/1920x1080',
	});

	const [packs] = useState<Pack[]>([
		{
			id: 1,
			name: 'Core Set',
			image: 'https://placehold.co/300x400',
			price: { coins: 1000 },
			cardCount: 5,
			guarantees: ['1 Rare+'],
		},
		{
			id: 2,
			name: 'Premium Dragon Pack',
			image: 'https://placehold.co/300x400',
			price: { gems: 200 },
			cardCount: 5,
			guarantees: ['1 Epic+'],
			sale: { original: 300, discount: '33%' },
		},
		{
			id: 3,
			name: 'Mythic Bundle',
			image: 'https://placehold.co/300x400',
			price: { gems: 1500 },
			cardCount: 15,
			guarantees: ['2 Legendary', '3 Epic+'],
			timeLeft: '2d 15h',
		},
	]);

	const [dailyDeals] = useState<Deal[]>([
		{
			name: 'Ancient Dragon',
			type: 'card',
			rarity: 'legendary',
			image: 'https://placehold.co/300x400',
			price: { gems: 500, original: 1000 },
			timeLeft: '15:45',
		},
		{
			name: 'Dragon Tamer Bundle',
			type: 'bundle',
			image: 'https://placehold.co/300x400',
			price: { coins: 2500, original: 5000 },
			contents: ['3 Dragon Cards', '200 Coins'],
			timeLeft: '15:45',
		},
	]);

	// Handle pack selection
	const handlePackSelect = (pack: Pack) => {
		setSelectedPack(pack);
		setShowPackDetails(true);
	};

	// Close modal
	const handleCloseModal = () => {
		setShowPackDetails(false);
		setSelectedPack(null);
	};

	// Handle purchase
	const handlePurchase = (itemName: string, price: Price) => {
		if ((price.coins && currency.coins >= price.coins) || (price.gems && currency.gems >= price.gems)) {
			alert(`Purchased ${itemName}!`);
		} else {
			alert('Not enough currency!');
		}
	};

	return (
		<div className={styles.container}>
			{/* Background elements */}
			<div className={styles.backgroundImage} style={{ backgroundImage: `url(${featuredPack.background})` }}></div>
			<div className={styles.backgroundGradient}></div>

			{/* Content wrapper */}
			<div className={styles.contentWrapper}>
				{/* Header with currency */}
				<header className={styles.header}>
					<div className={styles.currencyContainer}>
						<div className={styles.currencyBadge}>
							<img src="https://placehold.co/24x24" alt="Coins" className={styles.coinIcon} />
							<span className={styles.coinValue}>{currency.coins.toLocaleString()}</span>
						</div>
						<div className={styles.currencyBadge}>
							<img src="https://placehold.co/24x24" alt="Gems" className={styles.gemIcon} />
							<span className={styles.gemValue}>{currency.gems}</span>
						</div>
					</div>
				</header>

				{/* Main content */}
				<main className={styles.mainContent}>
					{/* Featured Pack Section */}
					<div className={styles.featuredSection}>
						<div className={styles.featuredInfo}>
							<div className={styles.featuredTag}>NEW EXPANSION</div>
							<h1 className={styles.featuredTitle}>{featuredPack.name}</h1>
							<p className={styles.featuredDescription}>{featuredPack.description}</p>

							<div className={styles.featuredContentList}>
								{featuredPack.contents.map((content, index) => (
									<div key={index} className={styles.featuredItem}>
										<div className={styles.featuredBullet}></div>
										<span>{content}</span>
									</div>
								))}
							</div>

							<button className={styles.buyButton} onClick={() => handlePurchase(featuredPack.name, featuredPack.price)}>
								<span className={styles.buttonHighlight}></span>
								<div className={styles.buttonContent}>
									<span className={styles.buttonText}>Buy Bundle</span>
									<div className={styles.priceContainer}>
										<img
											src="https://placehold.co/24x24"
											alt="Gems"
											className={styles.gemIcon}
											style={{ width: '1.5rem', height: '1.5rem' }}
										/>
										<span>{featuredPack.price.gems}</span>
									</div>
								</div>
							</button>
						</div>

						<img src={featuredPack.image} alt={featuredPack.name} className={styles.featuredImage} />
					</div>

					{/* Daily Deals Section */}
					<div>
						<h2 className={styles.sectionTitle}>Daily Deals</h2>
						<div className={styles.dealsGrid}>
							{dailyDeals.map((deal, index) => (
								<div key={index} className={styles.dealCard}>
									<div className={styles.dealCardBorder}></div>
									<div className={styles.dealCardContent}>
										<img src={deal.image} alt={deal.name} className={styles.dealImage} />
										<div className={styles.dealInfo}>
											<div className={styles.dealTimer}>{deal.timeLeft}</div>
											<h3 className={styles.dealTitle}>{deal.name}</h3>

											{deal.contents && (
												<div className={styles.dealContentList}>
													{deal.contents.map((content, idx) => (
														<div key={idx} className={styles.dealItem}>
															{content}
														</div>
													))}
												</div>
											)}

											<div className={styles.dealPrice}>
												<div className={styles.priceGroup}>
													<img
														src="https://placehold.co/24x24"
														alt={deal.price.coins ? 'Coins' : 'Gems'}
														className={deal.price.coins ? styles.coinIcon : styles.gemIcon}
													/>
													<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
														<span className={styles.originalPrice}>{deal.price.original}</span>
														<span className={deal.price.coins ? styles.discountPrice : styles.gemPrice}>
															{deal.price.coins || deal.price.gems}
														</span>
													</div>
												</div>
												<button className={styles.buyNowButton} onClick={() => handlePurchase(deal.name, deal.price)}>
													<span className={styles.smallButtonHighlight}></span>
													<span className={styles.smallButtonText}>Buy Now</span>
												</button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Card Packs Section */}
					<div>
						<h2 className={styles.sectionTitle}>Card Packs</h2>
						<div className={styles.packsGrid}>
							{packs.map((pack) => (
								<div key={pack.id} className={styles.packCard} onClick={() => handlePackSelect(pack)}>
									<div className={styles.packCardBorder}></div>
									<div className={styles.packCardContent}>
										{(pack.timeLeft || pack.sale) && (
											<div className={`${styles.badgeTag} ${pack.timeLeft ? styles.timerTag : styles.saleTag}`}>
												{pack.timeLeft || `-${pack.sale?.discount}`}
											</div>
										)}

										<img src={pack.image} alt={pack.name} className={styles.packImage} />
										<h3 className={styles.packTitle}>{pack.name}</h3>

										<div className={styles.packContentList}>
											<div className={styles.packItem}>
												<div className={styles.packBullet}></div>
												<span>{pack.cardCount} cards per pack</span>
											</div>
											{pack.guarantees.map((guarantee, idx) => (
												<div key={idx} className={styles.packItem}>
													<div className={styles.packBullet}></div>
													<span>{guarantee}</span>
												</div>
											))}
										</div>

										<div className={styles.packFooter}>
											<div className={styles.priceGroup}>
												<img
													src="https://placehold.co/24x24"
													alt={pack.price.coins ? 'Coins' : 'Gems'}
													className={pack.price.coins ? styles.coinIcon : styles.gemIcon}
												/>
												{pack.sale ? (
													<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
														<span className={styles.originalPrice}>{pack.sale.original}</span>
														<span className={pack.price.coins ? styles.discountPrice : styles.gemPrice}>
															{pack.price.coins || pack.price.gems}
														</span>
													</div>
												) : (
													<span className={pack.price.coins ? styles.discountPrice : styles.gemPrice}>
														{pack.price.coins || pack.price.gems}
													</span>
												)}
											</div>
											<button
												className={styles.buyNowButton}
												onClick={(e) => {
													e.stopPropagation();
													handlePurchase(pack.name, pack.price);
												}}
											>
												<span className={styles.smallButtonHighlight}></span>
												<span className={styles.smallButtonText}>Buy Pack</span>
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</main>
			</div>

			{/* Pack Details Modal */}
			{showPackDetails && selectedPack && <PackDetailsModal pack={selectedPack} onClose={handleCloseModal} />}
		</div>
	);
};

export default Shop;
