# План разработки: CS:GO Cases Simulator

## 🎯 Описание проекта

Симулятор открытия кейсов в стиле CS:GO с элементами казино-тематики. Фронтенд-приложение на React с использованием библиотеки react-bits для красивых анимаций.

---

## 🏗️ Архитектура MVP

### Стек технологий

- **React 18+** — основной фреймворк
- **TypeScript** — типизация
- **Vite** — сборщик
- **Tailwind CSS** — стилизация
- **shadcn/ui** — UI компоненты
- **react-bits** — анимации и визуальные эффекты
- **Zustand** — управление состоянием (легковесная альтернатива Redux)
- **localStorage** — сохранение прогресса (инвентарь, баланс)

---

## 📦 Функционал MVP

### 1. Главная страница (Home)
- Отображение текущего баланса
- Навигация по разделам
- Последние выпавшие предметы (лента)

### 2. Открытие кейсов (Cases)
- Каталог кейсов с разной ценой и редкостью
- Анимация открытия (рулетка)
- Шансы выпадения по редкостям:
  - Common (серое) — 50%
  - Uncommon (синее) — 25%
  - Rare (фиолетовое) — 15%
  - Mythical (розовое) — 7%
  - Legendary (красное) — 2.5%
  - Ancient (золотое) — 0.5%
- Полученный предмет попадает в инвентарь

### 3. Инвентарь (Inventory)
- Отображение всех полученных предметов
- Возможность продать предмет (50% от стоимости)
- Фильтрация по редкости
- Статистика: всего предметов, общая стоимость

### 4. Краш (Crash)
- График с растущим множителем (x1.0 → x∞)
- Игрок делает ставку
- Нужно успеть забрать выигрыш до "краша"
- Краш происходит в случайный момент (алгоритм с house edge ~5%)

### 5. Рулетка (Roulette)
- Ставка на цвет (красное/чёрное/зелёное)
- Анимация вращения
- Выплаты: 2x для цветов, 14x для зелёного

---

## 📁 Структура проекта

```
cases-csgo/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn компоненты
│   │   ├── cases/           # компоненты кейсов
│   │   ├── inventory/       # компоненты инвентаря
│   │   ├── crash/           # компоненты краша
│   │   ├── roulette/        # компоненты рулетки
│   │   └── shared/          # общие компоненты
│   ├── hooks/               # кастомные хуки
│   ├── lib/                 # утилиты и конфиги
│   ├── store/               # Zustand store
│   ├── types/               # TypeScript типы
│   ├── data/                # статические данные (кейсы, предметы)
│   ├── pages/               # страницы
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── images/              # изображения предметов
├── docs/
│   └── plan.md              # этот файл
└── package.json
```

---

## 🎨 Дизайн-система

### Цветовая палитра
- **Фон**: тёмный (#0f0f0f, #1a1a1a)
- **Акцент**: золотой (#ffd700), оранжевый (#ff6b35)
- **Редкости**:
  - Common: #b0b0b0 (серый)
  - Uncommon: #4b69ff (синий)
  - Rare: #8847ff (фиолетовый)
  - Mythical: #d32ce6 (розовый)
  - Legendary: #eb4b4b (красный)
  - Ancient: #ffd700 (золотой)

### Анимации (react-bits)
- FadeIn / FadeOut — переходы
- SlideIn — появление элементов
- Pulse — акценты на кнопках
- CountUp — анимация чисел (баланс, множители)
- Particles — эффект при выпадении редкого предмета

---

## 📊 Состояние приложения (Zustand Store)

```typescript
interface AppState {
  // Баланс
  balance: number;
  addBalance: (amount: number) => void;
  subtractBalance: (amount: number) => boolean;
  
  // Инвентарь
  inventory: Item[];
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  sellItem: (id: string) => void;
  
  // История
  history: HistoryItem[];
  addHistory: (item: HistoryItem) => void;
  
  // Статистика
  stats: Stats;
  updateStats: (result: 'win' | 'loss') => void;
}
```

---

## 🗂️ Этапы разработки

### Этап 1: Настройка проекта
- [ ] Инициализация Vite + React + TypeScript
- [ ] Настройка Tailwind CSS
- [ ] Установка shadcn/ui
- [ ] Установка react-bits
- [ ] Настройка Zustand store

### Этап 2: Базовые компоненты
- [ ] Layout с навигацией
- [ ] Главная страница с балансом
- [ ] Система роутинга (React Router)

### Этап 3: Кейсы
- [ ] Каталог кейсов
- [ ] Анимация рулетки при открытии
- [ ] Логика выпадения предметов
- [ ] Сохранение в инвентарь

### Этап 4: Инвентарь
- [ ] Отображение предметов
- [ ] Продажа предметов
- [ ] Фильтрация и сортировка

### Этап 5: Мини-игры
- [ ] Crash — график, логика, ставки
- [ ] Roulette — колесо, ставки, выплаты

### Этап 6: Полировка
- [ ] Анимации react-bits
- [ ] Звуковые эффекты (опционально)
- [ ] Сохранение в localStorage
- [ ] Адаптивный дизайн

---

## 🎲 Логика вероятностей

### Генерация предмета
```typescript
function getRandomItem(): Item {
  const rand = Math.random() * 100;
  let rarity: Rarity;
  
  if (rand < 0.5) rarity = 'Ancient';
  else if (rand < 3) rarity = 'Legendary';
  else if (rand < 10) rarity = 'Mythical';
  else if (rand < 25) rarity = 'Rare';
  else if (rand < 50) rarity = 'Uncommon';
  else rarity = 'Common';
  
  // Выбор случайного предмета из пула редкости
  return itemsByRarity[rarity][randomIndex];
}
```

### Crash алгоритм
```typescript
function getCrashPoint(): number {
  // House edge ~5%
  const e = 2 ** 32;
  const h = cryptoRandom() * e;
  if (h % 100 === 0) return 1.0; // Instant crash (house wins)
  return Math.floor((100 * e - h) / (e - h)) / 100;
}
```

---

## 📝 Следующие шаги

1. Инициализировать проект командой:
   ```bash
   npm create vite@latest . -- --template react-ts
   ```

2. Установить зависимости:
   ```bash
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   npx shadcn@latest init
   npm install react-bits zustand react-router-dom
   ```

3. Начать разработку с Этапа 1
