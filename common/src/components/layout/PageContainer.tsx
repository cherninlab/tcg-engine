import { Box, Container, ContainerProps, MantineSize } from '@mantine/core';
import React, { ReactNode } from 'react';
import { UI_CONSTANTS } from '../../theme';

export interface PageContainerProps {
  children: ReactNode;
  bgImage?: string;
  containerSize?: MantineSize | number;
  className?: string;
  containerProps?: Omit<ContainerProps, 'size'>;
}

/**
 * A unified page container component that provides consistent styling for all pages
 * Used as the outermost wrapper for all full-page content
 */
export function PageContainer({
  children,
  bgImage,
  containerSize = 'lg',
  className = '',
  containerProps
}: PageContainerProps) {
  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
        backgroundSize: '128px',
        background: !bgImage ? UI_CONSTANTS.BACKGROUNDS.PAGE : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
      className={className}
    >
      <Container size={containerSize} style={{ width: '100%', zIndex: 1 }} {...containerProps}>
        {children}
      </Container>
    </Box>
  );
}
