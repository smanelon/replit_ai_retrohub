import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CornerLeftDown } from "lucide-react";
import { KeyboardControlKey } from "./KeyboardControlKey";

export function GameControls() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-green-400">Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col space-y-2">
            <h3 className="text-md font-semibold text-gray-300">Movement</h3>
            
            <div className="grid grid-cols-3 gap-2 max-w-[180px]">
              <div></div>
              <KeyboardControlKey>
                <ArrowUp size={16} />
              </KeyboardControlKey>
              <div></div>
              
              <KeyboardControlKey>
                <ArrowLeft size={16} />
              </KeyboardControlKey>
              
              <KeyboardControlKey>
                <ArrowDown size={16} />
              </KeyboardControlKey>
              
              <KeyboardControlKey>
                <ArrowRight size={16} />
              </KeyboardControlKey>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <h3 className="text-md font-semibold text-gray-300">Actions</h3>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center">
                <KeyboardControlKey>Space</KeyboardControlKey>
                <span className="ml-2 text-gray-400">Jump</span>
              </div>
              
              <div className="flex items-center">
                <KeyboardControlKey>Ctrl</KeyboardControlKey>
                <span className="ml-2 text-gray-400">Action/Attack</span>
              </div>
              
              <div className="flex items-center">
                <KeyboardControlKey>Esc</KeyboardControlKey>
                <span className="ml-2 text-gray-400">Pause</span>
              </div>
            </div>
          </div>
          
          <div className="mt-2 text-sm text-gray-500">
            <p>Tip: Use F5 to restart the game if you get stuck</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
