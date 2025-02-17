const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8787';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

export const api = {
    // Cards
    getCards: () => fetchApi('/cards'),
    createCard: (data: unknown) => fetchApi('/cards', { method: 'POST', body: JSON.stringify(data) }),
    updateCard: (id: string, data: unknown) => fetchApi(`/cards/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCard: (id: string) => fetchApi(`/cards/${id}`, { method: 'DELETE' }),

    // Decks
    getDecks: () => fetchApi('/decks'),
    createDeck: (data: unknown) => fetchApi('/decks', { method: 'POST', body: JSON.stringify(data) }),
    updateDeck: (id: string, data: unknown) => fetchApi(`/decks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteDeck: (id: string) => fetchApi(`/decks/${id}`, { method: 'DELETE' }),

    // Players
    getPlayers: () => fetchApi('/players'),
    createPlayer: (data: unknown) => fetchApi('/players', { method: 'POST', body: JSON.stringify(data) }),
    updatePlayer: (id: string, data: unknown) => fetchApi(`/players/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deletePlayer: (id: string) => fetchApi(`/players/${id}`, { method: 'DELETE' }),
};
