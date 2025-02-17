import { Anchor, Button, Center, Paper, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { loginCredentialsSchema } from '@tcg/common/schemas/auth';
import { LoginCredentials } from '@tcg/common/types/auth';
import { zodResolver } from '@tcg/common/utils/schema';
import { useState } from 'react';

function LoginPage() {
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<LoginCredentials>({
		initialValues: {
			email: '',
			password: '',
		},
		validate: zodResolver(loginCredentialsSchema),
	});

	const handleSubmit = async (values: LoginCredentials) => {
		setIsLoading(true);
		try {
			// TODO: Implement actual login logic
			console.log('Login attempt with:', values);
		} catch (error) {
			form.setErrors({ email: 'Invalid credentials' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Center h="100vh">
			<Paper p={30} maw={400} w="100%" mx="auto">
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Stack>
						<TextInput required label="Email" placeholder="hello@example.com" {...form.getInputProps('email')} />

						<PasswordInput required label="Password" placeholder="Your password" {...form.getInputProps('password')} />

						<Button type="submit" fullWidth mt="xl" loading={isLoading}>
							Sign in
						</Button>
					</Stack>
				</form>

				<Text ta="center" mt="md">
					Don&apos;t have an account?{' '}
					<Anchor href="/auth/register" fw={700}>
						Register
					</Anchor>
				</Text>

				<Anchor href="/auth/forgot-password" ta="center" display="block" mt="sm" size="sm">
					Forgot password?
				</Anchor>
			</Paper>
		</Center>
	);
}

export default LoginPage;
