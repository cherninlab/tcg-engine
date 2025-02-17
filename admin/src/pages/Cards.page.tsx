import { Button, Card, Group, Modal, NumberInput, Select, Stack, Table, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Card as CardType } from '@tcg-game-template/common/src/types/card';
import { useEffect, useState } from 'react';

type CardFormValues = Omit<CardType, 'id'>;

export function CardsPage() {
	const [cards, setCards] = useState<CardType[]>([]);
	const [loading, setLoading] = useState(false);

	const [modalOpen, setModalOpen] = useState(false);
	const [editingCard, setEditingCard] = useState<CardType | null>(null);

	// Mantine form to handle both create and edit
	const form = useForm<CardFormValues>({
		initialValues: {
			name: '',
			imageUrl: '',
			type: 'creature',
			cost: 0,
			power: 0,
			toughness: 0,
			displayEffect: '',
			logicEffect: undefined,
			rarity: 'common',
		},
		validate: {
			name: (v) => (!v.trim() ? 'Name is required' : null),
			cost: (v) => (v < 0 ? 'Cost cannot be negative' : null),
			power: (v, values) => (values.type === 'creature' && (v ?? 0) < 0 ? 'Power must be >= 0' : null),
			toughness: (v, values) => (values.type === 'creature' && (v ?? 0) < 0 ? 'Toughness must be >= 0' : null),
		},
	});

	// Fetch all cards on mount
	useEffect(() => {
		void fetchCards();
	}, []);

	async function fetchCards() {
		setLoading(true);
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:8787'}/cards`);
			if (!res.ok) {
				throw new Error(`Failed to fetch cards, status: ${res.status}`);
			}
			const data: CardType[] = await res.json();
			setCards(data);
		} catch (error) {
			console.error('Error fetching cards:', error);
			notifications.show({
				title: 'Error',
				message: 'Failed to fetch cards. Please refresh the page.',
				color: 'red',
			});
		} finally {
			setLoading(false);
		}
	}

	// Open the modal for creating a new card
	function openCreateModal() {
		setEditingCard(null);
		form.reset();
		setModalOpen(true);
	}

	// Open the modal for editing an existing card
	function openEditModal(card: CardType) {
		setEditingCard(card);
		form.setValues({
			...card,
			power: card.power ?? 0,
			toughness: card.toughness ?? 0,
			displayEffect: card.displayEffect ?? '',
			...(card.logicEffect?.effectType && {
				logicEffect: {
					effectType: card.logicEffect.effectType,
					amount: card.logicEffect.amount,
					target: card.logicEffect.target,
				},
			}),
		});
		setModalOpen(true);
	}

	// Close the modal
	function closeModal() {
		setModalOpen(false);
		setEditingCard(null);
		form.reset();
	}

	// Submit form (create or edit)
	async function handleSubmit(values: CardFormValues) {
		setLoading(true);
		try {
			// Clean up and validate the values before submission
			const submissionValues = {
				...values,
				// Convert empty strings to undefined
				imageUrl: values.imageUrl?.trim() || undefined,
				displayEffect: values.displayEffect?.trim() || undefined,
				// Handle optional creature stats
				power: values.type === 'creature' ? values.power : undefined,
				toughness: values.type === 'creature' ? values.toughness : undefined,
				// Clean up logic effect if not fully specified
				logicEffect: values.logicEffect?.effectType
					? {
							effectType: values.logicEffect.effectType,
							amount: values.logicEffect.amount,
							target: values.logicEffect.target,
					  }
					: undefined,
			};

			// Determine if we're creating or editing
			const isEditing = !!editingCard;
			const url = isEditing
				? `${import.meta.env.VITE_API_URL ?? 'http://localhost:8787'}/cards/${editingCard?.id}`
				: `${import.meta.env.VITE_API_URL ?? 'http://localhost:8787'}/cards`;
			const method = isEditing ? 'PUT' : 'POST';

			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(submissionValues),
			});

			if (!res.ok) {
				const errorData = await res.json();
				console.error('Server response:', errorData);

				if (errorData.error?.name === 'ZodError') {
					const issues = errorData.error.issues;
					const errorMessage = issues.map((issue: any) => `${issue.path.join('.')}: ${issue.message}`).join('\n');
					notifications.show({
						title: 'Validation Error',
						message: errorMessage,
						color: 'red',
					});
					return;
				}
				throw new Error(`Error ${method} card, status: ${res.status}`);
			}

			// Refresh list and close modal
			await fetchCards();
			closeModal();
			notifications.show({
				title: 'Success',
				message: `Card ${isEditing ? 'updated' : 'created'} successfully`,
				color: 'green',
			});
		} catch (error) {
			console.error('Error details:', error);
			notifications.show({
				title: 'Error',
				message: error instanceof Error ? error.message : 'An unexpected error occurred',
				color: 'red',
			});
		} finally {
			setLoading(false);
		}
	}

	// Verify card exists before deletion
	async function verifyCardExists(cardId: string): Promise<boolean> {
		try {
			const url = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8787'}/cards/${cardId}`;
			const res = await fetch(url, { method: 'GET' });
			return res.ok;
		} catch (error) {
			console.error('Error verifying card:', error);
			return false;
		}
	}

	// Delete a card
	async function handleDelete(cardId: string) {
		if (!window.confirm('Are you sure you want to delete this card?')) return;

		setLoading(true);
		try {
			// First verify the card still exists
			const cardExists = await verifyCardExists(cardId);
			if (!cardExists) {
				notifications.show({
					title: 'Error',
					message: 'This card no longer exists in the database. Refreshing the list...',
					color: 'yellow',
				});
				await fetchCards();
				return;
			}

			const url = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8787'}/cards/${cardId}`;

			const res = await fetch(url, { method: 'DELETE' });

			if (!res.ok) {
				if (res.status === 404) {
					notifications.show({
						title: 'Error',
						message: 'Card not found. The list will be refreshed to show current data.',
						color: 'yellow',
					});
				} else {
					throw new Error(`Error deleting card, status: ${res.status}`);
				}
			} else {
				notifications.show({
					title: 'Success',
					message: 'Card deleted successfully',
					color: 'green',
				});
			}

			// Always refresh the list to ensure UI is in sync
			await fetchCards();
		} catch (error) {
			console.error('Delete error:', error);
			notifications.show({
				title: 'Error',
				message: error instanceof Error ? error.message : 'An unexpected error occurred while deleting the card',
				color: 'red',
			});
			// Refresh list even on error to ensure UI is in sync
			await fetchCards();
		} finally {
			setLoading(false);
		}
	}

	return (
		<Stack>
			<Group justify="space-between">
				<Text size="xl" fw={700}>
					Cards
				</Text>
				<Button onClick={openCreateModal}>Create Card</Button>
			</Group>

			<Card withBorder>
				<Table>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Name</Table.Th>
							<Table.Th>Type</Table.Th>
							<Table.Th>Rarity</Table.Th>
							<Table.Th>Cost</Table.Th>
							<Table.Th>Power</Table.Th>
							<Table.Th>Toughness</Table.Th>
							<Table.Th>Effect Type</Table.Th>
							<Table.Th>Display Effect</Table.Th>
							<Table.Th>Actions</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{cards.length === 0 && (
							<Table.Tr>
								<Table.Td colSpan={9} style={{ textAlign: 'center', padding: 20 }}>
									No cards found
								</Table.Td>
							</Table.Tr>
						)}
						{cards.map((card) => (
							<Table.Tr key={card.id}>
								<Table.Td>{card.name}</Table.Td>
								<Table.Td>{card.type}</Table.Td>
								<Table.Td>{card.rarity}</Table.Td>
								<Table.Td>{card.cost}</Table.Td>
								<Table.Td>{card.power ?? '-'}</Table.Td>
								<Table.Td>{card.toughness ?? '-'}</Table.Td>
								<Table.Td>{card.logicEffect?.effectType ?? '-'}</Table.Td>
								<Table.Td>{card.displayEffect ?? '-'}</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Button variant="light" size="xs" onClick={() => openEditModal(card)}>
											Edit
										</Button>
										<Button variant="light" color="red" size="xs" onClick={() => handleDelete(card.id)}>
											Delete
										</Button>
									</Group>
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</Card>

			<Modal opened={modalOpen} onClose={closeModal} title={editingCard ? 'Edit Card' : 'Create Card'} centered>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack>
						<TextInput label="Name" {...form.getInputProps('name')} />
						<TextInput label="Image URL" placeholder="Optional link to card art" {...form.getInputProps('imageUrl')} />
						<Select
							label="Type"
							data={[
								{ value: 'creature', label: 'Creature' },
								{ value: 'spell', label: 'Spell' },
								{ value: 'artifact', label: 'Artifact' },
							]}
							{...form.getInputProps('type')}
						/>
						<Select
							label="Rarity"
							data={[
								{ value: 'common', label: 'Common' },
								{ value: 'uncommon', label: 'Uncommon' },
								{ value: 'rare', label: 'Rare' },
								{ value: 'legendary', label: 'Legendary' },
							]}
							{...form.getInputProps('rarity')}
						/>
						<NumberInput label="Cost" min={0} {...form.getInputProps('cost')} />
						{form.values.type === 'creature' && (
							<>
								<NumberInput label="Power" min={0} {...form.getInputProps('power')} />
								<NumberInput label="Toughness" min={0} {...form.getInputProps('toughness')} />
							</>
						)}
						<Select
							label="Logic Effect Type"
							placeholder="None"
							data={[
								{ value: 'damage', label: 'Damage' },
								{ value: 'heal', label: 'Heal' },
								{ value: 'drawCard', label: 'Draw Card' },
								{ value: 'buff', label: 'Buff' },
							]}
							{...form.getInputProps('logicEffect.effectType')}
						/>
						{form.values.logicEffect?.effectType && (
							<>
								{(form.values.logicEffect.effectType === 'damage' ||
									form.values.logicEffect.effectType === 'heal' ||
									form.values.logicEffect.effectType === 'buff') && (
									<NumberInput label="Effect Amount" min={1} {...form.getInputProps('logicEffect.amount')} />
								)}
								<Select
									label="Target"
									placeholder="Select a target"
									data={[
										{ value: 'self', label: 'Self' },
										{ value: 'opponent', label: 'Opponent' },
										{ value: 'creature', label: 'A single creature' },
										{ value: 'allCreatures', label: 'All creatures' },
									]}
									{...form.getInputProps('logicEffect.target')}
								/>
							</>
						)}
						<TextInput
							label="Display Effect (optional text)"
							placeholder="e.g. Deal 2 damage to a creature"
							{...form.getInputProps('displayEffect')}
						/>
						<Group justify="flex-end" mt="md">
							<Button variant="light" onClick={closeModal}>
								Cancel
							</Button>
							<Button type="submit" loading={loading}>
								{editingCard ? 'Save Changes' : 'Create Card'}
							</Button>
						</Group>
					</Stack>
				</form>
			</Modal>
		</Stack>
	);
}
