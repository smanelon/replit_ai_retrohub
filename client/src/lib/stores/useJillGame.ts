import { create } from "zustand";
import { getLocalStorage, setLocalStorage } from "@/lib/utils";

// Tile types
enum TileType {
  EMPTY = 0,
  WALL = 1,
  PLATFORM = 2,
  SPIKE = 3,
  GEM = 4,
  KEY = 5,
  DOOR = 6,
  EXIT = 7,
}

// Game objects
interface Player {
  position: { x: number; y: number };
  width: number;
  height: number;
  velocityY: number;
  speed: number;
  jumpPower: number;
  onGround: boolean;
  facingRight: boolean;
}

interface Collectable {
  x: number;
  y: number;
  collected: boolean;
}

interface Door {
  x: number;
  y: number;
  opened: boolean;
  keyRequired: boolean;
}

interface Level {
  id: number;
  width: number;
  height: number;
  tiles: TileType[][];
  startPosition: { x: number; y: number };
}

interface GameState {
  level: Level;
  player: Player;
  gems: Collectable[];
  keys: Collectable[];
  doors: Door[];
  gravity: number;
  collectedGems: number;
  totalGems: number;
  collectedKeys: number;
  totalKeys: number;
  gameOver: boolean;
  levelComplete: boolean;
}

interface JillGameState {
  gameState: GameState;
  setPlayerPosition: (x: number, y: number) => void;
  collectItem: (type: 'gem' | 'key', index: number) => void;
  updateGameState: (deltaTime: number) => void;
  loadLevel: (levelId: number) => void;
  resetLevel: () => void;
  saveGame: () => void;
  loadGame: () => boolean;
}

// Default level layout
const LEVEL_1: TileType[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1],
  [1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 1],
  [1, 2, 2, 2, 3, 3, 3, 3, 6, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const TILE_SIZE = 32;

// Create initial game state
const createInitialGameState = (): GameState => {
  // Initialize level from LEVEL_1
  const level: Level = {
    id: 1,
    width: LEVEL_1[0].length,
    height: LEVEL_1.length,
    tiles: [...LEVEL_1], // deep copy
    startPosition: { x: 2 * TILE_SIZE, y: 2 * TILE_SIZE }
  };
  
  // Find gems in the level
  const gems: Collectable[] = [];
  const keys: Collectable[] = [];
  const doors: Door[] = [];
  
  for (let y = 0; y < level.height; y++) {
    for (let x = 0; x < level.width; x++) {
      const tile = level.tiles[y][x];
      
      if (tile === TileType.GEM) {
        gems.push({ x: x * TILE_SIZE, y: y * TILE_SIZE, collected: false });
      } else if (tile === TileType.KEY) {
        keys.push({ x: x * TILE_SIZE, y: y * TILE_SIZE, collected: false });
      } else if (tile === TileType.DOOR) {
        doors.push({ 
          x: x * TILE_SIZE, 
          y: y * TILE_SIZE, 
          opened: false,
          keyRequired: true
        });
      }
    }
  }
  
  return {
    level,
    player: {
      position: { x: level.startPosition.x, y: level.startPosition.y },
      width: 24,
      height: 32,
      velocityY: 0,
      speed: 150,
      jumpPower: 350,
      onGround: false,
      facingRight: true
    },
    gems,
    keys,
    doors,
    gravity: 800,
    collectedGems: 0,
    totalGems: gems.length,
    collectedKeys: 0,
    totalKeys: keys.length,
    gameOver: false,
    levelComplete: false
  };
};

export const useJillGame = create<JillGameState>((set, get) => ({
  gameState: createInitialGameState(),
  
  setPlayerPosition: (x, y) => {
    set(state => ({
      gameState: {
        ...state.gameState,
        player: {
          ...state.gameState.player,
          position: { x, y }
        }
      }
    }));
  },
  
  collectItem: (type, index) => {
    set(state => {
      const newState = { ...state.gameState };
      
      if (type === 'gem') {
        newState.gems[index].collected = true;
        newState.collectedGems++;
      } else if (type === 'key') {
        newState.keys[index].collected = true;
        newState.collectedKeys++;
      }
      
      return { gameState: newState };
    });
  },
  
  updateGameState: (deltaTime) => {
    set(state => {
      const { gameState } = state;
      const { player, level, gravity, gems, keys, doors } = gameState;
      
      // Apply gravity
      let newVelocityY = player.velocityY + gravity * deltaTime;
      let newY = player.position.y + newVelocityY * deltaTime;
      
      // Reset ground state
      let onGround = false;
      
      // Collision detection with tiles
      const playerLeft = player.position.x;
      const playerRight = player.position.x + player.width;
      const playerTop = player.position.y;
      const playerBottom = newY + player.height;
      
      // Check for vertical collisions
      const tileY = Math.floor(playerBottom / TILE_SIZE);
      for (let x = Math.floor(playerLeft / TILE_SIZE); x <= Math.floor(playerRight / TILE_SIZE); x++) {
        if (tileY >= 0 && tileY < level.height && x >= 0 && x < level.width) {
          const tile = level.tiles[tileY][x];
          
          if (tile === TileType.WALL || tile === TileType.PLATFORM) {
            newY = tileY * TILE_SIZE - player.height;
            newVelocityY = 0;
            onGround = true;
            break;
          } else if (tile === TileType.SPIKE) {
            // Hit a spike, reset level
            return { gameState: createInitialGameState() };
          }
        }
      }
      
      // Check for gem collection
      for (let i = 0; i < gems.length; i++) {
        const gem = gems[i];
        if (!gem.collected && 
            player.position.x < gem.x + TILE_SIZE &&
            player.position.x + player.width > gem.x &&
            player.position.y < gem.y + TILE_SIZE &&
            player.position.y + player.height > gem.y) {
          gem.collected = true;
          gameState.collectedGems++;
        }
      }
      
      // Check for key collection
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (!key.collected && 
            player.position.x < key.x + TILE_SIZE &&
            player.position.x + player.width > key.x &&
            player.position.y < key.y + TILE_SIZE &&
            player.position.y + player.height > key.y) {
          key.collected = true;
          gameState.collectedKeys++;
        }
      }
      
      // Check for door interaction
      for (let i = 0; i < doors.length; i++) {
        const door = doors[i];
        if (!door.opened && 
            player.position.x < door.x + TILE_SIZE &&
            player.position.x + player.width > door.x &&
            player.position.y < door.y + TILE_SIZE &&
            player.position.y + player.height > door.y) {
          
          if (door.keyRequired && gameState.collectedKeys > 0) {
            door.opened = true;
            // Remove the door from the level
            const doorX = Math.floor(door.x / TILE_SIZE);
            const doorY = Math.floor(door.y / TILE_SIZE);
            if (doorY >= 0 && doorY < level.height && doorX >= 0 && doorX < level.width) {
              level.tiles[doorY][doorX] = TileType.EMPTY;
            }
          }
        }
      }
      
      // Check for level exit
      for (let y = 0; y < level.height; y++) {
        for (let x = 0; x < level.width; x++) {
          if (level.tiles[y][x] === TileType.EXIT) {
            const exitX = x * TILE_SIZE;
            const exitY = y * TILE_SIZE;
            
            if (player.position.x < exitX + TILE_SIZE &&
                player.position.x + player.width > exitX &&
                player.position.y < exitY + TILE_SIZE &&
                player.position.y + player.height > exitY) {
              
              // Level complete
              gameState.levelComplete = true;
              // In a real game we would load the next level here
              // For now just reset the current level
              return { gameState: createInitialGameState() };
            }
          }
        }
      }
      
      return {
        gameState: {
          ...gameState,
          player: {
            ...player,
            position: { ...player.position, y: newY },
            velocityY: newVelocityY,
            onGround
          }
        }
      };
    });
  },
  
  loadLevel: (levelId) => {
    set({
      gameState: createInitialGameState()
    });
  },
  
  resetLevel: () => {
    set({
      gameState: createInitialGameState()
    });
  },
  
  saveGame: () => {
    const { gameState } = get();
    setLocalStorage('jillGameSave', gameState);
  },
  
  loadGame: () => {
    const savedGame = getLocalStorage('jillGameSave') as GameState | null;
    
    if (savedGame) {
      set({ gameState: savedGame });
      return true;
    }
    
    return false;
  }
}));
