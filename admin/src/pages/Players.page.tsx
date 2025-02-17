import { Avatar, Badge, Button, Card, Group, Modal, Stack, Table, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Player } from '@tcg-game-template/common/src/types/player';
import { useEffect, useState } from 'react';

interface PlayerFormValues {
	username: string;
	email: string;
	displayName?: string;
	avatarUrl?: string;
}

export function PlayersPage() {
	const [players, setPlayers] = useState<Player[]>([]);
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

	const form = useForm<PlayerFormValues>({
		initialValues: {
			username: '',
			email: '',
			displayName: '',
			avatarUrl: '',
		},
		validate: {
			username: (v) => (!v.trim() ? 'Username is required' : null),
			email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
		},
	});

	useEffect(() => {
		void fetchPlayers();
	}, []);

	async function fetchPlayers() {
		setLoading(true);
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:8787'}/players`);
			if (!res.ok) {
				throw new Error(`Failed to fetch players, status: ${res.status}`);
			}
			const data: Player[] = await res.json();
			setPlayers(data);
		} catch (error) {
			console.error('Failed to fetch players:', error);
		} finally {
			setLoading(false);
		}
	}

	function openCreateModal() {
		form.reset();
		setEditingPlayer(null);
		setModalOpen(true);
	}

	function openEditModal(player: Player) {
		form.setValues({
			username: player.username,
			email: player.email,
			displayName: player.displayName,
			avatarUrl: player.avatarUrl,
		});
		setEditingPlayer(player);
		setModalOpen(true);
	}

	function closeModal() {
		form.reset();
		setEditingPlayer(null);
		setModalOpen(false);
	}

	async function handleSubmit(values: PlayerFormValues) {
		try {
			const url = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8787'}/players${editingPlayer ? `/${editingPlayer.id}` : ''}`;
			const res = await fetch(url, {
				method: editingPlayer ? 'PUT' : 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(values),
			});

			if (!res.ok) {
				throw new Error(`Failed to ${editingPlayer ? 'update' : 'create'} player, status: ${res.status}`);
			}

			void fetchPlayers();
			closeModal();
		} catch (error) {
			console.error(`Failed to ${editingPlayer ? 'update' : 'create'} player:`, error);
		}
	}

	async function handleDelete(playerId: string) {
		if (!window.confirm('Are you sure you want to delete this player?')) {
			return;
		}

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:8787'}/players/${playerId}`, {
				method: 'DELETE',
			});

			if (!res.ok) {
				throw new Error(`Failed to delete player, status: ${res.status}`);
			}

			void fetchPlayers();
		} catch (error) {
			console.error('Failed to delete player:', error);
		}
	}

	return (
		<Stack>
			<Group justify="space-between">
				<Text size="xl" fw={700}>
					Players
				</Text>
				<Button onClick={openCreateModal}>Create Player</Button>
			</Group>

			<Card withBorder>
				<Table>
					<Table.Thead>
						<Table.Tr>
							<Table.Th></Table.Th>
							<Table.Th>Username</Table.Th>
							<Table.Th>Email</Table.Th>
							<Table.Th>Stats</Table.Th>
							<Table.Th>Joined</Table.Th>
							<Table.Th>Actions</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{players.map((player) => (
							<Table.Tr key={player.id}>
								<Table.Td>
									<Avatar src={player.avatarUrl} radius="xl" />
								</Table.Td>
								<Table.Td>
									<Text>{player.username}</Text>
									{player.displayName && (
										<Text size="sm" c="dimmed">
											{player.displayName}
										</Text>
									)}
								</Table.Td>
								<Table.Td>{player.email}</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Badge color="blue">{player.stats.gamesPlayed} Games</Badge>
										<Badge color="green">{player.stats.winRate}% Win Rate</Badge>
									</Group>
								</Table.Td>
								<Table.Td>{new Date(player.createdAt).toLocaleDateString()}</Table.Td>
								<Table.Td>
									<Group gap="xs">
										<Button variant="light" size="xs" onClick={() => openEditModal(player)}>
											Edit
										</Button>
										<Button variant="light" color="red" size="xs" onClick={() => handleDelete(player.id)}>
											Delete
										</Button>
									</Group>
								</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</Card>

			<Modal opened={modalOpen} onClose={closeModal} title={editingPlayer ? 'Edit Player' : 'Create Player'}>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack>
						<TextInput label="Username" required {...form.getInputProps('username')} />
						<TextInput label="Email" required {...form.getInputProps('email')} />
						<TextInput label="Display Name" {...form.getInputProps('displayName')} />
						<TextInput label="Avatar URL" {...form.getInputProps('avatarUrl')} />
						<Button type="submit">Save</Button>
					</Stack>
				</form>
			</Modal>
		</Stack>
	);
}
