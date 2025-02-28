import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { notifications } from '@mantine/notifications';
import { Center, Loader, Stack, Text } from '@mantine/core';

function VerifyTokenPage() {
  const { verifyToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/auth/login');
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
        navigate('/auth/login');
      });
  }, [token, verifyToken, navigate]);

  return (
    <Center h="100vh">
      <Stack align="center" gap="md">
        <Loader size="xl" />
        <Text size="lg">Verifying your login...</Text>
      </Stack>
    </Center>
  );
}

export default VerifyTokenPage;
