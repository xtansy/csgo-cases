export type Rarity = 'common' | 'uncommon' | 'rare' | 'mythical' | 'legendary' | 'ancient';

export interface Item {
  id: string;
  name: string;
  rarity: Rarity;
  price: number;
  image?: string;
  description?: string;
}

export interface Case {
  id: string;
  name: string;
  price: number;
  items: Item[];
  image?: string;
  description?: string;
}

export interface InventoryItem extends Item {
  inventoryId: string;
  obtainedAt: number;
}

export interface HistoryItem {
  id: string;
  type: 'case' | 'crash' | 'roulette';
  result: 'win' | 'loss';
  amount: number;
  item?: Item;
  timestamp: number;
}

export interface Stats {
  totalCasesOpened: number;
  totalSpent: number;
  totalWon: number;
  bestDrop: Item | null;
  crashWins: number;
  rouletteWins: number;
}

export interface GameState {
  balance: number;
  inventory: InventoryItem[];
  history: HistoryItem[];
  stats: Stats;
  soundEnabled: boolean;
}
