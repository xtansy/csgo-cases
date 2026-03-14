import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import { formatPrice, getRarityColor, getRarityName } from "../lib/utils";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useSound } from "../hooks/useSound";

type FilterRarity =
  | "all"
  | "common"
  | "uncommon"
  | "rare"
  | "mythical"
  | "legendary"
  | "ancient";

export default function InventoryPage() {
  const { inventory, sellItem } = useGameStore();
  const { play } = useSound();
  const [filter, setFilter] = useState<FilterRarity>("all");

  const filteredItems =
    filter === "all"
      ? inventory
      : inventory.filter((item) => item.rarity === filter);

  const totalValue = inventory.reduce((sum, item) => sum + item.price, 0);
  const totalSellValue = inventory.reduce(
    (sum, item) => sum + Math.floor(item.price * 0.5),
    0,
  );

  const handleSell = (inventoryId: string) => {
    play("click");
    if (confirm("Продать предмет за 50% стоимости?")) {
      sellItem(inventoryId);
      play("cashout");
    }
  };

  const handleSellAll = () => {
    play("click");
    if (confirm(`Продать все предметы за ${formatPrice(totalSellValue)}?`)) {
      inventory.forEach((item) => sellItem(item.inventoryId));
      play("cashout");
    }
  };

  const rarities: FilterRarity[] = [
    "all",
    "common",
    "uncommon",
    "rare",
    "mythical",
    "legendary",
    "ancient",
  ];

  return (
    <div className="space-y-8">
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-4xl font-bold">🎒 Инвентарь</h1>
          <p className="text-muted-foreground">Ваши предметы</p>
        </div>

        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Общая стоимость</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatPrice(totalValue)}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {inventory.length > 0 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="destructive" onClick={handleSellAll}>
                Продать всё ({formatPrice(totalSellValue)})
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {rarities.map((rarity, index) => (
          <motion.div
            key={rarity}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant={filter === rarity ? "default" : "outline"}
              size="sm"
              onClick={() => {
                play("click");
                setFilter(rarity);
              }}
              className={
                filter === rarity && rarity !== "all" ? "glow-primary" : ""
              }
              style={
                filter === rarity && rarity !== "all"
                  ? {
                      borderColor: getRarityColor(rarity),
                      backgroundColor: getRarityColor(rarity),
                    }
                  : {}
              }
            >
              {rarity === "all" ? "Все" : getRarityName(rarity)}
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Items grid */}
      {filteredItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <motion.span
                className="text-4xl mb-4 block"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                📦
              </motion.span>
              {inventory.length === 0
                ? "Инвентарь пуст. Откройте кейс, чтобы получить предметы!"
                : "Нет предметов выбранной редкости"}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.inventoryId}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.03 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="overflow-hidden transition-all"
                    style={{
                      borderColor: getRarityColor(item.rarity),
                      boxShadow: `0 0 10px ${getRarityColor(item.rarity)}40`,
                    }}
                  >
                    <CardHeader className="pb-3">
                      <motion.div
                        className="w-full h-32 rounded-lg flex items-center justify-center mb-2"
                        style={{
                          backgroundColor: `${getRarityColor(item.rarity)}20`,
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <motion.span
                          className="text-5xl"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.2,
                          }}
                        >
                          🔫
                        </motion.span>
                      </motion.div>
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <CardDescription className="flex items-center justify-between">
                        <span style={{ color: getRarityColor(item.rarity) }}>
                          {getRarityName(item.rarity)}
                        </span>
                        <span className="text-xs">
                          {new Date(item.obtainedAt).toLocaleDateString(
                            "ru-RU",
                          )}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-400">
                          {formatPrice(item.price)}
                        </span>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSell(item.inventoryId)}
                          >
                            Продать ({formatPrice(Math.floor(item.price * 0.5))}
                            )
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
