import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
	title: 'Base/Button',
	component: Button,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'tertiary', 'danger'],
			description: 'Visual style variant of the button',
		},
		size: {
			control: 'select',
			options: ['small', 'medium', 'large'],
			description: 'Size of the button',
		},
		disabled: {
			control: 'boolean',
			description: 'Whether the button is disabled',
		},
		loading: {
			control: 'boolean',
			description: 'Whether to show a loading state',
		},
		fullWidth: {
			control: 'boolean',
			description: 'Whether the button should take full width',
		},
		active: {
			control: 'boolean',
			description: 'Whether the button is in an active state',
		},
		tooltip: {
			control: 'text',
			description: 'Tooltip text to show on hover',
		},
		onClick: { action: 'clicked' },
	},
};

export default meta;
type Story = StoryObj<typeof Button>;

// Base button
export const Default: Story = {
	args: {
		children: 'Button',
	},
};

// Variants
export const Primary: Story = {
	args: {
		children: 'Primary Button',
		variant: 'primary',
	},
};

export const Secondary: Story = {
	args: {
		children: 'Secondary Button',
		variant: 'secondary',
	},
};

export const Tertiary: Story = {
	args: {
		children: 'Tertiary Button',
		variant: 'tertiary',
	},
};

export const Danger: Story = {
	args: {
		children: 'Danger Button',
		variant: 'danger',
	},
};

// Sizes
export const Small: Story = {
	args: {
		children: 'Small Button',
		size: 'small',
	},
};

export const Large: Story = {
	args: {
		children: 'Large Button',
		size: 'large',
	},
};

// States
export const Disabled: Story = {
	args: {
		children: 'Disabled Button',
		disabled: true,
	},
};

export const Loading: Story = {
	args: {
		children: 'Loading Button',
		loading: true,
	},
};

export const WithTooltip: Story = {
	args: {
		children: 'Hover me',
		tooltip: 'This is a helpful tooltip',
	},
};

// With icons
export const WithStartIcon: Story = {
	args: {
		children: 'With Start Icon',
		startIcon: '→',
	},
};

export const WithEndIcon: Story = {
	args: {
		children: 'With End Icon',
		endIcon: '←',
	},
};

// Full width
export const FullWidth: Story = {
	args: {
		children: 'Full Width Button',
		fullWidth: true,
	},
};
