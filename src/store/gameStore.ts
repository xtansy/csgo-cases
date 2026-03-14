import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GameState, HistoryItem, InventoryItem, Item, Stats } from "../types";

interface GameActions {
  // Баланс
  addBalance: (amount: number) => void;
  subtractBalance: (amount: number) => boolean;

  // Инвентарь
  addItem: (item: Item) => void;
  removeItem: (inventoryId: string) => void;
  sellItem: (inventoryId: string) => number;

  // История
  addHistory: (historyItem: HistoryItem) => void;

  // Статистика
  updateStats: (
    type: "case" | "crash" | "roulette",
    result: "win" | "loss",
    amount?: number,
    item?: Item,
  ) => void;

  // Звук
  toggleSound: () => void;

  // Сброс
  reset: () => void;
}

const defaultStats: Stats = {
  totalCasesOpened: 0,
  totalSpent: 0,
  totalWon: 0,
  bestDrop: null,
  crashWins: 0,
  rouletteWins: 0,
};

const defaultState: GameState = {
  balance: 10000,
  inventory: [],
  history: [],
  stats: defaultStats,
  soundEnabled: true,
};

type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...defaultState,

      // Баланс
      addBalance: (amount) => {
        set((state) => ({
          balance: state.balance + amount,
          stats: {
            ...state.stats,
            totalWon: state.stats.totalWon + amount,
          },
        }));
      },

      subtractBalance: (amount) => {
        const state = get();
        if (state.balance >= amount) {
          set((state) => ({
            balance: state.balance - amount,
            stats: {
              ...state.stats,
              totalSpent: state.stats.totalSpent + amount,
            },
          }));
          return true;
        }
        return false;
      },

      // Инвентарь
      addItem: (item) => {
        const inventoryItem: InventoryItem = {
          ...item,
          inventoryId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          obtainedAt: Date.now(),
        };

        set((state) => {
          const bestDrop =
            !state.stats.bestDrop || item.price > state.stats.bestDrop.price
              ? item
              : state.stats.bestDrop;

          return {
            inventory: [inventoryItem, ...state.inventory],
            stats: {
              ...state.stats,
              bestDrop,
            },
          };
        });
      },

      removeItem: (inventoryId) => {
        set((state) => ({
          inventory: state.inventory.filter(
            (item) => item.inventoryId !== inventoryId,
          ),
        }));
      },

      sellItem: (inventoryId) => {
        const state = get();
        const item = state.inventory.find((i) => i.inventoryId === inventoryId);
        if (!item) return 0;

        const sellPrice = Math.floor(item.price * 0.5);

        set((state) => ({
          inventory: state.inventory.filter(
            (i) => i.inventoryId !== inventoryId,
          ),
          balance: state.balance + sellPrice,
        }));

        return sellPrice;
      },

      // История
      addHistory: (historyItem) => {
        set((state) => ({
          history: [historyItem, ...state.history].slice(0, 100),
        }));
      },

      // Статистика
      updateStats: (type, result, _amount, item) => {
        set((state) => {
          const newStats = { ...state.stats };

          if (type === "case") {
            newStats.totalCasesOpened += 1;
            if (item) {
              newStats.totalWon += item.price;
            }
          } else if (type === "crash" && result === "win") {
            newStats.crashWins += 1;
          } else if (type === "roulette" && result === "win") {
            newStats.rouletteWins += 1;
          }

          return { stats: newStats };
        });
      },

      // Звук
      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },

      // Сброс
      reset: () => {
        set(defaultState);
      },
    }),
    {
      name: "csgo-cases-storage",
      partialize: (state) => ({
        balance: state.balance,
        inventory: state.inventory,
        history: state.history,
        stats: state.stats,
        soundEnabled: state.soundEnabled,
      }),
    },
  ),
);
