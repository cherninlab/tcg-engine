import { Box, Button, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { PageContainer } from '../layout/PageContainer';
import { UI_CONSTANTS } from '../../theme';

export interface LoginPageProps {
	onSubmit: (email: string) => Promise<void>;
	loading?: boolean;
	error?: string | null;
	title?: string;
	subtitle?: string;
	buttonText?: string;
	bgImage?: string;
}

export function LoginPage({
	onSubmit,
	loading = false,
	error = null,
	title = 'Welcome back',
	subtitle = 'Enter your email to receive a magic link',
	buttonText = 'Send magic link',
	bgImage,
}: LoginPageProps) {
	const [submitted, setSubmitted] = useState(false);

	const form = useForm({
		initialValues: {
			email: '',
		},
		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
		},
	});

	const handleSubmit = async (values: typeof form.values) => {
		try {
			await onSubmit(values.email);
			setSubmitted(true);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<PageContainer bgImage={bgImage}>
			<Paper
				style={{
					position: 'relative',
					maxWidth: '450px',
					width: '100%',
					margin: '0 auto',
					border: UI_CONSTANTS.BORDERS.CARD,
					transition: `transform ${UI_CONSTANTS.ANIMATIONS.DURATION.MEDIUM} ${UI_CONSTANTS.ANIMATIONS.TIMING}`,
				}}
			>
				<div style={{ padding: '30px', position: 'relative', zIndex: 1 }}>
					{!submitted ? (
						<>
							<Title
								order={2}
								style={{
									color: '#fff',
									fontSize: '28px',
									textAlign: 'center',
									marginBottom: '20px',
									fontFamily: '"Russo One", "M PLUS Rounded 1c", sans-serif',
								}}
							>
								{title}
							</Title>

							<Text
								style={{
									color: 'rgba(255, 255, 255, 0.8)',
									textAlign: 'center',
									marginBottom: '30px',
								}}
							>
								{subtitle}
							</Text>

							<form onSubmit={form.onSubmit(handleSubmit)}>
								<Stack>
									<TextInput
										placeholder="you@example.com"
										required
										size="md"
										autoComplete="email"
										{...form.getInputProps('email')}
									/>

									{error && (
										<Text
											style={{
												color: '#ff6b6b',
												backgroundColor: 'rgba(255, 107, 107, 0.1)',
												padding: '10px',
												borderRadius: '8px',
												borderLeft: '4px solid #ff6b6b',
												marginTop: '15px',
											}}
										>
											{error}
										</Text>
									)}

									<Button
										type="submit"
										fullWidth
										loading={loading}
										style={{
											background: UI_CONSTANTS.BACKGROUNDS.BUTTON_PRIMARY,
											boxShadow: UI_CONSTANTS.SHADOWS.BUTTON,
											border: 'none',
											height: '50px',
											fontSize: '18px',
											fontWeight: 'bold',
											textTransform: 'uppercase',
											letterSpacing: '1px',
											borderRadius: '8px',
											transition: `all ${UI_CONSTANTS.ANIMATIONS.DURATION.FAST} ${UI_CONSTANTS.ANIMATIONS.TIMING}`,
											marginTop: '20px',
											position: 'relative',
											overflow: 'hidden',
											fontFamily: '"Russo One", "M PLUS Rounded 1c", sans-serif',
										}}
									>
										{buttonText}
									</Button>
								</Stack>
							</form>
						</>
					) : (
						<Box
							style={{
								textAlign: 'center',
								padding: '20px 0',
								animation: 'fadeIn 0.5s ease-in-out',
							}}
						>
							<Title
								order={2}
								style={{
									color: '#fff',
									fontSize: '24px',
									marginBottom: '15px',
								}}
							>
								Check your email
							</Title>
							<Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
								We've sent a magic link to{' '}
								<Text component="span" style={{ color: '#f39800', fontWeight: 'bold' }}>
									{form.values.email}
								</Text>
								. Click the link in the email to sign in.
							</Text>
						</Box>
					)}
				</div>
			</Paper>
		</PageContainer>
	);
}
