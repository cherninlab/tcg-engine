import { Center, Loader } from '@mantine/core';

export const PageLoader = () => {
  return (
    <Center style={{ height: '100vh' }}>
      <Loader size="xl" />
    </Center>
  );
};
