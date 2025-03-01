# TCG Engine Component Library

This directory contains the shared component library for the TCG Engine. The components are organized by domain and follow consistent patterns for maintainability and reusability.

## Directory Structure

```
components/
├── base/           # Base UI components (buttons, inputs, etc.)
├── card/           # Card-related components
├── game/           # Game-specific components
├── auth/           # Authentication components
├── layout/         # Layout components
├── effects/        # Visual effects and animations
└── ui/             # Higher-level UI components
```

## Component Guidelines

### 1. File Structure

Each component should have:

- Component file (ComponentName.tsx)
- Styles file (ComponentName.module.css)
- Types file (ComponentName.types.ts) if complex
- Test file (ComponentName.test.tsx)
- Stories file (ComponentName.stories.tsx) if visual

### 2. Component Pattern

```typescript
import styles from './ComponentName.module.css';
import type { ComponentNameProps } from './ComponentName.types';

export const ComponentName: React.FC<ComponentNameProps> = ({ prop1, prop2, children }) => {
	return <div className={styles.root}>{children}</div>;
};
```

### 3. Styling Guidelines

- Use CSS Modules for component styling
- Follow BEM-like naming: `componentName_element_modifier`
- Use CSS variables for theming
- Keep styles scoped to components
- Use CSS Grid/Flexbox for layouts

### 4. Props Interface Pattern

```typescript
export interface ComponentNameProps {
	/** Description of the prop */
	prop1: string;
	/** Description of the optional prop */
	prop2?: number;
	/** Description of the callback */
	onEvent?: (value: string) => void;
	/** Description of the children */
	children?: React.ReactNode;
}
```

### 5. Testing Guidelines

- Test component rendering
- Test user interactions
- Test prop variations
- Test error states
- Use React Testing Library

### 6. Documentation

- Add JSDoc comments for components and props
- Include usage examples
- Document any complex logic
- Keep props documentation up to date

### 7. Accessibility

- Use semantic HTML
- Include ARIA attributes
- Support keyboard navigation
- Test with screen readers
- Follow WCAG guidelines

### 8. Performance

- Memoize when needed
- Lazy load heavy components
- Optimize re-renders
- Monitor bundle size

## Usage Example

```typescript
import { Button } from '@tcg/components/base';
import { Card } from '@tcg/components/card';

const MyComponent = () => {
	return (
		<div>
			<Card>
				<Button variant="primary">Click Me</Button>
			</Card>
		</div>
	);
};
```

## Contributing

1. Follow the component pattern
2. Add proper documentation
3. Include tests
4. Update stories if visual
5. Ensure accessibility
6. Test performance
7. Get code review
