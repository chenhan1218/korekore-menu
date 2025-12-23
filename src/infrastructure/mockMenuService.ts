/**
 * Mock Menu Data Service
 * Provides mock menu items for Menu Scan MVP testing
 */

import type { MenuItemType } from '@/types/menu';

/**
 * Creates and returns 20 mock menu items with realistic Japanese restaurant data
 * This is used in the Menu Scan MVP before Gemini API integration
 */
export function createMockMenuItems(): MenuItemType[] {
  return [
    {
      id: 'item_1',
      name_jp: '唐揚げ',
      name_zh: '唐揚雞',
      variants: [
        { spec: '單點', price: 500, tax_type: '稅込' },
        { spec: '定食', price: 800, tax_type: '稅込' },
      ],
    },
    {
      id: 'item_2',
      name_jp: '生ビール',
      name_zh: '生啤酒',
      variants: [
        { spec: '大杯', price: 680, tax_type: '稅拔' },
        { spec: '小杯', price: 480, tax_type: '稅拔' },
      ],
    },
    {
      id: 'item_3',
      name_jp: 'ラーメン',
      name_zh: '拉麵',
      variants: [
        { spec: '小盛', price: 750, tax_type: '稅込' },
        { spec: '並盛', price: 850, tax_type: '稅込' },
        { spec: '大盛', price: 950, tax_type: '稅込' },
      ],
    },
    {
      id: 'item_4',
      name_jp: 'テンプラ',
      name_zh: '天婦羅',
      variants: [{ spec: '單點', price: 600, tax_type: '稅込' }],
    },
    {
      id: 'item_5',
      name_jp: 'カレー',
      name_zh: '咖哩飯',
      variants: [
        { spec: '豚肉', price: 850, tax_type: '稅込' },
        { spec: '雞肉', price: 800, tax_type: '稅込' },
      ],
    },
    {
      id: 'item_6',
      name_jp: 'サラダ',
      name_zh: '沙拉',
      variants: [
        { spec: '小', price: 300, tax_type: '稅込' },
        { spec: '大', price: 500, tax_type: '稅込' },
      ],
    },
    {
      id: 'item_7',
      name_jp: 'ステーキ',
      name_zh: '牛排',
      variants: [
        { spec: '中等', price: 1500, tax_type: '稅込' },
        { spec: '厚切', price: 1800, tax_type: '稅込' },
      ],
    },
    {
      id: 'item_8',
      name_jp: 'トンカツ',
      name_zh: '豬排',
      variants: [{ spec: '定食', price: 950, tax_type: '稅込' }],
    },
    {
      id: 'item_9',
      name_jp: 'すし',
      name_zh: '壽司',
      variants: [
        { spec: '小盒', price: 800, tax_type: '稅込' },
        { spec: '大盒', price: 1200, tax_type: '稅込' },
      ],
    },
    {
      id: 'item_10',
      name_jp: 'うどん',
      name_zh: '烏龍麵',
      variants: [
        { spec: '熱湯', price: 500, tax_type: '稅込' },
        { spec: '冷湯', price: 550, tax_type: '稅込' },
      ],
    },
    {
      id: 'item_11',
      name_jp: 'そば',
      name_zh: '蕎麥麵',
      variants: [
        { spec: '熱湯', price: 550, tax_type: '稅込' },
        { spec: '冷湯', price: 600, tax_type: '稅込' },
      ],
    },
    {
      id: 'item_12',
      name_jp: '漬物',
      name_zh: '漬物',
      variants: [{ spec: '小盤', price: 150, tax_type: '稅込' }],
    },
    {
      id: 'item_13',
      name_jp: '天ぷら',
      name_zh: '天婦羅炸蝦',
      variants: [
        { spec: '三隻', price: 750, tax_type: '稅込' },
        { spec: '五隻', price: 1000, tax_type: '稅込' },
      ],
    },
    {
      id: 'item_14',
      name_jp: 'ギョーザ',
      name_zh: '水餃',
      variants: [
        { spec: '6個', price: 380, tax_type: '稅込' },
        { spec: '12個', price: 680, tax_type: '稅込' },
      ],
    },
    {
      id: 'item_15',
      name_jp: 'シュウマイ',
      name_zh: '燒賣',
      variants: [{ spec: '4個', price: 350, tax_type: '稅込' }],
    },
    {
      id: 'item_16',
      name_jp: 'コーヒー',
      name_zh: '咖啡',
      variants: [
        { spec: 'ホット', price: 300, tax_type: '稅込' },
        { spec: 'アイス', price: 350, tax_type: '稅込' },
      ],
    },
    {
      id: 'item_17',
      name_jp: 'ジュース',
      name_zh: '果汁',
      variants: [
        { spec: 'オレンジ', price: 250, tax_type: '稅込' },
        { spec: 'アップル', price: 250, tax_type: '稅込' },
      ],
    },
    {
      id: 'item_18',
      name_jp: 'デザート',
      name_zh: '甜點',
      variants: [
        { spec: 'アイスクリーム', price: 400, tax_type: '稅込' },
        { spec: 'ケーキ', price: 500, tax_type: '稅込' },
      ],
    },
    {
      id: 'item_19',
      name_jp: '唐揚げチーズ',
      name_zh: '起司唐揚',
      variants: [{ spec: '單點', price: 600, tax_type: '稅込' }],
    },
    {
      id: 'item_20',
      name_jp: 'オムレツ',
      name_zh: '蛋包飯',
      variants: [
        { spec: 'チキン', price: 800, tax_type: '稅込' },
        { spec: 'ビーフ', price: 900, tax_type: '稅込' },
      ],
    },
  ];
}

/**
 * Mock service function that simulates API call
 * Returns mock menu items as if they were parsed from an image
 */
export async function mockMenuScanService(): Promise<MenuItemType[]> {
  // Simulate async operation (would be API call in real implementation)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createMockMenuItems());
    }, 100);
  });
}
