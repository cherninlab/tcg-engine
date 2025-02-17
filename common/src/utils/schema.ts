import { z } from 'zod';

export function zodResolver<T extends z.ZodType>(schema: T) {
	return (values: z.infer<T>) => {
		const result = schema.safeParse(values);
		if (!result.success) {
			return result.error.errors.reduce((acc, error) => {
				const path = error.path.join('.');
				acc[path] = error.message;
				return acc;
			}, {} as Record<string, string>);
		}
		return {};
	};
}

export function validateSchema<T extends z.ZodType>(schema: T, data: unknown): data is z.infer<T> {
	const result = schema.safeParse(data);
	return result.success;
}
