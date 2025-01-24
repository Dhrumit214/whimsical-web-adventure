import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Coins, Clock } from "lucide-react";

interface GameHistoryEntry {
  id: number;
  score: number;
  money: number;
  level: number;
  timestamp: Date;
}

interface GameHistoryProps {
  history: GameHistoryEntry[];
}

export const GameHistory = ({ history }: GameHistoryProps) => {
  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Recent Games
      </h2>
      <ScrollArea className="h-[300px] rounded-lg border bg-white/50 backdrop-blur-sm p-4">
        {history.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No games played yet. Start playing to see your history!</p>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-lg bg-white/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">Score: {entry.score}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-amber-500" />
                      <span className="font-medium">${entry.money}</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                      <span className="font-medium">Level {entry.level}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};