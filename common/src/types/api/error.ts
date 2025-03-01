import { z } from '@hono/zod-openapi';

/**
 * Schema Definitions
 * -----------------
 */

/**
 * Enum of all possible error codes in the application
 */
export const ErrorCode = {
	// Authentication errors
	INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
	TOKEN_EXPIRED: 'TOKEN_EXPIRED',
	INVALID_TOKEN: 'INVALID_TOKEN',
	UNAUTHORIZED: 'UNAUTHORIZED',
	FORBIDDEN: 'FORBIDDEN',
	// Input validation errors
	INVALID_INPUT: 'INVALID_INPUT',
	MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
	INVALID_FORMAT: 'INVALID_FORMAT',
	// Resource errors
	NOT_FOUND: 'NOT_FOUND',
	ALREADY_EXISTS: 'ALREADY_EXISTS',
	CONFLICT: 'CONFLICT',
	// Game logic errors
	INVALID_GAME_STATE: 'INVALID_GAME_STATE',
	INVALID_ACTION: 'INVALID_ACTION',
	INVALID_TARGET: 'INVALID_TARGET',
	INSUFFICIENT_RESOURCES: 'INSUFFICIENT_RESOURCES',
	// System errors
	INTERNAL_ERROR: 'INTERNAL_ERROR',
	SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
	DATABASE_ERROR: 'DATABASE_ERROR',
	NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

/**
 * Schema for error details
 * Provides detailed information about a specific error
 */
export const ErrorDetailSchema = z
	.object({
		field: z.string().optional().openapi({
			description: 'Field that caused the error',
			example: 'email',
		}),
		message: z.string().openapi({
			description: 'Detailed error message',
			example: 'Email must be a valid email address',
		}),
		code: z.string().optional().openapi({
			description: 'Error code specific to this detail',
			example: 'INVALID_FORMAT',
		}),
		params: z
			.record(z.unknown())
			.optional()
			.openapi({
				description: 'Additional parameters related to the error',
				example: { min: 1, max: 100 },
			}),
	})
	.openapi({
		description: 'Detailed information about a specific error',
	});

/**
 * Schema for API errors
 * Used for standardized error responses across the API
 */
export const APIErrorSchema = z
	.object({
		code: z
			.enum([
				ErrorCode.INVALID_CREDENTIALS,
				ErrorCode.TOKEN_EXPIRED,
				ErrorCode.INVALID_TOKEN,
				ErrorCode.UNAUTHORIZED,
				ErrorCode.FORBIDDEN,
				ErrorCode.INVALID_INPUT,
				ErrorCode.MISSING_REQUIRED_FIELD,
				ErrorCode.INVALID_FORMAT,
				ErrorCode.NOT_FOUND,
				ErrorCode.ALREADY_EXISTS,
				ErrorCode.CONFLICT,
				ErrorCode.INVALID_GAME_STATE,
				ErrorCode.INVALID_ACTION,
				ErrorCode.INVALID_TARGET,
				ErrorCode.INSUFFICIENT_RESOURCES,
				ErrorCode.INTERNAL_ERROR,
				ErrorCode.SERVICE_UNAVAILABLE,
				ErrorCode.DATABASE_ERROR,
				ErrorCode.NETWORK_ERROR,
			] as const)
			.openapi({
				description: 'Error code identifying the type of error',
				example: ErrorCode.INVALID_INPUT,
			}),
		message: z.string().openapi({
			description: 'Human-readable error message',
			example: 'Invalid input parameters',
		}),
		details: z.array(ErrorDetailSchema).optional().openapi({
			description: 'Additional error details',
		}),
		stack: z.string().optional().openapi({
			description: 'Stack trace (only included in development)',
			example: 'Error: Invalid input\n    at validateInput (/app/src/validators.ts:10:5)',
		}),
	})
	.openapi({
		description: 'API error response',
	});

/**
 * Type Definitions
 * ---------------
 */

/**
 * Type for error codes
 */
export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * Error detail type
 */
export type ErrorDetail = z.infer<typeof ErrorDetailSchema>;

/**
 * API error type
 */
export type APIErrorType = z.infer<typeof APIErrorSchema>;

/**
 * API-Specific Implementations
 * --------------------------
 */

/**
 * Custom error class for API errors
 * Extends the standard Error class with API-specific fields
 */
export class APIError extends Error {
	/**
	 * Create a new API error
	 * @param code Error code from the ErrorCode enum
	 * @param message Human-readable error message
	 * @param details Optional additional error details
	 * @param status HTTP status code to use (defaults based on error code)
	 */
	constructor(public code: ErrorCodeType, message: string, public details?: ErrorDetail[], public status?: number) {
		super(message);
		this.name = 'APIError';
	}

	/**
	 * Convert the error to a response object
	 * @returns Standardized error response object
	 */
	toResponse(): APIErrorType {
		const response: APIErrorType = {
			code: this.code as any, // Type coercion needed due to z.enum constraint
			message: this.message,
		};

		if (this.details) {
			response.details = this.details;
		}

		// Only include stack trace in development
		if (process.env.NODE_ENV === 'development') {
			response.stack = this.stack;
		}

		return response;
	}

	/**
	 * Get appropriate HTTP status code for this error
	 * @returns HTTP status code
	 */
	getStatus(): number {
		if (this.status) return this.status;

		// Default status codes based on error type
		switch (this.code) {
			case ErrorCode.INVALID_CREDENTIALS:
			case ErrorCode.TOKEN_EXPIRED:
			case ErrorCode.INVALID_TOKEN:
			case ErrorCode.UNAUTHORIZED:
				return 401;
			case ErrorCode.FORBIDDEN:
				return 403;
			case ErrorCode.NOT_FOUND:
				return 404;
			case ErrorCode.ALREADY_EXISTS:
			case ErrorCode.CONFLICT:
				return 409;
			case ErrorCode.INVALID_INPUT:
			case ErrorCode.MISSING_REQUIRED_FIELD:
			case ErrorCode.INVALID_FORMAT:
				return 400;
			case ErrorCode.INVALID_GAME_STATE:
			case ErrorCode.INVALID_ACTION:
			case ErrorCode.INVALID_TARGET:
			case ErrorCode.INSUFFICIENT_RESOURCES:
				return 422;
			case ErrorCode.SERVICE_UNAVAILABLE:
				return 503;
			case ErrorCode.INTERNAL_ERROR:
			case ErrorCode.DATABASE_ERROR:
			case ErrorCode.NETWORK_ERROR:
			default:
				return 500;
		}
	}
}

/**
 * Factory functions for common errors
 */
export const Errors = {
	/**
	 * Create a not found error
	 * @param resource Resource type that wasn't found
	 * @param id ID of the resource
	 * @returns APIError instance
	 */
	notFound: (resource: string, id?: string): APIError => {
		const message = id ? `${resource} with ID ${id} not found` : `${resource} not found`;
		return new APIError(ErrorCode.NOT_FOUND, message);
	},

	/**
	 * Create an unauthorized error
	 * @param message Custom message (optional)
	 * @returns APIError instance
	 */
	unauthorized: (message = 'Unauthorized'): APIError => {
		return new APIError(ErrorCode.UNAUTHORIZED, message);
	},

	/**
	 * Create an invalid input error
	 * @param details Validation error details
	 * @returns APIError instance
	 */
	invalidInput: (details: ErrorDetail[]): APIError => {
		return new APIError(ErrorCode.INVALID_INPUT, 'Invalid input parameters', details);
	},

	/**
	 * Create a server error
	 * @param message Error message (optional)
	 * @param originalError Original error that caused the server error
	 * @returns APIError instance
	 */
	serverError: (message = 'Internal server error', originalError?: Error): APIError => {
		const error = new APIError(ErrorCode.INTERNAL_ERROR, message);
		if (originalError && process.env.NODE_ENV === 'development') {
			error.stack = originalError.stack;
		}
		return error;
	},
};
