import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import { formatPrice } from "../lib/utils";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useSound } from "../hooks/useSound";

type BetColor = "red" | "black" | "green";

export default function RoulettePage() {
  const { balance, subtractBalance, addBalance, addHistory, updateStats } =
    useGameStore();
  const { play } = useSound();

  const [bet, setBet] = useState<number>(100);
  const [selectedColor, setSelectedColor] = useState<BetColor | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [result, setResult] = useState<BetColor | null>(null);
  const [won, setWon] = useState<boolean>(false);
  const [winAmount, setWinAmount] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);

  const spin = () => {
    if (!selectedColor) {
      alert("Выберите цвет!");
      return;
    }

    if (bet > balance) {
      alert("Недостаточно средств!");
      return;
    }

    if (!subtractBalance(bet)) {
      alert("Недостаточно средств!");
      return;
    }

    play("click");
    setIsSpinning(true);
    setResult(null);
    setWon(false);
    setWinAmount(0);

    // Имитация вращения (2 секунды)
    setTimeout(() => {
      // Генерация результата (5 зеленых, 45% красных, 45% чёрных)
      const rand = Math.random() * 100;
      let resultColor: BetColor;

      if (rand < 5) {
        resultColor = "green";
      } else if (rand < 50) {
        resultColor = "red";
      } else {
        resultColor = "black";
      }

      setResult(resultColor);
      setIsSpinning(false);

      // Анимация вращения
      const baseRotation = 720;
      const colorOffset =
        resultColor === "green" ? 9 : resultColor === "red" ? 108 : 288;
      setRotation(baseRotation + colorOffset);

      // Проверка выигрыша
      if (resultColor === selectedColor) {
        const multiplier = resultColor === "green" ? 14 : 2;
        const winAmount = bet * multiplier;
        addBalance(winAmount);
        setWon(true);
        setWinAmount(winAmount);
        play("win");

        addHistory({
          id: Date.now().toString(),
          type: "roulette",
          result: "win",
          amount: winAmount - bet,
          timestamp: Date.now(),
        });
        updateStats("roulette", "win");
      } else {
        play("lose");
        addHistory({
          id: Date.now().toString(),
          type: "roulette",
          result: "loss",
          amount: -bet,
          timestamp: Date.now(),
        });
        updateStats("roulette", "loss");
      }
    }, 2000);
  };

  const getColorName = (color: BetColor) => {
    switch (color) {
      case "red":
        return "Красное";
      case "black":
        return "Чёрное";
      case "green":
        return "Зелёное";
    }
  };

  const getColorBg = (color: BetColor) => {
    switch (color) {
      case "red":
        return "bg-red-500";
      case "black":
        return "bg-gray-800";
      case "green":
        return "bg-green-500";
    }
  };

  const getPayout = (color: BetColor) => {
    return color === "green" ? "x14" : "x2";
  };

  return (
    <div className="space-y-8">
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold">🎰 Рулетка</h1>
        <p className="text-muted-foreground">
          Выберите цвет и испытайте удачу!
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Roulette wheel */}
        <Card>
          <CardHeader>
            <CardTitle>Колесо фортуны</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Pointer */}
              <motion.div
                className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "16px solid transparent",
                  borderRight: "16px solid transparent",
                  borderTop: "32px solid #eab308",
                }}
                animate={isSpinning ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              />

              {/* Wheel */}
              <motion.div
                className="w-full h-full rounded-full border-8 border-border overflow-hidden"
                style={{
                  background:
                    "conic-gradient(#22c55e 0deg 18deg, #ef4444 18deg 198deg, #1f2937 198deg 378deg)",
                }}
                animate={{ rotate: isSpinning ? rotation : rotation % 360 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />

              {/* Center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-16 h-16 rounded-full bg-background border-4 border-border flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                >
                  <span className="text-2xl">🎰</span>
                </motion.div>
              </div>

              {/* Result overlay */}
              <AnimatePresence>
                {result && !isSpinning && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className={`text-4xl font-bold px-6 py-3 rounded-lg ${getColorBg(result)}`}
                      initial={{ scale: 0.5, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", duration: 0.5 }}
                    >
                      {getColorName(result)}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Win/Loss message */}
            {result && !isSpinning && (
              <motion.div
                className={`text-center mt-4 text-2xl font-bold ${won ? "text-green-400" : "text-red-400"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {won ? `🎉 Выигрыш: ${formatPrice(winAmount)}` : "💔 Проигрыш"}
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Betting controls */}
        <Card>
          <CardHeader>
            <CardTitle>Сделать ставку</CardTitle>
            <CardDescription>Баланс: {formatPrice(balance)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Color selection */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Выберите цвет
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["red", "black", "green"] as BetColor[]).map((color) => (
                  <motion.button
                    key={color}
                    onClick={() => {
                      play("click");
                      setSelectedColor(color);
                    }}
                    disabled={isSpinning}
                    className={`
                      h-20 rounded-lg font-bold text-lg transition-all
                      ${getColorBg(color)}
                      ${selectedColor === color ? "ring-4 ring-yellow-400 scale-105" : "hover:scale-105"}
                      ${isSpinning ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    `}
                    whileHover={{ scale: isSpinning ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-white">
                      <div>{getColorName(color)}</div>
                      <div className="text-sm opacity-80">
                        {getPayout(color)}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Bet amount */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Размер ставки
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={bet}
                  onChange={(e) =>
                    setBet(Math.max(1, parseInt(e.target.value) || 0))
                  }
                  className="flex-1 px-3 py-2 rounded-md bg-secondary border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={isSpinning}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    play("click");
                    setBet(Math.floor(balance * 0.1));
                  }}
                  disabled={isSpinning}
                >
                  10%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    play("click");
                    setBet(Math.floor(balance * 0.5));
                  }}
                  disabled={isSpinning}
                >
                  50%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    play("click");
                    setBet(balance);
                  }}
                  disabled={isSpinning}
                >
                  MAX
                </Button>
              </div>
            </div>

            {/* Spin button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full glow-primary"
                size="lg"
                onClick={spin}
                disabled={isSpinning || !selectedColor || bet > balance}
              >
                {isSpinning ? "🎰 Вращение..." : "🎰 Крутить"}
              </Button>
            </motion.div>

            {/* Info */}
            <div className="text-sm text-muted-foreground text-center">
              🟢 Зелёное: 5% шанс, x14 выплата
              <br />
              🔴 Красное: 45% шанс, x2 выплата
              <br />⚫ Чёрное: 45% шанс, x2 выплата
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
