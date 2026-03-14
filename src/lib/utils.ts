import { Item, Rarity } from '../types';
import { cases, rarityChances } from '../data/cases';

/**
 * Генерация случайного предмета из кейса с учётом шансов
 */
export function getRandomItem(caseId: string): Item {
  const caseData = cases.find(c => c.id === caseId);
  if (!caseData) throw new Error(`Case ${caseId} not found`);
  
  const rand = Math.random() * 100;
  let rarity: Rarity;
  
  // Определяем редкость
  let cumulative = 0;
  if (rand < (cumulative += rarityChances.ancient)) rarity = 'ancient';
  else if (rand < (cumulative += rarityChances.legendary)) rarity = 'legendary';
  else if (rand < (cumulative += rarityChances.mythical)) rarity = 'mythical';
  else if (rand < (cumulative += rarityChances.rare)) rarity = 'rare';
  else if (rand < (cumulative += rarityChances.uncommon)) rarity = 'uncommon';
  else rarity = 'common';
  
  // Фильтруем предметы по редкости
  const itemsByRarity = caseData.items.filter(item => item.rarity === rarity);
  
  // Если нет предметов такой редкости, пробуем следующую по убыванию
  if (itemsByRarity.length === 0) {
    const rarityOrder: Rarity[] = ['ancient', 'legendary', 'mythical', 'rare', 'uncommon', 'common'];
    const currentIndex = rarityOrder.indexOf(rarity);
    
    for (let i = currentIndex + 1; i < rarityOrder.length; i++) {
      const fallbackItems = caseData.items.filter(item => item.rarity === rarityOrder[i]);
      if (fallbackItems.length > 0) {
        return fallbackItems[Math.floor(Math.random() * fallbackItems.length)];
      }
    }
    
    // Если совсем ничего нет, возвращаем первый предмет
    return caseData.items[0];
  }
  
  // Возвращаем случайный предмет из filtered
  return itemsByRarity[Math.floor(Math.random() * itemsByRarity.length)];
}

/**
 * Форматирование числа с разделителями тысяч
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ru-RU');
}

/**
 * Форматирование цены
 */
export function formatPrice(price: number): string {
  return `$${formatNumber(price)}`;
}

/**
 * Генерация точки краша с house edge ~5%
 */
export function getCrashPoint(): number {
  const e = 2 ** 32;
  const h = cryptoRandom() * e;
  
  // 5% шанс на мгновенный краш (x1.00)
  if (h % 100 === 0) return 1.0;
  
  const crashPoint = Math.floor((100 * e - h) / (e - h)) / 100;
  return Math.max(1.0, Math.min(crashPoint, 1000));
}

/**
 * Криптографически случайное число
 */
function cryptoRandom(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
}

/**
 * Получить цвет редкости
 */
export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: '#b0b0b0',
    uncommon: '#4b69ff',
    rare: '#8847ff',
    mythical: '#d32ce6',
    legendary: '#eb4b4b',
    ancient: '#ffd700',
  };
  return colors[rarity] || '#ffffff';
}

/**
 * Получить название редкости
 */
export function getRarityName(rarity: string): string {
  const names: Record<string, string> = {
    common: 'Обычное',
    uncommon: 'Необычное',
    rare: 'Редкое',
    mythical: 'Мифическое',
    legendary: 'Легендарное',
    ancient: 'Древнее',
  };
  return names[rarity] || rarity;
}
