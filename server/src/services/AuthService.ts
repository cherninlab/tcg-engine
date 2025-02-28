import { Context } from 'hono';
import { Resend } from 'resend';

interface MagicLinkToken {
	email: string;
	expiresAt: number;
}

export class AuthService {
	private static readonly MAGIC_LINK_EXPIRY = 15 * 60 * 1000; // 15 minutes in milliseconds
	private static readonly TOKEN_PREFIX = 'magic_link_token:';

	/**
	 * Sends a magic link to the user's email
	 */
	static async sendMagicLink(c: Context<{ Bindings: Env }>, email: string): Promise<void> {
		try {
			console.log(`[Email Service] Starting magic link process for ${email}`);

			// Generate a secure token
			const token = crypto.randomUUID();
			console.log(`[Email Service] Generated token: ${token}`);

			// Store token with email and expiry
			const tokenData: MagicLinkToken = {
				email,
				expiresAt: Date.now() + this.MAGIC_LINK_EXPIRY,
			};

			// Store in KV with expiry
			console.log(`[Email Service] Storing token in KV with expiry: ${this.MAGIC_LINK_EXPIRY / 1000}s`);
			await c.env.SESSION_KV.put(
				`${this.TOKEN_PREFIX}${token}`,
				JSON.stringify(tokenData),
				{ expirationTtl: this.MAGIC_LINK_EXPIRY / 1000 } // KV expiry in seconds
			);

			const resend = new Resend('re_XqE6F3v7_FavKJ4qwiz9oHJw6z2Z3VZmF');
			
			const data = await resend.emails.send({
				from: 'TCG <noreply@cherninlab.com>',
				to: [email],
				subject: 'Your Magic Link to TCG',
				html: `<p>Welcome to TCG! <a href="${c.env.CLIENT_URL}/auth/verify?token=${token}">Click here to login</a></p>`,
			});

			console.log(`[Email Service] Email sent successfully: ${data}`);
		} catch (error) {
			console.error('[Email Service] Error in sendMagicLink:', error);
			throw new Error('Failed to send magic link');
		}
	}

	/**
	 * Verifies a magic link token and returns user data with auth token
	 */
	static async verifyMagicLink(c: Context<{ Bindings: Env }>, token: string): Promise<{ token: string; user: any }> {
		try {
			// Retrieve token data
			const tokenKey = `${this.TOKEN_PREFIX}${token}`;
			const tokenDataStr = await c.env.SESSION_KV.get(tokenKey);

			if (!tokenDataStr) {
				throw new Error('Invalid or expired token');
			}

			const tokenData = JSON.parse(tokenDataStr) as MagicLinkToken;

			// Check if token is expired
			if (tokenData.expiresAt < Date.now()) {
				// Clean up expired token
				await c.env.SESSION_KV.delete(tokenKey);
				throw new Error('Token has expired');
			}

			// Get or create user
			const user = await this.getOrCreateUser(c, tokenData.email);

			// Generate auth token
			const authToken = crypto.randomUUID();

			// Store auth token with user ID
			await c.env.SESSION_KV.put(
				`auth_token:${authToken}`,
				JSON.stringify({ userId: user.id }),
				{ expirationTtl: 7 * 24 * 60 * 60 } // 7 days in seconds
			);

			// Delete the used magic link token
			await c.env.SESSION_KV.delete(tokenKey);

			return {
				token: authToken,
				user,
			};
		} catch (error) {
			console.error('Error verifying magic link:', error);
			throw error;
		}
	}

	/**
	 * Gets or creates a user by email
	 */
	private static async getOrCreateUser(c: Context<{ Bindings: Env }>, email: string): Promise<any> {
		try {
			// Check if user exists
			const userKey = `user:email:${email}`;
			const existingUser = await c.env.PLAYER_KV.get(userKey);

			if (existingUser) {
				const user = JSON.parse(existingUser);

				// Update last login time
				user.lastLogin = new Date().toISOString();
				await c.env.PLAYER_KV.put(userKey, JSON.stringify(user));

				return user;
			}

			// Create new user
			const userId = crypto.randomUUID();
			const now = new Date().toISOString();

			// Determine role based on email domain (for demo purposes)
			const isAdmin = email.endsWith('@admin.com');

			const newUser = {
				id: userId,
				email,
				username: email.split('@')[0], // Simple username from email
				role: isAdmin ? 'admin' : 'user',
				createdAt: now,
				lastLogin: now,
			};

			// Store user by email and ID
			await c.env.PLAYER_KV.put(userKey, JSON.stringify(newUser));
			await c.env.PLAYER_KV.put(`user:id:${userId}`, JSON.stringify(newUser));

			return newUser;
		} catch (error) {
			console.error('Error getting or creating user:', error);
			throw new Error('Failed to process user data');
		}
	}

	/**
	 * Validates an auth token and returns the associated user
	 */
	static async validateToken(c: Context<{ Bindings: Env }>, token: string): Promise<any> {
		try {
			if (!token) {
				throw new Error('No token provided');
			}

			// Get token data
			const tokenData = await c.env.SESSION_KV.get(`auth_token:${token}`);
			if (!tokenData) {
				throw new Error('Invalid or expired token');
			}

			const { userId } = JSON.parse(tokenData);

			// Get user data
			const userData = await c.env.PLAYER_KV.get(`user:id:${userId}`);
			if (!userData) {
				throw new Error('User not found');
			}

			return JSON.parse(userData);
		} catch (error) {
			console.error('Error validating token:', error);
			throw error;
		}
	}
}
