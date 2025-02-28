import { Button, Paper, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import clsx from 'clsx';
import { useState } from 'react';
import styles from './LoginPage.module.css';

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
		<div className={styles.loginContainer} style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}>
			<Paper className={styles.loginCard}>
				<div className={styles.loginCardInner}>
					{!submitted ? (
						<>
							<Text className={styles.loginTitle}>{title}</Text>

							<Text className={styles.loginSubtitle}>{subtitle}</Text>

							<form onSubmit={form.onSubmit(handleSubmit)}>
								<Stack>
									<TextInput
										placeholder="you@example.com"
										required
										size="md"
										classNames={{
											input: styles.loginInput,
											label: styles.loginInputLabel,
										}}
										autoComplete="email"
										{...form.getInputProps('email')}
									/>

									{error && <Text className={styles.loginError}>{error}</Text>}

									<Button type="submit" fullWidth loading={loading} className={styles.loginButton}>
										{buttonText}
									</Button>
								</Stack>
							</form>
						</>
					) : (
						<div className={clsx(styles.loginSuccessContainer, styles.loginSuccessAnimation)}>
							<Text className={styles.loginSuccessTitle}>Check your email</Text>
							<Text className={styles.loginSuccessMessage}>
								We've sent a magic link to <span className={styles.loginSuccessEmail}>{form.values.email}</span>. Click the link in the
								email to sign in.
							</Text>
						</div>
					)}
				</div>
			</Paper>
		</div>
	);
}
