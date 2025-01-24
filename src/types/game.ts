export type Dish = 'burger' | 'hotdog' | 'fries' | 'premiumBurger' | 'pizza' | 'iceCream';
export type Step = 'bun' | 'patty' | 'topBun' | 'sausage' | 'toppings' | 'fries' | 'salt';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  unlockCost: number;
  isUnlocked: boolean;
  steps: Step[];
  icon: string;
}

export interface Customer {
  id: number;
  dish: Dish;
  patience: number;
  steps: Step[];
  reward: number;
}

export interface GameState {
  level: number;
  money: number;
  unlockedDishes: Dish[];
  requiredScore: number;
  menuItems: MenuItem[];
}