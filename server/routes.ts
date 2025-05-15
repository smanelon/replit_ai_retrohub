import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gamesController } from "./controllers/games.controller";

export async function registerRoutes(app: Express): Promise<Server> {
  // Game routes
  app.get("/api/games", gamesController.getGames);
  app.get("/api/games/:id", gamesController.getGameById);
  app.get("/api/games/:id/save", gamesController.getSaveState);
  app.post("/api/games/:id/save", gamesController.saveGameState);

  const httpServer = createServer(app);

  return httpServer;
}
