import { Center, Loader, Stack, Text } from '@mantine/core';

interface PageLoaderProps {
    message?: string;
}

export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
    return (
        <Center h="100%">
            <Stack align="center" gap="xs">
                <Loader size="lg" />
                <Text size="sm" c="dimmed">
                    {message}
                </Text>
            </Stack>
        </Center>
    );
}
