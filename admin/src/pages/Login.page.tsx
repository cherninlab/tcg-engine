import { Button, Center, Paper, PasswordInput, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
	const { login, loading, error } = useAuth();
	const navigate = useNavigate();

	const form = useForm({
		initialValues: {
			email: '',
			password: '',
		},
		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
			password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
		},
	});

	const handleSubmit = async (values: typeof form.values) => {
		try {
			await login(values.email, values.password);
			navigate('/');
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Center h="100vh">
			<Paper p={30} maw={400} w="100%" mx="auto">
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<TextInput label="Email" placeholder="you@example.com" required {...form.getInputProps('email')} />

					<PasswordInput label="Password" placeholder="your password" required mt="md" {...form.getInputProps('password')} />

					{error && (
						<Text c="red" size="sm" mt="sm">
							{error}
						</Text>
					)}

					<Button type="submit" fullWidth mt="xl" loading={loading}>
						Sign in
					</Button>
				</form>
			</Paper>
		</Center>
	);
}
