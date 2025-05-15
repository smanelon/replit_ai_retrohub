import { GameLibrary } from "@/components/GameLibrary";

export default function Home() {
  return (
    <div className="flex flex-col space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-400 font-['Press_Start_2P'] tracking-tighter mb-4">
          Retro Game Haven
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Step back in time and enjoy classic games from the golden era of PC gaming. 
          Experience the authentic gameplay of titles like Jill of the Jungle, 
          Commander Keen, and more - right in your browser!
        </p>
      </div>
      
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-green-400 mb-6">Game Library</h2>
        <GameLibrary />
      </div>
      
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-green-400 mb-4">About Retro Games</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            The early 90s were a golden age for PC platformers, with vibrant characters, 
            creative level design, and challenging gameplay that kept players coming back 
            for more. Games like Jill of the Jungle were developed by Epic MegaGames (now Epic Games)
            and featured colorful graphics, catchy sound effects, and inventive puzzle elements.
          </p>
          <p>
            These classics are preserved here for both nostalgic players who want to relive their 
            childhood favorites and new gamers curious about the origins of modern platformers.
          </p>
        </div>
      </div>
    </div>
  );
}
