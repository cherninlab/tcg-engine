# TCG Engine

A high-performance, type-safe card game engine built with Cloudflare Workers, Hono, and Zod.

## Features

- **State Management**: Persistent game states using Durable Objects.
- **Action Processing**: Simplified action handling with validation.
- **Matchmaking**: Efficient player matching with minimal complexity.
- **Collection Management**: Streamlined card collection management.

## Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/cherninlab/tcg-engine.git
   cd tcg-engine
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   cp .env.example .env
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

## API Endpoints

### Actions

- **POST /action/actions**: Process an action.
  - **Request Body**: Action data.
  - **Response**: Action response.

### Cards

- **GET /cards**: Fetch all cards.
  - **Response**: Array of cards.
- **GET /cards/:cardId**: Fetch a specific card.
  - **Path Parameter**: `cardId`
  - **Response**: Card object.

### Decks

- **POST /decks**: Create a new deck.
  - **Request Body**: Deck data.
  - **Response**: Created deck.
- **GET /decks/:deckId**: Fetch a specific deck.
  - **Path Parameter**: `deckId`
  - **Response**: Deck object.
- **PUT /decks/:deckId**: Update a deck.
  - **Path Parameter**: `deckId`
  - **Request Body**: Update data.
  - **Response**: Updated deck.

### Economy

- **POST /economy/purchase**: Purchase an item.
  - **Request Body**: Purchase data.
  - **Response**: Purchase confirmation.
- **GET /economy/balance**: Get player balance.
  - **Query Parameter**: `playerId`
  - **Response**: Player balance.

### Players

- **POST /players**: Create a new player.
  - **Request Body**: Player data.
  - **Response**: Created player.
- **GET /players/:playerId**: Fetch a specific player.
  - **Path Parameter**: `playerId`
  - **Response**: Player object.
- **PUT /players/:playerId**: Update a player.
  - **Path Parameter**: `playerId`
  - **Request Body**: Update data.
  - **Response**: Updated player.

### Sessions

- **POST /sessions**: Create a new session.
  - **Request Body**: Session data.
  - **Response**: Created session.
- **POST /sessions/join**: Join an existing session.
  - **Request Body**: Join data.
  - **Response**: Updated session.
- **GET /sessions/:sessionId**: Fetch a specific session.
  - **Path Parameter**: `sessionId`
  - **Response**: Session object.

## Environment Variables

- **CARD_KV**: KV Namespace for card data.
- **PLAYER_KV**: KV Namespace for player data.
- **DECK_KV**: KV Namespace for deck data.
- **SESSION_KV**: KV Namespace for session data.
- **CARD_IMAGES**: R2 Bucket for card images.
- **GAME_ASSETS**: R2 Bucket for game assets.

## Error Messages

Common error messages that may be encountered:

- `invalidAction`: Invalid action performed.
- `insufficientFunds`: Insufficient funds for this transaction.
- `invalidDeck`: Deck does not meet the required criteria.
- `sessionExpired`: Game session has expired.
- `unauthorized`: Unauthorized access.
- `rateLimitExceeded`: Too many requests.
- `serverError`: Internal server error occurred.
