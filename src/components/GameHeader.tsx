import { Timer, Trophy } from "lucide-react";

interface GameHeaderProps {
  score: number;
  timeLeft: number;
}

export const GameHeader = ({ score, timeLeft }: GameHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm p-4 z-10 animate-fade-in">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 hover:scale-105 transition-transform">
          <Trophy className="w-6 h-6 text-yellow-500 animate-bounce" />
          <span className="text-xl font-bold text-gray-800">Score: {score}</span>
        </div>
        <div className="flex items-center gap-2 hover:scale-105 transition-transform">
          <Timer className="w-6 h-6 text-blue-500 animate-pulse" />
          <span className="text-xl font-bold text-gray-800">{timeLeft}s</span>
        </div>
      </div>
    </header>
  );
};