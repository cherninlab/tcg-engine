import { notifications } from '@mantine/notifications';
import { LoginPage } from '@rism-tcg/common';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import bgTile from '../../assets/bg-tile-512.png';
import { useAuth } from '../../hooks/useAuth';

function ClientLoginPage() {
	const { login, loading, error, verifyToken } = useAuth();
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');

	// Handle magic link token verification
	useEffect(() => {
		if (token) {
			verifyToken(token).catch((err) => {
				notifications.show({
					title: 'Authentication Error',
					message: err.message || 'Failed to verify login token',
					color: 'red',
				});
			});
		}
	}, [token, verifyToken]);

	const handleSubmit = async (email: string) => {
		try {
			await login(email);
		} catch (err) {
			// Error is already handled in the login function
			console.error('Login error:', err);
		}
	};

	return (
		<LoginPage
			onSubmit={handleSubmit}
			loading={loading}
			error={error}
			title="LOG IN"
			subtitle="Enter your email to receive a magic link"
			buttonText="Send magic link"
			bgImage={bgTile}
		/>
	);
}

export default ClientLoginPage;
