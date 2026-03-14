import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import {
  formatPrice,
  getRarityColor,
  getRarityName,
  getRandomItem,
} from "../lib/utils";
import { cases } from "../data/cases";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useSound } from "../hooks/useSound";

export default function CasesPage() {
  const { subtractBalance, addItem, addHistory, updateStats } = useGameStore();
  const { play } = useSound();
  const [openingCase, setOpeningCase] = useState<string | null>(null);
  const [roulettePosition, setRoulettePosition] = useState(0);
  const [wonItem, setWonItem] = useState<(typeof cases)[0]["items"][0] | null>(
    null,
  );
  const [generatedItems, setGeneratedItems] = useState<
    (typeof cases)[0]["items"]
  >([]);

  const handleOpenCase = (caseId: string) => {
    const caseData = cases.find((c) => c.id === caseId);
    if (!caseData) return;

    if (!subtractBalance(caseData.price)) {
      alert("Недостаточно средств!");
      return;
    }

    play("click");
    setOpeningCase(caseId);
    setWonItem(null);

    // Генерируем предмет заранее
    const item = getRandomItem(caseId);

    // Генерируем ленту предметов для рулетки
    const items = Array(50)
      .fill(null)
      .map(() => getRandomItem(caseId));
    // Устанавливаем выигрышный предмет примерно в центре
    items[25] = item;
    setGeneratedItems(items);

    // Анимация рулетки (3 секунды)
    setTimeout(() => {
      setRoulettePosition(2000 + Math.random() * 200);
      play("spin");
    }, 100);

    setTimeout(() => {
      setWonItem(item);
      addItem(item);
      addHistory({
        id: Date.now().toString(),
        type: "case",
        result: "win",
        amount: -caseData.price,
        item,
        timestamp: Date.now(),
      });
      updateStats("case", "win", caseData.price, item);

      // Звук победы для редких предметов
      if (["legendary", "ancient", "mythical"].includes(item.rarity)) {
        play("win");
      }

      setOpeningCase(null);
    }, 3500);
  };

  return (
    <div className="space-y-8">
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold">📦 Кейсы</h1>
        <p className="text-muted-foreground">
          Выберите кейс и испытайте удачу!
        </p>
      </motion.div>

      {/* Cases grid */}
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {cases.map((caseData, index) => (
          <motion.div
            key={caseData.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`overflow-hidden transition-all duration-300 ${
                openingCase === caseData.id ? "ring-2 ring-primary glow" : ""
              }`}
            >
              <CardHeader>
                <motion.div
                  className="w-full h-40 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4"
                  animate={{
                    scale: openingCase === caseData.id ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: openingCase === caseData.id ? Infinity : 0,
                  }}
                >
                  <span className="text-6xl">📦</span>
                </motion.div>
                <CardTitle className="text-xl">{caseData.name}</CardTitle>
                <CardDescription>{caseData.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Items preview */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Возможные предметы:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {caseData.items.slice(0, 6).map((item) => (
                      <motion.div
                        key={item.id}
                        className="w-8 h-8 rounded border flex items-center justify-center text-xs"
                        style={{
                          borderColor: getRarityColor(item.rarity),
                          backgroundColor: `${getRarityColor(item.rarity)}20`,
                        }}
                        title={item.name}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                      >
                        🔫
                      </motion.div>
                    ))}
                    {caseData.items.length > 6 && (
                      <span className="text-xs text-muted-foreground">
                        +{caseData.items.length - 6}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full glow-primary"
                    disabled={openingCase !== null}
                    onClick={() => handleOpenCase(caseData.id)}
                  >
                    {openingCase === caseData.id
                      ? "🎰 Открытие..."
                      : formatPrice(caseData.price)}
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Roulette animation overlay */}
      <AnimatePresence>
        {openingCase && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-4xl p-8"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              {/* Roulette window */}
              <div className="relative overflow-hidden h-40 bg-card rounded-xl border-2 border-primary glow">
                {/* Center line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-yellow-400 z-20 -translate-x-1/2 shadow-[0_0_10px_rgba(255,215,0,0.8)]" />

                {/* Items strip */}
                <motion.div
                  className="flex items-center gap-2 absolute left-4"
                  animate={{ x: -roulettePosition }}
                  transition={{ duration: 3.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {generatedItems.map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex-shrink-0 w-32 h-28 rounded-lg border-2 flex flex-col items-center justify-center gap-2"
                      style={{
                        borderColor: getRarityColor(item.rarity),
                        backgroundColor: `${getRarityColor(item.rarity)}20`,
                      }}
                    >
                      <span className="text-3xl">🔫</span>
                      <span className="text-xs text-center px-2 truncate w-full">
                        {item.name}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <motion.p
                className="text-center text-muted-foreground mt-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Открываем...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Won item modal */}
      <AnimatePresence>
        {wonItem && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setWonItem(null)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="max-w-md w-full glow pulse-glow">
                <CardHeader className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <CardTitle className="text-2xl">
                      🎉 Вам выпал предмет!
                    </CardTitle>
                  </motion.div>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <motion.div
                    className="w-48 h-48 rounded-xl border-4 flex items-center justify-center mb-4"
                    style={{
                      borderColor: getRarityColor(wonItem.rarity),
                      backgroundColor: `${getRarityColor(wonItem.rarity)}20`,
                    }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.3, duration: 0.6 }}
                  >
                    <motion.span
                      className="text-6xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 0.5,
                        delay: 0.5,
                        repeat: Infinity,
                      }}
                    >
                      🔫
                    </motion.span>
                  </motion.div>
                  <motion.h3
                    className="text-xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {wonItem.name}
                  </motion.h3>
                  <motion.p
                    className="text-lg font-semibold"
                    style={{ color: getRarityColor(wonItem.rarity) }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {getRarityName(wonItem.rarity)}
                  </motion.p>
                  <motion.p
                    className="text-2xl font-bold text-green-400 mt-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                  >
                    {formatPrice(wonItem.price)}
                  </motion.p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => setWonItem(null)}>
                    Забрать в инвентарь
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
