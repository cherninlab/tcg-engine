import { Button, Container, Group, Text, Title } from '@mantine/core';
import { useNavigate, useRouteError } from 'react-router-dom';

export const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <Container size="md" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <Title order={1} mb="xl">
        Oops! Something went wrong
      </Title>
      <Text mb="xl" c="dimmed">
        {error instanceof Error ? error.message : 'An unexpected error occurred'}
      </Text>
      <Group justify="center">
        <Button onClick={() => navigate(-1)}>Go Back</Button>
        <Button onClick={() => navigate('/')} variant="light">
          Go Home
        </Button>
      </Group>
    </Container>
  );
};
