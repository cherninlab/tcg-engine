import { Button, Paper, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

function ForgotPasswordPage() {
	const form = useForm({
		initialValues: {
			email: '',
		},
		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
		},
	});

	const handleSubmit = async (values: { email: string }) => {
		// TODO: Implement password reset logic
		console.log('Reset password for:', values.email);
	};

	return (
		<Paper radius="md" p="xl" withBorder>
			<Title order={2} ta="center" mt="md" mb={50}>
				Forgot your password?
			</Title>

			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Stack>
					<TextInput required label="Email" placeholder="hello@example.com" {...form.getInputProps('email')} />

					<Button fullWidth mt="xl" type="submit">
						Reset password
					</Button>
				</Stack>
			</form>
		</Paper>
	);
}

export default ForgotPasswordPage;
