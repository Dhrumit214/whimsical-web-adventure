import { Timer, Trophy, Coins, GaugeCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface GameHeaderProps {
  score: number;
  timeLeft: number;
  level: number;
  money: number;
  requiredScore: number;
  onPurchaseTime: () => void;
}

export const GameHeader = ({ 
  score, 
  timeLeft, 
  level, 
  money, 
  requiredScore,
  onPurchaseTime 
}: GameHeaderProps) => {
  const progressPercentage = (score / requiredScore) * 100;
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 hover:scale-105 transition-transform">
              <Trophy className="w-6 h-6 text-yellow-500 animate-bounce" />
              <span className="text-xl font-bold text-gray-800">Score: {score}</span>
            </div>
            <div className="flex items-center gap-2 hover:scale-105 transition-transform">
              <Coins className="w-6 h-6 text-amber-500" />
              <span className="text-xl font-bold text-gray-800">${money}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 hover:scale-105 transition-transform">
              <GaugeCircle className="w-6 h-6 text-purple-500" />
              <span className="text-xl font-bold text-gray-800">Level {level}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                <Timer className="w-6 h-6 text-blue-500 animate-pulse" />
                <span className="text-xl font-bold text-gray-800">{timeLeft}s</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onPurchaseTime}
                className="flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                Buy 60s ($50)
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Progress value={progressPercentage} className="h-2" />
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {score}/{requiredScore} to Level {level + 1}
          </span>
        </div>
      </div>
    </header>
  );
};