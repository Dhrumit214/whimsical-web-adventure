import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { Users, Award, Check, AlertCircle, Utensils, Pizza, Sandwich, CookingPot, Coins } from "lucide-react";
import { GameHeader } from "@/components/GameHeader";
import { GameStart } from "@/components/GameStart";
import { GameOver } from "@/components/GameOver";
import { PrepStation } from "@/components/PrepStation";
import { CustomerAvatar } from "@/components/CustomerAvatar";
import { RecipeSteps } from "@/components/RecipeSteps";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import type { Customer, Dish, Step, GameState } from "../types/game";

const GAME_DURATION = 60;
const MAX_CUSTOMERS = 3;
const BASE_PATIENCE_DURATION = 15;
const BASE_REWARD = 10;

const INITIAL_GAME_STATE: GameState = {
  level: 1,
  money: 0,
  unlockedDishes: ['burger'],
  requiredScore: 50
};

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
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentSteps, setCurrentSteps] = useState<Step[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);

  const calculatePatience = useCallback(() => {
    return Math.max(5, BASE_PATIENCE_DURATION - Math.floor(gameState.level / 2));
  }, [gameState.level]);

  const calculateReward = useCallback((patience: number) => {
    const baseReward = BASE_REWARD * gameState.level;
    const patienceBonus = Math.floor(patience * 2);
    return baseReward + patienceBonus;
  }, [gameState.level]);

  const generateCustomer = useCallback(() => {
    const availableDishes = gameState.unlockedDishes;
    const randomDish = availableDishes[Math.floor(Math.random() * availableDishes.length)];
    const patience = calculatePatience();
    const reward = calculateReward(patience);
    
    const newCustomer = {
      id: Date.now(),
      dish: randomDish,
      patience,
      steps: DISH_STEPS[randomDish],
      reward
    };
    
    toast.success('New customer arrived!', {
      description: `Order: ${DISH_NAMES[randomDish]} (${reward}$)`,
      icon: <Users className="w-4 h-4" />,
    });
    
    return newCustomer;
  }, [gameState.unlockedDishes, calculatePatience, calculateReward]);

  const checkLevelUp = useCallback(() => {
    if (score >= gameState.requiredScore) {
      const newLevel = gameState.level + 1;
      const newUnlockedDishes = [...gameState.unlockedDishes];
      
      if (newLevel === 2 && !newUnlockedDishes.includes('hotdog')) {
        newUnlockedDishes.push('hotdog');
        toast.success('New recipe unlocked: Hot Dog! 🌭');
      } else if (newLevel === 3 && !newUnlockedDishes.includes('fries')) {
        newUnlockedDishes.push('fries');
        toast.success('New recipe unlocked: Fries! 🍟');
      }

      setGameState(prev => ({
        ...prev,
        level: newLevel,
        unlockedDishes: newUnlockedDishes,
        requiredScore: prev.requiredScore + (50 * newLevel)
      }));

      toast.success(`Level Up! Now at level ${newLevel}`, {
        icon: <Award className="w-4 h-4" />
      });
    }
  }, [score, gameState]);

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
      const reward = selectedCustomer.reward;
      setScore((prev) => prev + 10);
      setGameState(prev => ({
        ...prev,
        money: prev.money + reward
      }));
      setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
      setSelectedCustomer(null);
      setCurrentSteps([]);
      
      toast.success(`Order completed! Earned $${reward}`, {
        icon: <Coins className="w-4 h-4" />
      });
      
      checkLevelUp();
    } else {
      toast.error("Incomplete or incorrect order!");
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setGameState(INITIAL_GAME_STATE);
    setCustomers([]);
    setCurrentSteps([]);
    setSelectedCustomer(null);
    setShowGameOver(false);
  };

  return (
    <div className="min-h-screen transition-all relative overflow-hidden bg-warm-gradient">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      {/* Food Truck Illustration */}
      <div className="absolute top-20 right-10 w-96 h-64 bg-white/90 rounded-xl shadow-2xl transform -rotate-3 overflow-hidden">
        <div className="absolute inset-0 bg-food-truck opacity-20" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-orange-500/20" />
        <div className="absolute top-4 left-4 flex space-x-4">
          <CookingPot className="w-8 h-8 text-orange-500 animate-bounce" />
          <Pizza className="w-8 h-8 text-orange-500 animate-pulse" />
          <Sandwich className="w-8 h-8 text-orange-500 animate-bounce" />
        </div>
      </div>
      
      {/* Floating Clouds */}
      <div className="absolute top-10 left-10 w-20 h-10 bg-white rounded-full opacity-20 animate-float" />
      <div className="absolute top-20 right-20 w-16 h-8 bg-white rounded-full opacity-20 animate-float-delayed" />
      
      {/* Flying Birds */}
      <div className="absolute top-40 left-0 w-4 h-4 text-gray-400 animate-bird">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </div>
      
      {/* City Skyline */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-200/20 to-transparent" />

      <GameHeader score={score} timeLeft={timeLeft} level={gameState.level} money={gameState.money} requiredScore={gameState.requiredScore} />

      <main className="pt-20 p-4 max-w-7xl mx-auto relative">
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
              
              {/* Ingredient Icons Display */}
              <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
                <div className="flex justify-center space-x-4">
                  <div className="flex flex-col items-center">
                    <Pizza className="w-8 h-8 text-orange-500" />
                    <span className="text-sm mt-1">Patty</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Sandwich className="w-8 h-8 text-orange-500" />
                    <span className="text-sm mt-1">Bun</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Utensils className="w-8 h-8 text-orange-500" />
                    <span className="text-sm mt-1">Toppings</span>
                  </div>
                </div>
              </div>

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
                            value={(customer.patience / BASE_PATIENCE_DURATION) * 100} 
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
        money={gameState.money}
        level={gameState.level}
        onRestart={startGame}
        onOpenChange={setShowGameOver}
      />
    </div>
  );
};

export default Index;
