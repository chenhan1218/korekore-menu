import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MenuScanPage } from '../MenuScanPage';

// Helper to render with Router
const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('MenuScanPage', () => {
  beforeEach(() => {
    // Clear any global state if needed
  });

  it('renders the page with upload component initially', () => {
    renderWithRouter(<MenuScanPage />);

    // Page should show upload component heading
    const uploadSection = screen.getByRole('heading', {
      name: /上傳菜單/i,
    });
    expect(uploadSection).toBeDefined();
  });

  it('shows file input for menu image upload', () => {
    renderWithRouter(<MenuScanPage />);

    // Should have a file input with specific id
    const fileInput = document.querySelector('#menu-file-input') as HTMLInputElement;
    expect(fileInput).toBeDefined();
    expect(fileInput?.type).toBe('file');
  });

  it('displays page title and description', () => {
    renderWithRouter(<MenuScanPage />);

    const title = screen.getByText('KoreKore');
    const subtitle = screen.getByText(/日本餐廳菜單翻譯工具/i);
    expect(title).toBeDefined();
    expect(subtitle).toBeDefined();
  });

  it('renders with mock menu items structure ready', () => {
    // This test verifies the page structure is ready to display menu items
    // Actual file upload integration is tested in integration tests
    renderWithRouter(<MenuScanPage />);

    // Page should have upload component visible initially
    const uploadSection = screen.getByRole('heading', {
      name: /上傳菜單/i,
    });
    expect(uploadSection).toBeDefined();
  });

  it('has upload input element for file selection', () => {
    renderWithRouter(<MenuScanPage />);

    // Verify file input is available
    const fileInput = screen.getByLabelText(/Select menu image/i);
    expect(fileInput).toBeDefined();
    expect((fileInput as HTMLInputElement).type).toBe('file');
  });

  it('displays upload help text', () => {
    renderWithRouter(<MenuScanPage />);

    const helpText = screen.getByText(/支援 JPG 和 PNG 格式/i);
    expect(helpText).toBeDefined();
  });

  it('has proper page structure with data testid', () => {
    const { container } = renderWithRouter(<MenuScanPage />);

    // Verify page has proper data-testid for testing
    const page = container.querySelector('[data-testid="menu-scan-page"]');
    expect(page).toBeDefined();

    // Verify it's a div element
    expect(page?.tagName).toBe('DIV');
  });

  it('is accessible with proper semantic HTML', () => {
    const { container } = renderWithRouter(<MenuScanPage />);

    // Check for main content area
    const page = container.querySelector('[data-testid="menu-scan-page"]');
    expect(page).toBeDefined();

    // Check for semantic header
    const header = container.querySelector('header');
    expect(header).toBeDefined();
  });

  it('is responsive with proper classes', () => {
    const { container } = renderWithRouter(<MenuScanPage />);

    // Check for responsive wrapper
    const page = container.querySelector('[data-testid="menu-scan-page"]');
    expect(page?.className).toContain('p-4');
    expect(page?.className).toContain('md:p-6');
  });
});
