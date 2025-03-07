// Generated by Wrangler by running `wrangler types`

interface Env {
	CARD_KV: KVNamespace;
	PLAYER_KV: KVNamespace;
	DECK_KV: KVNamespace;
	SESSION_KV: KVNamespace;
	CLIENT_URL: string;
	ADMIN_URL: string;
	API_URL: string;
	ENVIRONMENT: string;
	CARD_IMAGES: R2Bucket;
	GAME_ASSETS: R2Bucket;
	RESEND_API_KEY: string;
}
