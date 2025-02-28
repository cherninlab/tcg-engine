# TCG Game Template

A complete Trading Card Game (TCG) solution, using a Cloudflare Workers backend and multiple React frontends (Admin panel and Client). This monorepo provides everything you need to build, manage, and play a TCG-style game.

## Architecture Overview

### Backend (Cloudflare Workers)

- **API Layer**: Hono-based API with OpenAPI documentation
- **Service Layer**: Handles business logic and data operations
- **Data Storage**: Uses Cloudflare KV for data persistence
- **API Documentation**: Includes Scalar API Reference UI

### Frontends

- **Admin Panel**: React application for game administration
- **Client**: React application for players to interact with the game
- **Shared Code**: Common types, schemas, and utilities

## Packages

- `server/` - Includes all server logic, including routes `/api`, game configuration, and services.
- `admin/` - A React app for administrators to manage cards, decks, players, store items, and more.
- `client/` - A React app for players to build decks, view their collection, participate in matches, and handle their in-game profile.
- `common/` - Shared TypeScript types, Zod schemas, and utilities used across the server and frontends.

## Installation

1. Clone the repository
2. Install dependencies with `npm install`

## Development

To run the entire stack (server, admin, client) in parallel, use:

```bash
npm run dev
```

This leverages the concurrently package to start the server, admin, and client at once.

## Build & Production

To build all packages for production, run:

```bash
npm run build
```

This will execute the `build` script in each workspace (server, admin, client).

## Deployment

### Deploying the Server (Cloudflare Workers)

The server is designed to be deployed to Cloudflare Workers using Wrangler:

```bash
cd server
npm run deploy
```

### Deploying the Frontends (Admin & Client)

The React frontends can be deployed to any static hosting service:

1. Build the frontend: `npm run build -w admin` or `npm run build -w client`
2. Deploy the build output to your preferred hosting service

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request with a clear description of changes

## License

See the [LICENSE](LICENSE) file for details.
