import { create } from "zustand";
import { apiRequest } from "@/lib/queryClient";

export interface Game {
  id: string;
  title: string;
  description: string;
  releaseYear: number;
  genre: string;
  coverImage?: string;
}

interface GameLibraryState {
  games: Game[];
  isLoading: boolean;
  error: Error | null;
  fetchGames: () => Promise<void>;
  getGameById: (id: string) => Game | null;
}

export const useGameLibrary = create<GameLibraryState>((set, get) => ({
  games: [],
  isLoading: false,
  error: null,
  
  fetchGames: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await apiRequest("GET", "/api/games");
      const data = await response.json();
      
      set({ games: data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch games:", error);
      set({ error: error as Error, isLoading: false });
      
      // Fallback to default games if API fails
      set({
        games: [
          {
            id: "jill",
            title: "Jill of the Jungle",
            description: "Help Jill navigate through dangerous platforming levels full of enemies and obstacles.",
            releaseYear: 1992,
            genre: "Platformer",
            coverImage: "/games/jill/cover.svg"
          },
          {
            id: "commander",
            title: "Commander Keen",
            description: "Join Commander Keen in his space adventures to save the galaxy from alien threats.",
            releaseYear: 1990,
            genre: "Platformer",
            coverImage: "/games/commander/cover.svg"
          },
          {
            id: "jazz",
            title: "Jazz Jackrabbit",
            description: "A fast-paced side-scrolling platformer starring Jazz Jackrabbit on a quest to save Princess Eva Earlong.",
            releaseYear: 1994,
            genre: "Platformer",
            coverImage: "/games/jazz/cover.svg"
          }
        ]
      });
    }
  },
  
  getGameById: (id: string) => {
    return get().games.find(game => game.id === id) || null;
  }
}));
