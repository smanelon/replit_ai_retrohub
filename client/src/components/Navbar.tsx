import { Link } from "react-router-dom";
import { useAudio } from "@/lib/stores/useAudio";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const { isMuted, toggleMute } = useAudio();
  
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-green-400 font-['Press_Start_2P'] tracking-tighter">
            Retro Game Haven
          </Link>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
              className="text-white hover:text-green-400"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
