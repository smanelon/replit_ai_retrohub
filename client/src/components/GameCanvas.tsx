import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useGameLibrary } from "@/lib/stores/useGameLibrary";
import { useJillGame } from "@/lib/stores/useJillGame";
import { JillEngine } from "./JillEngine";
import { Button } from "./ui/button";
import { Save, FolderOpen } from "lucide-react";
import { useAudio } from "@/lib/stores/useAudio";
import { toast } from "sonner";

export function GameCanvas() {
  const { gameId } = useParams<{ gameId: string }>();
  const { getGameById } = useGameLibrary();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { saveGame, loadGame } = useJillGame();
  const { playSuccess } = useAudio();
  
  const game = gameId ? getGameById(gameId) : null;
  
  useEffect(() => {
    if (!canvasRef.current || !game) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set initial canvas size
    const updateCanvasSize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    
    updateCanvasSize();
    
    // Update canvas size when window is resized
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [game]);
  
  const handleSaveGame = () => {
    saveGame();
    playSuccess();
    toast.success("Game saved successfully!");
  };
  
  const handleLoadGame = () => {
    const loaded = loadGame();
    if (loaded) {
      playSuccess();
      toast.success("Game loaded successfully!");
    } else {
      toast.error("No saved game found");
    }
  };
  
  if (!game) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gray-800 rounded-lg">
        <div className="text-xl text-gray-400">Game not found</div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {game.id === "jill" ? (
          <JillEngine canvasRef={canvasRef} />
        ) : (
          <canvas 
            ref={canvasRef} 
            className="w-full h-full"
            tabIndex={0}
          />
        )}
      </div>
      
      <div className="flex justify-between mt-4">
        <div className="text-sm text-gray-400">
          Use arrow keys to move, spacebar to jump, and ctrl to shoot
        </div>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="text-green-400 border-green-800 hover:bg-green-900/30"
            onClick={handleSaveGame}
          >
            <Save size={16} className="mr-2" />
            Save
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            className="text-green-400 border-green-800 hover:bg-green-900/30"
            onClick={handleLoadGame}
          >
            <FolderOpen size={16} className="mr-2" />
            Load
          </Button>
        </div>
      </div>
    </div>
  );
}
