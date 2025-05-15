import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GameCanvas } from "@/components/GameCanvas";
import { GameControls } from "@/components/GameControls";
import { useGameLibrary } from "@/lib/stores/useGameLibrary";
import { useGame } from "@/lib/stores/useGame";
import { useAudio } from "@/lib/stores/useAudio";
import { ChevronLeft } from "lucide-react";

export default function GamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { getGameById } = useGameLibrary();
  const { phase, start } = useGame();
  const { isMuted, backgroundMusic } = useAudio();
  
  const game = gameId ? getGameById(gameId) : null;
  
  useEffect(() => {
    // Start the game when component mounts
    if (phase === "ready") {
      start();
    }
    
    // Play background music if not muted
    if (backgroundMusic && !isMuted) {
      backgroundMusic.play().catch(error => {
        console.log("Background music play prevented:", error);
      });
    }
    
    return () => {
      // Pause the background music when unmounting
      if (backgroundMusic) {
        backgroundMusic.pause();
      }
    };
  }, [backgroundMusic, isMuted, phase, start]);
  
  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px]">
        <div className="text-xl text-red-400 mb-4">Game not found</div>
        <Link to="/">
          <Button>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-green-400">{game.title}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <GameCanvas />
        </div>
        
        <div className="space-y-6">
          <GameControls />
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold text-green-400 mb-2">Game Info</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Released:</span> {game.releaseYear}
              </div>
              <div>
                <span className="text-gray-400">Genre:</span> {game.genre}
              </div>
              <p className="text-gray-300 mt-2">{game.description}</p>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-xl font-semibold text-green-400 mb-2">Tips</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
              <li>Collect all gems for bonus points</li>
              <li>Find keys to unlock doors</li>
              <li>Avoid spikes - they're deadly!</li>
              <li>Reach the exit to complete the level</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
