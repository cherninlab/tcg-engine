import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <Container size="md" py="xl">
                    <Stack align="center" spacing="lg">
                        <Title>Something went wrong</Title>
                        <Text c="dimmed" size="lg" ta="center">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </Text>
                        <Button onClick={() => window.location.reload()}>Refresh Page</Button>
                    </Stack>
                </Container>
            );
        }

        return this.props.children;
    }
}
