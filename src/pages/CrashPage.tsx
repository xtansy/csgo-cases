import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import { formatPrice, getCrashPoint } from "../lib/utils";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useSound } from "../hooks/useSound";

export default function CrashPage() {
  const { balance, subtractBalance, addBalance, addHistory, updateStats } =
    useGameStore();
  const { play } = useSound();

  const [bet, setBet] = useState<number>(100);
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [crashed, setCrashed] = useState<boolean>(false);
  const [crashPoint, setCrashPointState] = useState<number>(0);
  const [cashedOut, setCashedOut] = useState<boolean>(false);
  const [cashedOutAt, setCashedOutAt] = useState<number>(0);

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startGame = () => {
    if (bet > balance) {
      alert("Недостаточно средств!");
      return;
    }

    if (!subtractBalance(bet)) {
      alert("Недостаточно средств!");
      return;
    }

    play("click");
    const point = getCrashPoint();
    setCrashPointState(point);
    setIsPlaying(true);
    setCrashed(false);
    setCashedOut(false);
    setMultiplier(1.0);
    startTimeRef.current = Date.now();

    animate(point);
  };

  const animate = (point: number) => {
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newMultiplier = 1 + (elapsed / 1000) ** 2 * 0.1;

      if (newMultiplier >= point) {
        setMultiplier(point);
        setCrashed(true);
        setIsPlaying(false);

        if (!cashedOut) {
          play("lose");
          addHistory({
            id: Date.now().toString(),
            type: "crash",
            result: "loss",
            amount: -bet,
            timestamp: Date.now(),
          });
          updateStats("crash", "loss");
        }

        return;
      }

      setMultiplier(newMultiplier);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const cashOut = () => {
    if (!isPlaying || crashed || cashedOut) return;

    const winAmount = Math.floor(bet * multiplier);
    addBalance(winAmount);
    setCashedOut(true);
    setCashedOutAt(multiplier);
    play("cashout");

    addHistory({
      id: Date.now().toString(),
      type: "crash",
      result: "win",
      amount: winAmount - bet,
      timestamp: Date.now(),
    });
    updateStats("crash", "win");
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const getMultiplierColor = (mult: number) => {
    if (mult < 2) return "text-muted-foreground";
    if (mult < 5) return "text-green-400";
    if (mult < 10) return "text-purple-400";
    return "text-yellow-400";
  };

  return (
    <div className="space-y-8">
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold">🚀 Crash</h1>
        <p className="text-muted-foreground">
          Забери выигрыш до того, как ракета улетит!
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Game area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Игровое поле</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 bg-gradient-to-b from-secondary to-card rounded-xl overflow-hidden border border-border">
              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-4 p-4 opacity-20">
                {Array(24)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className="border border-border/50 rounded" />
                  ))}
              </div>

              {/* Multiplier display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-center"
                  animate={crashed ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className={`text-7xl font-bold ${crashed ? "text-red-400" : getMultiplierColor(multiplier)}`}
                    animate={
                      isPlaying && !crashed ? { scale: [1, 1.05, 1] } : {}
                    }
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {multiplier.toFixed(2)}x
                  </motion.div>
                  {crashed && (
                    <motion.div
                      className="text-2xl text-red-400 mt-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      💥 CRASHED
                    </motion.div>
                  )}
                  {cashedOut && (
                    <motion.div
                      className="text-2xl text-green-400 mt-2"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      ✅ Забрано на {cashedOutAt.toFixed(2)}x
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Rocket animation */}
              {!crashed && (
                <motion.div
                  className="absolute text-4xl"
                  animate={{
                    left: `${Math.min(50 + (multiplier - 1) * 20, 90)}%`,
                    bottom: `${Math.min(20 + (multiplier - 1) * 30, 80)}%`,
                  }}
                  transition={{ duration: 0.1 }}
                >
                  🚀
                </motion.div>
              )}

              {/* Crash point indicator */}
              {crashed && (
                <motion.div
                  className="absolute top-4 right-4 text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Точка краша: {crashPoint.toFixed(2)}x
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Betting controls */}
        <Card>
          <CardHeader>
            <CardTitle>Ставка</CardTitle>
            <CardDescription>Баланс: {formatPrice(balance)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  disabled={isPlaying}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    play("click");
                    setBet(Math.floor(balance * 0.1));
                  }}
                  disabled={isPlaying}
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
                  disabled={isPlaying}
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
                  disabled={isPlaying}
                >
                  MAX
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              {!isPlaying ? (
                <motion.div
                  className="w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full glow-primary"
                    size="lg"
                    onClick={startGame}
                    disabled={bet > balance}
                  >
                    🚀 Сделать ставку
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  className="w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full"
                    size="lg"
                    variant={cashedOut ? "secondary" : "destructive"}
                    onClick={cashOut}
                    disabled={cashedOut || crashed}
                  >
                    {cashedOut
                      ? `✅ Забрано на ${cashedOutAt.toFixed(2)}x`
                      : `💰 Забрать (${formatPrice(Math.floor(bet * multiplier))})`}
                  </Button>
                </motion.div>
              )}
            </div>

            {isPlaying && !cashedOut && (
              <motion.div
                className="text-center text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Текущий выигрыш:{" "}
                <span className="text-green-400 font-semibold">
                  {formatPrice(Math.floor(bet * multiplier))}
                </span>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Статистика</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Побед в Crash:</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Множитель:</span>
              <span className="font-semibold">{multiplier.toFixed(2)}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Статус:</span>
              <motion.span
                className={`font-semibold ${crashed ? "text-red-400" : cashedOut ? "text-green-400" : isPlaying ? "text-yellow-400" : ""}`}
                animate={
                  isPlaying && !crashed ? { opacity: [0.5, 1, 0.5] } : {}
                }
                transition={{ duration: 1, repeat: Infinity }}
              >
                {crashed
                  ? "Краш"
                  : cashedOut
                    ? "Выигрыш"
                    : isPlaying
                      ? "Игра"
                      : "Ожидание"}
              </motion.span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
