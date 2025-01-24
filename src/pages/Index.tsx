import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { 
  Users, 
  Award, 
  ChefHat, 
  Pizza, 
  CookingPot,
  Timer as Clock,
  CheckCircle as Check,
  AlertTriangle as AlertCircle,
  Coins,
  Utensils
} from "lucide-react";
import { GameHeader } from "@/components/GameHeader";
import { GameStart } from "@/components/GameStart";
import { GameOver } from "@/components/GameOver";
import { PrepStation } from "@/components/PrepStation";
import { CustomerAvatar } from "@/components/CustomerAvatar";
import { RecipeSteps } from "@/components/RecipeSteps";
import { GameHistory } from "@/components/GameHistory";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { UpgradesShop } from "@/components/UpgradesShop";
import { Button } from "@/components/ui/button";
import type { Customer, Dish, Step, GameState, MenuItem } from "../types/game";

const INITIAL_GAME_DURATION = 120;
const TIME_PURCHASE_COST = 50;
const TIME_PURCHASE_AMOUNT = 60;
const MAX_CUSTOMERS = 3;
const BASE_PATIENCE_DURATION = 15;

interface GameHistoryEntry {
  id: number;
  score: number;
  money: number;
  level: number;
  timestamp: Date;
}

const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'burger',
    name: 'Basic Burger',
    price: 12,
    unlockCost: 0,
    isUnlocked: true,
    steps: ['bun', 'patty', 'topBun'],
    icon: 'burger'
  },
  {
    id: 'fries',
    name: 'French Fries',
    price: 5,
    unlockCost: 0,
    isUnlocked: true,
    steps: ['fries', 'salt'],
    icon: 'fries'
  },
  {
    id: 'hotdog',
    name: 'Hot Dog',
    price: 20,
    unlockCost: 100,
    isUnlocked: false,
    steps: ['bun', 'sausage', 'toppings'],
    icon: 'hotdog'
  },
  {
    id: 'premiumBurger',
    name: 'Premium Burger',
    price: 30,
    unlockCost: 250,
    isUnlocked: false,
    steps: ['bun', 'patty', 'toppings', 'topBun'],
    icon: 'burger'
  },
  {
    id: 'pizza',
    name: 'Pizza',
    price: 45,
    unlockCost: 500,
    isUnlocked: false,
    steps: ['bun', 'toppings'],
    icon: 'pizza'
  },
  {
    id: 'iceCream',
    name: 'Ice Cream',
    price: 25,
    unlockCost: 750,
    isUnlocked: false,
    steps: ['toppings'],
    icon: 'iceCream'
  }
];

const INITIAL_GAME_STATE: GameState = {
  level: 1,
  money: 0,
  score: 0,
  unlockedDishes: ['burger', 'fries'],
  requiredScore: 50,
  menuItems: INITIAL_MENU_ITEMS
};

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(INITIAL_GAME_DURATION);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentSteps, setCurrentSteps] = useState<Step[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameHistory, setGameHistory] = useState<GameHistoryEntry[]>([]);

  const startGame = () => {
    setGameStarted(true);
    setTimeLeft(INITIAL_GAME_DURATION);
    setGameState(INITIAL_GAME_STATE);
    setCustomers([]);
    setCurrentSteps([]);
    setSelectedCustomer(null);
    setShowGameOver(false);
  };

  const handleGameOver = () => {
    const historyEntry: GameHistoryEntry = {
      id: Date.now(),
      score: gameState.score,
      money: gameState.money,
      level: gameState.level,
      timestamp: new Date()
    };
    
    setGameHistory(prev => [historyEntry, ...prev]);

    setGameStarted(false);
    setShowGameOver(true);
    setTimeLeft(INITIAL_GAME_DURATION);
    setGameState(INITIAL_GAME_STATE);
    setCustomers([]);
    setCurrentSteps([]);
    setSelectedCustomer(null);
  };

  const handleUnlockItem = (itemId: string) => {
    if (gameState.money >= gameState.menuItems.find(item => item.id === itemId)?.unlockCost!) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - prev.menuItems.find(item => item.id === itemId)?.unlockCost!,
        menuItems: prev.menuItems.map(item =>
          item.id === itemId ? { ...item, isUnlocked: true } : item
        ),
        unlockedDishes: [...prev.unlockedDishes, itemId as Dish]
      }));
    }
  };

  const handleServe = () => {
    if (!selectedCustomer) return;

    const menuItem = gameState.menuItems.find(item => item.id === selectedCustomer.dish);
    if (!menuItem) return;

    const expectedSteps = menuItem.steps;
    const isCorrectOrder = currentSteps.length === expectedSteps.length &&
      currentSteps.every((step, index) => step === expectedSteps[index]);

    if (isCorrectOrder) {
      const newScore = gameState.score + 10;
      const newMoney = gameState.money + selectedCustomer.reward;
      const newLevel = newScore >= gameState.requiredScore ? gameState.level + 1 : gameState.level;
      const newRequiredScore = newScore >= gameState.requiredScore ? gameState.requiredScore * 1.5 : gameState.requiredScore;

      setGameState(prev => ({
        ...prev,
        score: newScore,
        money: newMoney,
        level: newLevel,
        requiredScore: newRequiredScore
      }));

      setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id));
      setSelectedCustomer(null);
      setCurrentSteps([]);

      toast.success(`Order completed! +$${selectedCustomer.reward}`, {
        description: "Great job! Keep up the good work!"
      });
    } else {
      toast.error("Order is incorrect!", {
        description: "Check the recipe steps and try again."
      });
    }
  };

  const purchaseTime = () => {
    if (gameState.money >= TIME_PURCHASE_COST) {
      setTimeLeft(prev => prev + TIME_PURCHASE_AMOUNT);
      setGameState(prev => ({
        ...prev,
        money: prev.money - TIME_PURCHASE_COST
      }));
      toast.success(`Purchased ${TIME_PURCHASE_AMOUNT} seconds for $${TIME_PURCHASE_COST}!`);
    } else {
      toast.error(`Not enough money! Need $${TIME_PURCHASE_COST - gameState.money} more.`);
    }
  };

  const calculatePatience = useCallback(() => {
    return Math.max(5, BASE_PATIENCE_DURATION - Math.floor(gameState.level / 2));
  }, [gameState.level]);

  const shouldGenerateOrder = useCallback((itemPrice: number) => {
    const levelFactor = gameState.level * 5;
    const probability = Math.min(100, Math.max(0, 100 - (levelFactor / itemPrice))); 
    return Math.random() * 100 <= probability;
  }, [gameState.level]);

  const generateCustomer = useCallback(() => {
    const availableDishes = gameState.menuItems
      .filter(item => item.isUnlocked)
      .filter(item => shouldGenerateOrder(item.price));

    if (availableDishes.length === 0) {
      availableDishes.push(...gameState.menuItems.filter(item => item.isUnlocked));
    }

    if (availableDishes.length === 0) {
      console.error('No available dishes found');
      return null;
    }

    const randomMenuItem = availableDishes[Math.floor(Math.random() * availableDishes.length)];
    
    if (!randomMenuItem) {
      console.error('Failed to select random menu item');
      return null;
    }

    const patience = calculatePatience();
    
    const dishType = randomMenuItem.id as Dish;
    
    const newCustomer: Customer = {
      id: Date.now(),
      dish: dishType,
      patience,
      steps: randomMenuItem.steps,
      reward: randomMenuItem.price
    };
    
    toast.success('New customer arrived!', {
      description: `Order: ${randomMenuItem.name} ($${randomMenuItem.price})`,
      icon: <Users className="w-4 h-4" />,
    });
    
    return newCustomer;
  }, [gameState.menuItems, calculatePatience, shouldGenerateOrder]);

  useEffect(() => {
    if (gameStarted && timeLeft <= 10) {
      toast.warning(`Only ${timeLeft} seconds left!`, {
        description: "Hurry up! Time is running out!",
        icon: <Clock className="w-4 h-4 text-red-500 animate-pulse" />,
      });
    }
  }, [timeLeft, gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGameOver();
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
          const newCustomer = generateCustomer();
          if (newCustomer) {
            return [...prev, newCustomer];
          }
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
      toast.info(`Selected customer's order: ${customer.dish}`);
    }
  };

  const handleStep = (step: Step) => {
    if (!selectedCustomer) {
      toast.error("Please select a customer first!");
      return;
    }

    const expectedStep = gameState.menuItems.find(item => item.id === selectedCustomer.dish)!.steps[currentSteps.length];
    const buttonElement = document.activeElement as HTMLButtonElement;
    
    if (step === expectedStep) {
      setCurrentSteps((prev) => [...prev, step]);
      toast.success(`Added ${step}!`, {
        icon: <Check className="w-4 h-4" />
      });
    } else {
      buttonElement?.classList.add('animate-shake', 'bg-red-100');
      setTimeout(() => {
        buttonElement?.classList.remove('animate-shake', 'bg-red-100');
      }, 300);
      
      toast.error("Wrong ingredient! Check the recipe steps.", {
        icon: <AlertCircle className="w-4 h-4" />
      });
    }
  };

  useEffect(() => {
    if (showGameOver) {
      setTimeLeft(INITIAL_GAME_DURATION);
    }
  }, [showGameOver]);

  return (
    <div className="min-h-screen transition-all relative overflow-hidden bg-warm-gradient">
      {gameStarted ? (
        <div>
          <GameHeader 
            score={gameState.score} 
            timeLeft={timeLeft} 
            level={gameState.level} 
            money={gameState.money} 
            requiredScore={gameState.requiredScore}
            onPurchaseTime={purchaseTime}
          />
          <main className="pt-32 p-4 max-w-7xl mx-auto relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Customers
                  </h2>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={purchaseTime}
                      className={`flex items-center gap-2 ${
                        timeLeft <= 10 ? 'animate-pulse bg-red-50' : ''
                      }`}
                    >
                      Buy 60s ($50)
                    </Button>
                    <UpgradesShop
                      money={gameState.money}
                      menuItems={gameState.menuItems}
                      onUnlockItem={handleUnlockItem}
                    />
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
                          <AlertTitle className="capitalize flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              {customer.dish}
                            </span>
                            <span className="text-sm font-normal text-green-600 flex items-center gap-1">
                              <Coins className="w-4 h-4" />
                              ${customer.reward}
                            </span>
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
                            steps={gameState.menuItems.find(item => item.id === customer.dish)!.steps}
                            completedSteps={currentSteps}
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
                stepNames={{ bun: 'Add Bun', patty: 'Add Patty', topBun: 'Add Top Bun', sausage: 'Add Sausage', toppings: 'Add Toppings', fries: 'Add Fries', salt: 'Add Salt' }}
              />
            </div>
          </main>
        </div>
      ) : (
        <main className="pt-16 p-4 max-w-7xl mx-auto">
          {!showGameOver && (
            <div className="flex flex-col items-center justify-center">
              <div className="text-center space-y-4 mb-16">
                <ChefHat className="w-16 h-16 mx-auto text-orange-500" />
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Food Truck Frenzy</h1>
                <p className="text-gray-600 max-w-md mx-auto">
                  Run your food truck empire against the clock!
                </p>
                <Button 
                  size="lg"
                  onClick={startGame}
                  className="mt-8 text-lg px-8 hover:scale-110 transition-transform bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg"
                >
                  Start Game
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-16">
                <div className="p-8 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all text-center">
                  <Utensils className="w-8 h-8 text-orange-500 mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">Serve Customers</h3>
                  <p className="text-gray-600">Take orders and prepare delicious meals for your hungry customers!</p>
                </div>
                <div className="p-8 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all text-center">
                  <Pizza className="w-8 h-8 text-orange-500 mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">Unlock Recipes</h3>
                  <p className="text-gray-600">Earn money to unlock new recipes and expand your menu!</p>
                </div>
                <div className="p-8 rounded-lg bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all text-center">
                  <CookingPot className="w-8 h-8 text-orange-500 mb-4 mx-auto" />
                  <h3 className="text-lg font-semibold mb-2">Level Up</h3>
                  <p className="text-gray-600">Progress through levels and become the ultimate food truck master!</p>
                </div>
              </div>

              <GameHistory history={gameHistory} />
            </div>
          )}
          
          <GameOver 
            show={showGameOver}
            score={gameState.score}
            money={gameState.money}
            level={gameState.level}
            onRestart={startGame}
            onOpenChange={setShowGameOver}
          />
        </main>
      )}
    </div>
  );
};

export default Index;
