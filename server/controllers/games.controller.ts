import { Request, Response } from "express";
import { storage } from "../storage";

// List of available retro games
const GAMES = [
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
];

/**
 * Controller for handling game-related API requests
 */
export const gamesController = {
  /**
   * Get a list of all available games
   */
  getGames: (req: Request, res: Response) => {
    res.json(GAMES);
  },

  /**
   * Get a specific game by ID
   */
  getGameById: (req: Request, res: Response) => {
    const { id } = req.params;
    const game = GAMES.find(game => game.id === id);
    
    if (!game) {
      return res.status(404).json({ message: `Game with ID ${id} not found` });
    }
    
    res.json(game);
  },

  /**
   * Get save state for a game (if it exists)
   */
  getSaveState: (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.query;

    // For now, we'll just return a simple response
    // In a real implementation, this would fetch from a database
    res.json({ 
      success: true, 
      message: "Save state should be handled client-side for now",
      data: null 
    });
  },

  /**
   * Save game state
   */
  saveGameState: (req: Request, res: Response) => {
    const { id } = req.params;
    const { state } = req.body;

    // For now, we'll just return a simple response
    // In a real implementation, this would save to a database
    res.json({ 
      success: true, 
      message: "Save state should be handled client-side for now" 
    });
  }
};
