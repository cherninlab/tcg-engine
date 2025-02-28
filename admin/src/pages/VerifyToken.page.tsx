import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notifications } from '@mantine/notifications';
import { Center, Loader, Stack, Text } from '@mantine/core';

export function VerifyTokenPage() {
  const { verifyToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

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
        navigate('/login');
      });
  }, [token, verifyToken, navigate]);

  return (
    <Center h="100vh">
      <Stack align="center" gap="md">
        <Loader size="xl" />
        <Text size="lg">Verifying your admin access...</Text>
      </Stack>
    </Center>
  );
}
