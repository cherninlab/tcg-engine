import { Box, Button, Paper, PaperProps, Text, Title } from '@mantine/core';
import React, { ReactNode } from 'react';
import { UI_CONSTANTS } from '../../theme';

export interface FeatureCardProps extends Omit<PaperProps, 'children'> {
  icon?: ReactNode;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

/**
 * FeatureCard component for displaying featured content with consistent styling
 * Used for home page features, dashboard cards, etc.
 */
export function FeatureCard({
  icon,
  title,
  description,
  buttonText,
  onButtonClick,
  className = '',
  ...paperProps
}: FeatureCardProps) {
  return (
    <Paper
      className={className}
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '10px',
        padding: '20px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: `all ${UI_CONSTANTS.ANIMATIONS.DURATION.MEDIUM} ${UI_CONSTANTS.ANIMATIONS.TIMING}`,
        marginBottom: '20px',
        border: UI_CONSTANTS.BORDERS.CARD,
      }}
      {...paperProps}
    >
      {icon && (
        <Box
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '15px',
            color: '#f39800',
            border: UI_CONSTANTS.BORDERS.CARD_HIGHLIGHT,
          }}
        >
          {icon}
        </Box>
      )}

      <Title
        order={3}
        style={{
          color: 'white',
          marginBottom: '10px',
          fontSize: '20px',
        }}
      >
        {title}
      </Title>

      <Text
        style={{
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '15px',
          flex: 1,
        }}
      >
        {description}
      </Text>

      {buttonText && (
        <Button
          variant="light"
          onClick={onButtonClick}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: `background ${UI_CONSTANTS.ANIMATIONS.DURATION.MEDIUM} ${UI_CONSTANTS.ANIMATIONS.TIMING}`,
          }}
        >
          {buttonText}
        </Button>
      )}
    </Paper>
  );
}
