import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";

interface GameStartProps {
  onStart: () => void;
}

export const GameStart = ({ onStart }: GameStartProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
      <div className="text-center space-y-4">
        <ChefHat className="w-16 h-16 mx-auto text-orange-500 animate-bounce" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Food Truck Frenzy</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Serve as many customers as you can in 60 seconds!
        </p>
      </div>
      <Button 
        size="lg"
        onClick={onStart}
        className="text-lg px-8 hover:scale-110 transition-transform bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg"
      >
        Start Game
      </Button>
    </div>
  );
};