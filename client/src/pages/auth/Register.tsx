import { Anchor, Button, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

interface RegisterFormValues {
	email: string;
	password: string;
	confirmPassword: string;
}

function RegisterPage() {
	const form = useForm<RegisterFormValues>({
		initialValues: {
			email: '',
			password: '',
			confirmPassword: '',
		},
		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
			confirmPassword: (value, values) => (value !== values.password ? 'Passwords did not match' : null),
		},
	});

	const handleSubmit = async (values: RegisterFormValues) => {
		// TODO: Implement registration logic
		console.log('Register attempt with:', values);
	};

	return (
		<div
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'var(--mantine-color-dark-8)',
			}}
		>
			<Paper radius="md" p="xl" withBorder maw={400} w="100%" mx="auto">
				<Title order={2} ta="center" mt="md" mb="md">
					Create an account
				</Title>

				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack>
						<TextInput required label="Email" placeholder="hello@example.com" {...form.getInputProps('email')} />

						<PasswordInput required label="Password" placeholder="Your password" {...form.getInputProps('password')} />

						<PasswordInput
							required
							label="Confirm Password"
							placeholder="Confirm your password"
							{...form.getInputProps('confirmPassword')}
						/>

						<Button fullWidth mt="xl" type="submit">
							Register
						</Button>
					</Stack>
				</form>

				<Text ta="center" mt="md">
					Already have an account?{' '}
					<Anchor href="/auth/login" fw={700}>
						Sign in
					</Anchor>
				</Text>
			</Paper>
		</div>
	);
}

export default RegisterPage;
