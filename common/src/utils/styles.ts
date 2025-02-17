import clsx, { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
	return clsx(inputs);
}

// Type for CSS modules
export type CSSModule = {
	readonly [key: string]: string;
};

// Helper to combine CSS module classes with conditional classes
export function createStyles(styles: CSSModule) {
	return {
		cls: (className: keyof typeof styles, ...additional: ClassValue[]) => cn(styles[className as string], ...additional),
		classes: styles,
	};
}
