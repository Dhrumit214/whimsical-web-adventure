import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Timer, Utensils, ChefHat, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Dish = 'burger' | 'hotdog' | 'fries';
type Step = 'bun' | 'patty' | 'topBun' | 'sausage' | 'toppings' | 'fries' | 'salt';

interface Customer {
  id: number;
  dish: Dish;
  patience: number;
  steps: Step[];
}

const GAME_DURATION = 60;
const MAX_CUSTOMERS = 3;
const PATIENCE_DURATION = 15;

const DISH_STEPS: Record<Dish, Step[]> = {
  burger: ['bun', 'patty', 'topBun'],
  hotdog: ['bun', 'sausage', 'toppings'],
  fries: ['fries', 'salt']
};

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentSteps, setCurrentSteps] = useState<Step[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);

  const generateCustomer = useCallback(() => {
    const dishes: Dish[] = ['burger', 'hotdog', 'fries'];
    const randomDish = dishes[Math.floor(Math.random() * dishes.length)];
    return {
      id: Date.now(),
      dish: randomDish,
      patience: PATIENCE_DURATION,
      steps: DISH_STEPS[randomDish]
    };
  }, []);

  // Game timer
  useEffect(() => {
    if (!gameStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameStarted(false);
          setShowGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted]);

  // Customer generation
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setCustomers((prev) => {
        if (prev.length < MAX_CUSTOMERS) {
          return [...prev, generateCustomer()];
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [gameStarted, generateCustomer]);

  // Customer patience
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setCustomers((prev) => 
        prev.map((customer) => ({
          ...customer,
          patience: customer.patience - 1
        })).filter((customer) => customer.patience > 0)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted]);

  const handleStep = (step: Step) => {
    if (!selectedCustomer) return;

    const expectedStep = DISH_STEPS[selectedCustomer.dish][currentSteps.length];
    if (step === expectedStep) {
      setCurrentSteps((prev) => [...prev, step]);
    }
  };

  const handleServe = () => {
    if (!selectedCustomer) return;

    const isCorrect = JSON.stringify(currentSteps) === JSON.stringify(DISH_STEPS[selectedCustomer.dish]);
    if (isCorrect) {
      setScore((prev) => prev + 10);
      setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
      setSelectedCustomer(null);
      setCurrentSteps([]);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setCustomers([]);
    setCurrentSteps([]);
    setSelectedCustomer(null);
    setShowGameOver(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm p-4 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="text-xl font-bold text-gray-800">Score: {score}</span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="w-6 h-6 text-blue-500" />
            <span className="text-xl font-bold text-gray-800">{timeLeft}s</span>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="pt-20 p-4 max-w-7xl mx-auto">
        {!gameStarted && !showGameOver && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="text-center space-y-4">
              <ChefHat className="w-16 h-16 mx-auto text-orange-500" />
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Food Truck Frenzy</h1>
              <p className="text-gray-600 max-w-md mx-auto">
                Serve as many customers as you can in 60 seconds!
              </p>
            </div>
            <Button 
              size="lg"
              onClick={startGame}
              className="text-lg px-8"
            >
              Start Game
            </Button>
          </div>
        )}

        {gameStarted && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customers Queue */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Customers</h2>
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`cursor-pointer transition-all ${
                    selectedCustomer?.id === customer.id 
                      ? 'ring-2 ring-primary' 
                      : ''
                  }`}
                >
                  <Alert>
                    <Utensils className="h-4 w-4" />
                    <AlertTitle className="capitalize">{customer.dish}</AlertTitle>
                    <AlertDescription className="mt-2">
                      <Progress 
                        value={(customer.patience / PATIENCE_DURATION) * 100} 
                        className="h-2"
                      />
                      <span className="text-sm text-gray-500 mt-1 block">
                        Time left: {customer.patience}s
                      </span>
                    </AlertDescription>
                  </Alert>
                </div>
              ))}
            </div>

            {/* Prep Station */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Prep Station</h2>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => handleStep('bun')}
                >
                  Add Bun
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleStep('patty')}
                >
                  Add Patty
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleStep('topBun')}
                >
                  Add Top Bun
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleStep('sausage')}
                >
                  Add Sausage
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleStep('toppings')}
                >
                  Add Toppings
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleStep('fries')}
                >
                  Add Fries
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleStep('salt')}
                >
                  Add Salt
                </Button>
                <Button 
                  onClick={handleServe}
                  variant="default"
                  className="col-span-2 bg-orange-500 hover:bg-orange-600"
                >
                  Serve Order
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Game Over Dialog */}
      <Dialog open={showGameOver} onOpenChange={setShowGameOver}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Game Over!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <Trophy className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <p className="text-2xl font-bold mb-2">Final Score: {score}</p>
            <p className="text-gray-600">
              You served {score / 10} orders successfully!
            </p>
          </div>
          <DialogFooter>
            <Button onClick={startGame} className="w-full">
              Play Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;