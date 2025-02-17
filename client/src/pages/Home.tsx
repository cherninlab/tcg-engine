import { Button, Container, Stack, Text, Title } from '@mantine/core';
import styles from './Home.module.css';

function HomePage() {
	return (
		<Container size="lg" className={styles.root}>
			<Stack gap="xl">
				<Title order={1}>Welcome to TCG Engine</Title>
				<Text size="lg">A modern trading card game platform built with React and Mantine</Text>
				<Button size="lg">Get Started</Button>
			</Stack>
		</Container>
	);
}

export default HomePage;
