import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
	title: 'Card/Card',
	component: Card,
	tags: ['autodocs'],
	argTypes: {
		elevation: {
			control: 'select',
			options: ['none', 'low', 'medium', 'high'],
			description: 'Shadow elevation of the card',
		},
		border: {
			control: 'select',
			options: ['none', 'light', 'medium', 'heavy'],
			description: 'Border style of the card',
		},
		fullWidth: {
			control: 'boolean',
			description: 'Whether the card takes full width',
		},
		fullHeight: {
			control: 'boolean',
			description: 'Whether the card takes full height',
		},
		clickable: {
			control: 'boolean',
			description: 'Whether the card is clickable',
		},
		selected: {
			control: 'boolean',
			description: 'Whether the card is selected',
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the card is disabled',
		},
		hoverEffect: {
			control: 'select',
			options: ['none', 'lift', 'glow'],
			description: 'Hover effect to apply',
		},
		onClick: { action: 'clicked' },
	},
};

export default meta;
type Story = StoryObj<typeof Card>;

// Base card
export const Default: Story = {
	args: {
		children: 'Card content',
	},
};

// Elevation variants
export const NoElevation: Story = {
	args: {
		children: 'No elevation',
		elevation: 'none',
	},
};

export const HighElevation: Story = {
	args: {
		children: 'High elevation',
		elevation: 'high',
	},
};

// Border variants
export const LightBorder: Story = {
	args: {
		children: 'Light border',
		border: 'light',
	},
};

export const HeavyBorder: Story = {
	args: {
		children: 'Heavy border',
		border: 'heavy',
	},
};

// Interactive states
export const Clickable: Story = {
	args: {
		children: 'Click me',
		clickable: true,
		hoverEffect: 'lift',
	},
};

export const Selected: Story = {
	args: {
		children: 'Selected card',
		selected: true,
	},
};

export const Disabled: Story = {
	args: {
		children: 'Disabled card',
		disabled: true,
		clickable: true,
	},
};

// With header and footer
export const WithHeaderFooter: Story = {
	args: {
		children: 'Main content',
		header: 'Header content',
		footer: 'Footer content',
	},
};

// With background image
export const WithBackgroundImage: Story = {
	args: {
		children: 'Card with background',
		backgroundImage: 'https://picsum.photos/300/200',
		elevation: 'high',
	},
};

// Full width and height
export const FullSize: Story = {
	args: {
		children: 'Full size card',
		fullWidth: true,
		fullHeight: true,
	},
	parameters: {
		layout: 'fullscreen',
	},
};

// Hover effects
export const WithLiftEffect: Story = {
	args: {
		children: 'Hover to lift',
		hoverEffect: 'lift',
	},
};

export const WithGlowEffect: Story = {
	args: {
		children: 'Hover to glow',
		hoverEffect: 'glow',
	},
};
