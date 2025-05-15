import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameLibrary } from "@/lib/stores/useGameLibrary";
import { Gamepad2 } from "lucide-react";

export function GameLibrary() {
  const { games, fetchGames, isLoading, error } = useGameLibrary();

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-pulse text-green-400">Loading games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-200">
        <h3 className="font-bold mb-2">Error loading games</h3>
        <p>{error.message || "An unknown error occurred"}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <Link 
          to={`/game/${game.id}`} 
          key={game.id}
          className="transition-transform hover:scale-105"
        >
          <Card className="h-full bg-gray-800 border-gray-700 hover:border-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-green-400">{game.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="h-40 bg-gray-900 rounded-md flex items-center justify-center mb-4">
                {game.coverImage ? (
                  <img 
                    src={game.coverImage} 
                    alt={game.title} 
                    className="h-full w-full object-cover rounded-md" 
                  />
                ) : (
                  <Gamepad2 size={64} className="text-gray-700" />
                )}
              </div>
              <p className="text-gray-300 text-sm">{game.description}</p>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-gray-500">
                Released: {game.releaseYear} | Genre: {game.genre}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
