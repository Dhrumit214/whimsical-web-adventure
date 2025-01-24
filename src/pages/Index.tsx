import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Timer, Utensils, ChefHat } from "lucide-react";

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
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ChefHat className="w-6 h-6" />
          <span className="text-xl font-bold">Score: {score}</span>
        </div>
        <div className="flex items-center gap-2">
          <Timer className="w-6 h-6" />
          <span className="text-xl font-bold">{timeLeft}s</span>
        </div>
      </div>

      {/* Game Area */}
      {!gameStarted && !showGameOver && (
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-bold mb-4">Food Truck Frenzy</h1>
          <Button onClick={startGame}>Start Game</Button>
        </div>
      )}

      {gameStarted && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customers */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Customers</h2>
            {customers.map((customer) => (
              <Alert 
                key={customer.id}
                className={`cursor-pointer ${selectedCustomer?.id === customer.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <Utensils className="h-4 w-4" />
                <AlertTitle>Order: {customer.dish}</AlertTitle>
                <AlertDescription>
                  Time left: {customer.patience}s
                </AlertDescription>
              </Alert>
            ))}
          </div>

          {/* Prep Station */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Prep Station</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => handleStep('bun')}>Add Bun</Button>
              <Button onClick={() => handleStep('patty')}>Add Patty</Button>
              <Button onClick={() => handleStep('topBun')}>Add Top Bun</Button>
              <Button onClick={() => handleStep('sausage')}>Add Sausage</Button>
              <Button onClick={() => handleStep('toppings')}>Add Toppings</Button>
              <Button onClick={() => handleStep('fries')}>Add Fries</Button>
              <Button onClick={() => handleStep('salt')}>Add Salt</Button>
              <Button 
                onClick={handleServe}
                variant="secondary"
                className="col-span-2"
              >
                Serve Order
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Dialog */}
      <Dialog open={showGameOver} onOpenChange={setShowGameOver}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Game Over!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-2xl font-bold mb-2">Final Score: {score}</p>
            <p className="text-muted-foreground">
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