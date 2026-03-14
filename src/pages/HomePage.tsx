import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

export default function HomePage() {
  const { stats, inventory, history } = useGameStore();

  const recentHistory = history.slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero section */}
      <motion.section
        className="text-center space-y-4 py-12"
        variants={itemVariants}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{ backgroundSize: "200% 200%" }}
        >
          CS:GO Cases Simulator
        </motion.h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Открывай кейсы, испытывай удачу в Crash и Roulette, собирай коллекцию
          редких предметов!
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link to="/cases">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="glow-primary">
                🎁 Открыть кейс
              </Button>
            </motion.div>
          </Link>
          <Link to="/crash">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline">
                🚀 Crash
              </Button>
            </motion.div>
          </Link>
          <Link to="/roulette">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline">
                🎰 Рулетка
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.section>

      {/* Stats cards */}
      <motion.section
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        {[
          {
            title: "Открыто кейсов",
            value: stats.totalCasesOpened,
            icon: "📦",
            color: "",
          },
          {
            title: "Всего потрачено",
            value: formatPrice(stats.totalSpent),
            icon: "💸",
            color: "text-red-400",
          },
          {
            title: "Всего выиграно",
            value: formatPrice(stats.totalWon),
            icon: "💰",
            color: "text-green-400",
          },
          {
            title: "Предметов в инвентаре",
            value: inventory.length,
            icon: "🎒",
            color: "",
          },
        ].map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <span className="text-2xl">{stat.icon}</span>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* Best drop */}
      {stats.bestDrop && (
        <motion.section variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>🏆 Лучший дроп</CardTitle>
              <CardDescription>Ваш самый ценный предмет</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                className="flex items-center gap-4"
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold"
                  style={{
                    backgroundColor: `${getRarityColor(stats.bestDrop.rarity)}20`,
                    border: `2px solid ${getRarityColor(stats.bestDrop.rarity)}`,
                  }}
                >
                  🔫
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{stats.bestDrop.name}</p>
                  <p
                    className="text-sm"
                    style={{ color: getRarityColor(stats.bestDrop.rarity) }}
                  >
                    {getRarityName(stats.bestDrop.rarity)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-green-400">
                    {formatPrice(stats.bestDrop.price)}
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.section>
      )}

      {/* Recent history */}
      {recentHistory.length > 0 && (
        <motion.section variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>📜 Недавняя история</CardTitle>
              <CardDescription>Последние 5 действий</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.01,
                      backgroundColor: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {item.type === "case"
                          ? "📦"
                          : item.type === "crash"
                            ? "🚀"
                            : "🎰"}
                      </span>
                      <div>
                        <p className="font-medium capitalize">
                          {item.type === "case"
                            ? "Открытие кейса"
                            : item.type === "crash"
                              ? "Crash"
                              : "Рулетка"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.timestamp).toLocaleString("ru-RU")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${item.result === "win" ? "text-green-400" : "text-red-400"}`}
                      >
                        {item.result === "win" ? "+" : "-"}
                        {formatPrice(Math.abs(item.amount))}
                      </p>
                      {item.item && (
                        <p
                          className="text-xs"
                          style={{ color: getRarityColor(item.item.rarity) }}
                        >
                          {item.item.name}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>
      )}
    </motion.div>
  );
}

function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: "#b0b0b0",
    uncommon: "#4b69ff",
    rare: "#8847ff",
    mythical: "#d32ce6",
    legendary: "#eb4b4b",
    ancient: "#ffd700",
  };
  return colors[rarity] || "#ffffff";
}

function getRarityName(rarity: string): string {
  const names: Record<string, string> = {
    common: "Обычное",
    uncommon: "Необычное",
    rare: "Редкое",
    mythical: "Мифическое",
    legendary: "Легендарное",
    ancient: "Древнее",
  };
  return names[rarity] || rarity;
}
