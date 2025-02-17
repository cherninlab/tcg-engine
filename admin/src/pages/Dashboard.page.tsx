import { Card, Center, Group, RingProgress, SimpleGrid, Stack, Text } from '@mantine/core';

export function DashboardPage() {
	return (
		<Stack>
			<Group justify="space-between">
				<Text size="xl" fw={700}>
					Dashboard
				</Text>
			</Group>

			<SimpleGrid cols={3}>
				<Card withBorder>
					<Stack>
						<Text size="lg" fw={500}>
							Total Players
						</Text>
						<Group justify="center">
							<Text size="xl" fw={700}>
								0
							</Text>
						</Group>
					</Stack>
				</Card>

				<Card withBorder>
					<Stack>
						<Text size="lg" fw={500}>
							Total Cards
						</Text>
						<Group justify="center">
							<Text size="xl" fw={700}>
								0
							</Text>
						</Group>
					</Stack>
				</Card>

				<Card withBorder>
					<Stack>
						<Text size="lg" fw={500}>
							Total Decks
						</Text>
						<Group justify="center">
							<Text size="xl" fw={700}>
								0
							</Text>
						</Group>
					</Stack>
				</Card>

				<Card withBorder>
					<Stack>
						<Text size="lg" fw={500}>
							Card Types Distribution
						</Text>
						<Center>
							<RingProgress
								size={150}
								thickness={20}
								sections={[
									{ value: 40, color: 'blue', label: 'Creatures' },
									{ value: 30, color: 'red', label: 'Spells' },
									{ value: 30, color: 'yellow', label: 'Artifacts' },
								]}
							/>
						</Center>
					</Stack>
				</Card>

				<Card withBorder>
					<Stack>
						<Text size="lg" fw={500}>
							Card Rarities
						</Text>
						<Center>
							<RingProgress
								size={150}
								thickness={20}
								sections={[
									{ value: 40, color: 'gray', label: 'Common' },
									{ value: 30, color: 'blue', label: 'Uncommon' },
									{ value: 20, color: 'violet', label: 'Rare' },
									{ value: 10, color: 'gold', label: 'Legendary' },
								]}
							/>
						</Center>
					</Stack>
				</Card>
			</SimpleGrid>
		</Stack>
	);
}
