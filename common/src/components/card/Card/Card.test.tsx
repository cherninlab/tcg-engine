import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Card } from './Card';

describe('Card', () => {
	it('renders children correctly', () => {
		render(<Card>Card content</Card>);
		expect(screen.getByText('Card content')).toBeInTheDocument();
	});

	it('applies elevation classes correctly', () => {
		const { container } = render(<Card elevation="high">Card</Card>);
		expect(container.firstChild).toHaveClass('high');
	});

	it('applies border classes correctly', () => {
		const { container } = render(<Card border="medium">Card</Card>);
		expect(container.firstChild).toHaveClass('border-medium');
	});

	it('applies size modifiers correctly', () => {
		const { container } = render(
			<Card fullWidth fullHeight>
				Card
			</Card>
		);
		expect(container.firstChild).toHaveClass('fullWidth');
		expect(container.firstChild).toHaveClass('fullHeight');
	});

	it('handles click events correctly', () => {
		const handleClick = jest.fn();
		render(<Card onClick={handleClick}>Card</Card>);
		fireEvent.click(screen.getByText('Card'));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('applies clickable class when clickable or has onClick', () => {
		const { container: container1 } = render(<Card clickable>Card</Card>);
		expect(container1.firstChild).toHaveClass('clickable');

		const { container: container2 } = render(<Card onClick={() => {}}>Card</Card>);
		expect(container2.firstChild).toHaveClass('clickable');
	});

	it('applies selected class when selected', () => {
		const { container } = render(<Card selected>Card</Card>);
		expect(container.firstChild).toHaveClass('selected');
	});

	it('handles disabled state correctly', () => {
		const handleClick = jest.fn();
		const { container } = render(
			<Card disabled onClick={handleClick}>
				Card
			</Card>
		);

		expect(container.firstChild).toHaveClass('disabled');
		fireEvent.click(screen.getByText('Card'));
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('renders header and footer correctly', () => {
		render(
			<Card header={<div>Header</div>} footer={<div>Footer</div>}>
				Content
			</Card>
		);

		expect(screen.getByText('Header')).toBeInTheDocument();
		expect(screen.getByText('Content')).toBeInTheDocument();
		expect(screen.getByText('Footer')).toBeInTheDocument();
	});

	it('applies background image correctly', () => {
		const { container } = render(<Card backgroundImage="test.jpg">Card</Card>);

		expect(container.firstChild).toHaveClass('hasBackgroundImage');
		expect(container.firstChild).toHaveStyle({
			backgroundImage: 'url(test.jpg)',
		});
	});

	it('applies hover effect classes correctly', () => {
		const { container } = render(<Card hoverEffect="lift">Card</Card>);
		expect(container.firstChild).toHaveClass('hover-lift');
	});

	it('forwards ref correctly', () => {
		const ref = React.createRef<HTMLDivElement>();
		render(<Card ref={ref}>Card</Card>);
		expect(ref.current).toBeInstanceOf(HTMLDivElement);
	});
});
