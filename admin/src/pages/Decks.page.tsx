import { Button, Card, Group, LoadingOverlay, Modal, ScrollArea, Select, Stack, Table, Text, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Card as CardType } from '@tcg-game-template/common/src/types/card';
import { Deck } from '@tcg-game-template/common/src/types/deck';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface DeckFormValues {
	name: string;
	description?: string;
	cardIds: string[];
}

interface CardSelection {
	[cardId: string]: number;
}

export function DecksPage() {
	const { user } = useAuth();
	const [decks, setDecks] = useState<Deck[]>([]);
	const [cards, setCards] = useState<CardType[]>([]);
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
	const [selectedCard, setSelectedCard] = useState<string | null>(null);
	const [cardCopies, setCardCopies] = useState<CardSelection>({});

	const form = useForm<DeckFormValues>({
		initialValues: {
			name: '',
			description: '',
			cardIds: [],
		},
		validate: {
			name: (v) => (!v.trim() ? 'Name is required' : null),
			cardIds: (v) => {
				if (v.length < 40) return 'Deck must have at least 40 cards';
				if (v.length > 60) return 'Deck cannot have more than 60 cards';
				return null;
			},
		},
	});

	useEffect(() => {
		void fetchDecks();
		void fetchCards();
	}, []);

	async function fetchCards() {
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:8787'}/cards`);
			if (!res.ok) {
				throw new Error(`Failed to fetch cards, status: ${res.status}`);
			}
			const data: CardType[] = await res.json();
			setCards(data);
		} catch (error) {
			console.error('Failed to fetch cards:', error);
		}
	}

	async function fetchDecks() {
		setLoading(true);
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:8787'}/decks`);
			if (!res.ok) {
				throw new Error(`Failed to fetch decks, status: ${res.status}`);
			}
			const data: Deck[] = await res.json();
			setDecks(data);
		} catch (error) {
			console.error('Failed to fetch decks:', error);
		} finally {
			setLoading(false);
		}
	}

	function openCreateModal() {
		form.reset();
		setEditingDeck(null);
		setModalOpen(true);
		setCardCopies({});
		setSelectedCard(null);
	}

	function openEditModal(deck: Deck) {
		form.setValues({
			name: deck.name,
			description: deck.description,
			cardIds: deck.cards,
		});
		// Convert card array to copies map
		const copies: CardSelection = {};
		deck.cards.forEach((cardId) => {
			copies[cardId] = (copies[cardId] || 0) + 1;
		});
		setCardCopies(copies);
		setEditingDeck(deck);
		setModalOpen(true);
	}

	function closeModal() {
		form.reset();
		setEditingDeck(null);
		setModalOpen(false);
		setCardCopies({});
		setSelectedCard(null);
	}

	function handleAddCard() {
		if (!selectedCard) return;
		const currentCopies = cardCopies[selectedCard] || 0;
		if (currentCopies < 4) {
			const newCopies = { ...cardCopies, [selectedCard]: currentCopies + 1 };
			setCardCopies(newCopies);
			// Update form cardIds
			const newCardIds = Object.entries(newCopies).flatMap(([cardId, count]) => Array(count).fill(cardId));
			form.setFieldValue('cardIds', newCardIds);
		}
	}

	function handleRemoveCard(cardId: string) {
		const currentCopies = cardCopies[cardId] || 0;
		if (currentCopies > 0) {
			const newCopies = { ...cardCopies };
			if (currentCopies === 1) {
				delete newCopies[cardId];
			} else {
				newCopies[cardId] = currentCopies - 1;
			}
			setCardCopies(newCopies);
			// Update form cardIds
			const newCardIds = Object.entries(newCopies).flatMap(([cardId, count]) => Array(count).fill(cardId));
			form.setFieldValue('cardIds', newCardIds);
		}
	}

	const totalCards = Object.values(cardCopies).reduce((sum, count) => sum + count, 0);

	async function handleSubmit(values: DeckFormValues) {
		try {
			const url = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8787'}/decks${editingDeck ? `/${editingDeck.id}` : ''}`;
			const res = await fetch(url, {
				method: editingDeck ? 'PUT' : 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...values,
					ownerId: user?.id,
					cards: values.cardIds,
				}),
			});

			if (!res.ok) {
				throw new Error(`Failed to ${editingDeck ? 'update' : 'create'} deck, status: ${res.status}`);
			}

			void fetchDecks();
			closeModal();
		} catch (error) {
			console.error(`Failed to ${editingDeck ? 'update' : 'create'} deck:`, error);
		}
	}

	async function handleDelete(deckId: string) {
		if (!window.confirm('Are you sure you want to delete this deck?')) {
			return;
		}

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:8787'}/decks/${deckId}`, {
				method: 'DELETE',
			});

			if (!res.ok) {
				throw new Error(`Failed to delete deck, status: ${res.status}`);
			}

			void fetchDecks();
		} catch (error) {
			console.error('Failed to delete deck:', error);
		}
	}

	return (
		<Stack>
			<LoadingOverlay visible={loading} />
			<Group justify="space-between">
				<Text size="xl" fw={700}>
					Decks
				</Text>
				<Button onClick={openCreateModal}>Create Deck</Button>
			</Group>

			<Card withBorder>
				<Table>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Name</Table.Th>
							<Table.Th>Description</Table.Th>
							<Table.Th>Cards</Table.Th>
							<Table.Th>Created</Table.Th>
							<Table.Th>Actions</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{decks.map((deck) => (
							<Table.Tr key={deck.id}>
								<Table.Td>{deck.name}</Table.Td>
								<Table.Td>{deck.description}</Table.Td>
								<Table.Td>{deck.cards.length} cards</Table.Td>
								<Table.Td>{new Date(deck.createdAt).toLocaleDateString()}</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Button variant="light" size="xs" onClick={() => openEditModal(deck)}>
											Edit
										</Button>
										<Button variant="light" color="red" size="xs" onClick={() => handleDelete(deck.id)}>
											Delete
										</Button>
									</Group>
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</Card>

			<Modal opened={modalOpen} onClose={closeModal} title={editingDeck ? 'Edit Deck' : 'Create Deck'} size="lg">
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack>
						<TextInput label="Name" required {...form.getInputProps('name')} />
						<Textarea label="Description" {...form.getInputProps('description')} />

						<Group align="flex-end">
							<Select
								label="Add Card"
								placeholder="Select a card"
								data={cards.map((card) => ({
									value: card.id,
									label: `${card.name} (${card.type}, ${card.rarity})`,
								}))}
								searchable
								value={selectedCard}
								onChange={setSelectedCard}
								style={{ flex: 1 }}
							/>
							<Button onClick={handleAddCard} disabled={!selectedCard || (cardCopies[selectedCard] || 0) >= 4}>
								Add Copy
							</Button>
						</Group>

						<Card withBorder>
							<Text size="sm" fw={500} mb="xs">
								Selected Cards ({totalCards}/60)
							</Text>
							<ScrollArea h={200}>
								<Table>
									<Table.Thead>
										<Table.Tr>
											<Table.Th>Card</Table.Th>
											<Table.Th>Copies</Table.Th>
											<Table.Th>Actions</Table.Th>
										</Table.Tr>
									</Table.Thead>
									<Table.Tbody>
										{Object.entries(cardCopies).map(([cardId, copies]) => {
											const card = cards.find((c) => c.id === cardId);
											if (!card) return null;
											return (
												<Table.Tr key={cardId}>
													<Table.Td>{card.name}</Table.Td>
													<Table.Td>{copies}/4</Table.Td>
													<Table.Td>
														<Button variant="subtle" color="red" size="xs" onClick={() => handleRemoveCard(cardId)}>
															Remove Copy
														</Button>
													</Table.Td>
												</Table.Tr>
											);
										})}
									</Table.Tbody>
								</Table>
							</ScrollArea>
						</Card>

						<Text size="sm" c="dimmed">
							Deck must have between 40 and 60 cards, with no more than 4 copies of any card.
						</Text>
						<Button type="submit" disabled={totalCards < 40 || totalCards > 60}>
							Save
						</Button>
					</Stack>
				</form>
			</Modal>
		</Stack>
	);
}
