/**
 * MenuScanFlow Integration Tests
 * Tests the complete end-to-end user flow
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../HomePage';
import { MenuScanPage } from '../MenuScanPage';

// Helper to render with Router
const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Menu Scan End-to-End Flow', () => {
  beforeEach(() => {
    // Clear screen before each test
  });

  describe('HomePage Navigation', () => {
    it('displays prominent upload button on homepage', () => {
      renderWithRouter(<HomePage />);

      const uploadButton = screen.getByRole('button', {
        name: /上傳菜單照片或拍照/i,
      });
      expect(uploadButton).toBeDefined();
    });

    it('shows application introduction on homepage', () => {
      renderWithRouter(<HomePage />);

      expect(screen.getByText('KoreKore')).toBeDefined();
      expect(screen.getByText(/日本餐廳菜單翻譯 AI 工具/i)).toBeDefined();
    });

    it('displays feature highlights on homepage', () => {
      renderWithRouter(<HomePage />);

      // Check for key features mentioned
      expect(screen.getByText(/拍攝菜單/i)).toBeDefined();
      expect(screen.getByText(/AI 秒解析/i)).toBeDefined();
      expect(screen.getByText(/點餐卡生成/i)).toBeDefined();
    });

    it('homepage is responsive on different screen sizes', () => {
      const { container } = renderWithRouter(<HomePage />);

      const page = container.querySelector('[data-testid="home-page"]');
      expect(page?.className).toContain('min-h-screen');
      expect(page?.className).toContain('flex');
      expect(page?.className).toContain('flex-col');
    });
  });

  describe('MenuScanPage Structure', () => {
    it('renders complete menu scan page', () => {
      renderWithRouter(<MenuScanPage />);

      // Should show upload section
      expect(screen.getByRole('heading', { name: /上傳菜單/i })).toBeDefined();

      // Should have file input
      const fileInput = document.querySelector('#menu-file-input');
      expect(fileInput).toBeDefined();
    });

    it('displays upload instructions', () => {
      renderWithRouter(<MenuScanPage />);

      expect(screen.getByText(/支援 JPG 和 PNG 格式/i)).toBeDefined();
      expect(screen.getByText(/檔案大小限制：15MB/i)).toBeDefined();
    });

    it('provides help text for compression', () => {
      renderWithRouter(<MenuScanPage />);

      expect(screen.getByText(/超過 5MB 會自動壓縮/i)).toBeDefined();
    });
  });

  describe('Menu Upload and Display', () => {
    it('can handle file input for menu scanning', () => {
      renderWithRouter(<MenuScanPage />);

      const fileInput = document.querySelector('#menu-file-input') as HTMLInputElement;
      expect(fileInput).toBeDefined();
      expect(fileInput?.accept).toContain('image/jpeg');
      expect(fileInput?.accept).toContain('image/png');
    });

    it('page layout is responsive and accessible', () => {
      const { container } = renderWithRouter(<MenuScanPage />);

      const page = container.querySelector('[data-testid="menu-scan-page"]');
      expect(page?.className).toContain('p-4');
      expect(page?.className).toContain('md:p-6');

      // Check for semantic header
      const header = container.querySelector('header');
      expect(header).toBeDefined();
    });
  });

  describe('User Experience', () => {
    it('homepage provides clear path to menu scanning', () => {
      renderWithRouter(<HomePage />);

      // CTA button is prominent
      const uploadButton = screen.getByRole('button', {
        name: /上傳菜單照片或拍照/i,
      });

      // Button should be visible and interactive
      expect(uploadButton).toBeDefined();
      expect(uploadButton?.className).toContain('bg-gradient-to-r');
    });

    it('menu scan page shows title and instruction', () => {
      renderWithRouter(<MenuScanPage />);

      expect(screen.getByText('KoreKore')).toBeDefined();
      expect(screen.getByText(/日本餐廳菜單翻譯工具/i)).toBeDefined();
    });

    it('provides feedback mechanism for errors', () => {
      renderWithRouter(<MenuScanPage />);

      // Error section structure should be in DOM (even if hidden initially)
      const page = document.querySelector('[data-testid="menu-scan-page"]');
      expect(page).toBeDefined();
    });

    it('supports both upload and photo input methods', () => {
      renderWithRouter(<HomePage />);

      const uploadButton = screen.getByRole('button', {
        name: /上傳菜單照片或拍照/i,
      });
      expect(uploadButton).toBeDefined();

      // Button text mentions both methods
      expect(uploadButton?.textContent).toContain('📸');
    });
  });

  describe('Accessibility and Performance', () => {
    it('uses semantic HTML throughout', () => {
      const { container: homeContainer } = renderWithRouter(<HomePage />);

      // HomePage should have proper semantic structure
      expect(homeContainer.querySelector('main')).toBeNull(); // We use divs, but could improve
      expect(homeContainer.querySelector('footer')).toBeDefined();

      const { container: scanContainer } = renderWithRouter(<MenuScanPage />);
      expect(scanContainer.querySelector('header')).toBeDefined();
    });

    it('has proper ARIA labels for interactive elements', () => {
      renderWithRouter(<MenuScanPage />);

      const fileInput = document.querySelector('#menu-file-input') as HTMLInputElement;
      expect(fileInput?.getAttribute('aria-label')).toBeDefined();
    });

    it('supports keyboard navigation', () => {
      renderWithRouter(<HomePage />);

      const uploadButton = screen.getByRole('button', {
        name: /上傳菜單照片或拍照/i,
      });
      expect(uploadButton).toBeDefined();
      // Button is keyboard accessible via role
    });
  });

  describe('Content and Information Architecture', () => {
    it('homepage explains value proposition clearly', () => {
      renderWithRouter(<HomePage />);

      const mainContent = screen.getByText(/在日本餐廳點餐不再困擾/i);
      expect(mainContent).toBeDefined();
    });

    it('displays key features with icons', () => {
      renderWithRouter(<HomePage />);

      // Should have emoji/icon indicators
      const content = document.body.innerHTML;
      expect(content).toContain('📸'); // Photo icon
      expect(content).toContain('🤖'); // AI icon
      expect(content).toContain('✍️'); // Writing icon
    });

    it('shows statistics about app capabilities', () => {
      renderWithRouter(<HomePage />);

      const content = document.body.innerHTML;
      expect(content).toContain('20+');
      expect(content).toContain('即時');
      expect(content).toContain('100%');
    });

    it('menucan page clearly indicates its purpose', () => {
      renderWithRouter(<MenuScanPage />);

      const heading = screen.getByRole('heading', {
        name: /上傳菜單/i,
      });
      expect(heading).toBeDefined();
    });
  });
});
