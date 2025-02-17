# TCG Game Template

A complete Trading Card Game (TCG) solution, using a Cloudflare Workers backend and multiple React frontends (Admin panel and Client). This monorepo provides everything you need to build, manage, and play a TCG-style game.

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

### Deploying the Frontends (Admin & Client)

## Environment Variables

## Additional Resources
