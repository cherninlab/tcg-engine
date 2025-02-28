import { Button, Container, Group, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { routes } from '../router';
import styles from './Home.module.css';

function HomePage() {
	return (
		<Container size="lg" className={styles.root}>
			<Stack gap="xl">
				<Title order={1}>Welcome to TCG Engine</Title>
				<Text size="lg">A modern trading card game platform built with React and Cloudflare Workers</Text>

				<div className={styles.cardDisplay}>
					<div className={styles.card} />
					<div className={styles.card} />
					<div className={styles.card} />
				</div>

				<Group justify="center" gap="md">
					<Button component={Link} to={routes.app.game.play} size="lg" color="green">
						Play Game
					</Button>

					<Button component={Link} to={routes.app.game.deck} size="lg" variant="outline">
						Deck Builder
					</Button>
				</Group>
			</Stack>
		</Container>
	);
}

export default HomePage;
