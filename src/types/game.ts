export type Dish = 'burger' | 'hotdog' | 'fries';
export type Step = 'bun' | 'patty' | 'topBun' | 'sausage' | 'toppings' | 'fries' | 'salt';

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
}