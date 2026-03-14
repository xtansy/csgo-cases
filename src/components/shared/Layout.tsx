import { Outlet, Link, useLocation } from "react-router-dom";
import { useGameStore } from "../../store/gameStore";
import { formatPrice } from "../../lib/utils";
import { Button } from "../ui/button";

export default function Layout() {
  const location = useLocation();
  const { balance, soundEnabled, toggleSound } = useGameStore();

  const navItems = [
    { path: "/", label: "Главная" },
    { path: "/cases", label: "Кейсы" },
    { path: "/inventory", label: "Инвентарь" },
    { path: "/crash", label: "Crash" },
    { path: "/roulette", label: "Рулетка" },
  ];

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <span className="text-primary-foreground font-bold text-lg">
                C
              </span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">
              CS:GO Cases
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={
                    location.pathname === item.path ? "default" : "ghost"
                  }
                  size="sm"
                  className={
                    location.pathname === item.path ? "glow-primary" : ""
                  }
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {/* Balance */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
              <span className="text-green-400 font-semibold">$</span>
              <span className="font-bold text-lg">{formatPrice(balance)}</span>
            </div>

            {/* Sound toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">🔊</span>
              <button
                onClick={toggleSound}
                data-state={soundEnabled ? "checked" : "unchecked"}
                className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-muted data-[state=checked]:bg-primary"
              >
                <span
                  className={cn(
                    "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
                    soundEnabled ? "translate-x-4" : "translate-x-0",
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-8 mx-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 mt-auto">
        <div className="container px-4 mx-auto text-center text-muted-foreground text-sm">
          <p>CS:GO Cases Simulator — образовательный проект</p>
          <p className="mt-1">Не является азартной игрой на реальные деньги</p>
        </div>
      </footer>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
