import { LoginPage as CommonLoginPage } from '@tcg/common';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { notifications } from '@mantine/notifications';

export function LoginPage() {
  const { login, loading, error, verifyToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Handle magic link token verification
  useEffect(() => {
    if (token) {
      verifyToken(token)
        .then(() => {
          navigate('/');
        })
        .catch((err) => {
          notifications.show({
            title: 'Authentication Error',
            message: err.message || 'Failed to verify login token',
            color: 'red',
          });
        });
    }
  }, [token, verifyToken, navigate]);

  const handleSubmit = async (email: string) => {
    try {
      await login(email);
    } catch (err) {
      // Error is already handled in the login function
      console.error('Login error:', err);
    }
  };

  return (
    <CommonLoginPage
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      title="Admin Dashboard"
      subtitle="Enter your admin email to receive a magic link"
      buttonText="Send magic link"
    />
  );
}
