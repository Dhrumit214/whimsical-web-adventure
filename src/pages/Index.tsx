import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { Users, Award, Check, AlertCircle } from "lucide-react";
import { GameHeader } from "@/components/GameHeader";
import { GameStart } from "@/components/GameStart";
import { GameOver } from "@/components/GameOver";
import { PrepStation } from "@/components/PrepStation";
import { CustomerAvatar } from "@/components/CustomerAvatar";
import { RecipeSteps } from "@/components/RecipeSteps";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import type { Customer, Dish, Step } from "../types/game";

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
    <div className="min-h-screen transition-all relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      {/* Food Truck Illustration */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-food-truck opacity-10 transform rotate-12" />
      
      {/* Floating Clouds */}
      <div className="absolute top-10 left-10 w-20 h-10 bg-white rounded-full opacity-20 animate-float" />
      <div className="absolute top-20 right-20 w-16 h-8 bg-white rounded-full opacity-20 animate-float-delayed" />
      
      {/* City Skyline */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-200/20 to-transparent" />

      <GameHeader score={score} timeLeft={timeLeft} />

      <main className="pt-20 p-4 max-w-7xl mx-auto">
        {!gameStarted && !showGameOver && (
          <GameStart onStart={startGame} />
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
                      ? 'ring-2 ring-primary shadow-lg scale-105' 
                      : 'hover:shadow-md'
                  }`}
                >
                  <Alert className="relative overflow-hidden bg-white/80 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <CustomerAvatar id={customer.id} patience={customer.patience} />
                      <div className="flex-1">
                        <AlertTitle className="capitalize flex items-center gap-2">
                          {DISH_NAMES[customer.dish]}
                        </AlertTitle>
                        <AlertDescription>
                          <Progress 
                            value={(customer.patience / PATIENCE_DURATION) * 100} 
                            className={`h-2 transition-all ${
                              customer.patience < 5 ? 'bg-red-200' : ''
                            }`}
                          />
                        </AlertDescription>
                      </div>
                    </div>
                    {selectedCustomer?.id === customer.id && (
                      <div className="mt-4 animate-fade-in">
                        <RecipeSteps
                          steps={DISH_STEPS[customer.dish].map(step => STEP_NAMES[step])}
                          completedSteps={currentSteps.map(step => STEP_NAMES[step])}
                        />
                      </div>
                    )}
                  </Alert>
                </div>
              ))}
            </div>

            <PrepStation
              selectedCustomer={selectedCustomer}
              currentSteps={currentSteps}
              onStepClick={handleStep}
              onServe={handleServe}
              stepNames={STEP_NAMES}
            />
          </div>
        )}
      </main>

      <GameOver 
        show={showGameOver}
        score={score}
        onRestart={startGame}
        onOpenChange={setShowGameOver}
      />
    </div>
  );
};

export default Index;
