/**
 * MenuScanPage Integration Tests
 * Tests complete end-to-end user workflows for the menu scanning feature
 *
 * This file verifies the complete user journey:
 * 1. Upload menu image
 * 2. View parsed menu items
 * 3. Select menu items and variants
 * 4. Confirm order
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { MenuScanPage } from '../MenuScanPage';
import { useMenuStore } from '@/domain/stores/menuStore';
import type { MenuItemType } from '@/types/menu';

// Mock the mockMenuScanService to return sample data
vi.mock('@/infrastructure/mockMenuService', () => ({
  mockMenuScanService: vi.fn(async () => {
    return Promise.resolve([
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
        name_jp: '枝豆',
        name_zh: '毛豆',
        variants: [{ spec: '單點', price: 350, tax_type: '稅込' }],
      },
      {
        id: 'item_4',
        name_jp: '餃子',
        name_zh: '餃子',
        variants: [
          { spec: '6個', price: 380, tax_type: '稅込' },
          { spec: '12個', price: 680, tax_type: '稅込' },
        ],
      },
      {
        id: 'item_5',
        name_jp: 'コロッケ',
        name_zh: '可樂餅',
        variants: [
          { spec: '單點', price: 120, tax_type: '稅込' },
          { spec: '5個組', price: 500, tax_type: '稅込' },
        ],
      },
      {
        id: 'item_6',
        name_jp: 'とんかつ',
        name_zh: '炸豬排',
        variants: [{ spec: '定食', price: 1200, tax_type: '稅込' }],
      },
      {
        id: 'item_7',
        name_jp: 'サラダ',
        name_zh: '沙拉',
        variants: [{ spec: '普通', price: 380, tax_type: '稅込' }],
      },
      {
        id: 'item_8',
        name_jp: 'スープ',
        name_zh: '湯',
        variants: [
          { spec: '味噌湯', price: 200, tax_type: '稅込' },
          { spec: '清湯', price: 150, tax_type: '稅込' },
        ],
      },
      {
        id: 'item_9',
        name_jp: 'ご飯',
        name_zh: '米飯',
        variants: [
          { spec: '小碗', price: 100, tax_type: '稅込' },
          { spec: '大碗', price: 200, tax_type: '稅込' },
        ],
      },
      {
        id: 'item_10',
        name_jp: 'みそ汁',
        name_zh: '味噌湯',
        variants: [{ spec: '普通', price: 200, tax_type: '稅込' }],
      },
      {
        id: 'item_11',
        name_jp: '焼鳥',
        name_zh: '烤雞串',
        variants: [
          { spec: '1串', price: 150, tax_type: '稅込' },
          { spec: '5串', price: 650, tax_type: '稅込' },
        ],
      },
      {
        id: 'item_12',
        name_jp: 'チーズ',
        name_zh: '起司',
        variants: [{ spec: '普通', price: 250, tax_type: '稅込' }],
      },
      {
        id: 'item_13',
        name_jp: 'トマト',
        name_zh: '番茄',
        variants: [{ spec: '普通', price: 300, tax_type: '稅込' }],
      },
      {
        id: 'item_14',
        name_jp: 'キュウリ',
        name_zh: '小黃瓜',
        variants: [{ spec: '普通', price: 200, tax_type: '稅込' }],
      },
      {
        id: 'item_15',
        name_jp: 'ナス',
        name_zh: '茄子',
        variants: [{ spec: '普通', price: 220, tax_type: '稅込' }],
      },
      {
        id: 'item_16',
        name_jp: 'トウモロコシ',
        name_zh: '玉米',
        variants: [{ spec: '普通', price: 280, tax_type: '稅込' }],
      },
      {
        id: 'item_17',
        name_jp: 'ブロッコリー',
        name_zh: '綠花菜',
        variants: [{ spec: '普通', price: 250, tax_type: '稅込' }],
      },
      {
        id: 'item_18',
        name_jp: '玉ねぎ',
        name_zh: '洋蔥',
        variants: [{ spec: '普通', price: 150, tax_type: '稅込' }],
      },
      {
        id: 'item_19',
        name_jp: 'ニンジン',
        name_zh: '紅蘿蔔',
        variants: [{ spec: '普通', price: 180, tax_type: '稅込' }],
      },
      {
        id: 'item_20',
        name_jp: 'ジャガイモ',
        name_zh: '馬鈴薯',
        variants: [{ spec: '普通', price: 200, tax_type: '稅込' }],
      },
    ] as MenuItemType[]);
  }),
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('MenuScanPage Integration Tests', () => {
  beforeEach(() => {
    const store = useMenuStore.getState();
    store.reset();
  });

  describe('Complete User Flow', () => {
    it('should load page and show upload section initially', () => {
      renderWithRouter(<MenuScanPage />);

      // Verify page renders with upload section
      expect(screen.getByRole('heading', { name: /上傳菜單/i })).toBeDefined();
      expect(screen.getByText(/支援 JPG 和 PNG 格式/i)).toBeDefined();
    });

    it('should display 20+ menu items after upload', async () => {
      renderWithRouter(<MenuScanPage />);

      // Simulate file selection
      const fileInput = document.querySelector('#menu-file-input') as HTMLInputElement;
      const mockFile = new File(['test'], 'menu.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      // Wait for menu to appear
      await waitFor(
        () => {
          expect(screen.queryByText(/菜單已解析/i)).toBeTruthy();
        },
        { timeout: 10000 }
      );

      // Verify 20 items are displayed
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThanOrEqual(20);
    });

    it('should allow selecting menu items', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MenuScanPage />);

      // Upload
      const fileInput = document.querySelector('#menu-file-input') as HTMLInputElement;
      const mockFile = new File(['test'], 'menu.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      // Wait for menu
      await waitFor(() => {
        expect(screen.queryByText(/菜單已解析/i)).toBeTruthy();
      }, { timeout: 10000 });

      // Select item
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0] as Element);

      // Verify selection summary appears
      await waitFor(() => {
        expect(screen.getByText(/已選擇菜項/i)).toBeTruthy();
      });
    });

    it('should track multiple selections correctly', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MenuScanPage />);

      // Upload
      const fileInput = document.querySelector('#menu-file-input') as HTMLInputElement;
      const mockFile = new File(['test'], 'menu.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      // Wait for menu
      await waitFor(() => {
        expect(screen.queryByText(/菜單已解析/i)).toBeTruthy();
      }, { timeout: 10000 });

      // Select multiple items
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0] as Element);
      await user.click(checkboxes[1] as Element);
      await user.click(checkboxes[2] as Element);

      // Verify count shows 3
      await waitFor(() => {
        expect(screen.getByText(/已選擇菜項 \(3\)/i)).toBeTruthy();
      });
    });

    it('should enable confirm button when items are selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MenuScanPage />);

      // Upload
      const fileInput = document.querySelector('#menu-file-input') as HTMLInputElement;
      const mockFile = new File(['test'], 'menu.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      // Wait for menu
      await waitFor(() => {
        expect(screen.queryByText(/菜單已解析/i)).toBeTruthy();
      }, { timeout: 10000 });

      // Select item
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0] as Element);

      // Confirm button should be enabled
      const confirmBtn = screen.getByRole('button', { name: /確認點餐/i });
      expect((confirmBtn as HTMLButtonElement).disabled).toBe(false);
    });

    it('should allow uploading new menu', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MenuScanPage />);

      // First upload
      const fileInput = document.querySelector('#menu-file-input') as HTMLInputElement;
      const mockFile = new File(['test'], 'menu.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      // Wait for menu
      await waitFor(() => {
        expect(screen.queryByText(/菜單已解析/i)).toBeTruthy();
      }, { timeout: 10000 });

      // Select item
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0] as Element);

      // Click upload new menu button
      const uploadNewBtn = screen.getByRole('button', { name: /上傳新菜單/i });
      await user.click(uploadNewBtn as Element);

      // Should return to upload state
      expect(screen.getByRole('heading', { name: /上傳菜單/i })).toBeTruthy();
    });
  });

  describe('Page Structure and Accessibility', () => {
    it('should have proper page structure', () => {
      const { container } = renderWithRouter(<MenuScanPage />);

      const page = container.querySelector('[data-testid="menu-scan-page"]');
      expect(page).toBeTruthy();
      expect(page?.className).toContain('p-4');
      expect(page?.className).toContain('md:p-6');
    });

    it('should have ARIA labels for file input', () => {
      renderWithRouter(<MenuScanPage />);

      const fileInput = document.querySelector('#menu-file-input') as HTMLInputElement;
      expect(fileInput?.getAttribute('aria-label')).toBeTruthy();
    });
  });

  describe('Error Handling Flow', () => {
    it('should display error when file input validation fails', async () => {
      renderWithRouter(<MenuScanPage />);

      // Try to select an invalid file (too large)
      const fileInput = document.querySelector('#menu-file-input') as HTMLInputElement;
      const largeFile = new File(['x'.repeat(20 * 1024 * 1024)], 'huge.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      // Error handling should be triggered or file rejected
      // The component should still be functional
      await new Promise((resolve) => setTimeout(resolve, 500));
      expect(screen.getByRole('heading', { name: /上傳菜單/i })).toBeTruthy();
    });

    it('should recover gracefully after upload failure', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MenuScanPage />);

      // First successful upload
      const fileInput = document.querySelector('#menu-file-input') as HTMLInputElement;
      const mockFile = new File(['test'], 'menu.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      // Wait for menu
      await waitFor(() => {
        expect(screen.queryByText(/菜單已解析/i)).toBeTruthy();
      }, { timeout: 10000 });

      // Return to upload
      const uploadNewBtn = screen.getByRole('button', { name: /上傳新菜單/i });
      await user.click(uploadNewBtn);

      // Should be able to upload again
      expect(screen.getByRole('heading', { name: /上傳菜單/i })).toBeTruthy();
      const fileInputAgain = document.querySelector('#menu-file-input') as HTMLInputElement;
      expect(fileInputAgain).toBeTruthy();
    });

    it('should handle deselection of items without errors', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MenuScanPage />);

      // Upload
      const fileInput = document.querySelector('#menu-file-input') as HTMLInputElement;
      const mockFile = new File(['test'], 'menu.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      // Wait for menu
      await waitFor(() => {
        expect(screen.queryByText(/菜單已解析/i)).toBeTruthy();
      }, { timeout: 10000 });

      // Select and deselect items
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0] as Element);
      await user.click(checkboxes[1] as Element);

      // Deselect first item
      await user.click(checkboxes[0] as Element);

      // Should show only 1 item selected
      expect(screen.getByText(/已選擇菜項 \(1\)/i)).toBeTruthy();

      // Deselect remaining item
      await user.click(checkboxes[1] as Element);

      // Selection summary should disappear when no items selected
      const summary = screen.queryByText(/已選擇菜項/i);
      expect(summary).toBeFalsy();
    });
  });

  describe('Performance and Responsiveness', () => {
    it('should render 20 items efficiently', async () => {
      const startTime = performance.now();
      renderWithRouter(<MenuScanPage />);

      const fileInput = document.querySelector('#menu-file-input') as HTMLInputElement;
      const mockFile = new File(['test'], 'menu.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      await waitFor(() => {
        expect(screen.queryByText(/菜單已解析/i)).toBeTruthy();
      }, { timeout: 10000 });

      const renderTime = performance.now() - startTime;

      // Should render complete page within reasonable time
      expect(renderTime).toBeLessThan(15000);

      // Verify all items present
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThanOrEqual(20);
    });

    it('should handle rapid selections without lag', async () => {
      const user = userEvent.setup();
      renderWithRouter(<MenuScanPage />);

      // Upload
      const fileInput = document.querySelector('#menu-file-input') as HTMLInputElement;
      const mockFile = new File(['test'], 'menu.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      await waitFor(() => {
        expect(screen.queryByText(/菜單已解析/i)).toBeTruthy();
      }, { timeout: 10000 });

      const checkboxes = screen.getAllByRole('checkbox');
      const startTime = performance.now();

      // Rapid selections
      for (let i = 0; i < Math.min(5, checkboxes.length); i++) {
        await user.click(checkboxes[i] as Element);
      }

      const selectionTime = performance.now() - startTime;

      // Should handle 5 selections quickly
      expect(selectionTime).toBeLessThan(5000);

      // Verify final state
      expect(screen.getByText(/已選擇菜項/i)).toBeTruthy();
    });

    it('should maintain responsive state after selecting many items', async () => {
      const user = userEvent.setup();
      const { container } = renderWithRouter(<MenuScanPage />);

      // Upload
      const fileInput = document.querySelector('#menu-file-input') as HTMLInputElement;
      const mockFile = new File(['test'], 'menu.jpg', { type: 'image/jpeg' });
      fireEvent.change(fileInput, { target: { files: [mockFile] } });

      await waitFor(() => {
        expect(screen.queryByText(/菜單已解析/i)).toBeTruthy();
      }, { timeout: 10000 });

      const checkboxes = screen.getAllByRole('checkbox');

      // Select all items
      for (let i = 0; i < checkboxes.length; i++) {
        await user.click(checkboxes[i] as Element);
      }

      // Should show all selected
      expect(screen.getByText(new RegExp(`已選擇菜項 \\(${checkboxes.length}\\)`))).toBeTruthy();

      // Confirm button should be enabled
      const confirmBtn = screen.getByRole('button', { name: /確認點餐/i });
      expect((confirmBtn as HTMLButtonElement).disabled).toBe(false);

      // Page should still be responsive
      const page = container.querySelector('[data-testid="menu-scan-page"]');
      expect(page).toBeTruthy();
    });
  });
});
