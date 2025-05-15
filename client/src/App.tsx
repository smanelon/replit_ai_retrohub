import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { Navbar } from "./components/Navbar";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import NotFound from "./pages/not-found";
import { useAudio } from "./lib/stores/useAudio";

function App() {
  // Initialize audio elements
  useEffect(() => {
    const backgroundMusic = new Audio("/sounds/background.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    
    const hitSound = new Audio("/sounds/hit.mp3");
    const successSound = new Audio("/sounds/success.mp3");
    
    // Store audio elements in the store
    useAudio.getState().setBackgroundMusic(backgroundMusic);
    useAudio.getState().setHitSound(hitSound);
    useAudio.getState().setSuccessSound(successSound);
    
    return () => {
      // Clean up audio when component unmounts
      backgroundMusic.pause();
      hitSound.pause();
      successSound.pause();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:gameId" element={<GamePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
