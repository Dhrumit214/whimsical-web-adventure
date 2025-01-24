import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Timer, Utensils, ChefHat, Trophy, Check, AlertCircle, Clock, Star, Users, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const DISH_NAMES: Record<Dish, string> = {
  burger: 'Burger',
  hotdog: 'Hot Dog',
  fries: 'Fries'
};

const STEP_NAMES: Record<Step, string> = {
  bun: 'Add Bun',
  patty: 'Add Patty',
  topBun: 'Add Top Bun',
  sausage: 'Add Sausage',
  toppings: 'Add Toppings',
  fries: 'Add Fries',
  salt: 'Add Salt'
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
    const newCustomer = {
      id: Date.now(),
      dish: randomDish,
      patience: PATIENCE_DURATION,
      steps: DISH_STEPS[randomDish]
    };
    
    toast.success('New customer arrived!', {
      description: `Order: ${DISH_NAMES[randomDish]}`,
      icon: <Users className="w-4 h-4" />,
    });
    
    return newCustomer;
  }, []);

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

  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setCustomers((prev) => {
        const updatedCustomers = prev.map((customer) => ({
          ...customer,
          patience: customer.patience - 1
        }));
        
        const leavingCustomers = updatedCustomers.filter(
          (customer) => customer.patience === 0
        );
        
        if (leavingCustomers.length > 0) {
          if (selectedCustomer && leavingCustomers.some(c => c.id === selectedCustomer.id)) {
            setSelectedCustomer(null);
            setCurrentSteps([]);
            toast.error("Customer left due to long wait!");
          }
        }
        
        return updatedCustomers.filter((customer) => customer.patience > 0);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, selectedCustomer]);

  const handleCustomerSelect = (customer: Customer) => {
    if (selectedCustomer?.id === customer.id) {
      setSelectedCustomer(null);
      setCurrentSteps([]);
    } else {
      setSelectedCustomer(customer);
      setCurrentSteps([]);
      toast.info(`Selected customer's order: ${DISH_NAMES[customer.dish]}`);
    }
  };

  const handleStep = (step: Step) => {
    if (!selectedCustomer) {
      toast.error("Please select a customer first!");
      return;
    }

    const expectedStep = DISH_STEPS[selectedCustomer.dish][currentSteps.length];
    if (step === expectedStep) {
      setCurrentSteps((prev) => [...prev, step]);
      toast.success(`Added ${STEP_NAMES[step]}!`, {
        icon: <Check className="w-4 h-4" />
      });
    } else {
      toast.error("Wrong ingredient! Check the recipe steps.", {
        icon: <AlertCircle className="w-4 h-4" />
      });
    }
  };

  const handleServe = () => {
    if (!selectedCustomer) {
      toast.error("Please select a customer first!");
      return;
    }

    const isCorrect = JSON.stringify(currentSteps) === JSON.stringify(DISH_STEPS[selectedCustomer.dish]);
    if (isCorrect) {
      setScore((prev) => prev + 10);
      setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
      setSelectedCustomer(null);
      setCurrentSteps([]);
      toast.success("Order served successfully!", {
        icon: <Award className="w-4 h-4" />
      });
    } else {
      toast.error("Incomplete or incorrect order!");
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
    <div className="min-h-screen bg-[#f8f9fa] transition-all">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm p-4 z-10 animate-fade-in">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 hover-scale">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="text-xl font-bold text-gray-800">Score: {score}</span>
          </div>
          <div className="flex items-center gap-2 hover-scale">
            <Timer className="w-6 h-6 text-blue-500 animate-pulse" />
            <span className="text-xl font-bold text-gray-800">{timeLeft}s</span>
          </div>
        </div>
      </header>

      <main className="pt-20 p-4 max-w-7xl mx-auto">
        {!gameStarted && !showGameOver && (
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
              onClick={startGame}
              className="text-lg px-8 hover:scale-105 transition-transform"
            >
              Start Game
            </Button>
          </div>
        )}

        {gameStarted && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Customers
              </h2>
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => handleCustomerSelect(customer)}
                  className={`cursor-pointer transition-all transform hover:scale-102 ${
                    selectedCustomer?.id === customer.id 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                >
                  <Alert className="relative overflow-hidden">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${customer.id}`} />
                        <AvatarFallback>
                          <Utensils className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <AlertTitle className="capitalize flex items-center gap-2">
                          {DISH_NAMES[customer.dish]}
                          {selectedCustomer?.id === customer.id && (
                            <Star className="w-4 h-4 text-yellow-500 animate-pulse" />
                          )}
                        </AlertTitle>
                        <AlertDescription>
                          <div className="mt-2">
                            <Progress 
                              value={(customer.patience / PATIENCE_DURATION) * 100} 
                              className={`h-2 transition-all ${
                                customer.patience < 5 ? 'bg-red-200' : ''
                              }`}
                            />
                            <span className="text-sm text-gray-500 mt-1 block flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {customer.patience}s
                            </span>
                          </div>
                          {selectedCustomer?.id === customer.id && (
                            <div className="mt-2 text-sm animate-fade-in">
                              <div className="font-medium mb-1">Recipe Steps:</div>
                              {DISH_STEPS[customer.dish].map((step, index) => (
                                <div 
                                  key={step}
                                  className={`flex items-center gap-2 ${
                                    currentSteps[index] === step 
                                      ? 'text-green-500' 
                                      : 'text-gray-600'
                                  }`}
                                >
                                  {currentSteps[index] === step ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    <span className="w-4 h-4 inline-block" />
                                  )}
                                  {STEP_NAMES[step]}
                                </div>
                              ))}
                            </div>
                          )}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                Prep Station
              </h2>
              
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6 animate-fade-in">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Current Order</h3>
                {selectedCustomer ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-800">
                      Preparing: {DISH_NAMES[selectedCustomer.dish]}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentSteps.map((step, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 animate-scale-in"
                        >
                          {STEP_NAMES[step]}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    Select a customer to start preparing their order
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => handleStep('bun')}
                  disabled={!selectedCustomer}
                >
                  Add Bun
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleStep('patty')}
                  disabled={!selectedCustomer}
                >
                  Add Patty
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleStep('topBun')}
                  disabled={!selectedCustomer}
                >
                  Add Top Bun
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleStep('sausage')}
                  disabled={!selectedCustomer}
                >
                  Add Sausage
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleStep('toppings')}
                  disabled={!selectedCustomer}
                >
                  Add Toppings
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleStep('fries')}
                  disabled={!selectedCustomer}
                >
                  Add Fries
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleStep('salt')}
                  disabled={!selectedCustomer}
                >
                  Add Salt
                </Button>
                <Button 
                  onClick={handleServe}
                  variant="default"
                  className="col-span-2 bg-green-500 hover:bg-green-600 transition-colors animate-fade-in"
                  disabled={!selectedCustomer}
                >
                  <Check className="w-5 h-5" />
                  Serve Order
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Dialog open={showGameOver} onOpenChange={setShowGameOver}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <DialogHeader>
            <DialogTitle className="text-center">Game Over!</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <Trophy className="w-12 h-12 mx-auto text-yellow-500 mb-4 animate-bounce" />
            <p className="text-2xl font-bold mb-2">Final Score: {score}</p>
            <p className="text-gray-600">
              You served {score / 10} orders successfully!
            </p>
          </div>
          <DialogFooter>
            <Button 
              onClick={startGame} 
              className="w-full hover:scale-105 transition-transform"
            >
              Play Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
