import { Case, Item } from '../types';

// Пул предметов для генерации
const itemsPool: Record<string, Item[]> = {
  cheap: [
    { id: 'c1', name: 'P250 | Sand Dune', rarity: 'common', price: 5 },
    { id: 'c2', name: 'MP9 | Storm', rarity: 'common', price: 8 },
    { id: 'c3', name: 'SCAR-20 | Sand Mesh', rarity: 'common', price: 6 },
    { id: 'u1', name: 'Glock-18 | Blue Fissure', rarity: 'uncommon', price: 50 },
    { id: 'u2', name: 'USP-S | Guardian', rarity: 'uncommon', price: 45 },
    { id: 'r1', name: 'AK-47 | Redline', rarity: 'rare', price: 150 },
    { id: 'm1', name: 'M4A4 | Howl', rarity: 'mythical', price: 500 },
  ],
  budget: [
    { id: 'c4', name: 'AUG | Chameleon', rarity: 'common', price: 10 },
    { id: 'c5', name: 'P90 | Ash Wood', rarity: 'common', price: 12 },
    { id: 'u3', name: 'AWP | Worm God', rarity: 'uncommon', price: 80 },
    { id: 'u4', name: 'M4A1-S | Basilisk', rarity: 'uncommon', price: 75 },
    { id: 'r2', name: 'USP-S | Cortex', rarity: 'rare', price: 200 },
    { id: 'r3', name: 'Glock-18 | Vogue', rarity: 'rare', price: 250 },
    { id: 'm2', name: 'AK-47 | Neon Rider', rarity: 'mythical', price: 600 },
    { id: 'l1', name: 'AWP | Hyper Beast', rarity: 'legendary', price: 1500 },
  ],
  premium: [
    { id: 'c6', name: 'FAMAS | Commemoration', rarity: 'common', price: 15 },
    { id: 'u5', name: 'Desert Eagle | Code Red', rarity: 'uncommon', price: 120 },
    { id: 'u6', name: 'P250 | Neo Noir', rarity: 'uncommon', price: 100 },
    { id: 'r4', name: 'M4A1-S | Printstream', rarity: 'rare', price: 350 },
    { id: 'r5', name: 'AK-47 | Asiimov', rarity: 'rare', price: 400 },
    { id: 'm3', name: 'USP-S | Kill Confirmed', rarity: 'mythical', price: 800 },
    { id: 'l2', name: 'M4A4 | Neo-Noir', rarity: 'legendary', price: 2000 },
    { id: 'a1', name: 'Karambit | Fade', rarity: 'ancient', price: 10000 },
  ],
  elite: [
    { id: 'u7', name: 'AWP | Atheris', rarity: 'uncommon', price: 150 },
    { id: 'r6', name: 'Desert Eagle | Blaze', rarity: 'rare', price: 500 },
    { id: 'm4', name: 'Glock-18 | Gamma Doppler', rarity: 'mythical', price: 1200 },
    { id: 'm5', name: 'Butterfly Knife | Urban Masked', rarity: 'mythical', price: 1500 },
    { id: 'l3', name: 'AK-47 | Wild Lotus', rarity: 'legendary', price: 3500 },
    { id: 'l4', name: 'AWP | Dragon Lore', rarity: 'legendary', price: 5000 },
    { id: 'a2', name: 'M9 Bayonet | Doppler', rarity: 'ancient', price: 15000 },
  ],
  exclusive: [
    { id: 'r7', name: 'Sport Gloves | Pandora\'s Box', rarity: 'rare', price: 800 },
    { id: 'm6', name: 'Karambit | Lore', rarity: 'mythical', price: 2000 },
    { id: 'l5', name: 'Butterfly Knife | Fade', rarity: 'legendary', price: 6000 },
    { id: 'l6', name: 'M9 Bayonet | Marble Fade', rarity: 'legendary', price: 4500 },
    { id: 'a3', name: 'Karambit | Case Hardened', rarity: 'ancient', price: 20000 },
    { id: 'a4', name: 'AWP | The Gungnir', rarity: 'ancient', price: 25000 },
  ],
};

// Генерация кейсов
export const cases: Case[] = [
  {
    id: 'cheap',
    name: 'Бюджетный кейс',
    price: 50,
    items: itemsPool.cheap,
    description: 'Дешёвый кейс для начинающих. Шанс на редкие предметы минимален.',
  },
  {
    id: 'budget',
    name: 'Кейс новичка',
    price: 150,
    items: itemsPool.budget,
    description: 'Хороший баланс цены и качества. Может выпасть что-то стоящее.',
  },
  {
    id: 'premium',
    name: 'Премиум кейс',
    price: 500,
    items: itemsPool.premium,
    description: 'Кейс для опытных игроков. Высокий шанс на легендарные предметы.',
  },
  {
    id: 'elite',
    name: 'Элитный кейс',
    price: 1500,
    items: itemsPool.elite,
    description: 'Только для избранных. Здесь водятся ножи и перчатки!',
  },
  {
    id: 'exclusive',
    name: 'Эксклюзивный кейс',
    price: 5000,
    items: itemsPool.exclusive,
    description: 'Вершина удачи. Легендарные ножи и драконьи лоры ждут тебя.',
  },
];

// Шансы выпадения по редкостям
export const rarityChances: Record<string, number> = {
  common: 50,
  uncommon: 25,
  rare: 15,
  mythical: 7,
  legendary: 2.5,
  ancient: 0.5,
};

// Цвета для редкостей
export const rarityColors: Record<string, string> = {
  common: '#b0b0b0',
  uncommon: '#4b69ff',
  rare: '#8847ff',
  mythical: '#d32ce6',
  legendary: '#eb4b4b',
  ancient: '#ffd700',
};

// Названия редкостей
export const rarityNames: Record<string, string> = {
  common: 'Обычное',
  uncommon: 'Необычное',
  rare: 'Редкое',
  mythical: 'Мифическое',
  legendary: 'Легендарное',
  ancient: 'Древнее',
};
