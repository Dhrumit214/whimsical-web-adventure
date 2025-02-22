import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Coins } from "lucide-react";

interface GameOverProps {
  show: boolean;
  score: number;
  money: number;
  level: number;
  onRestart: () => void;
  onOpenChange: (open: boolean) => void;
}

export const GameOver = ({ show, score, money, level, onRestart, onOpenChange }: GameOverProps) => {
  return (
    <Dialog open={show} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Game Over!</DialogTitle>
        </DialogHeader>
        <div className="text-center py-8">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-6 animate-bounce" />
          <p className="text-3xl font-bold mb-2 text-gray-800">Final Score: {score}</p>
          <div className="space-y-2 text-gray-600 text-lg">
            <p>You reached Level {level}!</p>
            <p className="flex items-center justify-center gap-2">
              <Coins className="w-6 h-6 text-amber-500" />
              Total Earnings: ${money}
            </p>
            <p>
              You served {score / 10} orders successfully!
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={onRestart} 
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:scale-105 transition-transform text-lg font-medium"
          >
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};