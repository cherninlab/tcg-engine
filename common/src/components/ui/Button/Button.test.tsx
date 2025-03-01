import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Button } from './Button';

describe('Button', () => {
	it('renders children correctly', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});

	it('applies variant classes correctly', () => {
		const { container } = render(<Button variant="secondary">Button</Button>);
		expect(container.firstChild).toHaveClass('secondary');
	});

	it('applies size classes correctly', () => {
		const { container } = render(<Button size="large">Button</Button>);
		expect(container.firstChild).toHaveClass('large');
	});

	it('handles disabled state correctly', () => {
		render(<Button disabled>Button</Button>);
		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
		expect(button).toHaveClass('disabled');
	});

	it('handles loading state correctly', () => {
		const { container } = render(<Button loading>Button</Button>);
		expect(container.querySelector('.spinner')).toBeInTheDocument();
		expect(screen.getByRole('button')).toBeDisabled();
	});

	it('handles click events correctly', () => {
		const handleClick = jest.fn();
		render(<Button onClick={handleClick}>Button</Button>);
		fireEvent.click(screen.getByRole('button'));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('renders icons correctly', () => {
		const startIcon = <span data-testid="start-icon">→</span>;
		const endIcon = <span data-testid="end-icon">←</span>;

		render(
			<Button startIcon={startIcon} endIcon={endIcon}>
				Button
			</Button>
		);

		expect(screen.getByTestId('start-icon')).toBeInTheDocument();
		expect(screen.getByTestId('end-icon')).toBeInTheDocument();
	});

	it('shows tooltip on hover', async () => {
		render(<Button tooltip="Help text">Button</Button>);
		const tooltip = screen.getByText('Help text');
		expect(tooltip).toHaveClass('tooltip');
	});

	it('applies fullWidth class when specified', () => {
		const { container } = render(<Button fullWidth>Button</Button>);
		expect(container.firstChild).toHaveClass('fullWidth');
	});

	it('applies active class when specified', () => {
		const { container } = render(<Button active>Button</Button>);
		expect(container.firstChild).toHaveClass('active');
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLButtonElement>();
		render(<Button ref={ref}>Button</Button>);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});
});
