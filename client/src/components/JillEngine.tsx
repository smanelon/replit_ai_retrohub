import { useEffect, useRef, useState } from "react";
import { useJillGame } from "@/lib/stores/useJillGame";
import { useAudio } from "@/lib/stores/useAudio";

interface JillEngineProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

// Tile types for our simple Jill-like game
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

// Character frames
type SpriteFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// Tile size and color mapping 
const TILE_SIZE = 32;
const TILE_COLORS: Record<TileType, string> = {
  [TileType.EMPTY]: 'transparent',
  [TileType.WALL]: '#654321',
  [TileType.PLATFORM]: '#8B4513',
  [TileType.SPIKE]: '#FF0000',
  [TileType.GEM]: '#00FFFF',
  [TileType.KEY]: '#FFFF00',
  [TileType.DOOR]: '#8B4513',
  [TileType.EXIT]: '#00FF00',
};

export function JillEngine({ canvasRef }: JillEngineProps) {
  const { 
    gameState, 
    setPlayerPosition, 
    collectItem, 
    updateGameState,
    loadLevel,
    resetLevel
  } = useJillGame();
  
  const { playHit } = useAudio();
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const [tilesetLoaded, setTilesetLoaded] = useState(false);
  const tilesetRef = useRef<HTMLImageElement | null>(null);
  
  // Load tileset image
  useEffect(() => {
    const tilesetImage = new Image();
    tilesetImage.src = '/games/jill/tileset.svg';
    tilesetImage.onload = () => {
      tilesetRef.current = tilesetImage;
      setTilesetLoaded(true);
    };
  }, []);
  
  // Load initial level
  useEffect(() => {
    loadLevel(1);
  }, [loadLevel]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code);
      // Prevent default for arrow keys to avoid page scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Game render loop
  useEffect(() => {
    if (!canvasRef.current || !tilesetLoaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gameLoop = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }
      
      const deltaTime = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Handle player input
      handleInput(deltaTime);
      
      // Update game state
      updateGameState(deltaTime);
      
      // Render game
      renderGame(ctx);
      
      // Request next animation frame
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [canvasRef, tilesetLoaded]);
  
  // Handle keyboard input
  const handleInput = (deltaTime: number) => {
    const { x, y } = gameState.player.position;
    const speed = gameState.player.speed * deltaTime;
    let newX = x;
    let newY = y;
    
    // Handle horizontal movement
    if (keysPressed.current.has('ArrowLeft')) {
      newX = Math.max(0, x - speed);
      gameState.player.facingRight = false;
    }
    if (keysPressed.current.has('ArrowRight')) {
      newX = Math.min(gameState.level.width * TILE_SIZE - gameState.player.width, x + speed);
      gameState.player.facingRight = true;
    }
    
    // Handle jumping
    if (keysPressed.current.has('Space') && gameState.player.onGround) {
      gameState.player.velocityY = -gameState.player.jumpPower;
      gameState.player.onGround = false;
      playHit(); // Jump sound
    }
    
    // Apply new position
    if (newX !== x || newY !== y) {
      setPlayerPosition(newX, newY);
    }
    
    // Handle action button
    if (keysPressed.current.has('ControlLeft') || keysPressed.current.has('ControlRight')) {
      // Action is handled in the game state update
    }
  };
  
  // Render the game
  const renderGame = (ctx: CanvasRenderingContext2D) => {
    const { level, player, gems, keys, doors } = gameState;
    
    // Scale the rendering to fit the canvas
    const scaleX = ctx.canvas.width / (level.width * TILE_SIZE);
    const scaleY = ctx.canvas.height / (level.height * TILE_SIZE);
    const scale = Math.min(scaleX, scaleY);
    
    // Calculate centered position
    const offsetX = (ctx.canvas.width - level.width * TILE_SIZE * scale) / 2;
    const offsetY = (ctx.canvas.height - level.height * TILE_SIZE * scale) / 2;
    
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    
    // Draw background
    ctx.fillStyle = '#000033';
    ctx.fillRect(0, 0, level.width * TILE_SIZE, level.height * TILE_SIZE);
    
    // Draw tiles
    for (let y = 0; y < level.height; y++) {
      for (let x = 0; x < level.width; x++) {
        const tile = level.tiles[y][x];
        if (tile !== TileType.EMPTY) {
          ctx.fillStyle = TILE_COLORS[tile];
          ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          
          // Add details to some tiles
          if (tile === TileType.WALL) {
            ctx.strokeStyle = '#3D2817';
            ctx.lineWidth = 1;
            ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          } else if (tile === TileType.SPIKE) {
            // Draw spike details
            ctx.fillStyle = '#AA0000';
            for (let i = 0; i < 4; i++) {
              ctx.beginPath();
              ctx.moveTo(x * TILE_SIZE + i * 8 + 4, y * TILE_SIZE + TILE_SIZE);
              ctx.lineTo(x * TILE_SIZE + i * 8 + 8, y * TILE_SIZE + TILE_SIZE - 12);
              ctx.lineTo(x * TILE_SIZE + i * 8 + 12, y * TILE_SIZE + TILE_SIZE);
              ctx.fill();
            }
          } else if (tile === TileType.EXIT) {
            // Draw exit details
            ctx.fillStyle = '#005500';
            ctx.fillRect(x * TILE_SIZE + 4, y * TILE_SIZE + 4, TILE_SIZE - 8, TILE_SIZE - 8);
          }
        }
      }
    }
    
    // Draw collectable items
    gems.forEach(gem => {
      if (!gem.collected) {
        ctx.fillStyle = TILE_COLORS[TileType.GEM];
        ctx.beginPath();
        ctx.arc(gem.x + TILE_SIZE/2, gem.y + TILE_SIZE/2, TILE_SIZE/3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    keys.forEach(key => {
      if (!key.collected) {
        ctx.fillStyle = TILE_COLORS[TileType.KEY];
        ctx.fillRect(key.x + TILE_SIZE/4, key.y + TILE_SIZE/3, TILE_SIZE/2, TILE_SIZE/6);
        ctx.fillRect(key.x + TILE_SIZE/2 - TILE_SIZE/8, key.y + TILE_SIZE/2, TILE_SIZE/4, TILE_SIZE/3);
      }
    });
    
    doors.forEach(door => {
      if (!door.opened) {
        ctx.fillStyle = TILE_COLORS[TileType.DOOR];
        ctx.fillRect(door.x, door.y, TILE_SIZE, TILE_SIZE);
        
        // Door handle
        ctx.fillStyle = '#000000';
        ctx.fillRect(door.x + TILE_SIZE - TILE_SIZE/4, door.y + TILE_SIZE/2, TILE_SIZE/8, TILE_SIZE/8);
      }
    });
    
    // Draw player
    ctx.fillStyle = '#FF69B4'; // Pink color for Jill
    ctx.fillRect(player.position.x, player.position.y, player.width, player.height);
    
    // Draw player face direction
    ctx.fillStyle = '#FFFFFF';
    const eyeX = player.facingRight ? player.position.x + player.width - 10 : player.position.x + 4;
    ctx.fillRect(eyeX, player.position.y + 6, 6, 6);
    
    // Draw UI
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px monospace';
    ctx.fillText(`Gems: ${gameState.collectedGems}/${gameState.totalGems}`, 10, 20);
    ctx.fillText(`Keys: ${gameState.collectedKeys}/${gameState.totalKeys}`, 10, 40);
    ctx.fillText(`Level: ${gameState.level.id}`, 10, 60);
    
    ctx.restore();
  };
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
      tabIndex={0}
    />
  );
}
